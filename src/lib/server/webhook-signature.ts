import { createHmac } from "node:crypto";

const SIGNATURE_VERSION = "v1";

export function createWebhookSignature(
  payload: string,
  timestamp: string,
  secret: string,
): string {
  return `${SIGNATURE_VERSION}=${createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex")}`;
}
