import { timingSafeEqual } from "node:crypto";

export type EcosystemService =
  | "publishing-bot"
  | "telegram-control"
  | "monitoring"
  | "goose-desktop";

export interface ServicePrincipal {
  service: EcosystemService;
}

type ServiceAuthenticationErrorCode =
  | "not_configured"
  | "unauthorized"
  | "forbidden";

export class ServiceAuthenticationError extends Error {
  readonly code: ServiceAuthenticationErrorCode;

  constructor(code: ServiceAuthenticationErrorCode) {
    super(code);
    this.code = code;
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

function configuredTokenForService(service: EcosystemService): string | null {
  const value =
    service === "goose-desktop"
      ? process.env.GOOSE_DESKTOP_SERVICE_API_KEY
      : process.env.ECOSYSTEM_SERVICE_API_KEY;
  return value?.trim() || null;
}

export function authenticateService(
  headers: Headers,
  allowedServices: readonly EcosystemService[],
): ServicePrincipal {
  const service = headers.get(SERVICE_HEADER)?.trim() as EcosystemService | undefined;
  if (!service) {
    throw new ServiceAuthenticationError("unauthorized");
  }
  if (!allowedServices.includes(service)) {
    throw new ServiceAuthenticationError("forbidden");
  }

  const configuredToken = configuredTokenForService(service);
  if (!configuredToken) {
    throw new ServiceAuthenticationError("not_configured");
  }

  const token = readBearerToken(headers);
  if (!token || !safeEqual(token, configuredToken)) {
    throw new ServiceAuthenticationError("unauthorized");
  }

  return { service };
}
