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
  buildSalesEngineerPrompt,
  parseSalesEngineerAgentOutput,
  SALES_ENGINEER_AGENT_SCHEMA,
  type SalesEngineerAgentRequest,
  type SalesEngineerAgentResponse,
  type SalesEngineerToolResult,
} from "@/lib/ai/sales-engineer-agent";
import {
  buildSpaceExtractionPrompt,
  parseSpaceExtractionOutput,
  type SpaceExtractionRequest,
  type SpaceExtractionResult,
} from "@/lib/ai/space-extraction";
import { requestDhpCapability } from "@/lib/server/capability-gateway";
import {
  executeVercelAiSdkText,
  isVercelAiSdkTextRuntimeEnabled,
} from "@/lib/server/vercel-ai-sdk-runtime";

const MAX_GATEWAY_RESPONSE_BYTES = 128 * 1024;

type ModelRuntimeFailureCode =
  | "configuration"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "invalid_output";

type ModelRuntimeTask =
  | "project-analysis"
  | "sales-engineer"
  | "workspace-chat"
  | "space-extraction"
  | "space-layout";

interface ModelRuntimeImage {
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  dataBase64: string;
}

export class ModelRuntimeCapabilityError extends Error {
  constructor(
    message: string,
    readonly code: ModelRuntimeFailureCode,
    readonly upstreamHttpStatus: number | null = null,
    readonly upstreamStatus: string | null = null,
  ) {
    super(message);
    this.name = "ModelRuntimeCapabilityError";
  }
}

interface GatewayErrorPayload {
  error?: unknown;
  upstreamStatus?: unknown;
}

interface ModelRuntimeData {
  outputText?: unknown;
  provider?: unknown;
  model?: unknown;
  tier?: unknown;
  verifiedFree?: unknown;
}

interface GatewaySuccessPayload {
  capability?: unknown;
  data?: ModelRuntimeData;
}

export interface FreeModelRuntimeOutput {
  outputText: string;
  provider: string;
  model: string;
}

