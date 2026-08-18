import { createHash } from "node:crypto";

import {
  parseSalesEngineerAgentOutput,
  SALES_ENGINEER_TOOL_NAMES,
  type SalesEngineerAgentRequest,
  type SalesEngineerAgentResponse,
  type SalesEngineerToolName,
  type SalesEngineerToolResult,
} from "@/lib/ai/sales-engineer-agent";
import { supabaseRestRequest } from "@/lib/server/supabase-rest";

const MEMORY_KIND = "sales-engineer";
const PROMPT_VERSION = "2026-08-18-v1";
const SCHEMA_VERSION = "1";
const MEMORY_TIMEOUT_MS = 2_500;

interface AnalysisMemoryRow {
  fingerprint: string;
  response: unknown;
  provider: string;
  model: string;
}

export interface SalesEngineerMemoryResult {
  fingerprint: string;
  agent: SalesEngineerAgentResponse | null;
}

function technicalMemory(request: SalesEngineerAgentRequest) {
  const memory = request.memory;
  return {
    intentGroup: memory.intentGroup,
    intent: memory.intent,
    service: memory.service,
    projectType: memory.projectType,
    location: memory.location,
    images: memory.images.map((image) => ({
      storageKey: image.storageKey,
      name: image.name,
      size: image.size,
      type: image.type,
      lastModified: image.lastModified,
    })),
    imagesDeferred: memory.imagesDeferred,
    dimensions: memory.dimensions,
    style: memory.style,
    material: memory.material,
    budget: memory.budget,
    timeline: memory.timeline,
    priority: memory.priority,
    surveyWindow: memory.surveyWindow,
    quoteRequest: memory.quoteRequest,
  };
}

function canonicalPayload(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): string {
  return JSON.stringify({
    kind: MEMORY_KIND,
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    message: request.message,
    memory: technicalMemory(request),
    tools,
  });
}

export function createSalesEngineerFingerprint(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): string {
  return createHash("sha256")
    .update(canonicalPayload(request, tools), "utf8")
    .digest("hex");
}

function restoreToolsUsed(value: unknown): SalesEngineerToolName[] | null {
  if (!Array.isArray(value)) return null;
  const valid = value.filter(
    (item): item is SalesEngineerToolName =>
      typeof item === "string" &&
      (SALES_ENGINEER_TOOL_NAMES as readonly string[]).includes(item),
  );
  return valid.length === value.length ? valid : null;
}

function restoreAgent(row: AnalysisMemoryRow): SalesEngineerAgentResponse | null {
  if (!row.response || typeof row.response !== "object") return null;
  const value = row.response as Record<string, unknown>;
  try {
    const content = parseSalesEngineerAgentOutput(JSON.stringify(value));
    const generatedAt = typeof value.generatedAt === "string" ? value.generatedAt : "";
    const toolsUsed = restoreToolsUsed(value.toolsUsed);
    if (!generatedAt || !row.provider || !row.model || !toolsUsed) return null;
    return {
      ...content,
      provider: row.provider,
      model: row.model,
      generatedAt,
      toolsUsed,
    };
  } catch {
    return null;
  }
}

export async function readSalesEngineerMemory(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): Promise<SalesEngineerMemoryResult> {
  const fingerprint = createSalesEngineerFingerprint(request, tools);
  const query = new URLSearchParams({
    fingerprint: `eq.${fingerprint}`,
    kind: `eq.${MEMORY_KIND}`,
    prompt_version: `eq.${PROMPT_VERSION}`,
    schema_version: `eq.${SCHEMA_VERSION}`,
    select: "fingerprint,response,provider,model",
    limit: "1",
  });

  try {
    const rows = await supabaseRestRequest<AnalysisMemoryRow[]>("ai_analysis_memory", {
      query,
      signal: AbortSignal.timeout(MEMORY_TIMEOUT_MS),
    });
    const row = rows[0];
    return { fingerprint, agent: row ? restoreAgent(row) : null };
  } catch {
    return { fingerprint, agent: null };
  }
}

export async function writeSalesEngineerMemory(
  fingerprint: string,
  agent: SalesEngineerAgentResponse,
): Promise<void> {
  const query = new URLSearchParams({ on_conflict: "fingerprint" });
  try {
    await supabaseRestRequest("ai_analysis_memory", {
      method: "POST",
      query,
      prefer: "resolution=merge-duplicates,return=minimal",
      signal: AbortSignal.timeout(MEMORY_TIMEOUT_MS),
      body: {
        fingerprint,
        kind: MEMORY_KIND,
        prompt_version: PROMPT_VERSION,
        schema_version: SCHEMA_VERSION,
        response: agent,
        provider: agent.provider,
        model: agent.model,
        last_hit_at: new Date().toISOString(),
      },
    });
  } catch {
    // Exact-response cache is an optimization and must not block the AI flow.
  }
}
