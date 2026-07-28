import { NextRequest, NextResponse } from "next/server";

import {
  buildProposalEvidenceResponse,
  parseProposalEvidenceRequest,
  ProposalEvidenceValidationError,
} from "@/lib/ai/catalog";

export const dynamic = "force-dynamic";

const BODY_LIMIT_BYTES = 4 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_MAX_CLIENTS = 500;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RequestBodyTooLargeError extends Error {}

const rateLimits = new Map<string, RateLimitEntry>();

function jsonResponse(body: unknown, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("x-real-ip")?.trim() || forwarded || "anonymous";
}

function checkRateLimit(clientKey: string, now = Date.now()) {
  let boundedClientKey = clientKey;
  if (rateLimits.size >= RATE_LIMIT_MAX_CLIENTS && !rateLimits.has(clientKey)) {
    rateLimits.forEach((entry, key) => {
      if (entry.resetAt <= now) rateLimits.delete(key);
    });
    if (rateLimits.size >= RATE_LIMIT_MAX_CLIENTS) {
      boundedClientKey = "overflow";
    }
  }

  const existing = rateLimits.get(boundedClientKey);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(boundedClientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function isSameOriginRequest(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
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

  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Content-Type không được hỗ trợ.", requestId }, 415);
  }

  const rateLimit = checkRateLimit(getClientKey(request));
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
    const evidence = buildProposalEvidenceResponse(query);

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
      { error: "Không thể đối chiếu Knowledge Base lúc này.", requestId },
      500,
    );
  }
}
