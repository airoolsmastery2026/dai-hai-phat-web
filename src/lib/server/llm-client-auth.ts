import { timingSafeEqual } from "node:crypto";

export class LlmClientAuthenticationError extends Error {
  constructor(readonly code: "not_configured" | "unauthorized") {
    super(code);
    this.name = "LlmClientAuthenticationError";
  }
}

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

export function authenticateLlmClient(headers: Headers): void {
  const configuredToken = process.env.DHP_LLM_API_KEY?.trim();
  if (!configuredToken) {
    throw new LlmClientAuthenticationError("not_configured");
  }

  const token = readBearerToken(headers);
  if (!token || !safeEqual(token, configuredToken)) {
    throw new LlmClientAuthenticationError("unauthorized");
  }
}
