import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const DEFAULT_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 20_000;

export interface VercelAiSdkRuntimeOutput {
  outputText: string;
  provider: "google-generative-ai";
  model: string;
}

export type VercelAiSdkRuntimeReadinessReason =
  | "ready"
  | "runtime-selector"
  | "verified-free"
  | "paid-execution-blocked"
  | "missing-api-key";

export interface VercelAiSdkRuntimeReadiness {
  enabled: boolean;
  reason: VercelAiSdkRuntimeReadinessReason;
  model: string;
}

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function getVercelAiSdkModel(): string {
  return readEnv("DHP_AI_SDK_MODEL") || DEFAULT_MODEL;
}

export function getVercelAiSdkRuntimeReadiness(): VercelAiSdkRuntimeReadiness {
  const model = getVercelAiSdkModel();

  if (readEnv("DHP_AI_SDK_RUNTIME") !== "google-direct") {
    return { enabled: false, reason: "runtime-selector", model };
  }
  if (readEnv("DHP_AI_ALLOW_PAID") === "true") {
    return { enabled: false, reason: "paid-execution-blocked", model };
  }
  if (readEnv("DHP_AI_SDK_VERIFIED_FREE") !== "true") {
    return { enabled: false, reason: "verified-free", model };
  }
  if (!readEnv("GEMINI_API_KEY")) {
    return { enabled: false, reason: "missing-api-key", model };
  }

  return { enabled: true, reason: "ready", model };
}

export function isVercelAiSdkTextRuntimeEnabled(): boolean {
  return getVercelAiSdkRuntimeReadiness().enabled;
}

export async function executeVercelAiSdkText(
  prompt: string,
): Promise<VercelAiSdkRuntimeOutput> {
  const apiKey = readEnv("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for the Vercel AI SDK runtime.");
  }
  if (readEnv("DHP_AI_SDK_VERIFIED_FREE") !== "true") {
    throw new Error(
      "Vercel AI SDK direct runtime requires an explicitly verified free quota.",
    );
  }
  if (readEnv("DHP_AI_ALLOW_PAID") === "true") {
    throw new Error("Paid model execution is blocked by the DHP AI SDK runtime.");
  }

  const model = getVercelAiSdkModel();
  const google = createGoogleGenerativeAI({
    apiKey,
    name: "dhp-google-generative-ai",
  });

  const result = await generateText({
    model: google(model),
    prompt,
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const outputText = result.text.trim();
  if (!outputText) {
    throw new Error("Vercel AI SDK returned an empty model response.");
  }

  return {
    outputText,
    provider: "google-generative-ai",
    model,
  };
}
