import type {
  CRMHandoffRequest,
  CRMHandoffResponse,
} from "@/lib/ai/handoff";
import { createWebhookSignature } from "@/lib/server/webhook-signature";

const AUTOMATION_TIMEOUT_MS = 5_000;

export type AutomationDispatchStatus =
  | "delivered"
  | "not_configured"
  | "timeout"
  | "rejected"
  | "unavailable";

export interface AutomationDispatchResult {
  status: AutomationDispatchStatus;
}

function automationConfig(): { url: string; token: string } | null {
  const url = process.env.AUTOMATION_WEBHOOK_URL?.trim();
  const token = process.env.AUTOMATION_WEBHOOK_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return { url: parsed.toString(), token };
  } catch {
    return null;
  }
}

export async function dispatchLeadAutomation(
  lead: CRMHandoffRequest,
  handoff: CRMHandoffResponse,
  requestId: string,
): Promise<AutomationDispatchResult> {
  const config = automationConfig();
  if (!config) return { status: "not_configured" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTOMATION_TIMEOUT_MS);

  try {
    const timestamp = String(Math.floor(Date.now() / 1_000));
    const payload = JSON.stringify({
      event: "lead.received",
      occurredAt: handoff.receivedAt,
      leadId: handoff.leadId,
      source: lead.source,
      project: lead.project,
      contact: lead.contact,
      qualification: lead.qualification,
    });

    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `${lead.sessionId}:lead-received`,
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

    return { status: response.ok ? "delivered" : "rejected" };
  } catch (error) {
    return {
      status:
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}
