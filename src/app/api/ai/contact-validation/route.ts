import { NextRequest } from "next/server";

import {
  verifyContactValue,
  type ContactVerificationField,
} from "@/lib/server/contact-verification";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 2 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 16;
const SUPPORTED_FIELDS = new Set<ContactVerificationField>([
  "phone",
  "zalo",
  "email",
]);

function isContactField(value: unknown): value is ContactVerificationField {
  return typeof value === "string" && SUPPORTED_FIELDS.has(value as ContactVerificationField);
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return apiJsonResponse({ error: "Định dạng yêu cầu không được hỗ trợ.", requestId }, 415);
  }

  const rateLimit = consumeRateLimit(
    "contact-validation",
    getRequestClientKey(request.headers),
    { maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Quá nhiều lần kiểm tra liên hệ. Vui lòng thử lại sau.",
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
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > BODY_LIMIT_BYTES) {
      return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }

    const body = JSON.parse(rawBody) as { field?: unknown; value?: unknown };
    if (!isContactField(body.field) || typeof body.value !== "string") {
      return apiJsonResponse({ error: "Dữ liệu kiểm tra liên hệ không hợp lệ.", requestId }, 400);
    }

    const value = body.value.trim();
    if (!value || value.length > 254) {
      return apiJsonResponse({ error: "Giá trị liên hệ không hợp lệ.", requestId }, 400);
    }

    const verification = await verifyContactValue(body.field, value);
    return apiJsonResponse({ requestId, verification }, 200);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiJsonResponse({ error: "Dữ liệu JSON không hợp lệ.", requestId }, 400);
    }

    console.error("DHP contact validation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: "Hiện chưa thể kiểm tra liên hệ ở phía máy chủ.",
        code: "CONTACT_VALIDATION_UNAVAILABLE",
        requestId,
      },
      503,
    );
  }
}
