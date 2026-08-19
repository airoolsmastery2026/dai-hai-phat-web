import { NextRequest } from "next/server";

import { apiJsonResponse } from "@/lib/server/api-json-response";
import { requestDhpCapability } from "@/lib/server/capability-gateway";
import {
  authenticateService,
  ServiceAuthenticationError,
} from "@/lib/server/service-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;

type CapabilityStatusPayload = {
  data?: {
    state?: unknown;
    adapter?: { configured?: unknown };
  };
};

function errorResponse(
  requestId: string,
  status: number,
  code: string,
  message: string,
) {
  return apiJsonResponse(
    {
      schemaVersion: "1.0",
      requestId,
      error: { code, message, retryable: false },
    },
    status,
    NO_STORE_HEADERS,
  );
}

async function modelRuntimeConfigured(): Promise<boolean> {
  try {
    const response = await requestDhpCapability("model-runtime");
    if (!response.ok) return false;

    const payload = (await response.json()) as CapabilityStatusPayload;
    return (
      payload.data?.state === "configured" &&
      payload.data?.adapter?.configured === true
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  try {
    authenticateService(request.headers, ["monitoring", "telegram-control"]);

    const configured = await modelRuntimeConfigured();

    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        data: {
          status: configured ? "available" : "degraded",
          provider: "model-runtime",
          configured,
          policy: "verified-free-only",
          checkedAt: new Date().toISOString(),
        },
      },
      200,
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
        );
      }
      if (error.code === "forbidden") {
        return errorResponse(
          requestId,
          403,
          "SERVICE_FORBIDDEN",
          "Dịch vụ không có quyền xem trạng thái AI.",
        );
      }
      return errorResponse(
        requestId,
        401,
        "SERVICE_UNAUTHORIZED",
        "Thông tin xác thực dịch vụ không hợp lệ.",
      );
    }

    console.error("DHP API v1 AI status failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return apiJsonResponse(
      {
        schemaVersion: "1.0",
        requestId,
        error: {
          code: "AI_STATUS_FAILED",
          message: "Chưa thể kiểm tra trạng thái AI.",
          retryable: true,
        },
      },
      500,
      NO_STORE_HEADERS,
    );
  }
}
