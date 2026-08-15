import { NextRequest } from "next/server";

import { AI_CONCEPT_MODEL } from "@/lib/ai/concept-studio";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${AI_CONCEPT_MODEL}:generateContent`;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const UPSTREAM_TIMEOUT_MS = 105_000;
const MAX_IMAGE_BYTES = 2_200_000;
const MAX_BRIEF_LENGTH = 2_000;
const MAX_ERROR_RESPONSE_BYTES = 8 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const TARGETS = new Set(["raw", "finished"]);

type RevealTarget = "raw" | "finished";

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { mimeType?: unknown; data?: unknown };
      }>;
    };
  }>;
}

function readFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function isRevealTarget(value: string): value is RevealTarget {
  return TARGETS.has(value);
}

function buildPrompt(target: RevealTarget, brief: string): string {
  const projectContext = brief
    ? `\nYÊU CẦU / BỐI CẢNH CÔNG TRÌNH:\n${brief}\n`
    : "";

  if (target === "raw") {
    return `Bạn là chuyên gia diễn họa cải tạo dân dụng và nội thất cho Đại Hải Phát tại Việt Nam.

Hãy biến ảnh đầu vào thành trạng thái THÔ / CHƯA HOÀN THIỆN của chính không gian đó.${projectContext}
YÊU CẦU BẮT BUỘC:
- Đây là nhiệm vụ removal / strip-back, không phải thiết kế lại.
- Giữ nguyên 100% góc máy, phối cảnh, tỷ lệ, vị trí tường, cột, ô cửa, cửa sổ, trần và hình học chính.
- Loại bỏ đồ nội thất rời, tủ hoàn thiện, trang trí, rèm, đèn trang trí và các lớp hoàn thiện bề mặt khi hợp lý.
- Thể hiện trạng thái xây dựng thực tế: bê tông, gạch, tô trát/thạch cao chưa sơn hoặc nền chưa hoàn thiện phù hợp với ảnh.
- Không thêm công nhân, dụng cụ, bụi, chữ, logo, watermark hoặc hiệu ứng phá dỡ phi thực tế.
- Không tự thay đổi kết cấu chịu lực hoặc bịa thêm không gian.
- Ảnh 16:9, chân thực, ánh sáng tự nhiên, dùng làm khung đầu của video before/after.`;
  }

  return `Bạn là chuyên gia diễn họa hoàn thiện dân dụng và nội thất cho Đại Hải Phát tại Việt Nam.

