import { NextRequest } from "next/server";

import { normalizeVietnamPhone } from "@/lib/ai/customer-input";
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
const EMAIL_PATTERN = /^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i;

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

function normalizeEmail(value: string): string | null {
  const normalized = value.trim().toLocaleLowerCase("en-US");
  if (normalized.length > 254 || normalized.includes("..")) return null;
  const match = normalized.match(EMAIL_PATTERN);
  if (!match) return null;
  const [, local, domain] = match;
  if (local.length > 64 || domain.length > 253) return null;
  const labels = domain.split(".");
  if (
    labels.some((label) => !label || label.startsWith("-") || label.endsWith("-")) ||
    !/^[a-z]{2,24}$/i.test(labels[labels.length - 1] ?? "")
  ) {
    return null;
  }
  if (["example.com", "example.org", "example.net"].includes(domain)) return null;
  return normalized;
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
      const normalizedEmail = normalizeEmail(parsed.value);
      if (!normalizedEmail) {
        return apiJsonResponse(
          {
            valid: false,
            verification: "invalid",
            message: "Email chưa đúng định dạng hoặc đang dùng địa chỉ minh họa. Vui lòng kiểm tra lại.",
            requestId,
          },
          422,
        );
      }

      const result = await verifyEmailDomain(normalizedEmail);
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
            normalizedValue: normalizedEmail,
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
          normalizedValue: normalizedEmail,
          message: "Email đúng định dạng nhưng DNS chưa thể xác nhận tên miền lúc này. Hộp thư chưa được xác minh quyền sở hữu.",
          requestId,
        },
        200,
      );
    }

    const normalizedPhone = normalizeVietnamPhone(parsed.value);
    if (!normalizedPhone) {
      return apiJsonResponse(
        {
          valid: false,
          verification: "invalid",
          message: `${parsed.field === "zalo" ? "Số Zalo" : "Số điện thoại"} chưa đúng chuẩn số di động Việt Nam.`,
          requestId,
        },
        422,
      );
    }

    const result = await verifyPhoneWithAPILayer(normalizedPhone);
    if (result.status === "invalid") {
      return apiJsonResponse(
        {
          valid: false,
          verification: "invalid",
          message: `${parsed.field === "zalo" ? "Số Zalo" : "Số điện thoại"} không được dịch vụ kiểm tra số công nhận là hợp lệ. Vui lòng kiểm tra lại.`,
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
          normalizedValue: normalizedPhone,
          message: "Số điện thoại được dịch vụ kiểm tra mạng công nhận là hợp lệ. Việc số này thuộc về người nhập vẫn cần OTP hoặc xác nhận liên hệ thực tế.",
          requestId,
        },
        200,
      );
    }

    return apiJsonResponse(
      {
        valid: true,
        verification: "format_only",
        normalizedValue: normalizedPhone,
        message: "Số điện thoại đúng định dạng nhưng dịch vụ kiểm tra ngoài chưa xác nhận được. Quyền sở hữu số chưa được xác minh.",
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
        error: "Không thể kiểm tra thông tin liên hệ ở phía máy chủ lúc này. Vui lòng thử lại.",
        code: "CONTACT_VALIDATION_UNAVAILABLE",
        requestId,
      },
      503,
    );
  }
}
