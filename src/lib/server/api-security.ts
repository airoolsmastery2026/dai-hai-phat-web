const MAX_RATE_LIMIT_KEYS = 1_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitPolicy {
  maxRequests: number;
  windowMs: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

export function getRequestClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return headers.get("x-real-ip")?.trim() || forwarded || "anonymous";
}

export function isSameOriginRequest(headers: Headers, requestHost: string): boolean {
  if (headers.get("sec-fetch-site") === "cross-site") return false;

  const origin = headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export function consumeRateLimit(
  scope: string,
  clientKey: string,
  policy: RateLimitPolicy,
  now = Date.now(),
) {
  let storageKey = `${scope}:${clientKey}`;
  if (rateLimits.size >= MAX_RATE_LIMIT_KEYS && !rateLimits.has(storageKey)) {
    rateLimits.forEach((entry, key) => {
      if (entry.resetAt <= now) rateLimits.delete(key);
    });
    if (rateLimits.size >= MAX_RATE_LIMIT_KEYS) {
      storageKey = `${scope}:overflow`;
    }
  }

  const existing = rateLimits.get(storageKey);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(storageKey, {
      count: 1,
      resetAt: now + policy.windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= policy.maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
