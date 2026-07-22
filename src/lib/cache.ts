const cacheStore = new Map<string, { expiresAt: number; value: unknown }>();

export function getCached<T>(key: string, factory: () => T, ttlMs = 60_000): T {
  const cached = cacheStore.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const value = factory();
  cacheStore.set(key, { expiresAt: now + ttlMs, value });
  return value;
}
