import { NextRequest } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";
import { createSystemHealthSnapshot } from "@/lib/server/system-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  try {
    const principal = authenticateService(request.headers, [
      "telegram-control",
      "monitoring",
    ]);
    const health = createSystemHealthSnapshot();

    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          service: "dai-hai-phat-web",
          requestedBy: principal.service,
          ...health,
        },
      },
      health.state === "operational" ? 200 : 503,
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

    console.error("DHP system health API failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        error: {
          code: "HEALTH_CHECK_UNAVAILABLE",
          message: "Chưa thể kiểm tra trạng thái hệ thống.",
          retryable: true,
        },
      },
      500,
    );
  }
}
