export type HealthState = "operational" | "degraded";

type ConfigurationState = "configured" | "not-configured";

export interface SystemHealthSnapshot {
  state: HealthState;
  checkedAt: string;
  services: {
    website: "operational";
    ai: ConfigurationState;
    crm: ConfigurationState;
    phoneVerification: ConfigurationState;
    ecosystemApi: ConfigurationState;
  };
}

function configured(value: string | undefined): ConfigurationState {
  return value?.trim() ? "configured" : "not-configured";
}

function configuredHttpsWebhook(
  url: string | undefined,
  token: string | undefined,
): ConfigurationState {
  const normalizedUrl = url?.trim();
  const normalizedToken = token?.trim();
  if (!normalizedUrl || !normalizedToken) return "not-configured";

  try {
    return new URL(normalizedUrl).protocol === "https:"
      ? "configured"
      : "not-configured";
  } catch {
    return "not-configured";
  }
}

export function createSystemHealthSnapshot(
  env: NodeJS.ProcessEnv = process.env,
  now = new Date(),
): SystemHealthSnapshot {
  const services = {
    website: "operational" as const,
    ai: configured(env.GEMINI_API_KEY),
    crm: configuredHttpsWebhook(env.CRM_WEBHOOK_URL, env.CRM_WEBHOOK_TOKEN),
    phoneVerification: configured(env.APILAYER_API_KEY),
    ecosystemApi: configured(env.ECOSYSTEM_SERVICE_API_KEY),
  };

  return {
    state:
      services.ai === "configured" &&
      services.crm === "configured" &&
      services.phoneVerification === "configured"
        ? "operational"
        : "degraded",
    checkedAt: now.toISOString(),
    services,
  };
}
