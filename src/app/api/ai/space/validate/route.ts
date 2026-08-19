import { NextRequest } from "next/server";

import {
  evaluateSpaceProposal,
  type SpaceModel,
  validateSpaceModel,
} from "@/lib/ai/space-designer";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 128 * 1024;
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
    "ai-space-validator",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều yêu cầu kiểm tra không gian. Vui lòng thử lại sau.",
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
      { error: "Dữ liệu Space Model vượt quá giới hạn.", requestId },
      413,
    );
  }

  try {
    const rawBody = await readLimitedBody(request);
    const payload = JSON.parse(rawBody) as {
      model?: unknown;
      proposal?: unknown;
    };

    const modelReport = validateSpaceModel(payload.model);
    if (!modelReport.valid) {
      return apiJsonResponse(
        {
          requestId,
          gate: "G1_SPACE_MODEL",
          valid: false,
          issues: modelReport.issues,
        },
        422,
      );
    }

    if (payload.proposal === undefined) {
      return apiJsonResponse(
        {
          requestId,
          gate: "G1_SPACE_MODEL",
          valid: true,
          issues: modelReport.issues,
        },
        200,
      );
    }

    const proposalReport = evaluateSpaceProposal(
      payload.model as SpaceModel,
      payload.proposal,
    );

    return apiJsonResponse(
      {
        requestId,
        gate: "G5_LAYOUT_CONSTRAINTS",
        valid: proposalReport.valid,
        issues: proposalReport.issues,
      },
      proposalReport.valid ? 200 : 422,
    );
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return apiJsonResponse(
        { error: "Dữ liệu Space Model vượt quá giới hạn.", requestId },
        413,
      );
    }

    if (error instanceof SyntaxError) {
      return apiJsonResponse(
        { error: "Dữ liệu JSON không hợp lệ.", requestId },
        400,
      );
    }

    console.error("DHP Space Designer validation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: "Không thể kiểm tra Space Model lúc này.",
        code: "SPACE_VALIDATION_FAILED",
        requestId,
      },
      500,
    );
  }
}
