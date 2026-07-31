import type {
  CRMHandoffRequest,
  CRMHandoffResponse,
} from "@/lib/ai/handoff";
import type { PhoneVerificationResult } from "@/lib/server/phone-verification";
import { createWebhookSignature } from "@/lib/server/webhook-signature";

const CRM_TIMEOUT_MS = 8_000;

export interface CRMVerificationMetadata {
  phone: PhoneVerificationResult;
}

export class CRMDeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "timeout" | "rejected" | "unavailable",
    readonly upstreamStatus?: number,
  ) {
    super(message);
  }
}

function crmConfig() {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  const token = process.env.CRM_WEBHOOK_TOKEN?.trim();
  if (!url || !token) {
    throw new CRMDeliveryError("CRM chưa được cấu hình.", "not_configured");
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error();
    return { url: parsed.toString(), token };
  } catch {
    throw new CRMDeliveryError("CRM_WEBHOOK_URL không hợp lệ.", "not_configured");
  }
}

function classifyCRMResponse(status: number): CRMDeliveryError {
  if (status === 408 || status === 425 || status === 429 || status >= 500) {
    return new CRMDeliveryError(
      "CRM tạm thời không khả dụng.",
      "unavailable",
      status,
    );
  }

  return new CRMDeliveryError("CRM từ chối hồ sơ.", "rejected", status);
}

export async function deliverLeadToCRM(
  lead: CRMHandoffRequest,
  requestId: string,
  verification?: CRMVerificationMetadata,
): Promise<CRMHandoffResponse> {
  const config = crmConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CRM_TIMEOUT_MS);

  try {
    const timestamp = String(Math.floor(Date.now() / 1_000));
    const payload = JSON.stringify({
      schemaVersion: "1.1",
      eventId: requestId,
      event: "lead.handoff",
      ...lead,
      ...(verification ? { verification } : {}),
      receivedAt: new Date().toISOString(),
    });
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": lead.sessionId,
        "X-DHP-Request-Id": requestId,
        "X-DHP-Signature": createWebhookSignature(
          payload,
          timestamp,
          config.token,
        ),
        "X-DHP-Timestamp": timestamp,
      },
      body: payload,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw classifyCRMResponse(response.status);
    }

    const responsePayload = (await response.json().catch(() => null)) as unknown;
    const record =
      typeof responsePayload === "object" && responsePayload !== null
        ? (responsePayload as Record<string, unknown>)
        : {};
    const leadId =
      typeof record.leadId === "string" && record.leadId.trim()
        ? record.leadId.trim().slice(0, 100)
        : lead.sessionId;

    return { leadId, receivedAt: new Date().toISOString() };
  } catch (error) {
    if (error instanceof CRMDeliveryError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new CRMDeliveryError("CRM phản hồi quá thời gian.", "timeout");
    }
    throw new CRMDeliveryError("Không thể kết nối CRM.", "unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
