import type { ConversationSession } from "@/lib/ai";

export const AI_DRAFT_RETENTION_DAYS = 7;
export const AI_DRAFT_RETENTION_MS =
  AI_DRAFT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

interface PersistedAIDraft {
  version: 1;
  savedAt: number;
  expiresAt: number;
  session: ConversationSession;
}

export type AIDraftReadResult =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "expired"; sessionId: string | null }
  | { status: "ready"; session: ConversationSession };

const PRIVATE_CONTACT_FIELDS = [
  "name",
  "phone",
  "surveyAddress",
  "email",
  "zalo",
] as const;

function getSafeSessionId(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" && /^[a-zA-Z0-9-]{1,100}$/.test(id) ? id : null;
}

export function serializeAIDraft(
  session: ConversationSession,
  now = Date.now(),
): string {
  const memory = { ...session.memory };
  PRIVATE_CONTACT_FIELDS.forEach((field) => {
    delete memory[field];
  });

  const draft: PersistedAIDraft = {
    version: 1,
    savedAt: now,
    expiresAt: now + AI_DRAFT_RETENTION_MS,
    session: {
      ...session,
      memory,
    },
  };

  return JSON.stringify(draft);
}

export function readAIDraft(
  serialized: string | null,
  now = Date.now(),
): AIDraftReadResult {
  if (!serialized) return { status: "missing" };

  try {
    const parsed = JSON.parse(serialized) as Partial<PersistedAIDraft>;
    if (
      parsed.version !== 1 ||
      typeof parsed.savedAt !== "number" ||
      !Number.isFinite(parsed.savedAt) ||
      typeof parsed.expiresAt !== "number" ||
      !Number.isFinite(parsed.expiresAt) ||
      parsed.expiresAt <= parsed.savedAt ||
      typeof parsed.session !== "object" ||
      parsed.session === null
    ) {
      return { status: "invalid" };
    }

    if (now >= parsed.expiresAt) {
      return {
        status: "expired",
        sessionId: getSafeSessionId(parsed.session),
      };
    }

    return {
      status: "ready",
      session: parsed.session as ConversationSession,
    };
  } catch {
    return { status: "invalid" };
  }
}
