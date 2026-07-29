import { NextRequest, NextResponse } from "next/server";

import {
  parseVerifiedGalleryRequest,
  ProposalEvidenceValidationError,
} from "@/lib/ai/catalog";
import { listPublicResidentialGallery } from "@/lib/ai/public-gallery";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";

export const dynamic = "force-dynamic";

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

export function GET(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return jsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }

  const rateLimit = consumeRateLimit(
    "verified-gallery",
    getRequestClientKey(request.headers),
    { maxRequests: 60, windowMs: 60_000 },
  );
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: "Quá nhiều yêu cầu thư viện. Vui lòng thử lại sau.", requestId },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  try {
    const query = parseVerifiedGalleryRequest(request.nextUrl.searchParams);
    const gallery = listPublicResidentialGallery(query);

    console.info("DHP residential gallery generated", {
      requestId,
      resultCount: gallery.items.length,
      total: gallery.total,
      hasFilters: request.nextUrl.searchParams.size > 0,
    });

    return jsonResponse({ requestId, gallery }, 200);
  } catch (error) {
    if (error instanceof ProposalEvidenceValidationError) {
      return jsonResponse({ error: error.message, requestId }, 400);
    }

    console.error("DHP residential gallery failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonResponse(
      { error: "Không thể tải thư viện công trình lúc này.", requestId },
      500,
    );
  }
}
