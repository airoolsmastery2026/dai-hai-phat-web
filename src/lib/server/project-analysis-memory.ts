import { createHash } from "node:crypto";

import {
  parseProjectAnalysisOutput,
  type ProjectAnalysisRequest,
  type ProjectAnalysisResponse,
  type ProjectEvidenceContext,
} from "@/lib/ai/analysis";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
  supabaseRestRequest,
} from "@/lib/server/supabase-rest";

const MEMORY_KIND = "project-analysis";
const PROMPT_VERSION = "2026-08-18-v1";
const SCHEMA_VERSION = "1";
const MEMORY_TIMEOUT_MS = 2_500;

interface AnalysisMemoryRow {
  fingerprint: string;
  response: unknown;
  provider: string;
  model: string;
}

export interface ProjectAnalysisMemoryResult {
  fingerprint: string;
  analysis: ProjectAnalysisResponse | null;
}

function canonicalPayload(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): string {
  return JSON.stringify({
    kind: MEMORY_KIND,
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    request,
    evidence: {
      projects: evidence.projects.slice(0, 6),
      materials: evidence.materials.slice(0, 6),
      pricingRule: evidence.pricingRule,
    },
  });
}

export function createProjectAnalysisFingerprint(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): string {
  return createHash("sha256")
    .update(canonicalPayload(request, evidence), "utf8")
    .digest("hex");
}

function restoreAnalysis(row: AnalysisMemoryRow): ProjectAnalysisResponse | null {
  if (!row.response || typeof row.response !== "object") return null;
  const value = row.response as Record<string, unknown>;
  try {
    const content = parseProjectAnalysisOutput(JSON.stringify(value));
    const generatedAt = typeof value.generatedAt === "string" ? value.generatedAt : "";
    const evidenceCount =
      typeof value.evidenceCount === "number" && Number.isInteger(value.evidenceCount)
        ? value.evidenceCount
        : 0;
    if (!generatedAt || !row.provider || !row.model) return null;
    return {
      ...content,
      provider: row.provider,
      model: row.model,
      generatedAt,
      evidenceCount,
    };
  } catch {
    return null;
  }
}

export async function readProjectAnalysisMemory(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<ProjectAnalysisMemoryResult> {
  const fingerprint = createProjectAnalysisFingerprint(request, evidence);
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
    return { fingerprint, analysis: row ? restoreAnalysis(row) : null };
  } catch (error) {
    if (
      error instanceof SupabaseServerConfigurationError ||
      error instanceof SupabaseRestError ||
      (error instanceof Error && error.name === "TimeoutError")
    ) {
      return { fingerprint, analysis: null };
    }
    return { fingerprint, analysis: null };
  }
}

export async function writeProjectAnalysisMemory(
  fingerprint: string,
  analysis: ProjectAnalysisResponse,
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
        response: analysis,
        provider: analysis.provider,
        model: analysis.model,
        last_hit_at: new Date().toISOString(),
      },
    });
  } catch {
    // Cache persistence must never block the customer-facing AI flow.
  }
}
