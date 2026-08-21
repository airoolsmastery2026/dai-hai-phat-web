import { NextRequest } from "next/server";

import {
  AI_CONCEPT_PRESENTATION_TRANSFORM,
  type AIConceptView,
  isAIConceptView,
} from "@/lib/ai/concept-studio";
import type { ProjectImageMimeType } from "@/lib/ai/image-upload";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import {
  ConceptRenderAdapterError,
  isConceptRenderConfigured,
  renderConceptPresentation,
  type ConceptRenderImage,
} from "@/lib/server/concept-render-adapter";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_IMAGE_BYTES = 2_200_000;
const MAX_TOTAL_IMAGE_BYTES = 6_000_000;
const MAX_BRIEF_LENGTH = 4_000;
const MIN_BRIEF_LENGTH = 20;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const VIEW_INSTRUCTIONS: Record<AIConceptView, string> = {
  front:
    "Tạo góc chính diện rộng, ngang tầm mắt. Thể hiện đầy đủ bố cục, tỷ lệ, màu sắc và quan hệ của hạng mục mới với kiến trúc hiện trạng.",
  left:
    "Tạo góc ba phần tư từ bên trái khoảng 35–45 độ. Giữ nguyên phương án nền và thể hiện rõ chiều sâu, khung, liên kết bên trái và độ dày vật liệu.",
  right:
    "Tạo góc ba phần tư từ bên phải khoảng 35–45 độ. Giữ nguyên phương án nền và thể hiện rõ chiều sâu, phụ kiện, liên kết bên phải và cấu tạo lắp đặt.",
  detail:
    "Tạo ảnh cận cảnh của chính phương án nền. Tập trung vào vật liệu, mối nối, bản lề, tay nắm, liên kết kính, cạnh tủ, ray hoặc chi tiết cấu tạo quan trọng phù hợp với hạng mục.",
};

function readFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function validateImage(file: File, label: string): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return `${label} phải là ảnh JPG, PNG hoặc WEBP.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${label} vượt quá dung lượng cho phép sau khi tối ưu.`;
  }
  return null;
}

async function fileToRenderImage(file: File): Promise<ConceptRenderImage> {
  return {
    mimeType: file.type as ProjectImageMimeType,
    dataBase64: Buffer.from(await file.arrayBuffer()).toString("base64"),
  };
}

function buildPrompt(
  view: AIConceptView,
  brief: string,
  hasBaseConcept: boolean,
): string {
  return `Bạn là bộ máy dựng phối cảnh cho Đại Hải Phát, chuyên cơ khí dân dụng và nội thất nhà ở tại Việt Nam.

Ảnh đầu vào 1 là hiện trạng thật. Ảnh đầu vào 2 là mẫu thiết kế, sản phẩm, vật liệu hoặc phong cách tham khảo.${
    hasBaseConcept
      ? " Ảnh đầu vào 3 là phương án chính diện đã tạo và phải được dùng làm chuẩn thiết kế thống nhất."
      : ""
  }

THÔNG TIN DỰ ÁN:
${brief}

YÊU CẦU GÓC NHÌN:
${VIEW_INSTRUCTIONS[view]}

YÊU CẦU BẮT BUỘC:
- Chỉ tạo một ảnh phối cảnh 16:9.
- Giữ nguyên phối cảnh máy ảnh, tường, cột, nền, trần, cửa, cửa sổ và các phần hiện trạng không được yêu cầu thay đổi.
- Khóa đường chân trời, đường tụ, crop và tỷ lệ không gian của góc đang dựng để ảnh có thể dùng làm keyframe cuối cho chuyển cảnh trình bày kiến trúc mà không bị camera drift hoặc biến dạng hình học.
- Chuyển mẫu tham khảo thành một phương án phù hợp với tỷ lệ và điều kiện thực tế của ảnh hiện trạng; không sao chép mù quáng.
- Hạng mục phải có tỷ lệ hợp lý, vật liệu thực tế, kết cấu có thể thi công và phù hợp công trình dân dụng tại Việt Nam.
- Giữ đúng một phương án xuyên suốt: cùng kiểu dáng, vật liệu, màu sắc, số khoang, hoa văn, phụ kiện và logic kết cấu.
- Không tự bịa số đo, không chèn kích thước, chữ, logo, watermark, người, xe hoặc vật trang trí không được yêu cầu.
- Đây là phối cảnh ý tưởng, không phải bản vẽ kỹ thuật hay báo giá.
- Ánh sáng tự nhiên, chi tiết chân thực, hình học sạch, không có bộ phận lơ lửng hoặc kết cấu bất khả thi.`;
}

