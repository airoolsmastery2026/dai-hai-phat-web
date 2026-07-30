import { getAIService, type AIService } from "@/lib/ai/service-domain";

export const CONVERSION_EVENT_CHANNEL = "dhp:conversion";

export type AnalyticsServicePreset = AIService;

export type ConversionEventName =
  | "ai_intake_opened"
  | "service_preset_selected"
  | "ai_step_completed"
  | "ai_intake_completed"
  | "intake_abandoned"
  | "handoff_consent_given"
  | "crm_handoff_started"
  | "crm_handoff_succeeded"
  | "crm_handoff_failed"
  | "zalo_clicked"
  | "phone_clicked";

export interface ConversionEventProperties {
  sourcePath: string;
  service?: AnalyticsServicePreset;
}

export interface ConversionEventDetail {
  name: ConversionEventName;
  properties: ConversionEventProperties;
  occurredAt: string;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function normalizePath(pathname: string) {
  if (!pathname.startsWith("/")) return "/";
  return pathname.slice(0, 160);
}

export function getAnalyticsServicePreset(
  value: string | null,
): AnalyticsServicePreset | undefined {
  return getAIService(value) ?? undefined;
}

export function trackConversionEvent(
  name: ConversionEventName,
  properties: ConversionEventProperties,
) {
  if (typeof window === "undefined") return;

  const detail: ConversionEventDetail = {
    name,
    properties: {
      sourcePath: normalizePath(properties.sourcePath),
      ...(properties.service ? { service: properties.service } : {}),
    },
    occurredAt: new Date().toISOString(),
  };

  try {
    window.dispatchEvent(
      new CustomEvent<ConversionEventDetail>(CONVERSION_EVENT_CHANNEL, {
        detail,
      }),
    );

    window.dataLayer?.push({
      event: name,
      source_path: detail.properties.sourcePath,
      ...(detail.properties.service
        ? { service: detail.properties.service }
        : {}),
    });
  } catch {
    // Analytics must never interrupt navigation or the AI intake.
  }
}
