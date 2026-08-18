import { createHash } from "node:crypto";

import { supabaseRestRequest } from "@/lib/server/supabase-rest";

const MEMORY_TIMEOUT_MS = 2_500;
const SAFE_NAMESPACE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export interface BrainMemoryObject {
  namespace: string;
  sourceKey: string;
  kind: string;
  contentHash: string;
  facts: Record<string, unknown>;
  sourceVersion: string;
}

export type BrainMemoryWriteResult = "HIT" | "UPDATED" | "CREATED" | "UNAVAILABLE";

interface BrainMemoryRow {
  namespace: string;
  source_key: string;
  kind: string;
  content_hash: string;
  facts: Record<string, unknown>;
  source_version: string;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, canonicalize(item)]),
  );
}

export function createBrainContentHash(facts: Record<string, unknown>): string {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize(facts)), "utf8")
    .digest("hex");
}

function validateKey(namespace: string, sourceKey: string): void {
  if (!SAFE_NAMESPACE.test(namespace)) throw new Error("Invalid brain-memory namespace");
  if (!sourceKey.trim() || sourceKey.length > 180) throw new Error("Invalid brain-memory source key");
}

export async function readBrainMemory(
  namespace: string,
  sourceKey: string,
): Promise<BrainMemoryObject | null> {
  validateKey(namespace, sourceKey);
  const query = new URLSearchParams({
    namespace: `eq.${namespace}`,
    source_key: `eq.${sourceKey}`,
    select: "namespace,source_key,kind,content_hash,facts,source_version",
    limit: "1",
  });

  try {
    const rows = await supabaseRestRequest<BrainMemoryRow[]>("ai_memory_objects", {
      query,
      signal: AbortSignal.timeout(MEMORY_TIMEOUT_MS),
    });
    const row = rows[0];
    if (!row) return null;
    return {
      namespace: row.namespace,
      sourceKey: row.source_key,
      kind: row.kind,
      contentHash: row.content_hash,
      facts: row.facts,
      sourceVersion: row.source_version,
    };
  } catch {
    return null;
  }
}

export async function rememberBrainFacts(input: {
  namespace: string;
  sourceKey: string;
  kind: string;
  facts: Record<string, unknown>;
  sourceVersion?: string;
}): Promise<BrainMemoryWriteResult> {
  validateKey(input.namespace, input.sourceKey);
  const contentHash = createBrainContentHash(input.facts);
  const current = await readBrainMemory(input.namespace, input.sourceKey);
  if (current?.contentHash === contentHash) return "HIT";

  const query = new URLSearchParams({ on_conflict: "namespace,source_key" });
  try {
    await supabaseRestRequest("ai_memory_objects", {
      method: "POST",
      query,
      prefer: "resolution=merge-duplicates,return=minimal",
      signal: AbortSignal.timeout(MEMORY_TIMEOUT_MS),
      body: {
        namespace: input.namespace,
        source_key: input.sourceKey,
        kind: input.kind,
        content_hash: contentHash,
        facts: canonicalize(input.facts),
        source_version: input.sourceVersion ?? "1",
        updated_at: new Date().toISOString(),
      },
    });
    return current ? "UPDATED" : "CREATED";
  } catch {
    return "UNAVAILABLE";
  }
}
