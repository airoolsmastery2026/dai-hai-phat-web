import { after, NextRequest, NextResponse } from "next/server";

import {
  CRMHandoffValidationError,
  parseCRMHandoffRequest,
} from "@/lib/ai/handoff";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { dispatchLeadAutomation } from "@/lib/server/automation";
import { CRMDeliveryError, deliverLeadToCRM } from "@/lib/server/crm";
import { formatSupportReference } from "@/lib/server/support-reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const BODY_LIMIT_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;

function jsonResponse(body: unknown, status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return jsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Content-Type không được hỗ trợ.", requestId }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return jsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
  }

  const rateLimit = consumeRateLimit(
    "crm-handoff",
    getRequestClientKey(request.headers),
    { maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS },
  );
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: "Quá nhiều yêu cầu bàn giao. Vui lòng thử lại sau.",
        code: "RATE_LIMITED",
        requestId,
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > BODY_LIMIT_BYTES) {
      return jsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }
    const lead = parseCRMHandoffRequest(JSON.parse(rawBody) as unknown);
    if (lead.website) {
      return jsonResponse({ error: "Yêu cầu không hợp lệ.", requestId }, 400);
    }

    const result = await deliverLeadToCRM(lead, requestId);

    after(async () => {
      try {
        const automation = await dispatchLeadAutomation(lead, result, requestId);
        console.info("DHP lead automation completed", {
          requestId,
          sessionId: lead.sessionId,
          leadId: result.leadId,
          automation: automation.status,
        });
      } catch (error) {
        console.error("DHP lead automation failed", {
          requestId,
          sessionId: lead.sessionId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });

    console.info("DHP CRM handoff delivered", {
      requestId,
      sessionId: lead.sessionId,
      leadId: result.leadId,
    });
    return jsonResponse({ requestId, handoff: result }, 201);
  } catch (error) {
    if (
      error instanceof CRMHandoffValidationError ||
      error instanceof SyntaxError
    ) {
      return jsonResponse(
        {
          error:
            error instanceof CRMHandoffValidationError
              ? error.message
              : "Dữ liệu JSON không hợp lệ.",
          requestId,
        },
        400,
      );
    }
    if (error instanceof CRMDeliveryError) {
      console.warn("DHP CRM handoff unavailable", {
        requestId,
        code: error.code,
      });
      return jsonResponse(
        {
          error: formatSupportReference(
            error.code === "not_configured"
              ? "Kênh CRM chưa được cấu hình. Hồ sơ vẫn được giữ trên thiết bị."
              : "Chưa thể bàn giao hồ sơ. Dữ liệu vẫn được giữ trên thiết bị.",
            requestId,
          ),
          code: "CRM_UNAVAILABLE",
          requestId,
        },
        503,
      );
    }

    console.error("DHP CRM handoff failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonResponse(
      {
        error: formatSupportReference(
          "Chưa thể bàn giao hồ sơ. Dữ liệu vẫn được giữ trên thiết bị.",
          requestId,
        ),
        code: "CRM_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
