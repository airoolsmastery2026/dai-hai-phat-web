import { NextRequest } from "next/server";

import { SpaceConfirmationError } from "@/lib/ai/space-confirmation";
import { verifyConfirmedSpaceAtBoundary } from "@/lib/ai/space-confirmation-boundary";
import {
  buildPreliminarySpaceBoq,
  parseSpaceBoqRequest,
  SpaceBoqError,
} from "@/lib/ai/space-boq";
import {
  evaluateConfirmedLayout,
  parseStrictLayoutProposal,
  SpaceLayoutGateError,
} from "@/lib/ai/space-layout-gate";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { getSpaceConfirmationSealKey } from "@/lib/server/space-confirmation-key";
import { getSpacePricingCatalog } from "@/lib/server/space-pricing-catalog";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 512 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

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

function boqErrorStatus(error: SpaceBoqError): number {
  return error.code === "BOQ_AMOUNT_OVERFLOW" ||
    error.code === "INVALID_BOQ_PRICING_CATALOG"
    ? 422
    : 400;
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
    "ai-space-boq",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu lập BOQ. Vui lòng thử lại sau.",
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
      { error: "Dữ liệu BOQ vượt quá giới hạn.", requestId },
      413,
    );
  }

  const sealKey = await getSpaceConfirmationSealKey();
  if (!sealKey) {
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Chức năng BOQ chưa được cấu hình trust root an toàn.",
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
    const boqRequest = parseSpaceBoqRequest(payload);

    const confirmed = await verifyConfirmedSpaceAtBoundary(
      boqRequest.confirmed,
      sealKey,
    );
    const layoutReport = await evaluateConfirmedLayout(
      { confirmed, proposal: boqRequest.proposal },
      sealKey,
    );
    if (!layoutReport.valid) {
      return apiJsonResponse(
        {
          error: "Layout chưa vượt qua deterministic gate G5 nên không được lập BOQ.",
          code: "SPACE_LAYOUT_REJECTED",
          requestId,
          gate: layoutReport.gate,
          confirmedRevision: layoutReport.confirmedRevision,
          issues: layoutReport.issues,
        },
        422,
      );
    }

    const proposal = parseStrictLayoutProposal(boqRequest.proposal);
    const catalog = getSpacePricingCatalog();
    const boq = buildPreliminarySpaceBoq(
      proposal,
      boqRequest.selections,
      catalog,
    );

    return apiJsonResponse(
      {
        requestId,
        confirmedRevision: confirmed.confirmedRevision,
        ...boq,
      },
      200,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu BOQ vượt quá giới hạn.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceBoqError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        boqErrorStatus(error),
      );
    }
    if (error instanceof SpaceLayoutGateError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        400,
      );
    }
    if (error instanceof SpaceConfirmationError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        confirmationErrorStatus(error),
      );
    }

    console.error("DHP Space BOQ failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể lập BOQ tham chiếu lúc này.",
          requestId,
        ),
        code: "SPACE_BOQ_FAILED",
        requestId,
      },
      500,
    );
  }
}