export interface SpaceExtractionCapabilityResponse {
  extraction: SpaceExtractionResult;
  provider: string;
  model: string;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function mapGatewayFailure(
  status: number,
  payload: unknown,
): ModelRuntimeCapabilityError {
  const body =
    payload && typeof payload === "object"
      ? (payload as GatewayErrorPayload)
      : {};
  const upstreamStatus =
    typeof body.upstreamStatus === "number" ? body.upstreamStatus : null;

  if (status === 409 || status === 401 || status === 403) {
    return new ModelRuntimeCapabilityError(
      "Model runtime capability chưa được cấu hình.",
      "configuration",
      upstreamStatus ?? status,
    );
  }
  if (status === 429 || upstreamStatus === 429) {
    return new ModelRuntimeCapabilityError(
      "Các model miễn phí phía backend đang chạm giới hạn.",
      "rate_limit",
      upstreamStatus ?? status,
    );
  }
  if (status === 504 || upstreamStatus === 408 || upstreamStatus === 504) {
    return new ModelRuntimeCapabilityError(
      "Model runtime capability phản hồi quá lâu.",
      "timeout",
      upstreamStatus ?? status,
    );
  }
  return new ModelRuntimeCapabilityError(
    "Model runtime capability tạm thời không khả dụng.",
    "upstream",
    upstreamStatus ?? status,
  );
}

async function executeGatewayModelRuntime(
  task: ModelRuntimeTask,
  prompt: string,
  images: ModelRuntimeImage[] = [],
): Promise<FreeModelRuntimeOutput> {
  let response: Response;
  try {
    response = await requestDhpCapability("model-runtime", ["execute"], {
      method: "POST",
      body: JSON.stringify({
        task,
        schemaVersion: "1.0",
        freeOnly: true,
        allowPaid: false,
        prompt,
        ...(images.length > 0 ? { images } : {}),
      }),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new ModelRuntimeCapabilityError(
        "Model runtime capability phản hồi quá lâu.",
        "timeout",
      );
    }
    throw new ModelRuntimeCapabilityError(
      "Model runtime capability chưa sẵn sàng.",
      "configuration",
    );
  }

  const serialized = await response.text();
  if (serialized.length > MAX_GATEWAY_RESPONSE_BYTES) {
    throw new ModelRuntimeCapabilityError(
      "Model runtime trả về dữ liệu vượt giới hạn.",
      "invalid_output",
      response.status,
    );
  }
  const payload = safeJson(serialized);
  if (!response.ok) throw mapGatewayFailure(response.status, payload);

  if (!payload || typeof payload !== "object") {
    throw new ModelRuntimeCapabilityError(
      "Model runtime trả về dữ liệu không hợp lệ.",
      "invalid_output",
    );
  }
  const envelope = payload as GatewaySuccessPayload;
  const data = envelope.data;
  if (
    envelope.capability !== "model-runtime" ||
    !data ||
    data.tier !== "free" ||
    data.verifiedFree !== true ||
    typeof data.provider !== "string" ||
    typeof data.model !== "string" ||
    typeof data.outputText !== "string" ||
    !data.outputText.trim()
  ) {
    throw new ModelRuntimeCapabilityError(
      "Model runtime không chứng minh được zero-cost output.",
      "invalid_output",
    );
  }

  return {
    outputText: data.outputText,
    provider: data.provider,
    model: data.model,
  };
}

async function executeFreeModelRuntime(
  task: ModelRuntimeTask,
  prompt: string,
  images: ModelRuntimeImage[] = [],
): Promise<FreeModelRuntimeOutput> {
  const canUseAiSdk =
    images.length === 0 && isVercelAiSdkTextRuntimeEnabled();

  if (canUseAiSdk) {
    try {
      return await executeVercelAiSdkText(prompt);
    } catch {
      // The canonical DHP free-only gateway remains the fail-safe. A direct
      // AI SDK provider failure must never break the existing production path.
    }
  }

  return executeGatewayModelRuntime(task, prompt, images);
}

export async function runWorkspaceChatWithModelRuntimeCapability(
  prompt: string,
): Promise<FreeModelRuntimeOutput> {
  return executeFreeModelRuntime("workspace-chat", prompt);
}

export async function generateSpaceLayoutWithModelRuntimeCapability(
  prompt: string,
): Promise<FreeModelRuntimeOutput> {
  return executeFreeModelRuntime("space-layout", prompt);
}

export async function analyzeProjectWithModelRuntimeCapability(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<ProjectAnalysisResponse> {
  const prompt = [
    buildProjectAnalysisPrompt(request, evidence),
    "JSON_SCHEMA:",
    JSON.stringify(PROJECT_ANALYSIS_SCHEMA),
    "Chỉ trả về một JSON object hợp lệ, không Markdown.",
  ].join("\n");
  const result = await executeFreeModelRuntime("project-analysis", prompt);
  const analysis = assertProjectAnalysisLanguageQuality(
    parseProjectAnalysisOutput(result.outputText),
  );
  return {
    ...analysis,
    provider: result.provider,
    model: result.model,
    generatedAt: new Date().toISOString(),
    evidenceCount: evidence.projects.length,
  };
}

export async function runSalesEngineerWithModelRuntimeCapability(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): Promise<SalesEngineerAgentResponse> {
  const prompt = [
    buildSalesEngineerPrompt(request, tools),
    "JSON_SCHEMA:",
    JSON.stringify(SALES_ENGINEER_AGENT_SCHEMA),
    "Chỉ trả về một JSON object hợp lệ, không Markdown.",
  ].join("\n");
  const result = await executeFreeModelRuntime("sales-engineer", prompt);
  const content = parseSalesEngineerAgentOutput(result.outputText);
  return {
    ...content,
    provider: result.provider,
    model: result.model,
    generatedAt: new Date().toISOString(),
    toolsUsed: tools.map((tool) => tool.name),
  };
}

export async function extractSpaceWithModelRuntimeCapability(
  request: SpaceExtractionRequest,
  revision: string,
): Promise<SpaceExtractionCapabilityResponse> {
  const result = await executeFreeModelRuntime(
    "space-extraction",
    buildSpaceExtractionPrompt(request.context),
    [request.image],
  );

  return {
    extraction: parseSpaceExtractionOutput(result.outputText, revision),
    provider: result.provider,
    model: result.model,
  };
}
