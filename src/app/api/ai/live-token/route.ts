import { NextRequest } from "next/server";

import { GEMINI_LIVE_MODEL } from "@/lib/ai/live";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOKEN_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/auth_tokens";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;
const TOKEN_REQUEST_TIMEOUT_MS = 8_000;
const LIVE_SESSION_MINUTES = 15;
const NEW_SESSION_WINDOW_SECONDS = 60;

interface GeminiAuthTokenResponse {
  name?: unknown;
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }

  const rateLimit = consumeRateLimit(
    "gemini-live-token",
    getRequestClientKey(request.headers),
    {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Đã mở quá nhiều phiên thoại. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return apiJsonResponse(
      {
        error: formatSupportReference(
          "Trò chuyện trực tiếp tạm thời chưa được cấu hình.",
          requestId,
        ),
        code: "LIVE_UNAVAILABLE",
        requestId,
      },
      503,
    );
  }

  const now = Date.now();
  const expiresAt = new Date(now + LIVE_SESSION_MINUTES * 60_000).toISOString();
  const newSessionExpiresAt = new Date(
    now + NEW_SESSION_WINDOW_SECONDS * 1_000,
  ).toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TOKEN_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        uses: 1,
        expireTime: expiresAt,
        newSessionExpireTime: newSessionExpiresAt,
        liveConnectConstraints: {
          model: GEMINI_LIVE_MODEL,
          config: {
            responseModalities: ["AUDIO"],
          },
        },
      }),
    });

    if (!response.ok) {
      console.warn("DHP Gemini Live token unavailable", {
        requestId,
        upstreamStatus: response.status,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            "Chưa thể mở phiên thoại trực tiếp. Vui lòng thử lại.",
            requestId,
          ),
          code: "LIVE_UNAVAILABLE",
          requestId,
        },
        response.status === 429 ? 429 : 503,
        response.status === 429 ? { "Retry-After": "30" } : undefined,
      );
    }

    const payload = (await response.json()) as GeminiAuthTokenResponse;
    if (typeof payload.name !== "string" || !payload.name) {
      throw new Error("Gemini không trả về token hợp lệ.");
    }

    return apiJsonResponse(
      {
        token: payload.name,
        model: GEMINI_LIVE_MODEL,
        expiresAt,
        requestId,
      },
      200,
    );
  } catch (error) {
    const timedOut = controller.signal.aborted;
    console.error("DHP Gemini Live token failed", {
      requestId,
      timedOut,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        error: formatSupportReference(
          timedOut
            ? "Kết nối mở phiên thoại phản hồi quá lâu. Vui lòng thử lại."
            : "Chưa thể mở phiên thoại trực tiếp. Vui lòng thử lại.",
          requestId,
        ),
        code: timedOut ? "LIVE_TIMEOUT" : "LIVE_UNAVAILABLE",
        requestId,
      },
      timedOut ? 504 : 503,
    );
  } finally {
    clearTimeout(timeout);
  }
}
