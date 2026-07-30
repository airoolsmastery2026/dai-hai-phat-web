import type { AIService } from "@/lib/ai/service-domain";

const NO_SERVICE_PRESET_KEY = "service:none";

export function getAIOfficeSessionKey(servicePreset: AIService | null): string {
  return servicePreset ? `service:${servicePreset}` : NO_SERVICE_PRESET_KEY;
}
