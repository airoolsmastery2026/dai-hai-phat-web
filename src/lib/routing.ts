const LEGACY_TO_PUBLIC_SLUG: Record<string, string> = {
  "noi-that-gỗ-mdf-melamine": "noi-that-go-mdf-melamine",
};

const PUBLIC_TO_LEGACY_SLUG = Object.fromEntries(
  Object.entries(LEGACY_TO_PUBLIC_SLUG).map(([legacySlug, publicSlug]) => [
    publicSlug,
    legacySlug,
  ]),
) as Record<string, string>;

function decodeRouteSlug(value: string): string {
  try {
    return decodeURIComponent(value).normalize("NFC");
  } catch {
    return value.normalize("NFC");
  }
}

export function normalizeRouteSlug(value: string): string {
  const normalized = decodeRouteSlug(value);
  return PUBLIC_TO_LEGACY_SLUG[normalized] ?? normalized;
}

export function getPublicRouteSlug(value: string): string {
  const normalized = decodeRouteSlug(value);
  return LEGACY_TO_PUBLIC_SLUG[normalized] ?? normalized;
}
