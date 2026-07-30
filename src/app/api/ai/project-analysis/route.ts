import { NextRequest } from "next/server";

import {
  parseProjectAnalysisRequest,
  ProjectAnalysisValidationError,
  type ProjectEvidenceContext,
} from "@/lib/ai/analysis";
import { ProposalEvidenceValidationError } from "@/lib/ai/catalog";
import { buildResidentialProposalEvidenceResponse } from "@/lib/ai/public-evidence";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  analyzeProjectWithGemini,
  GeminiProjectAnalysisError,
} from "@/lib/server/gemini";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
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

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return apiJsonResponse({ error: "Content-Type không được hỗ trợ.", requestId }, 415);
  }

  const rateLimit = consumeRateLimit(
    "project-analysis",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu phân tích. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
  }

  try {
    const rawBody = await readLimitedBody(request);
    const analysisRequest = parseProjectAnalysisRequest(
      JSON.parse(rawBody) as unknown,
    );
    const evidence = buildResidentialProposalEvidenceResponse({
      service: analysisRequest.service,
      material: analysisRequest.material,
      style: analysisRequest.style,
      projectType: analysisRequest.projectType,
      dimensions: analysisRequest.dimensions,
      keywords: [analysisRequest.priority],
      limit: 6,
    });
    const evidenceContext: ProjectEvidenceContext = {
      projects: evidence.images.map((image) => ({
        id: image.id,
        title: image.title,
        category: image.category,
        material: image.material ?? null,
      })),
      materials: evidence.materials,
      pricingRule: evidence.pricingRule,
    };
    const analysis = await analyzeProjectWithGemini(
      analysisRequest,
      evidenceContext,
    );

    console.info("DHP Gemini project analysis generated", {
      requestId,
      service: analysisRequest.service,
      model: analysis.model,
      evidenceCount: analysis.evidenceCount,
    });

    return apiJsonResponse({ requestId, analysis }, 200);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }
    if (
      error instanceof ProjectAnalysisValidationError ||
      error instanceof ProposalEvidenceValidationError ||
      error instanceof SyntaxError
    ) {
      return apiJsonResponse(
        {
          error:
            error instanceof SyntaxError
              ? "Dữ liệu JSON không hợp lệ."
              : error.message,
          requestId,
        },
        400,
      );
    }
    if (error instanceof GeminiProjectAnalysisError) {
      const rateLimited = error.code === "rate_limit";
      const timedOut = error.code === "timeout";
      console.warn("DHP Gemini project analysis unavailable", {
        requestId,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            rateLimited
              ? "Dịch vụ phân tích AI đang bận. Hồ sơ vẫn được giữ nguyên."
              : timedOut
                ? "Phân tích AI phản hồi quá lâu. Hồ sơ vẫn được giữ nguyên để anh/chị thử lại."
                : "Phân tích AI tạm thời chưa khả dụng. Hồ sơ vẫn được giữ nguyên.",
            requestId,
          ),
          code: rateLimited
            ? "RATE_LIMITED"
            : timedOut
              ? "AI_TIMEOUT"
              : "AI_UNAVAILABLE",
          requestId,
        },
        rateLimited ? 429 : timedOut ? 504 : 503,
        rateLimited ? { "Retry-After": "30" } : undefined,
      );
    }

    console.error("DHP Gemini project analysis failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể phân tích hồ sơ lúc này. Hồ sơ vẫn được giữ nguyên.",
          requestId,
        ),
        code: "AI_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
