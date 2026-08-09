import { NextRequest } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  ControlCommandAuditReplayError,
  ControlCommandAuditValidationError,
  parseControlCommandAuditEvent,
  recordControlCommandAuditEvent,
} from "@/lib/server/control-command-audit";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
} from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

const BODY_LIMIT_BYTES = 8 * 1024;
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
    authenticateService(request.headers, ["telegram-control"]);

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

    const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();
    if (!idempotencyKey) {
      return errorResponse(
        requestId,
        400,
        "IDEMPOTENCY_KEY_REQUIRED",
        "Thiếu Idempotency-Key cho audit event.",
        false,
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu audit vượt quá giới hạn.",
        false,
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu audit vượt quá giới hạn.",
        false,
      );
    }

    const event = parseControlCommandAuditEvent(JSON.parse(rawBody) as unknown);
    if (idempotencyKey !== event.commandId) {
      return errorResponse(
        requestId,
        409,
        "IDEMPOTENCY_KEY_MISMATCH",
        "Idempotency-Key không khớp commandId.",
        false,
      );
    }

    const result = await recordControlCommandAuditEvent(event);
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          auditId: result.auditId,
          commandId: event.commandId,
          receivedAt: result.receivedAt,
        },
      },
      201,
      NO_STORE_HEADERS,
    );
  } catch (error) {
    if (error instanceof ServiceAuthenticationError) {
      if (error.code === "not_configured") {
        return errorResponse(
          requestId,
          503,
          "INTEGRATION_NOT_CONFIGURED",
          "API tích hợp chưa được cấu hình.",
          false,
        );
      }
      if (error.code === "forbidden") {
        return errorResponse(
          requestId,
          403,
          "SERVICE_FORBIDDEN",
          "Dịch vụ không có quyền ghi audit event.",
          false,
        );
      }
      return errorResponse(
        requestId,
        401,
        "SERVICE_UNAUTHORIZED",
        "Thông tin xác thực dịch vụ không hợp lệ.",
        false,
      );
    }

    if (
      error instanceof ControlCommandAuditValidationError ||
      error instanceof SyntaxError
    ) {
      return errorResponse(
        requestId,
        400,
        "INVALID_AUDIT_PAYLOAD",
        error instanceof ControlCommandAuditValidationError
          ? error.message
          : "Dữ liệu JSON không hợp lệ.",
        false,
      );
    }

    if (error instanceof ControlCommandAuditReplayError) {
      return errorResponse(
        requestId,
        409,
        "AUDIT_EVENT_REPLAY",
        "Command audit event đã được ghi nhận.",
        false,
      );
    }

    if (error instanceof SupabaseServerConfigurationError) {
      return errorResponse(
        requestId,
        503,
        "AUDIT_STORE_NOT_CONFIGURED",
        "Kho audit chưa được cấu hình.",
        false,
      );
    }

    if (error instanceof SupabaseRestError) {
      console.warn("DHP control audit persistence unavailable", {
        requestId,
        status: error.status,
      });
      return errorResponse(
        requestId,
        503,
        "AUDIT_STORE_UNAVAILABLE",
        "Kho audit tạm thời chưa khả dụng.",
        true,
      );
    }

    console.error("DHP control command audit failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse(
      requestId,
      500,
      "AUDIT_WRITE_FAILED",
      "Chưa thể ghi audit event.",
      true,
    );
  }
}
