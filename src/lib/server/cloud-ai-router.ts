import {
  buildProjectAnalysisPrompt,
  parseProjectAnalysisOutput,
  PROJECT_ANALYSIS_SCHEMA,
  type ProjectAnalysisRequest,
  type ProjectAnalysisResponse,
  type ProjectEvidenceContext,
} from "@/lib/ai/analysis";
import { assertProjectAnalysisLanguageQuality } from "@/lib/ai/analysis-output-quality";
import {
  analyzeProjectWithGemini,
  GeminiProjectAnalysisError,
} from "@/lib/server/gemini";
import {
  readProjectAnalysisMemory,
  writeProjectAnalysisMemory,
} from "@/lib/server/project-analysis-memory";

const REQUEST_TIMEOUT_MS = 15_000;
const MODEL_CATALOG_TTL_MS = 5 * 60_000;
const COOLDOWN_MS = 60_000;
const MAX_RESPONSE_BYTES = 128 * 1024;

export type CloudAiFailureCode =
  | "configuration"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "invalid_output";

export class CloudAiRouterError extends Error {
  constructor(
    message: string,
    readonly code: CloudAiFailureCode,
  ) {
    super(message);
    this.name = "CloudAiRouterError";
  }
}

interface ModelSpec {
  id: string;
  tier: "free" | "paid";
  priority?: number;
}

interface ProviderProfile {
  id: string;
  protocol: "openai-chat";
  baseUrl: string;
  apiKeyEnv: string;
  models: ModelSpec[];
  enabled?: boolean;
}

interface CatalogModel extends ModelSpec {
  provider: string;
  enabled?: boolean;
}

interface ModelCatalog {
  models?: CatalogModel[];
}

interface Candidate {
  provider: string;
  model: string;
  tier: "free" | "paid";
  priority: number;
  profile: ProviderProfile;
}

interface OpenAiChatResponse {
  choices?: Array<{
    message?: { content?: unknown };
  }>;
}

let catalogCache: { expiresAt: number; value: CatalogModel[] } | null = null;
const cooldowns = new Map<string, number>();

function allowPaid(): boolean {
  return process.env.DHP_AI_ALLOW_PAID?.trim().toLowerCase() === "true";
}

function parseProfiles(): ProviderProfile[] {
  const raw = process.env.DHP_AI_CLOUD_PROVIDERS_JSON?.trim();
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.flatMap((item): ProviderProfile[] => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      if (
        typeof record.id !== "string" ||
        typeof record.baseUrl !== "string" ||
        typeof record.apiKeyEnv !== "string" ||
        record.protocol !== "openai-chat" ||
        !Array.isArray(record.models) ||
        record.enabled === false
      ) return [];

      let url: URL;
      try { url = new URL(record.baseUrl); } catch { return []; }
      if (url.protocol !== "https:") return [];
      if (!/^[A-Z][A-Z0-9_]{2,80}$/.test(record.apiKeyEnv)) return [];

      const models = record.models.flatMap((model): ModelSpec[] => {
        if (!model || typeof model !== "object") return [];
        const spec = model as Record<string, unknown>;
        if (
          typeof spec.id !== "string" ||
          (spec.tier !== "free" && spec.tier !== "paid")
        ) return [];
        return [{
          id: spec.id,
          tier: spec.tier,
          priority: typeof spec.priority === "number" ? spec.priority : 100,
        }];
      });
      if (!models.length) return [];
      return [{
        id: record.id,
        protocol: "openai-chat",
        baseUrl: url.toString(),
        apiKeyEnv: record.apiKeyEnv,
        models,
        enabled: true,
      }];
    });
  } catch {
    return [];
  }
}

async function readModelCatalog(): Promise<CatalogModel[]> {
  const now = Date.now();
  if (catalogCache && catalogCache.expiresAt > now) return catalogCache.value;
  const rawUrl = process.env.DHP_AI_MODEL_CATALOG_URL?.trim();
  if (!rawUrl) return [];

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return [];
    const token = process.env.DHP_AI_MODEL_CATALOG_TOKEN?.trim();
    const response = await fetch(url, {
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return [];
    const payload = await response.json() as ModelCatalog;
    const models = Array.isArray(payload.models)
      ? payload.models.filter((model) =>
          model &&
          typeof model.provider === "string" &&
          typeof model.id === "string" &&
          (model.tier === "free" || model.tier === "paid") &&
          model.enabled !== false,
        )
      : [];
    catalogCache = { expiresAt: now + MODEL_CATALOG_TTL_MS, value: models };
    return models;
  } catch {
    return [];
  }
}

async function candidates(): Promise<Candidate[]> {
  const profiles = parseProfiles();
  const catalog = await readModelCatalog();
  const paid = allowPaid();
  const result = new Map<string, Candidate>();

  for (const profile of profiles) {
    if (!process.env[profile.apiKeyEnv]?.trim()) continue;
    for (const model of profile.models) {
      if (model.tier === "paid" && !paid) continue;
      const candidate: Candidate = {
        provider: profile.id,
        model: model.id,
        tier: model.tier,
        priority: model.priority ?? 100,
        profile,
      };
      result.set(`${candidate.provider}:${candidate.model}`, candidate);
    }
  }

  for (const model of catalog) {
    const profile = profiles.find((item) => item.id === model.provider);
    if (!profile || !process.env[profile.apiKeyEnv]?.trim()) continue;
    if (model.tier === "paid" && !paid) continue;
    const candidate: Candidate = {
      provider: model.provider,
      model: model.id,
      tier: model.tier,
      priority: model.priority ?? 90,
      profile,
    };
    result.set(`${candidate.provider}:${candidate.model}`, candidate);
  }

  return Array.from(result.values()).sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "free" ? -1 : 1;
    return a.priority - b.priority;
  });
}

