import {
  getSupabaseServerConfig,
  SupabaseRestError,
} from "@/lib/server/supabase-rest";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export interface SocialLeadWebhookEnvelope {
  schemaVersion: "1.0";
  eventId: string;
  eventType: "social.lead.created";
  occurredAt: string;
  sourceService: "publishing-bot";
  data: {
    platform: string;
    externalLeadId: string;
    publicationId?: string;
    sourceContentId?: string;
    customer: {
      displayName: string;
      platformUserId: string;
    };
    message: string;
    consentContext: string;
    metadata: Record<string, unknown>;
  };
}

interface SocialLeadRow {
  id: string;
  event_id: string;
  created_at: string;
}

export class SocialLeadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SocialLeadValidationError";
  }
}

export class SocialLeadReplayError extends Error {
  constructor() {
    super("Webhook event has already been processed.");
    this.name = "SocialLeadReplayError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new SocialLeadValidationError(`Thiếu trường ${field}.`);
  }
  const normalized = value.trim();
  if (
    !normalized ||
    normalized.length > maxLength ||
    CONTROL_CHARACTERS.test(normalized)
  ) {
    throw new SocialLeadValidationError(`Trường ${field} không hợp lệ.`);
  }
  return normalized;
}

function optionalText(
  value: unknown,
  field: string,
  maxLength: number,
): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return text(value, field, maxLength);
}

export function parseSocialLeadWebhook(
  value: unknown,
): SocialLeadWebhookEnvelope {
  if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.data.customer)) {
    throw new SocialLeadValidationError("Webhook social lead không đúng định dạng.");
  }
  if (value.schemaVersion !== "1.0") {
    throw new SocialLeadValidationError("Phiên bản webhook không được hỗ trợ.");
  }
  if (value.eventType !== "social.lead.created") {
    throw new SocialLeadValidationError("Loại sự kiện webhook không hợp lệ.");
  }
  if (value.sourceService !== "publishing-bot") {
    throw new SocialLeadValidationError("Nguồn webhook không được phép.");
  }

  const occurredAt = text(value.occurredAt, "occurredAt", 40);
  if (Number.isNaN(Date.parse(occurredAt))) {
    throw new SocialLeadValidationError("Thời điểm webhook không hợp lệ.");
  }

  const metadata = value.data.metadata ?? {};
  if (!isRecord(metadata) || JSON.stringify(metadata).length > 8_192) {
    throw new SocialLeadValidationError("Metadata webhook không hợp lệ.");
  }

  return {
    schemaVersion: "1.0",
    eventId: text(value.eventId, "eventId", 100),
    eventType: "social.lead.created",
    occurredAt,
    sourceService: "publishing-bot",
    data: {
      platform: text(value.data.platform, "data.platform", 40).toLowerCase(),
      externalLeadId: text(
        value.data.externalLeadId,
        "data.externalLeadId",
        160,
      ),
      publicationId: optionalText(
        value.data.publicationId,
        "data.publicationId",
        160,
      ),
      sourceContentId: optionalText(
        value.data.sourceContentId,
        "data.sourceContentId",
        160,
      ),
      customer: {
        displayName: text(
          value.data.customer.displayName,
          "data.customer.displayName",
          160,
        ),
        platformUserId: text(
          value.data.customer.platformUserId,
          "data.customer.platformUserId",
          160,
        ),
      },
      message: text(value.data.message, "data.message", 4_000),
      consentContext: text(
        value.data.consentContext,
        "data.consentContext",
        160,
      ),
      metadata,
    },
  };
}

function isUniqueViolation(error: SupabaseRestError): boolean {
  if (error.status !== 409 || !isRecord(error.details)) return false;
  return error.details.code === "23505";
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function insertSocialLead(
  envelope: SocialLeadWebhookEnvelope,
): Promise<SocialLeadRow[]> {
  const config = getSupabaseServerConfig();
  const endpoint = new URL("/rest/v1/social_leads", config.url);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify({
      event_id: envelope.eventId,
      event_type: envelope.eventType,
      occurred_at: envelope.occurredAt,
      source_service: envelope.sourceService,
      platform: envelope.data.platform,
      external_lead_id: envelope.data.externalLeadId,
      publication_id: envelope.data.publicationId ?? null,
      source_content_id: envelope.data.sourceContentId ?? null,
      customer_display_name: envelope.data.customer.displayName,
      platform_user_id: envelope.data.customer.platformUserId,
      message: envelope.data.message,
      consent_context: envelope.data.consentContext,
      metadata: envelope.data.metadata,
    }),
    cache: "no-store",
  });

  const body = await response.text();
  const payload = body ? safeParseJson(body) : null;
  if (!response.ok) {
    throw new SupabaseRestError(
      "Social lead persistence failed.",
      response.status,
      payload,
    );
  }
  return Array.isArray(payload) ? (payload as SocialLeadRow[]) : [];
}

export async function recordSocialLead(
  envelope: SocialLeadWebhookEnvelope,
): Promise<{ leadId: string; receivedAt: string }> {
  try {
    const rows = await insertSocialLead(envelope);
    const row = rows[0];
    if (!row?.id) {
      throw new Error("Social lead persistence returned no row.");
    }
    return { leadId: row.id, receivedAt: row.created_at };
  } catch (error) {
    if (error instanceof SupabaseRestError && isUniqueViolation(error)) {
      throw new SocialLeadReplayError();
    }
    throw error;
  }
}
