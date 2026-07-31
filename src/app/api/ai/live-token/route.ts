import { NextRequest } from "next/server";

import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AUTH_TOKEN_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/auth_tokens";
const DEFAULT_LIVE_MODEL = "gemini-3.1-flash-live-preview";
const TOKEN_TIMEOUT_MS = 8_000;
const SESSION_LIFETIME_MS = 15 * 60 * 1_000;
const NEW_SESSION_WINDOW_MS = 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;

interface GeminiAuthTokenResponse {
  name?: unknown;
  expireTime?: unknown;
}

function getLiveModel(): string {
  const configured = process.env.GEMINI_LIVE_MODEL?.trim();
  return configured && /^gemini-[a-z0-9.-]{1,72}$/i.test(configured)
    ? configured
    : DEFAULT_LIVE_MODEL;
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
        error: "Đã mở quá nhiều phiên Gemini Live. Vui lòng thử lại sau.",
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
          "Gemini Live chưa được cấu hình.",
          requestId,
        ),
        code: "LIVE_NOT_CONFIGURED",
        requestId,
      },
      503,
    );
  }

  const model = getLiveModel();
  const now = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TOKEN_TIMEOUT_MS);

  try {
    const response = await fetch(AUTH_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + SESSION_LIFETIME_MS).toISOString(),
        newSessionExpireTime: new Date(now + NEW_SESSION_WINDOW_MS).toISOString(),
        liveConnectConstraints: {
          model: `models/${model}`,
          config: {
            responseModalities: ["AUDIO"],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        },
      }),
    });

    if (!response.ok) {
      console.warn("DHP Gemini Live token unavailable", {
        requestId,
        upstreamHttpStatus: response.status,
      });
      return apiJsonResponse(
        {
          error: formatSupportReference(
            response.status === 429
              ? "Gemini Live đang bận. Vui lòng thử lại sau."
              : "Chưa thể mở Gemini Live lúc này.",
            requestId,
          ),
          code: response.status === 429 ? "RATE_LIMITED" : "LIVE_UNAVAILABLE",
          requestId,
        },
        response.status === 429 ? 429 : 503,
        response.status === 429 ? { "Retry-After": "30" } : undefined,
      );
    }

    const payload = (await response.json()) as GeminiAuthTokenResponse;
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      throw new Error("Gemini không trả về token Live hợp lệ.");
    }

    return apiJsonResponse(
      {
        token: payload.name,
        model,
        expiresAt:
          typeof payload.expireTime === "string"
            ? payload.expireTime
            : new Date(now + SESSION_LIFETIME_MS).toISOString(),
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
            ? "Gemini Live phản hồi quá chậm. Vui lòng thử lại."
            : "Chưa thể mở Gemini Live lúc này.",
          requestId,
        ),
        code: timedOut ? "LIVE_TIMEOUT" : "LIVE_UNAVAILABLE",
        requestId,
      },
      timedOut ? 504 : 500,
    );
  } finally {
    clearTimeout(timeout);
  }
}
