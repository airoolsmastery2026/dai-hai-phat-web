import { NextRequest } from "next/server";

import { SpaceConfirmationError } from "@/lib/ai/space-confirmation";
import { verifyConfirmedSpaceAtBoundary } from "@/lib/ai/space-confirmation-boundary";
import {
  buildSpaceLayoutGenerationPrompt,
  parseSpaceLayoutGenerationOutput,
  parseSpaceLayoutGenerationRequest,
  SpaceLayoutGenerationError,
} from "@/lib/ai/space-layout-generation";
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
import {
  generateSpaceLayoutWithModelRuntimeCapability,
  ModelRuntimeCapabilityError,
} from "@/lib/server/model-runtime-capability";
import { getSpaceConfirmationSealKey } from "@/lib/server/space-confirmation-key";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 512 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

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

function runtimeErrorStatus(error: ModelRuntimeCapabilityError): number {
  switch (error.code) {
    case "rate_limit":
      return 429;
    case "timeout":
      return 504;
    case "configuration":
      return 503;
    case "invalid_output":
    case "upstream":
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
    "ai-space-layout-generation",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu sinh layout. Vui lòng thử lại sau.",
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
      { error: "Dữ liệu sinh layout vượt quá giới hạn.", requestId },
      413,
    );
  }

  const sealKey = await getSpaceConfirmationSealKey();
  if (!sealKey) {
    console.error("DHP Space layout generation trust root is unavailable", {
      requestId,
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Chức năng sinh layout chưa được cấu hình an toàn.",
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
    const generationRequest = parseSpaceLayoutGenerationRequest(payload);
    const confirmed = await verifyConfirmedSpaceAtBoundary(
      generationRequest.confirmed,
      sealKey,
    );
    const prompt = buildSpaceLayoutGenerationPrompt(
      confirmed,
      generationRequest.intent,
    );
    const generated = await generateSpaceLayoutWithModelRuntimeCapability(prompt);
    const parsedOutput = parseSpaceLayoutGenerationOutput(generated.outputText);

    let proposal;
    try {
      proposal = parseStrictLayoutProposal(parsedOutput);
    } catch (error) {
      if (error instanceof SpaceLayoutGateError) {
        throw new SpaceLayoutGenerationError(
          "Model layout trả về proposal ngoài schema G5.",
          "INVALID_LAYOUT_MODEL_OUTPUT",
        );
      }
      throw error;
    }

    if (proposal.baseRevision !== confirmed.confirmedRevision) {
      throw new SpaceLayoutGenerationError(
        "Model layout trả về baseRevision không khớp geometry đã xác nhận.",
        "INVALID_LAYOUT_MODEL_OUTPUT",
      );
    }
    if (proposal.placements.length === 0 || proposal.placements.length > 100) {
      throw new SpaceLayoutGenerationError(
        "Model layout không tạo số lượng placement hữu dụng.",
        "INVALID_LAYOUT_MODEL_OUTPUT",
      );
    }

    const report = await evaluateConfirmedLayout(
      { confirmed, proposal },
      sealKey,
    );
    if (!report.valid) {
      return apiJsonResponse(
        {
          error: "Layout AI bị deterministic gate G5 từ chối.",
          code: "SPACE_LAYOUT_REJECTED",
          requestId,
          gate: report.gate,
          confirmedRevision: report.confirmedRevision,
          issues: report.issues,
        },
        422,
      );
    }

    return apiJsonResponse(
      {
        requestId,
        gate: report.gate,
        confirmedRevision: report.confirmedRevision,
        proposal,
        provider: generated.provider,
        model: generated.model,
      },
      200,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu sinh layout vượt quá giới hạn.", requestId },
        413,
      );
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SpaceLayoutGenerationError) {
      const status =
        error.code === "INVALID_LAYOUT_GENERATION_REQUEST" ||
        error.code === "INVALID_LAYOUT_INTENT"
          ? 400
          : error.code === "LAYOUT_PROMPT_TOO_LARGE"
            ? 422
            : 502;
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        status,
      );
    }
    if (error instanceof ModelRuntimeCapabilityError) {
      console.warn("DHP Space layout free model runtime unavailable", {
        requestId,
        code: error.code,
        upstreamStatus: error.upstreamHttpStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(error.message, requestId),
          code: `MODEL_RUNTIME_${error.code.toUpperCase()}`,
          requestId,
        },
        runtimeErrorStatus(error),
        error.code === "rate_limit" ? { "Retry-After": "30" } : undefined,
      );
    }
    if (error instanceof SpaceConfirmationError) {
      console.warn("DHP Space layout generation rejected untrusted confirmation", {
        requestId,
        code: error.code,
      });
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        confirmationErrorStatus(error),
      );
    }
    if (error instanceof SpaceLayoutGateError) {
      return apiJsonResponse(
        { error: error.message, code: error.code, requestId },
        400,
      );
    }

    console.error("DHP Space layout generation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể sinh layout lúc này.",
          requestId,
        ),
        code: "SPACE_LAYOUT_GENERATION_FAILED",
        requestId,
      },
      500,
    );
  }
}
