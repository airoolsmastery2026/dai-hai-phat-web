import {
  buildProjectAnalysisPrompt,
  parseProjectAnalysisOutput,
  PROJECT_ANALYSIS_SCHEMA,
  type ProjectAnalysisRequest,
  type ProjectAnalysisResponse,
  type ProjectEvidenceContext,
} from "@/lib/ai/analysis";

const GEMINI_INTERACTIONS_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RESPONSE_BYTES = 128 * 1024;

type GeminiFailureCode =
  | "configuration"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "invalid_output";

export class GeminiProjectAnalysisError extends Error {
  constructor(
    message: string,
    readonly code: GeminiFailureCode,
  ) {
    super(message);
  }
}

interface GeminiInteractionResponse {
  output_text?: unknown;
  steps?: Array<{
    type?: unknown;
    content?: Array<{
      type?: unknown;
      text?: unknown;
    }>;
  }>;
}

function getGeminiModel(): string {
  const configured = process.env.GEMINI_MODEL?.trim();
  return configured && /^gemini-[a-z0-9.-]{1,72}$/i.test(configured)
    ? configured
    : DEFAULT_GEMINI_MODEL;
}

function readOutputText(payload: GeminiInteractionResponse): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index];
    if (step?.type !== "model_output" || !Array.isArray(step.content)) continue;
    const text = step.content
      .filter(
        (item) => item?.type === "text" && typeof item.text === "string",
      )
      .map((item) => item.text as string)
      .join("");
    if (text.trim()) return text;
  }

  throw new GeminiProjectAnalysisError(
    "Gemini không trả về nội dung phân tích.",
    "invalid_output",
  );
}

export async function analyzeProjectWithGemini(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): Promise<ProjectAnalysisResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiProjectAnalysisError(
      "Gemini chưa được cấu hình.",
      "configuration",
    );
  }

  const model = getGeminiModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GEMINI_INTERACTIONS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        model,
        store: false,
        input: buildProjectAnalysisPrompt(request, evidence),
        ...(model.startsWith("gemini-3")
          ? { generation_config: { thinking_level: "low" } }
          : {}),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: PROJECT_ANALYSIS_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      throw new GeminiProjectAnalysisError(
        response.status === 429
          ? "Gemini đang giới hạn lưu lượng."
          : "Gemini tạm thời không phản hồi.",
        response.status === 429 ? "rate_limit" : "upstream",
      );
    }

    const serialized = await response.text();
    if (!serialized || serialized.length > MAX_RESPONSE_BYTES) {
      throw new GeminiProjectAnalysisError(
        "Phản hồi Gemini vượt quá giới hạn.",
        "invalid_output",
      );
    }

    let payload: GeminiInteractionResponse;
    try {
      payload = JSON.parse(serialized) as GeminiInteractionResponse;
    } catch {
      throw new GeminiProjectAnalysisError(
        "Gemini trả về phản hồi không hợp lệ.",
        "invalid_output",
      );
    }

    let analysis;
    try {
      analysis = parseProjectAnalysisOutput(readOutputText(payload));
    } catch (error) {
      if (error instanceof GeminiProjectAnalysisError) throw error;
      throw new GeminiProjectAnalysisError(
        error instanceof Error
          ? error.message
          : "Gemini trả về dữ liệu không hợp lệ.",
        "invalid_output",
      );
    }

    return {
      ...analysis,
      provider: "gemini",
      model,
      generatedAt: new Date().toISOString(),
      evidenceCount: evidence.projects.length,
    };
  } catch (error) {
    if (error instanceof GeminiProjectAnalysisError) throw error;
    if (controller.signal.aborted) {
      throw new GeminiProjectAnalysisError(
        "Gemini phản hồi quá thời gian cho phép.",
        "timeout",
      );
    }
    throw new GeminiProjectAnalysisError(
      "Không thể kết nối Gemini.",
      "upstream",
    );
  } finally {
    clearTimeout(timeout);
  }
}
