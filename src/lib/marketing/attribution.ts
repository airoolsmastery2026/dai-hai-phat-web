const ATTRIBUTION_STORAGE_KEY = "dhp-lead-attribution-v1";
export const ATTRIBUTION_COOKIE_NAME = "dhp_attribution_v1";
export const ATTRIBUTION_RETENTION_SECONDS = 30 * 24 * 60 * 60;
const ATTRIBUTION_RETENTION_MS = ATTRIBUTION_RETENTION_SECONDS * 1_000;
const MAX_VALUE_LENGTH = 160;

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type TrackingKey = (typeof TRACKING_KEYS)[number];

export interface LeadAttribution {
  firstTouchAt: string;
  landingPath: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

interface StoredAttribution extends LeadAttribution {
  expiresAt: number;
}

function clean(value: string | null, maxLength = MAX_VALUE_LENGTH): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, maxLength);
  return normalized || undefined;
}

function isStoredAttribution(value: unknown): value is StoredAttribution {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.firstTouchAt === "string" &&
    typeof record.landingPath === "string" &&
    typeof record.expiresAt === "number"
  );
}

function readStoredAttribution(storage: Storage, now = Date.now()): LeadAttribution | null {
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredAttribution(parsed) || parsed.expiresAt <= now) {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return null;
    }
    const { expiresAt: _expiresAt, ...attribution } = parsed;
    return attribution;
  } catch {
    return null;
  }
}

export function captureFirstTouchAttribution(
  location: Pick<Location, "pathname" | "search">,
  referrer: string,
  storage: Storage,
  now = Date.now(),
): LeadAttribution | null {
  const existing = readStoredAttribution(storage, now);
  if (existing) return existing;

  const params = new URLSearchParams(location.search);
  const values = Object.fromEntries(
    TRACKING_KEYS.map((key) => [key, clean(params.get(key))]),
  ) as Record<TrackingKey, string | undefined>;
  const cleanedReferrer = clean(referrer, 300);
  const hasCampaign = TRACKING_KEYS.some((key) => Boolean(values[key]));
  if (!hasCampaign && !cleanedReferrer) return null;

  const attribution: StoredAttribution = {
    firstTouchAt: new Date(now).toISOString(),
    landingPath: clean(location.pathname, 300) ?? "/",
    referrer: cleanedReferrer,
    utmSource: values.utm_source,
    utmMedium: values.utm_medium,
    utmCampaign: values.utm_campaign,
    utmContent: values.utm_content,
    utmTerm: values.utm_term,
    expiresAt: now + ATTRIBUTION_RETENTION_MS,
  };

  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    return attribution;
  }

  const { expiresAt: _expiresAt, ...result } = attribution;
  return result;
}

export function readLeadAttribution(storage: Storage): LeadAttribution | null {
  return readStoredAttribution(storage);
}

export function serializeLeadAttribution(attribution: LeadAttribution): string {
  return encodeURIComponent(JSON.stringify(attribution));
}

export function deserializeLeadAttribution(value: string | undefined): LeadAttribution | null {
  if (!value || value.length > 2_000) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as LeadAttribution;
  } catch {
    return null;
  }
}
