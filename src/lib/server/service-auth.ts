import { timingSafeEqual } from "node:crypto";

export type EcosystemService =
  | "publishing-bot"
  | "telegram-control"
  | "monitoring"
  | "goose-desktop";

export interface ServicePrincipal {
  service: EcosystemService;
}

export class ServiceAuthenticationError extends Error {
  constructor(readonly code: "not_configured" | "unauthorized" | "forbidden") {
    super(code);
  }
}

const SERVICE_HEADER = "x-dhp-source-service";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function readBearerToken(headers: Headers): string | null {
  const authorization = headers.get("authorization")?.trim();
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

export function authenticateService(
  headers: Headers,
  allowedServices: readonly EcosystemService[],
): ServicePrincipal {
  const configuredToken = process.env.ECOSYSTEM_SERVICE_API_KEY?.trim();
  if (!configuredToken) {
    throw new ServiceAuthenticationError("not_configured");
  }

  const service = headers.get(SERVICE_HEADER)?.trim() as EcosystemService | undefined;
  const token = readBearerToken(headers);
  if (!service || !token || !safeEqual(token, configuredToken)) {
    throw new ServiceAuthenticationError("unauthorized");
  }
  if (!allowedServices.includes(service)) {
    throw new ServiceAuthenticationError("forbidden");
  }

  return { service };
}
