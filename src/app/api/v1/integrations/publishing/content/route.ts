import { NextRequest } from "next/server";

import {
  listPublishingContent,
  type PublishingContentQuery,
} from "@/lib/integrations/publishing-content";
import {
  consumeRateLimit,
  getRequestClientKey,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function readLimit(value: string | null): number {
  if (!value) return DEFAULT_LIMIT;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

function readQuery(request: NextRequest): PublishingContentQuery {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const status = params.get("status");
  const locale = params.get("locale");

  return {
    type: type === "service" ? type : undefined,
    status: status === "ready" ? status : undefined,
    updatedAfter: params.get("updatedAfter") ?? undefined,
    category: params.get("category") ?? undefined,
    locale: locale === "vi-VN" ? locale : undefined,
    limit: readLimit(params.get("limit")),
    cursor: params.get("cursor") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  try {
    const principal = authenticateService(request.headers, ["publishing-bot"]);
    const rateLimit = consumeRateLimit(
      "publishing-content-v1",
      `${principal.service}:${getRequestClientKey(request.headers)}`,
      {
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW_MS,
      },
    );

    if (!rateLimit.allowed) {
      return apiJsonResponse(
        {
          schemaVersion: "1.0",
          requestId,
          error: {
            code: "RATE_LIMITED",
            message: "Quá nhiều yêu cầu nội dung. Vui lòng thử lại sau.",
            retryable: true,
          },
        },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    const page = listPublishingContent(readQuery(request));
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: page,
      },
      200,
    );
  } catch (error) {
    if (error instanceof ServiceAuthenticationError) {
      const notConfigured = error.code === "not_configured";
      return apiJsonResponse(
        {
          schemaVersion: "1.0",
          requestId,
          error: {
            code: notConfigured
              ? "INTEGRATION_NOT_CONFIGURED"
              : error.code === "forbidden"
                ? "SERVICE_FORBIDDEN"
                : "SERVICE_UNAUTHORIZED",
            message: notConfigured
              ? "API tích hợp chưa được cấu hình."
              : "Thông tin xác thực dịch vụ không hợp lệ.",
            retryable: false,
          },
        },
        notConfigured ? 503 : error.code === "forbidden" ? 403 : 401,
      );
    }

    console.error("DHP publishing content API failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        error: {
          code: "CONTENT_API_UNAVAILABLE",
          message: "Chưa thể cung cấp nội dung lúc này.",
          retryable: true,
        },
      },
      500,
    );
  }
}
