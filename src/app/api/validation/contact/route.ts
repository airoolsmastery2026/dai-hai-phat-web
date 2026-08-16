import { NextRequest } from "next/server";

import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import { verifyEmailDomain } from "@/lib/server/email-domain-verification";
import { verifyPhoneWithAPILayer } from "@/lib/server/phone-verification";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BODY_LIMIT_BYTES = 2 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

type ContactField = "phone" | "email" | "zalo";

function parseBody(value: unknown): { field: ContactField; value: string } | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.field !== "phone" && record.field !== "email" && record.field !== "zalo") {
    return null;
  }
  if (typeof record.value !== "string") return null;
  const normalized = record.value.trim();
  if (!normalized || normalized.length > 254) return null;
  return { field: record.field, value: normalized };
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
        error: "Có quá nhiều lần kiểm tra liên tiếp. Vui lòng thử lại sau ít phút.",
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
    const parsed = parseBody(JSON.parse(rawBody) as unknown);
    if (!parsed) {
      return apiJsonResponse({ error: "Thông tin cần kiểm tra không hợp lệ.", requestId }, 400);
    }

    if (parsed.field === "email") {
      const result = await verifyEmailDomain(parsed.value);
      if (result.status === "invalid") {
        return apiJsonResponse(
          {
            valid: false,
            verification: "invalid",
            message: "Tên miền email không thể nhận thư hoặc không tồn tại. Vui lòng kiểm tra lại email.",
            requestId,
          },
          422,
        );
      }
      if (result.status === "verified") {
        return apiJsonResponse(
          {
            valid: true,
            verification: "domain_valid",
            message: "Tên miền email có khả năng nhận thư. Hộp thư vẫn chưa được xác minh là thuộc về người nhập nếu chưa có bước xác nhận riêng.",
            requestId,
          },
          200,
        );
      }
      return apiJsonResponse(
        {
          valid: true,
          verification: "format_only",
          message: "Email đúng định dạng nhưng dịch vụ DNS chưa thể xác nhận tên miền lúc này. Hộp thư chưa được xác minh quyền sở hữu.",
          requestId,
        },
        200,
      );
    }

    const result = await verifyPhoneWithAPILayer(parsed.value);
    if (result.status === "invalid") {
      return apiJsonResponse(
        {
          valid: false,
          verification: "invalid",
          message: `${parsed.field === "zalo" ? "Số Zalo" : "Số điện thoại"} không được dịch vụ xác minh số công nhận là hợp lệ. Vui lòng kiểm tra lại.`,
          requestId,
        },
        422,
      );
    }
    if (result.status === "verified") {
      return apiJsonResponse(
        {
          valid: true,
          verification: "network_valid",
          message: "Số điện thoại được dịch vụ xác minh số công nhận là hợp lệ. Việc số này thuộc về người nhập vẫn cần OTP hoặc xác nhận liên hệ thực tế.",
          requestId,
        },
        200,
      );
    }

    return apiJsonResponse(
      {
        valid: true,
        verification: "format_only",
        message: "Số điện thoại đúng định dạng nhưng dịch vụ xác minh ngoài chưa khả dụng. Quyền sở hữu số chưa được xác minh.",
        requestId,
      },
      200,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiJsonResponse({ error: "Dữ liệu gửi đi chưa hợp lệ.", requestId }, 400);
    }
    console.warn("DHP contact validation unavailable", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        valid: true,
        verification: "format_only",
        message: "Không thể kiểm tra dịch vụ ngoài lúc này. Hệ thống chỉ ghi nhận thông tin đã vượt qua kiểm tra định dạng và chưa xem là đã xác minh.",
        requestId,
      },
      200,
    );
  }
}
