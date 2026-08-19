import { NextRequest } from "next/server";

import { SpaceConfirmationError } from "@/lib/ai/space-confirmation";
import {
  evaluateConfirmedLayout,
  SpaceLayoutGateError,
} from "@/lib/ai/space-layout-gate";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { getSpaceConfirmationSealKey } from "@/lib/server/space-confirmation-key";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 512 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

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

function confirmationErrorStatus(error: SpaceConfirmationError): number {
  return error.code === "INVALID_SEAL_KEY" ? 503 : 422;
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
    "ai-space-layout-validation",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu kiểm tra layout. Vui lòng thử lại sau.",
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
      { error: "Dữ liệu layout vượt quá giới hạn.", requestId },
      413,
    );
  }

  const sealKey = await getSpaceConfirmationSealKey();
  if (!sealKey) {
    console.error("DHP Space layout trust root is unavailable", { requestId });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Chức năng kiểm tra layout chưa được cấu hình an toàn.",
          requestId,
        ),
        code: "SPACE_CONFIRMATION_NOT_CONFIGURED",
        requestId,
      },
      503,
    );
  }

  try {
    const rawBody = await readLimitedBody(request);
    const payload = JSON.parse(rawBody) as unknown;
    const report = await evaluateConfirmedLayout(payload, sealKey);

    return apiJsonResponse(
      { requestId, ...report },
      report.valid ? 200 : 422,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu layout vượt quá giới hạn.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceLayoutGateError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        400,
      );
    }
    if (error instanceof SpaceConfirmationError) {
      console.warn("DHP Space layout rejected untrusted confirmation", {
        requestId,
        code: error.code,
      });
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        confirmationErrorStatus(error),
      );
    }

    console.error("DHP Space layout validation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể kiểm tra layout lúc này.",
          requestId,
        ),
        code: "SPACE_LAYOUT_VALIDATION_FAILED",
        requestId,
      },
      500,
    );
  }
}
