import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_VERSION = "v1";
const DEFAULT_MAX_AGE_SECONDS = 5 * 60;
const DEFAULT_FUTURE_SKEW_SECONDS = 60;

type WebhookVerificationCode =
  | "invalid_timestamp"
  | "stale"
  | "future_timestamp"
  | "invalid_signature";

export class WebhookVerificationError extends Error {
  readonly code: WebhookVerificationCode;

  constructor(code: WebhookVerificationCode) {
    super(code);
    this.name = "WebhookVerificationError";
    this.code = code;
  }
}

export interface WebhookVerificationOptions {
  nowSeconds?: number;
  maxAgeSeconds?: number;
  maxFutureSkewSeconds?: number;
}

export function createWebhookSignature(
  payload: string,
  timestamp: string,
  secret: string,
): string {
  return `${SIGNATURE_VERSION}=${createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex")}`;
}

export function verifyWebhookSignature(
  payload: string,
  timestamp: string,
  signature: string,
  secret: string,
  options: WebhookVerificationOptions = {},
): void {
  const timestampSeconds = Number(timestamp);
  if (!Number.isSafeInteger(timestampSeconds) || timestampSeconds <= 0) {
    throw new WebhookVerificationError("invalid_timestamp");
  }

  const nowSeconds = Math.floor(options.nowSeconds ?? Date.now() / 1_000);
  const maxAgeSeconds = options.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS;
  const maxFutureSkewSeconds =
    options.maxFutureSkewSeconds ?? DEFAULT_FUTURE_SKEW_SECONDS;

  if (nowSeconds - timestampSeconds > maxAgeSeconds) {
    throw new WebhookVerificationError("stale");
  }
  if (timestampSeconds - nowSeconds > maxFutureSkewSeconds) {
    throw new WebhookVerificationError("future_timestamp");
  }

  const expected = createWebhookSignature(payload, timestamp, secret);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature.trim(), "utf8");
  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new WebhookVerificationError("invalid_signature");
  }
}
