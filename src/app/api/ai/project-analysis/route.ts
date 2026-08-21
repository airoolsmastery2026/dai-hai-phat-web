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
  analyzeProjectWithCloudRouter,
  CloudAiRouterError,
} from "@/lib/server/cloud-ai-router";
import { buildDeterministicProjectAnalysis } from "@/lib/server/project-analysis-fallback";
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

    try {
      const routed = await analyzeProjectWithCloudRouter(
        analysisRequest,
        evidenceContext,
      );

      console.info("DHP cloud AI project analysis generated", {
        requestId,
        service: analysisRequest.service,
        provider: routed.analysis.provider,
        model: routed.analysis.model,
        evidenceCount: routed.analysis.evidenceCount,
        cache: routed.cache,
      });

      return apiJsonResponse(
        { requestId, analysis: routed.analysis },
        200,
        {
          "X-DHP-AI-Cache": routed.cache,
          "X-DHP-AI-Provider": routed.analysis.provider,
          "X-DHP-AI-Model": routed.analysis.model,
        },
      );
    } catch (error) {
      if (!(error instanceof CloudAiRouterError)) throw error;

      const fallback = buildDeterministicProjectAnalysis(
        analysisRequest,
        evidenceContext,
      );

      console.warn("DHP project analysis using deterministic fallback", {
        requestId,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
        fallbackProvider: fallback.provider,
        fallbackModel: fallback.model,
      });

      return apiJsonResponse(
        {
          requestId,
          analysis: fallback,
          degraded: true,
          fallbackReason: error.code,
        },
        200,
        {
          "X-DHP-AI-Cache": "MISS",
          "X-DHP-AI-Provider": fallback.provider,
          "X-DHP-AI-Model": fallback.model,
          "X-DHP-AI-Fallback": "deterministic",
        },
      );
    }
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
              : (error as Error).message,
          requestId,
        },
        400,
      );
    }

    console.error("DHP project analysis failed before fallback", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể xử lý hồ sơ lúc này. Hồ sơ vẫn được giữ nguyên.",
          requestId,
        ),
        code: "ANALYSIS_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
