import { NextRequest } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  recordSocialLead,
  parseSocialLeadWebhook,
  SocialLeadReplayError,
  SocialLeadValidationError,
} from "@/lib/server/social-lead-webhook";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
} from "@/lib/server/supabase-rest";
import {
  verifyWebhookSignature,
  WebhookVerificationError,
} from "@/lib/server/webhook-signature";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const BODY_LIMIT_BYTES = 32 * 1024;
const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;

function errorResponse(
  requestId: string,
  status: number,
  code: string,
  message: string,
  retryable: boolean,
) {
  return apiJsonResponse(
    {
      schemaVersion: "1.0",
      requestId,
      error: { code, message, retryable },
    },
    status,
    NO_STORE_HEADERS,
  );
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  try {
    if (
      !request.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("application/json")
    ) {
      return errorResponse(
        requestId,
        415,
        "UNSUPPORTED_MEDIA_TYPE",
        "Content-Type không được hỗ trợ.",
        false,
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu webhook vượt quá giới hạn.",
        false,
      );
    }

    const signature = request.headers.get("X-DHP-Signature")?.trim();
    const timestamp = request.headers.get("X-DHP-Timestamp")?.trim();
    const eventHeader = request.headers.get("X-DHP-Event-Id")?.trim();
    const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();
    if (!signature || !timestamp || !eventHeader || !idempotencyKey) {
      return errorResponse(
        requestId,
        400,
        "WEBHOOK_HEADERS_REQUIRED",
        "Thiếu header bắt buộc của webhook.",
        false,
      );
    }

    const secret = process.env.ECOSYSTEM_WEBHOOK_SECRET?.trim();
    if (!secret) {
      return errorResponse(
        requestId,
        503,
        "WEBHOOK_NOT_CONFIGURED",
        "Webhook tích hợp chưa được cấu hình.",
        false,
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu webhook vượt quá giới hạn.",
        false,
      );
    }

    verifyWebhookSignature(rawBody, timestamp, signature, secret);
    const envelope = parseSocialLeadWebhook(JSON.parse(rawBody) as unknown);

    if (envelope.eventId !== eventHeader) {
      return errorResponse(
        requestId,
        409,
        "EVENT_ID_MISMATCH",
        "X-DHP-Event-Id không khớp nội dung webhook.",
        false,
      );
    }
    if (idempotencyKey !== envelope.eventId) {
      return errorResponse(
        requestId,
        409,
        "IDEMPOTENCY_KEY_MISMATCH",
        "Idempotency-Key không khớp eventId.",
        false,
      );
    }
    if (envelope.sourceService !== "publishing-bot") {
      return errorResponse(
        requestId,
        403,
        "WEBHOOK_SOURCE_FORBIDDEN",
        "Nguồn webhook không được phép.",
        false,
      );
    }
    if (envelope.eventType !== "social.lead.created") {
      return errorResponse(
        requestId,
        400,
        "WEBHOOK_EVENT_UNSUPPORTED",
        "Loại sự kiện webhook không được hỗ trợ.",
        false,
      );
    }

    const result = await recordSocialLead(envelope);
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          leadId: result.leadId,
          eventId: envelope.eventId,
          status: "accepted",
          receivedAt: result.receivedAt,
        },
      },
      201,
      NO_STORE_HEADERS,
    );
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      const stale =
        error.code === "stale" || error.code === "future_timestamp";
      return errorResponse(
        requestId,
        401,
        stale ? "WEBHOOK_TIMESTAMP_INVALID" : "WEBHOOK_SIGNATURE_INVALID",
        stale
          ? "Thời điểm webhook không hợp lệ hoặc đã hết hạn."
          : "Chữ ký webhook không hợp lệ.",
        false,
      );
    }

    if (error instanceof SocialLeadReplayError) {
      return errorResponse(
        requestId,
        409,
        "WEBHOOK_REPLAY",
        "Webhook đã được xử lý trước đó.",
        false,
      );
    }

    if (error instanceof SocialLeadValidationError || error instanceof SyntaxError) {
      return errorResponse(
        requestId,
        400,
        "INVALID_WEBHOOK_PAYLOAD",
        error instanceof SocialLeadValidationError
          ? error.message
          : "Dữ liệu JSON không hợp lệ.",
        false,
      );
    }

    if (error instanceof SupabaseServerConfigurationError) {
      return errorResponse(
        requestId,
        503,
        "LEAD_STORE_NOT_CONFIGURED",
        "Kho lưu trữ lead chưa được cấu hình.",
        false,
      );
    }

    if (error instanceof SupabaseRestError) {
      console.warn("DHP social lead persistence unavailable", {
        requestId,
        status: error.status,
      });
      return errorResponse(
        requestId,
        503,
        "LEAD_STORE_UNAVAILABLE",
        "Kho lưu trữ lead tạm thời chưa khả dụng.",
        true,
      );
    }

    console.error("DHP social lead webhook failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse(
      requestId,
      500,
      "SOCIAL_LEAD_WEBHOOK_FAILED",
      "Chưa thể tiếp nhận social lead.",
      true,
    );
  }
}