function isCoolingDown(candidate: Candidate): boolean {
  const key = `${candidate.provider}:${candidate.model}`;
  const until = cooldowns.get(key) ?? 0;
  if (until <= Date.now()) {
    cooldowns.delete(key);
    return false;
  }
  return true;
}

function setCooldown(candidate: Candidate): void {
  cooldowns.set(`${candidate.provider}:${candidate.model}`, Date.now() + COOLDOWN_MS);
}

async function callOpenAiCompatible(
  candidate: Candidate,
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<ProjectAnalysisResponse> {
  const apiKey = process.env[candidate.profile.apiKeyEnv]?.trim();
  if (!apiKey) throw new CloudAiRouterError("Provider chưa được cấu hình.", "configuration");
  const endpoint = new URL("chat/completions", candidate.profile.baseUrl.endsWith("/")
    ? candidate.profile.baseUrl
    : `${candidate.profile.baseUrl}/`);
  const prompt = [
    buildProjectAnalysisPrompt(request, evidence),
    "JSON_SCHEMA:",
    JSON.stringify(PROJECT_ANALYSIS_SCHEMA),
    "Chỉ trả về một JSON object hợp lệ, không Markdown.",
  ].join("\n");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model: candidate.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new CloudAiRouterError("Provider đang giới hạn quota.", "rate_limit");
      }
      if (response.status === 401 || response.status === 403) {
        throw new CloudAiRouterError("Provider từ chối cấu hình xác thực.", "configuration");
      }
      throw new CloudAiRouterError("Provider cloud tạm thời không phản hồi.", "upstream");
    }

    const serialized = await response.text();
    if (!serialized || serialized.length > MAX_RESPONSE_BYTES) {
      throw new CloudAiRouterError("Phản hồi provider không hợp lệ.", "invalid_output");
    }
    const payload = JSON.parse(serialized) as OpenAiChatResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new CloudAiRouterError("Provider không trả về nội dung.", "invalid_output");
    }
    const analysis = assertProjectAnalysisLanguageQuality(parseProjectAnalysisOutput(content));
    return {
      ...analysis,
      provider: candidate.provider,
      model: candidate.model,
      generatedAt: new Date().toISOString(),
      evidenceCount: evidence.projects.length,
    };
  } catch (error) {
    if (error instanceof CloudAiRouterError) throw error;
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new CloudAiRouterError("Provider phản hồi quá thời gian.", "timeout");
    }
    throw new CloudAiRouterError("Không thể kết nối provider cloud.", "upstream");
  }
}

function mapGeminiError(error: GeminiProjectAnalysisError): CloudAiRouterError {
  return new CloudAiRouterError(error.message, error.code);
}

export interface RoutedProjectAnalysis {
  analysis: ProjectAnalysisResponse;
  cache: "HIT" | "MISS";
  fingerprint: string;
}

export async function analyzeProjectWithCloudRouter(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<RoutedProjectAnalysis> {
  const memory = await readProjectAnalysisMemory(request, evidence);
  if (memory.analysis) {
    return { analysis: memory.analysis, cache: "HIT", fingerprint: memory.fingerprint };
  }

  let lastError: CloudAiRouterError | null = null;
  for (const candidate of await candidates()) {
    if (isCoolingDown(candidate)) continue;
    try {
      const analysis = await callOpenAiCompatible(candidate, request, evidence);
      await writeProjectAnalysisMemory(memory.fingerprint, analysis);
      return { analysis, cache: "MISS", fingerprint: memory.fingerprint };
    } catch (error) {
      const routed = error instanceof CloudAiRouterError
        ? error
        : new CloudAiRouterError("Provider cloud lỗi.", "upstream");
      lastError = routed;
      if (routed.code === "configuration") continue;
      if (routed.code === "rate_limit" || routed.code === "timeout" || routed.code === "upstream") {
        setCooldown(candidate);
        continue;
      }
    }
  }

  try {
    const analysis = await analyzeProjectWithGemini(request, evidence);
    await writeProjectAnalysisMemory(memory.fingerprint, analysis);
    return { analysis, cache: "MISS", fingerprint: memory.fingerprint };
  } catch (error) {
    if (error instanceof GeminiProjectAnalysisError) {
      lastError = mapGeminiError(error);
    }
  }

  throw lastError ?? new CloudAiRouterError("Không có provider cloud khả dụng.", "configuration");
}
