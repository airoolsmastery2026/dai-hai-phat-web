import { NextRequest, NextResponse } from "next/server";

import {
  getTelegramControlStatus,
  sanitizeTelegramControlConfig,
  storeTelegramControlConfig,
} from "@/lib/server/admin-publishing";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
} from "@/lib/server/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "private, no-store", ...headers },
  });
}

function upstreamError(error: unknown) {
  const configurationError = error instanceof SupabaseServerConfigurationError;
  return json(
    {
      error: {
        code: configurationError
          ? "TELEGRAM_CONTROL_NOT_CONFIGURED"
          : "TELEGRAM_CONTROL_UNAVAILABLE",
        message: configurationError
          ? "Telegram Control chưa được cấu hình Supabase server-side."
          : "Không thể cập nhật Telegram Control.",
        retryable: error instanceof SupabaseRestError,
      },
    },
    configurationError ? 503 : 502,
  );
}

export async function GET() {
  try {
    return json({ data: await getTelegramControlStatus() });
  } catch (error) {
    return upstreamError(error);
  }
}

export async function PUT(request: NextRequest) {
  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return json(
      { error: { code: "CROSS_SITE_REQUEST", message: "Cross-site request bị từ chối.", retryable: false } },
      403,
    );
  }
  const limit = consumeRateLimit(
    "admin-telegram-control",
    getRequestClientKey(request.headers),
    { maxRequests: 10, windowMs: 10 * 60 * 1000 },
  );
  if (!limit.allowed) {
    return json(
      { error: { code: "RATE_LIMITED", message: "Thao tác quá nhanh. Vui lòng thử lại sau.", retryable: true } },
      429,
      { "retry-after": String(limit.retryAfterSeconds) },
    );
  }

  try {
    const config = sanitizeTelegramControlConfig(await request.json());
    await storeTelegramControlConfig(config);
    return json({ data: await getTelegramControlStatus() }, 202);
  } catch (error) {
    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message.includes("không hợp lệ"))
    ) {
      return json(
        {
          error: {
            code: "INVALID_TELEGRAM_CONFIG",
            message: error instanceof Error ? error.message : "Telegram config không hợp lệ.",
            retryable: false,
          },
        },
        400,
      );
    }
    return upstreamError(error);
  }
}
