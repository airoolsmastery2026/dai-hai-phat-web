import { after, NextRequest } from "next/server";

import {
  CRMHandoffValidationError,
  parseCRMHandoffRequest,
} from "@/lib/ai/handoff";
import {
  consumeRateLimit,
  getRequestClientKey,
  isSameOriginRequest,
} from "@/lib/server/api-security";
import { apiJsonResponse } from "@/lib/server/api-json-response";
import { dispatchLeadAutomation } from "@/lib/server/automation";
import { CRMDeliveryError, deliverLeadToCRM } from "@/lib/server/crm";
import { verifyEmailDomain } from "@/lib/server/email-domain-verification";
import { verifyPhoneWithAPILayer } from "@/lib/server/phone-verification";
import {
  ATTRIBUTION_COOKIE_NAME,
  deserializeLeadAttribution,
} from "@/lib/marketing/attribution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const BODY_LIMIT_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 4;

export async function POST(request: NextRequest) {
  const requestId = globalThis.crypto.randomUUID();

  if (!isSameOriginRequest(request.headers, request.nextUrl.host)) {
    return apiJsonResponse({ error: "Nguồn yêu cầu không hợp lệ.", requestId }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return apiJsonResponse({ error: "Định dạng yêu cầu không được hỗ trợ.", requestId }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT_BYTES) {
    return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
  }

  const rateLimit = consumeRateLimit(
    "crm-handoff",
    getRequestClientKey(request.headers),
    { maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS },
  );
  if (!rateLimit.allowed) {
    return apiJsonResponse(
      {
        error: "Bạn vừa gửi nhiều lần. Vui lòng thử lại sau ít phút.",
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
      return apiJsonResponse({ error: "Dữ liệu yêu cầu vượt quá giới hạn.", requestId }, 413);
    }

    const parsedLead = parseCRMHandoffRequest(JSON.parse(rawBody) as unknown);
    const attribution = deserializeLeadAttribution(
      request.cookies.get(ATTRIBUTION_COOKIE_NAME)?.value,
    );
    const lead = attribution
      ? parseCRMHandoffRequest({ ...parsedLead, attribution })
      : parsedLead;

    if (lead.website) {
      return apiJsonResponse({ error: "Yêu cầu không hợp lệ.", requestId }, 400);
    }

    const phoneVerification = await verifyPhoneWithAPILayer(lead.contact.phone);
    if (phoneVerification.status === "invalid") {
      return apiJsonResponse(
        {
          error: "Số điện thoại không vượt qua bước xác minh. Vui lòng kiểm tra lại trước khi gửi hồ sơ.",
          code: "PHONE_INVALID",
          requestId,
        },
        400,
      );
    }
    if (
      phoneVerification.status === "unverified" &&
      phoneVerification.reason === "not_configured"
    ) {
      return apiJsonResponse(
        {
          error: "Kênh kiểm tra số điện thoại chưa được cấu hình trên máy chủ. Hồ sơ chưa được gửi để tránh tiếp nhận dữ liệu chưa qua kiểm tra bắt buộc.",
          code: "PHONE_VERIFICATION_NOT_CONFIGURED",
          requestId,
        },
        503,
      );
    }

    const emailVerification = lead.contact.email
      ? await verifyEmailDomain(lead.contact.email)
      : null;
    if (emailVerification?.status === "invalid") {
      return apiJsonResponse(
        {
          error: "Tên miền email không thể nhận thư hoặc không tồn tại. Vui lòng kiểm tra lại email.",
          code: "EMAIL_DOMAIN_INVALID",
          requestId,
        },
        400,
      );
    }

    const result = await deliverLeadToCRM(lead, requestId, {
      phone: phoneVerification,
    });

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
      phoneVerification: phoneVerification.status,
      emailDomainVerification: emailVerification?.status ?? "not_provided",
      attributionSource: lead.attribution?.utmSource ?? null,
    });
    return apiJsonResponse({ requestId, handoff: result }, 201);
  } catch (error) {
    if (
      error instanceof CRMHandoffValidationError ||
      error instanceof SyntaxError
    ) {
      return apiJsonResponse(
        {
          error:
            error instanceof CRMHandoffValidationError
              ? "Một số thông tin chưa hợp lệ. Vui lòng kiểm tra lại hồ sơ trước khi gửi."
              : "Dữ liệu gửi đi chưa hợp lệ. Vui lòng thử lại.",
          requestId,
        },
        400,
      );
    }
    if (error instanceof CRMDeliveryError) {
      console.warn("DHP CRM handoff unavailable", {
        requestId,
        code: error.code,
        upstreamStatus: error.upstreamStatus ?? null,
      });
      return apiJsonResponse(
        {
          error:
            "Kênh gửi tự động đang tạm gián đoạn. Hồ sơ vẫn được giữ trên thiết bị; bạn có thể tiếp tục qua Zalo hoặc gọi kỹ sư.",
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
    return apiJsonResponse(
      {
        error:
          "Hiện chưa thể gửi hồ sơ tự động. Hồ sơ vẫn được giữ trên thiết bị; bạn có thể tiếp tục qua Zalo hoặc gọi kỹ sư.",
        code: "CRM_UNAVAILABLE",
        requestId,
      },
      500,
    );
  }
}
