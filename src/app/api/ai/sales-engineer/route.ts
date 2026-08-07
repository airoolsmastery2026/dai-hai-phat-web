import { NextRequest } from "next/server";

import {
  buildEstimateReadiness,
  buildNextQuestionTool,
  parseSalesEngineerAgentRequest,
  SalesEngineerAgentValidationError,
  type SalesEngineerToolResult,
} from "@/lib/ai/sales-engineer-agent";
import { buildResidentialProposalEvidenceResponse } from "@/lib/ai/public-evidence";
import { getAIService } from "@/lib/ai/service-domain";
import {
  runSalesEngineerWithGemini,
  GeminiSalesEngineerError,
} from "@/lib/server/gemini-sales-engineer";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 16 * 1024;
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

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return apiJsonResponse({ error: "Content-Type không được hỗ trợ.", requestId }, 415);
  }

  const rateLimit = consumeRateLimit(
    "sales-engineer-agent",
    getRequestClientKey(request.headers),
    { maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu tư vấn. Vui lòng thử lại sau.",
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
    const agentRequest = parseSalesEngineerAgentRequest(JSON.parse(rawBody) as unknown);
    const tools: SalesEngineerToolResult[] = [
      buildEstimateReadiness(agentRequest.memory),
      buildNextQuestionTool(agentRequest.memory),
    ];

    const service = getAIService(agentRequest.memory.service);
    if (service) {
      const evidence = buildResidentialProposalEvidenceResponse({
        service,
        material: agentRequest.memory.material ?? "",
        style: agentRequest.memory.style ?? "",
        projectType: agentRequest.memory.projectType ?? "",
        dimensions: agentRequest.memory.dimensions ?? "",
        keywords: [agentRequest.message],
        limit: 4,
      });
      tools.unshift({
        name: "search_project_evidence",
        summary:
          evidence.images.length > 0
            ? `Tìm thấy ${evidence.images.length} mẫu tham chiếu trong dữ liệu Đại Hải Phát.`
            : "Chưa tìm thấy mẫu tham chiếu phù hợp trong dữ liệu hiện có.",
        data: {
          projects: evidence.images.map((image) => ({
            id: image.id,
            title: image.title,
            category: image.category,
            material: image.material ?? null,
          })),
          materials: evidence.materials,
          pricingRule: evidence.pricingRule,
        },
      });
    }

    const agent = await runSalesEngineerWithGemini(agentRequest, tools);

    console.info("DHP sales engineer agent generated", {
      requestId,
      model: agent.model,
      toolsUsed: agent.toolsUsed,
      service: service ?? agentRequest.memory.service ?? null,
    });

    return apiJsonResponse({ requestId, agent }, 200);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }
    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }
    if (error instanceof SalesEngineerAgentValidationError) {
      return apiJsonResponse(
        { error: error.message, requestId },
        400,
      );
    }
    if (error instanceof GeminiSalesEngineerError) {
      const rateLimited = error.code === "rate_limit";
      const timedOut = error.code === "timeout";
      console.warn("DHP sales engineer agent unavailable", {
        requestId,
        code: error.code,
        upstreamHttpStatus: error.upstreamHttpStatus,
        upstreamStatus: error.upstreamStatus,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            rateLimited
              ? "Trợ lý AI đang bận. Hồ sơ dự án vẫn được giữ nguyên."
              : timedOut
                ? "Trợ lý AI phản hồi quá lâu. Hồ sơ vẫn được giữ nguyên để thử lại."
                : "Trợ lý AI tạm thời chưa khả dụng. Hồ sơ dự án vẫn được giữ nguyên.",
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

    console.error("DHP sales engineer agent failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Không thể xử lý tư vấn lúc này. Hồ sơ dự án vẫn được giữ nguyên.",
          requestId,
        ),
        code: "AI_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
