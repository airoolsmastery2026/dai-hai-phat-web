import { resolve4, resolve6, resolveMx } from "node:dns/promises";

const DNS_TIMEOUT_MS = 2_500;

export type EmailDomainVerificationStatus = "verified" | "invalid" | "unverified";

export interface EmailDomainVerificationResult {
  status: EmailDomainVerificationStatus;
  domain: string;
  method?: "mx" | "a" | "aaaa";
  reason?: "timeout" | "dns_error";
}

function extractDomain(email: string): string | null {
  const separator = email.lastIndexOf("@");
  if (separator <= 0 || separator === email.length - 1) return null;
  const domain = email.slice(separator + 1).trim().toLowerCase();
  if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(domain)) return null;
  return domain;
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), DNS_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function isMissingDnsRecord(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  return code === "ENODATA" || code === "ENOTFOUND";
}

export async function verifyEmailDomain(email: string): Promise<EmailDomainVerificationResult> {
  const domain = extractDomain(email);
  if (!domain) return { status: "invalid", domain: "" };

  try {
    const mx = await withTimeout(resolveMx(domain));
    if (mx.some((record) => record.exchange && record.exchange !== ".")) {
      return { status: "verified", domain, method: "mx" };
    }
    if (mx.some((record) => record.exchange === ".")) {
      return { status: "invalid", domain };
    }
  } catch (error) {
    if (error instanceof Error && error.message === "DNS_TIMEOUT") {
      return { status: "unverified", domain, reason: "timeout" };
    }
    if (!isMissingDnsRecord(error)) {
      return { status: "unverified", domain, reason: "dns_error" };
    }
  }

  try {
    const addresses = await withTimeout(resolve4(domain));
    if (addresses.length > 0) return { status: "verified", domain, method: "a" };
  } catch (error) {
    if (error instanceof Error && error.message === "DNS_TIMEOUT") {
      return { status: "unverified", domain, reason: "timeout" };
    }
    if (!isMissingDnsRecord(error)) {
      return { status: "unverified", domain, reason: "dns_error" };
    }
  }

  try {
    const addresses = await withTimeout(resolve6(domain));
    if (addresses.length > 0) return { status: "verified", domain, method: "aaaa" };
  } catch (error) {
    if (error instanceof Error && error.message === "DNS_TIMEOUT") {
      return { status: "unverified", domain, reason: "timeout" };
    }
    if (!isMissingDnsRecord(error)) {
      return { status: "unverified", domain, reason: "dns_error" };
    }
  }

  return { status: "invalid", domain };
}
