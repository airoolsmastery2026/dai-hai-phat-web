import { NextRequest } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  DhpRuntimeHandshakeError,
  parseDhpRuntimeHandshake,
} from "@/lib/server/dhp-runtime-handshake";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  try {
    const principal = authenticateService(request.headers, ["goose-desktop"]);
    const payload = await request.json();
    const runtimeNode = parseDhpRuntimeHandshake(payload);

    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          service: "dai-hai-phat-web",
          requestedBy: principal.service,
          runtimeNode,
          policy: {
            paidApiAutoUse: false,
            autoTopUp: false,
            meteredFallback: false,
            websiteRemainsSourceOfTruth: true,
            directDatabaseAccess: false,
            directProductionWrite: false,
          },
        },
      },
      200,
      { "Cache-Control": "private, no-store" },
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

    if (error instanceof DhpRuntimeHandshakeError) {
      const zeroDollarRequired = error.code === "ZERO_DOLLAR_REQUIRED";
      return apiJsonResponse(
        {
          schemaVersion: "1.0",
          requestId,
          error: {
            code: error.code,
            message: zeroDollarRequired
              ? "DHP runtime chỉ chấp nhận chế độ absolute-zero."
              : "Thông tin runtime không hợp lệ hoặc không có capability được hỗ trợ.",
            retryable: false,
          },
        },
        zeroDollarRequired ? 409 : 400,
      );
    }

    console.error("DHP internal runtime handshake failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        error: {
          code: "RUNTIME_HANDSHAKE_UNAVAILABLE",
          message: "Chưa thể kết nối runtime nội bộ.",
          retryable: true,
        },
      },
      500,
    );
  }
}
