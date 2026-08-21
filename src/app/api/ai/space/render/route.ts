import { NextRequest } from "next/server";

import { SpaceConfirmationError } from "@/lib/ai/space-confirmation";
import { verifyConfirmedSpaceAtBoundary } from "@/lib/ai/space-confirmation-boundary";
import {
  evaluateConfirmedLayout,
  parseStrictLayoutProposal,
  SpaceLayoutGateError,
} from "@/lib/ai/space-layout-gate";
import {
  buildSpaceRenderPrompt,
  parseSpaceRenderRequest,
  SPACE_RENDER_ARTIFACT_CLASS,
  SPACE_RENDER_ENGINEERING_STATUS,
  SpaceRenderError,
} from "@/lib/ai/space-render";
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
} from "@/lib/server/concept-render-adapter";
import { getSpaceConfirmationSealKey } from "@/lib/server/space-confirmation-key";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

const BODY_LIMIT_BYTES = 7_500_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;

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

function renderAdapterStatus(error: ConceptRenderAdapterError): number {
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
    "ai-space-render",
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

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return apiJsonResponse(
      { error: "Dữ liệu render vượt quá giới hạn.", requestId },
      413,
    );
  }

  const sealKey = await getSpaceConfirmationSealKey();
  if (!sealKey) {
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Chức năng render chưa được cấu hình trust root an toàn.",
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
    const renderRequest = parseSpaceRenderRequest(payload);

    const confirmed = await verifyConfirmedSpaceAtBoundary(
      renderRequest.confirmed,
      sealKey,
    );
    const layoutReport = await evaluateConfirmedLayout(
      { confirmed, proposal: renderRequest.proposal },
      sealKey,
    );
    if (!layoutReport.valid) {
      return apiJsonResponse(
        {
          error: "Layout chưa vượt qua deterministic gate G5 nên không được render.",
          code: "SPACE_LAYOUT_REJECTED",
          requestId,
          gate: layoutReport.gate,
          confirmedRevision: layoutReport.confirmedRevision,
          issues: layoutReport.issues,
        },
        422,
      );
    }

    if (!isConceptRenderConfigured()) {
      return apiJsonResponse(
        {
          error: formatSupportReference(
            "Render adapter chưa được cấu hình trên máy chủ.",
            requestId,
          ),
          code: "SPACE_RENDER_UNAVAILABLE",
          requestId,
        },
        503,
      );
    }

    const proposal = parseStrictLayoutProposal(renderRequest.proposal);
    const prompt = buildSpaceRenderPrompt(
      confirmed,
      proposal,
      renderRequest.styleIntent,
      Boolean(renderRequest.referenceImage),
    );
    const images = [
      renderRequest.siteImage,
      ...(renderRequest.referenceImage ? [renderRequest.referenceImage] : []),
    ];
    const rendered = await renderConceptPresentation({ prompt, images });

    return apiJsonResponse(
      {
        requestId,
        gate: "G6_RENDER_ADAPTER",
        confirmedRevision: confirmed.confirmedRevision,
        layoutGate: layoutReport.gate,
        artifactClass: SPACE_RENDER_ARTIFACT_CLASS,
        engineeringStatus: SPACE_RENDER_ENGINEERING_STATUS,
        imageBase64: rendered.imageBase64,
        mimeType: rendered.mimeType,
        model: rendered.model,
      },
      200,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu render vượt quá giới hạn.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceRenderError) {
      const status =
        error.code === "RENDER_IMAGE_TOO_LARGE"
          ? 413
          : error.code === "RENDER_PROMPT_TOO_LARGE"
            ? 422
            : 400;
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        status,
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
    if (error instanceof ConceptRenderAdapterError) {
      const status = renderAdapterStatus(error);
      console.warn("DHP Space render adapter unavailable", {
        requestId,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(error.message, requestId),
          code: `SPACE_RENDER_${error.code.toUpperCase()}`,
          requestId,
        },
        status,
        error.code === "rate_limit" ? { "Retry-After": "30" } : undefined,
      );
    }

    console.error("DHP Space render failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể tạo phối cảnh không gian lúc này.",
          requestId,
        ),
        code: "SPACE_RENDER_FAILED",
        requestId,
      },
      500,
    );
  }
}
