import type {
  ProjectAnalysisRequest,
  ProjectAnalysisResponse,
  ProjectEvidenceContext,
} from "@/lib/ai/analysis";
import {
  analyzeProjectWithModelRuntimeCapability,
  ModelRuntimeCapabilityError,
} from "@/lib/server/model-runtime-capability";
import {
  readProjectAnalysisMemory,
  writeProjectAnalysisMemory,
} from "@/lib/server/project-analysis-memory";

const CAPABILITY_COOLDOWN_MS = 60_000;
let capabilityCooldownUntil = 0;

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
    readonly upstreamHttpStatus: number | null = null,
    readonly upstreamStatus: string | null = null,
  ) {
    super(message);
    this.name = "CloudAiRouterError";
  }
}

function mapCapabilityError(error: ModelRuntimeCapabilityError): CloudAiRouterError {
  return new CloudAiRouterError(
    error.message,
    error.code,
    error.upstreamHttpStatus,
    error.upstreamStatus,
  );
}

function capabilityEligible(): boolean {
  return capabilityCooldownUntil <= Date.now();
}

function coolDownCapability(error: CloudAiRouterError): void {
  if (
    error.code === "rate_limit" ||
    error.code === "timeout" ||
    error.code === "upstream"
  ) {
    capabilityCooldownUntil = Date.now() + CAPABILITY_COOLDOWN_MS;
  }
}

export interface RoutedProjectAnalysis {
  analysis: ProjectAnalysisResponse;
  cache: "HIT" | "MISS";
  fingerprint: string;
}

async function persistAndReturn(
  fingerprint: string,
  analysis: ProjectAnalysisResponse,
): Promise<RoutedProjectAnalysis> {
  await writeProjectAnalysisMemory(fingerprint, analysis);
  return { analysis, cache: "MISS", fingerprint };
}

export async function analyzeProjectWithCloudRouter(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<RoutedProjectAnalysis> {
  const memory = await readProjectAnalysisMemory(request, evidence);
  if (memory.analysis) {
    return { analysis: memory.analysis, cache: "HIT", fingerprint: memory.fingerprint };
  }

  if (!capabilityEligible()) {
    throw new CloudAiRouterError(
      "Các model cloud miễn phí đang trong thời gian cooldown.",
      "rate_limit",
    );
  }

  try {
    const analysis = await analyzeProjectWithModelRuntimeCapability(request, evidence);
    return persistAndReturn(memory.fingerprint, analysis);
  } catch (error) {
    if (error instanceof ModelRuntimeCapabilityError) {
      const routed = mapCapabilityError(error);
      coolDownCapability(routed);
      throw routed;
    }
    const routed = new CloudAiRouterError(
      "Model runtime capability tạm thời không khả dụng.",
      "upstream",
    );
    coolDownCapability(routed);
    throw routed;
  }
}
