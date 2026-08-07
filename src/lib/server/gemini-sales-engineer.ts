import {
  buildSalesEngineerPrompt,
  parseSalesEngineerAgentOutput,
  SALES_ENGINEER_AGENT_SCHEMA,
  type SalesEngineerAgentRequest,
  type SalesEngineerAgentResponse,
  type SalesEngineerToolResult,
} from "@/lib/ai/sales-engineer-agent";

const GEMINI_INTERACTIONS_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RESPONSE_BYTES = 128 * 1024;
const MAX_ERROR_RESPONSE_BYTES = 8 * 1024;
const UPSTREAM_STATUS_PATTERN = /^[A-Z][A-Z0-9_]{0,63}$/;

type GeminiSalesAgentFailureCode =
  | "configuration"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "invalid_output";

export class GeminiSalesEngineerError extends Error {
  constructor(
    message: string,
    readonly code: GeminiSalesAgentFailureCode,
    readonly upstreamHttpStatus: number | null = null,
    readonly upstreamStatus: string | null = null,
  ) {
    super(message);
  }
}

interface GeminiInteractionResponse {
  output_text?: unknown;
  steps?: Array<{
    type?: unknown;
    content?: Array<{ type?: unknown; text?: unknown }>;
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
      .filter((item) => item?.type === "text" && typeof item.text === "string")
      .map((item) => item.text as string)
      .join("");
    if (text.trim()) return text;
  }
  throw new GeminiSalesEngineerError(
    "Gemini không trả về nội dung agent.",
    "invalid_output",
  );
}

async function readUpstreamStatus(response: Response): Promise<string | null> {
  try {
    const serialized = await response.text();
    if (!serialized || serialized.length > MAX_ERROR_RESPONSE_BYTES) return null;
    const payload = JSON.parse(serialized) as { error?: { status?: unknown } };
    const status = payload.error?.status;
    return typeof status === "string" && UPSTREAM_STATUS_PATTERN.test(status)
      ? status
      : null;
  } catch {
    return null;
  }
}

export async function runSalesEngineerWithGemini(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): Promise<SalesEngineerAgentResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiSalesEngineerError("Gemini chưa được cấu hình.", "configuration");
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
        input: buildSalesEngineerPrompt(request, tools),
        ...(model.startsWith("gemini-3")
          ? { generation_config: { thinking_level: "low" } }
          : {}),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: SALES_ENGINEER_AGENT_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      const upstreamStatus = await readUpstreamStatus(response);
      const rateLimited =
        response.status === 429 || upstreamStatus === "RESOURCE_EXHAUSTED";
      throw new GeminiSalesEngineerError(
        rateLimited ? "Gemini đang giới hạn lưu lượng." : "Gemini tạm thời không phản hồi.",
        rateLimited ? "rate_limit" : "upstream",
        response.status,
        upstreamStatus,
      );
    }

    const serialized = await response.text();
    if (!serialized || serialized.length > MAX_RESPONSE_BYTES) {
      throw new GeminiSalesEngineerError(
        "Phản hồi Gemini vượt quá giới hạn.",
        "invalid_output",
      );
    }

    let payload: GeminiInteractionResponse;
    try {
      payload = JSON.parse(serialized) as GeminiInteractionResponse;
    } catch {
      throw new GeminiSalesEngineerError(
        "Gemini trả về phản hồi không hợp lệ.",
        "invalid_output",
      );
    }

    let content;
    try {
      content = parseSalesEngineerAgentOutput(readOutputText(payload));
    } catch (error) {
      if (error instanceof GeminiSalesEngineerError) throw error;
      throw new GeminiSalesEngineerError(
        error instanceof Error ? error.message : "Gemini trả về dữ liệu không hợp lệ.",
        "invalid_output",
      );
    }

    return {
      ...content,
      provider: "gemini",
      model,
      generatedAt: new Date().toISOString(),
      toolsUsed: tools.map((tool) => tool.name),
    };
  } catch (error) {
    if (error instanceof GeminiSalesEngineerError) throw error;
    if (controller.signal.aborted) {
      throw new GeminiSalesEngineerError(
        "Gemini phản hồi quá thời gian cho phép.",
        "timeout",
      );
    }
    throw new GeminiSalesEngineerError("Không thể kết nối Gemini.", "upstream");
  } finally {
    clearTimeout(timeout);
  }
}
