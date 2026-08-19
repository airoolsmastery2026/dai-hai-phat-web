const SPACE_CONFIRMATION_KEY_DOMAIN = "dhp-space-confirmation-v1";
const MIN_TRUST_ROOT_CHARS = 32;

async function sha256Hex(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getSpaceConfirmationSealKey(): Promise<string | null> {
  const dedicated = process.env.DHP_SPACE_CONFIRMATION_SECRET?.trim();
  const trustRoot = dedicated || process.env.DHP_CONTROL_PLANE_SECRET?.trim();
  if (!trustRoot || trustRoot.length < MIN_TRUST_ROOT_CHARS) return null;

  // Domain separation means the source credential is never used directly as
  // an HMAC key and this derived key is scoped to Space confirmation only.
  return sha256Hex(`${SPACE_CONFIRMATION_KEY_DOMAIN}\u0000${trustRoot}`);
}
