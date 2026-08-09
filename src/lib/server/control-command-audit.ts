import {
  getSupabaseServerConfig,
  SupabaseRestError,
} from "@/lib/server/supabase-rest";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const OPERATOR_ROLES = ["owner", "admin", "operator", "viewer"] as const;
const AUDIT_STATUSES = ["accepted", "completed", "failed", "rejected"] as const;

type OperatorRole = (typeof OPERATOR_ROLES)[number];
type AuditStatus = (typeof AUDIT_STATUSES)[number];

export interface ControlCommandAuditEvent {
  eventType: "control.command.executed";
  commandId: string;
  operatorId: string;
  operatorRole: OperatorRole;
  targetService: string;
  command: string;
  status: AuditStatus;
  occurredAt: string;
}

interface ControlCommandAuditRow {
  id: string;
  command_id: string;
  created_at: string;
}

export class ControlCommandAuditValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ControlCommandAuditValidationError";
  }
}

export class ControlCommandAuditReplayError extends Error {
  constructor() {
    super("Control command audit event already exists.");
    this.name = "ControlCommandAuditReplayError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new ControlCommandAuditValidationError(`Thiếu trường ${field}.`);
  }
  const normalized = value.trim();
  if (
    !normalized ||
    normalized.length > maxLength ||
    CONTROL_CHARACTERS.test(normalized)
  ) {
    throw new ControlCommandAuditValidationError(`Trường ${field} không hợp lệ.`);
  }
  return normalized;
}

function enumValue<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ControlCommandAuditValidationError(`Trường ${field} không hợp lệ.`);
  }
  return value as T;
}

export function parseControlCommandAuditEvent(
  value: unknown,
): ControlCommandAuditEvent {
  if (!isRecord(value)) {
    throw new ControlCommandAuditValidationError("Audit event không đúng định dạng.");
  }
  if (value.eventType !== "control.command.executed") {
    throw new ControlCommandAuditValidationError("Loại audit event không hợp lệ.");
  }

  const occurredAt = text(value.occurredAt, "occurredAt", 40);
  if (Number.isNaN(Date.parse(occurredAt))) {
    throw new ControlCommandAuditValidationError("Thời điểm audit không hợp lệ.");
  }

  return {
    eventType: "control.command.executed",
    commandId: text(value.commandId, "commandId", 100),
    operatorId: text(value.operatorId, "operatorId", 160),
    operatorRole: enumValue(value.operatorRole, "operatorRole", OPERATOR_ROLES),
    targetService: text(value.targetService, "targetService", 80),
    command: text(value.command, "command", 160),
    status: enumValue(value.status, "status", AUDIT_STATUSES),
    occurredAt,
  };
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isUniqueViolation(error: SupabaseRestError): boolean {
  if (error.status !== 409 || !isRecord(error.details)) return false;
  return error.details.code === "23505";
}

export async function recordControlCommandAuditEvent(
  event: ControlCommandAuditEvent,
): Promise<{ auditId: string; receivedAt: string }> {
  const config = getSupabaseServerConfig();
  const endpoint = new URL("/rest/v1/control_command_audit", config.url);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        "content-type": "application/json",
        prefer: "return=representation",
      },
      body: JSON.stringify({
        event_type: event.eventType,
        command_id: event.commandId,
        operator_id: event.operatorId,
        operator_role: event.operatorRole,
        target_service: event.targetService,
        command: event.command,
        status: event.status,
        occurred_at: event.occurredAt,
      }),
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = raw ? safeParseJson(raw) : null;
    if (!response.ok) {
      throw new SupabaseRestError(
        "Control command audit persistence failed.",
        response.status,
        payload,
      );
    }
    const rows = Array.isArray(payload) ? (payload as ControlCommandAuditRow[]) : [];
    const row = rows[0];
    if (!row?.id) {
      throw new Error("Control command audit persistence returned no row.");
    }
    return { auditId: row.id, receivedAt: row.created_at };
  } catch (error) {
    if (error instanceof SupabaseRestError && isUniqueViolation(error)) {
      throw new ControlCommandAuditReplayError();
    }
    throw error;
  }
}
