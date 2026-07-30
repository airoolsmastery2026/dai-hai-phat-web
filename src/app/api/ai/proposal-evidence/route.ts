import { NextRequest, NextResponse } from "next/server";

import {
  parseProposalEvidenceRequest,
  ProposalEvidenceValidationError,
} from "@/lib/ai/catalog";
import { buildResidentialProposalEvidenceResponse } from "@/lib/ai/public-evidence";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";

const BODY_LIMIT_BYTES = 4 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

class RequestBodyTooLargeError extends Error {}

function readResponseRequestId(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("requestId" in body)) {
    return undefined;
  }

  const requestId = (body as { requestId?: unknown }).requestId;
  return typeof requestId === "string" && requestId.length <= 100
    ? requestId
    : undefined;
}

function jsonResponse(body: unknown, status: number, extraHeaders?: HeadersInit) {
  const requestId = readResponseRequestId(body);

  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(requestId ? { "X-Request-ID": requestId } : {}),
      ...extraHeaders,
    },
  });
}

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
    return jsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Content-Type không được hỗ trợ.", requestId }, 415);
  }

  const rateLimit = consumeRateLimit(
    "proposal-evidence",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "Quá nhiều yêu cầu đối chiếu. Vui lòng thử lại sau.", requestId },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return jsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
  }

  try {
    const rawBody = await readLimitedBody(request);
    const query = parseProposalEvidenceRequest(JSON.parse(rawBody) as unknown);
    const evidence = buildResidentialProposalEvidenceResponse(query);

    console.info("DHP proposal evidence generated", {
      requestId,
      service: query.service,
      imageCount: evidence.images.length,
      priceCount: evidence.prices.length,
    });

    return jsonResponse({ requestId, evidence }, 200);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }
    if (
      error instanceof ProposalEvidenceValidationError ||
      error instanceof SyntaxError
    ) {
      return jsonResponse(
        {
          error:
            error instanceof ProposalEvidenceValidationError
              ? error.message
              : "Dữ liệu JSON không hợp lệ.",
          requestId,
        },
        400,
      );
    }

    console.error("DHP proposal evidence failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonResponse(
      {
        error: formatSupportReference(
          "Không thể đối chiếu Knowledge Base lúc này.",
          requestId,
        ),
        requestId,
      },
      500,
    );
  }
}