Hãy biến ảnh đầu vào thành trạng thái HOÀN THIỆN có thể thi công của chính không gian đó.${projectContext}
YÊU CẦU BẮT BUỘC:
- Giữ nguyên 100% góc máy, phối cảnh, tỷ lệ, tường, cột, ô cửa, cửa sổ, trần và hình học chính trừ khi yêu cầu dự án nói rõ phần cần thay đổi.
- Hoàn thiện vật liệu, ánh sáng và nội thất theo ngôn ngữ hiện đại, ấm, cao cấp nhưng thực tế cho nhà ở Việt Nam.
- Vật liệu, đồ nội thất và chi tiết phải có tỷ lệ hợp lý, logic lắp đặt và khả năng thi công.
- Không tự bịa số đo, không chèn chữ, logo, watermark, người hoặc xe.
- Không tạo cấu kiện lơ lửng, hình học méo hoặc chi tiết bất khả thi.
- Ảnh 16:9, photorealistic, ánh sáng tự nhiên/cinematic vừa phải, dùng làm khung cuối của video before/after.
- Đây là phối cảnh ý tưởng để trao đổi; kỹ sư vẫn phải khảo sát và xác nhận phương án kỹ thuật.`;
}

async function fileToInlineData(file: File) {
  return {
    inline_data: {
      mime_type: file.type,
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
    },
  };
}

async function readUpstreamError(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text || text.length > MAX_ERROR_RESPONSE_BYTES) return null;
    const payload = JSON.parse(text) as { error?: { status?: unknown } };
    return typeof payload.error?.status === "string"
      ? payload.error.status.slice(0, 64)
      : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }

  const rateLimit = consumeRateLimit(
    "ai-raw-finished-reveal",
    getRequestClientKey(request.headers),
    { maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Bạn đã tạo nhiều bản xem trước trong thời gian ngắn. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Công cụ Thô → Hoàn thiện chưa được cấu hình trên máy chủ.",
          requestId,
        ),
        code: "AI_REVEAL_UNAVAILABLE",
        requestId,
      },
      503,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiJsonResponse({ error: "Dữ liệu gửi lên không hợp lệ.", requestId }, 400);
  }

  const targetValue = String(formData.get("target") ?? "");
  const brief = String(formData.get("brief") ?? "").trim();
  const sourceImage = readFile(formData, "sourceImage");

  if (!isRevealTarget(targetValue)) {
    return apiJsonResponse({ error: "Trạng thái dựng ảnh không hợp lệ.", requestId }, 400);
  }
  if (brief.length > MAX_BRIEF_LENGTH) {
    return apiJsonResponse(
      { error: `Mô tả dự án tối đa ${MAX_BRIEF_LENGTH} ký tự.`, requestId },
      400,
    );
  }
  if (!sourceImage) {
    return apiJsonResponse({ error: "Thiếu ảnh nguồn.", requestId }, 400);
  }
  if (!ALLOWED_IMAGE_TYPES.has(sourceImage.type)) {
    return apiJsonResponse({ error: "Ảnh nguồn phải là JPG, PNG hoặc WEBP.", requestId }, 415);
  }
  if (sourceImage.size > MAX_IMAGE_BYTES) {
    return apiJsonResponse(
      { error: "Ảnh nguồn vượt quá dung lượng cho phép sau khi tối ưu.", requestId },
      413,
    );
  }

  const parts: Array<Record<string, unknown>> = [
    { text: buildPrompt(targetValue, brief) },
    await fileToInlineData(sourceImage),
  ];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          responseFormat: { image: { aspectRatio: "16:9", imageSize: "1K" } },
        },
      }),
    });

    if (!response.ok) {
      const upstreamStatus = await readUpstreamError(response);
      console.warn("DHP raw-finished upstream unavailable", {
        requestId,
        target: targetValue,
        upstreamHttpStatus: response.status,
        upstreamStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            response.status === 429
              ? "Dịch vụ dựng ảnh đang bận. Vui lòng thử lại sau."
              : "Chưa thể tạo bản xem trước. Vui lòng thử lại.",
            requestId,
          ),
          code: response.status === 429 ? "UPSTREAM_RATE_LIMITED" : "AI_REVEAL_FAILED",
          requestId,
        },
        response.status === 429 ? 429 : 502,
        response.status === 429 ? { "Retry-After": "30" } : undefined,
      );
    }

    const payload = (await response.json()) as GeminiGenerateResponse;
    const imagePart = payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .find(
        (part) =>
          typeof part.inlineData?.data === "string" &&
          typeof part.inlineData?.mimeType === "string" &&
          part.inlineData.mimeType.startsWith("image/"),
      );
    if (
      typeof imagePart?.inlineData?.data !== "string" ||
      typeof imagePart.inlineData.mimeType !== "string"
    ) {
      throw new Error("Gemini did not return an image part.");
    }

    return apiJsonResponse(
      {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        model: AI_CONCEPT_MODEL,
        target: targetValue,
        requestId,
      },
      200,
    );
  } catch (error) {
    const timedOut = controller.signal.aborted;
    console.error("DHP raw-finished generation failed", {
      requestId,
      target: targetValue,
      timedOut,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          timedOut
            ? "Quá trình dựng ảnh phản hồi quá lâu. Vui lòng thử lại."
            : "Không thể tạo bản xem trước. Vui lòng kiểm tra ảnh và thử lại.",
          requestId,
        ),
        code: timedOut ? "AI_REVEAL_TIMEOUT" : "AI_REVEAL_FAILED",
        requestId,
      },
      timedOut ? 504 : 502,
    );
  } finally {
    clearTimeout(timeout);
  }
}
