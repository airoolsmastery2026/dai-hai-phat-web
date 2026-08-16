export type HealthState = "operational" | "degraded";

export interface SystemHealthSnapshot {
  state: HealthState;
  checkedAt: string;
  services: {
    website: "operational";
    ai: "configured" | "not-configured";
    crm: "configured" | "not-configured";
    phoneVerification: "configured" | "not-configured";
    ecosystemApi: "configured" | "not-configured";
  };
}

function configured(value: string | undefined): "configured" | "not-configured" {
  return value?.trim() ? "configured" : "not-configured";
}

export function createSystemHealthSnapshot(
  env: NodeJS.ProcessEnv = process.env,
  now = new Date(),
): SystemHealthSnapshot {
  const services = {
    website: "operational" as const,
    ai: configured(env.GEMINI_API_KEY),
    crm: configured(env.CRM_WEBHOOK_URL),
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
