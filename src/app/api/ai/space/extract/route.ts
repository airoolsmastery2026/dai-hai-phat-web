import { NextRequest } from "next/server";

import {
  parseSpaceExtractionRequest,
  SpaceExtractionOutputError,
  SpaceExtractionValidationError,
} from "@/lib/ai/space-extraction";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import {
  extractSpaceWithModelRuntimeCapability,
  ModelRuntimeCapabilityError,
} from "@/lib/server/model-runtime-capability";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 3_750_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;

class RequestBodyTooLargeError extends Error {}

async function readLimitedBody(request: NextRequest): Promise<string> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > BODY_LIMIT_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

function mapModelRuntimeError(
  error: ModelRuntimeCapabilityError,
  requestId: string,
) {
  const rateLimited = error.code === "rate_limit";
  const timedOut = error.code === "timeout";
  const invalidOutput = error.code === "invalid_output";

  return apiJsonResponse(
    {
      error: formatSupportReference(
        rateLimited
          ? "Các quota AI miễn phí đang bận hoặc đã chạm giới hạn. Ảnh không được lưu; bạn có thể thử lại sau."
          : timedOut
            ? "AI đọc mặt bằng phản hồi quá lâu. Ảnh không được lưu; bạn có thể thử lại."
            : invalidOutput
              ? "AI trả về dữ liệu mặt bằng không hợp lệ nên hệ thống đã chặn kết quả."
              : "AI đọc mặt bằng tạm thời chưa khả dụng. Ảnh không được lưu.",
        requestId,
      ),
      code: rateLimited
        ? "RATE_LIMITED"
        : timedOut
          ? "AI_TIMEOUT"
          : invalidOutput
            ? "INVALID_AI_GEOMETRY"
            : "AI_UNAVAILABLE",
      requestId,
    },
    rateLimited ? 429 : timedOut ? 504 : invalidOutput ? 502 : 503,
    rateLimited ? { "Retry-After": "30" } : undefined,
  );
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse(
      { error: "Nguồn yêu cầu không hợp lệ.", requestId },
      403,
    );
  }

  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return apiJsonResponse(
      { error: "Content-Type không được hỗ trợ.", requestId },
      415,
    );
  }

  const rateLimit = consumeRateLimit(
    "ai-space-extraction",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu đọc mặt bằng. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return apiJsonResponse(
      { error: "Dữ liệu ảnh vượt quá giới hạn của Space Designer.", requestId },
      413,
    );
  }

  try {
    const rawBody = await readLimitedBody(request);
    const extractionRequest = parseSpaceExtractionRequest(
      JSON.parse(rawBody) as unknown,
    );
    const revision = `space-${requestId}`;
    const routed = await extractSpaceWithModelRuntimeCapability(
      extractionRequest,
      revision,
    );

    console.info("DHP Space Designer extraction completed", {
      requestId,
      status: routed.extraction.status,
      provider: routed.provider,
      model: routed.model,
    });

    if (routed.extraction.status === "insufficient-evidence") {
      return apiJsonResponse(
        {
          requestId,
          gate: "G3_AI_EXTRACTION",
          code: "INSUFFICIENT_GEOMETRY_EVIDENCE",
          extraction: routed.extraction,
        },
        422,
        {
          "X-DHP-AI-Provider": routed.provider,
          "X-DHP-AI-Model": routed.model,
        },
      );
    }

    return apiJsonResponse(
      {
        requestId,
        gate: "G3_AI_EXTRACTION",
        extraction: routed.extraction,
      },
      200,
      {
        "X-DHP-AI-Provider": routed.provider,
        "X-DHP-AI-Model": routed.model,
      },
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu ảnh vượt quá giới hạn của Space Designer.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceExtractionValidationError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        error.code === "IMAGE_TOO_LARGE" ? 413 : 400,
      );
    }
    if (error instanceof SpaceExtractionOutputError) {
      console.warn("DHP Space Designer rejected AI geometry", {
        requestId,
        code: error.code,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            "AI trả về candidate geometry không đạt kiểm tra bắt buộc nên hệ thống đã chặn kết quả.",
            requestId,
          ),
          code: "INVALID_AI_GEOMETRY",
          requestId,
        },
        502,
      );
    }
    if (error instanceof ModelRuntimeCapabilityError) {
      console.warn("DHP Space Designer model runtime unavailable", {
        requestId,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
      });
      return mapModelRuntimeError(error, requestId);
    }

    console.error("DHP Space Designer extraction failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể đọc mặt bằng lúc này. Ảnh không được lưu.",
          requestId,
        ),
        code: "AI_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
