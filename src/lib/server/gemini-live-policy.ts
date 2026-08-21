import "server-only";

export type GeminiLiveReadinessReason =
  | "ready"
  | "live-disabled"
  | "verified-free"
  | "paid-execution-blocked"
  | "missing-api-key";

export interface GeminiLiveReadiness {
  enabled: boolean;
  reason: GeminiLiveReadinessReason;
}

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function getGeminiLiveReadiness(): GeminiLiveReadiness {
  if (readEnv("DHP_AI_LIVE_ENABLED") !== "true") {
    return { enabled: false, reason: "live-disabled" };
  }
  if (readEnv("DHP_AI_ALLOW_PAID") === "true") {
    return { enabled: false, reason: "paid-execution-blocked" };
  }
  if (readEnv("DHP_AI_LIVE_VERIFIED_FREE") !== "true") {
    return { enabled: false, reason: "verified-free" };
  }
  if (!readEnv("GEMINI_API_KEY")) {
    return { enabled: false, reason: "missing-api-key" };
  }

  return { enabled: true, reason: "ready" };
}

export function isGeminiLiveEnabled(): boolean {
  return getGeminiLiveReadiness().enabled;
}