function adapterStatus(error: ConceptRenderAdapterError): number {
  switch (error.code) {
    case "configuration":
      return 503;
    case "rate_limit":
      return 429;
    case "timeout":
      return 504;
    case "invalid_input":
      return 400;
    case "upstream":
    case "invalid_output":
      return 502;
  }
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse(
      { error: "Nguồn yêu cầu không hợp lệ.", requestId },
      403,
    );
  }

  const rateLimit = consumeRateLimit(
    "ai-concept-studio",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Bạn đã tạo nhiều phối cảnh trong thời gian ngắn. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  if (!isConceptRenderConfigured()) {
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Công cụ tạo phối cảnh chưa được cấu hình trên máy chủ.",
          requestId,
        ),
        code: "AI_CONCEPT_UNAVAILABLE",
        requestId,
      },
      503,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiJsonResponse(
      { error: "Dữ liệu gửi lên không hợp lệ.", requestId },
      400,
    );
  }

  const viewValue = String(formData.get("view") ?? "");
  const brief = String(formData.get("brief") ?? "").trim();
  const siteImage = readFile(formData, "siteImage");
  const referenceImage = readFile(formData, "referenceImage");
  const baseConcept = readFile(formData, "baseConcept");

  if (!isAIConceptView(viewValue)) {
    return apiJsonResponse(
      { error: "Góc phối cảnh không hợp lệ.", requestId },
      400,
    );
  }
  if (brief.length < MIN_BRIEF_LENGTH || brief.length > MAX_BRIEF_LENGTH) {
    return apiJsonResponse(
      {
        error: `Thông tin dự án phải có từ ${MIN_BRIEF_LENGTH} đến ${MAX_BRIEF_LENGTH} ký tự.`,
        requestId,
      },
      400,
    );
  }
  if (!siteImage || !referenceImage) {
    return apiJsonResponse(
      { error: "Thiếu ảnh hiện trạng hoặc ảnh mẫu tham khảo.", requestId },
      400,
    );
  }

  const imageValidationErrors = [
    validateImage(siteImage, "Ảnh hiện trạng"),
    validateImage(referenceImage, "Ảnh mẫu"),
    baseConcept ? validateImage(baseConcept, "Phương án nền") : null,
  ].filter((value): value is string => Boolean(value));
  if (imageValidationErrors.length) {
    return apiJsonResponse(
      { error: imageValidationErrors[0], requestId },
      413,
    );
  }

  const totalImageBytes =
    siteImage.size + referenceImage.size + (baseConcept?.size ?? 0);
  if (totalImageBytes > MAX_TOTAL_IMAGE_BYTES) {
    return apiJsonResponse(
      { error: "Tổng dung lượng ảnh vượt quá giới hạn xử lý.", requestId },
      413,
    );
  }

  try {
    const images = await Promise.all([
      fileToRenderImage(siteImage),
      fileToRenderImage(referenceImage),
      ...(baseConcept ? [fileToRenderImage(baseConcept)] : []),
    ]);
    const rendered = await renderConceptPresentation({
      prompt: buildPrompt(viewValue, brief, Boolean(baseConcept)),
      images,
    });

    return apiJsonResponse(
      {
        imageBase64: rendered.imageBase64,
        mimeType: rendered.mimeType,
        model: rendered.model,
        view: viewValue,
        presentationGuide: AI_CONCEPT_PRESENTATION_TRANSFORM,
        requestId,
      },
      200,
    );
  } catch (error) {
    if (error instanceof ConceptRenderAdapterError) {
      const status = adapterStatus(error);
      console.warn("DHP AI concept adapter unavailable", {
        requestId,
        view: viewValue,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(error.message, requestId),
          code:
            error.code === "rate_limit"
              ? "UPSTREAM_RATE_LIMITED"
              : error.code === "timeout"
                ? "AI_CONCEPT_TIMEOUT"
                : "AI_CONCEPT_FAILED",
          requestId,
        },
        status,
        error.code === "rate_limit" ? { "Retry-After": "30" } : undefined,
      );
    }

    console.error("DHP AI concept generation failed", {
      requestId,
      view: viewValue,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể tạo phối cảnh. Vui lòng kiểm tra ảnh và thử lại.",
          requestId,
        ),
        code: "AI_CONCEPT_FAILED",
        requestId,
      },
      502,
    );
  }
}
