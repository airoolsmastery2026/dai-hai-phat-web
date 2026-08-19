import { NextRequest } from "next/server";

import { confirmSpaceCandidateAtBoundary } from "@/lib/ai/space-confirmation-boundary";
import { SpaceConfirmationError } from "@/lib/ai/space-confirmation";
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

const BODY_LIMIT_BYTES = 256 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

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
  if (error.code === "INVALID_SEAL_KEY") return 503;
  if (
    error.code === "INVALID_CONFIRMATION_REQUEST" ||
    error.code === "CLIENT_AUTHORITY_FIELD"
  ) {
    return 400;
  }
  return 422;
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
    "ai-space-confirmation",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu xác nhận mặt bằng. Vui lòng thử lại sau.",
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
      { error: "Dữ liệu xác nhận mặt bằng vượt quá giới hạn.", requestId },
      413,
    );
  }

  const sealKey = await getSpaceConfirmationSealKey();
  if (!sealKey) {
    console.error("DHP Space confirmation trust root is unavailable", {
      requestId,
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Chức năng khóa mặt bằng chưa được cấu hình an toàn.",
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
    const confirmed = await confirmSpaceCandidateAtBoundary(payload, sealKey);

    console.info("DHP Space Designer geometry confirmed", {
      requestId,
      sourceRevision: confirmed.sourceRevision,
      confirmedRevision: confirmed.confirmedRevision,
      dimensionStatus: confirmed.verification.dimensionStatus,
    });

    return apiJsonResponse(
      {
        requestId,
        gate: "G4_GEOMETRY_CONFIRMATION",
        confirmed,
      },
      200,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu xác nhận mặt bằng vượt quá giới hạn.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceConfirmationError) {
      console.warn("DHP Space Designer confirmation rejected", {
        requestId,
        code: error.code,
      });
      return apiJsonResponse(
        {
          error: error.message,
          code: error.code,
          requestId,
        },
        confirmationErrorStatus(error),
      );
    }

    console.error("DHP Space Designer confirmation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể khóa mặt bằng lúc này.",
          requestId,
        ),
        code: "SPACE_CONFIRMATION_FAILED",
        requestId,
      },
      500,
    );
  }
}
