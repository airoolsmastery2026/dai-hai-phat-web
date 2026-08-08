import { NextRequest } from "next/server";

import {
  CRMHandoffValidationError,
  parseCRMHandoffRequest,
} from "@/lib/ai/handoff";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import { CRMDeliveryError, deliverLeadToCRM } from "@/lib/server/crm";
import { verifyPhoneWithAPILayer } from "@/lib/server/phone-verification";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const BODY_LIMIT_BYTES = 16 * 1024;
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
    authenticateService(request.headers, ["publishing-bot", "telegram-control"]);

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
        "Thiếu Idempotency-Key cho yêu cầu ghi dữ liệu.",
        false,
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu yêu cầu vượt quá giới hạn.",
        false,
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > BODY_LIMIT_BYTES) {
      return errorResponse(
        requestId,
        413,
        "PAYLOAD_TOO_LARGE",
        "Dữ liệu yêu cầu vượt quá giới hạn.",
        false,
      );
    }

    const lead = parseCRMHandoffRequest(JSON.parse(rawBody) as unknown);

    if (lead.website) {
      return errorResponse(
        requestId,
        400,
        "INVALID_LEAD_PAYLOAD",
        "Dữ liệu lead không hợp lệ.",
        false,
      );
    }

    if (idempotencyKey !== lead.sessionId) {
      return errorResponse(
        requestId,
        409,
        "IDEMPOTENCY_KEY_MISMATCH",
        "Idempotency-Key không khớp định danh hồ sơ.",
        false,
      );
    }

    const phoneVerification = await verifyPhoneWithAPILayer(lead.contact.phone);
    const result = await deliverLeadToCRM(lead, requestId, {
      phone: phoneVerification,
    });

    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          leadId: result.leadId,
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
          "Dịch vụ không có quyền tạo lead.",
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

    if (error instanceof CRMHandoffValidationError || error instanceof SyntaxError) {
      return errorResponse(
        requestId,
        400,
        "INVALID_LEAD_PAYLOAD",
        error instanceof CRMHandoffValidationError
          ? error.message
          : "Dữ liệu JSON không hợp lệ.",
        false,
      );
    }

    if (error instanceof CRMDeliveryError) {
      const retryable = error.code === "timeout" || error.code === "unavailable";
      const status = error.code === "rejected" ? 502 : 503;
      return errorResponse(
        requestId,
        status,
        "CRM_UNAVAILABLE",
        retryable
          ? "CRM tạm thời chưa khả dụng."
          : "CRM chưa thể tiếp nhận hồ sơ.",
        retryable,
      );
    }

    console.error("DHP API v1 lead creation failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse(
      requestId,
      500,
      "LEAD_CREATION_FAILED",
      "Chưa thể tạo lead.",
      true,
    );
  }
}
