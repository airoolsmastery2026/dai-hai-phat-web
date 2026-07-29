import {
  listVerifiedGallery,
  type VerifiedGalleryItem,
  type VerifiedGalleryRequest,
  type VerifiedGalleryResponse,
} from "@/lib/ai/catalog";

const PUBLIC_SERVICES = new Set([
  "Cầu thang và lan can",
  "Cửa cổng",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
]);

const PUBLIC_PROJECT_TYPE = "Nhà ở";
const CATALOG_PAGE_SIZE = 12;

function normalize(value?: string): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function collectVerifiedProjects(): VerifiedGalleryItem[] {
  const items: VerifiedGalleryItem[] = [];
  let cursor: number | undefined;

  do {
    const page = listVerifiedGallery({
      cursor,
      limit: CATALOG_PAGE_SIZE,
    });
    items.push(...page.items);
    cursor = page.nextCursor ? Number(page.nextCursor) : undefined;
  } while (cursor !== undefined);

  return items.filter(
    (item) =>
      Boolean(item.service && PUBLIC_SERVICES.has(item.service)) &&
      item.projectType === PUBLIC_PROJECT_TYPE,
  );
}

const PUBLIC_PROJECTS = collectVerifiedProjects();

function uniqueSorted(values: Array<string | undefined>): string[] {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).sort((left, right) => left.localeCompare(right, "vi"));
}

function matchesExact(expected: string | undefined, actual: string | undefined) {
  return !expected || normalize(expected) === normalize(actual);
}

export function listPublicResidentialGallery(
  query: VerifiedGalleryRequest,
): VerifiedGalleryResponse {
  const normalizedSearch = normalize(query.search);
  const filtered = PUBLIC_PROJECTS.filter((item) => {
    if (!matchesExact(query.service, item.service)) return false;
    if (!matchesExact(query.category, item.category)) return false;
    if (!matchesExact(query.material, item.material)) return false;
    if (!matchesExact(query.style, item.style)) return false;
    if (!matchesExact(query.projectType, item.projectType)) return false;
    if (!normalizedSearch) return true;

    return normalize(
      [
        item.title,
        item.alt,
        item.caption,
        item.service,
        item.category,
        item.material,
        item.style,
        item.projectType,
      ]
        .filter(Boolean)
        .join(" "),
    ).includes(normalizedSearch);
  });
  const start = Math.min(query.cursor ?? 0, filtered.length);
  const end = Math.min(start + query.limit, filtered.length);

  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    nextCursor: end < filtered.length ? String(end) : null,
    filters: {
      services: uniqueSorted(PUBLIC_PROJECTS.map((item) => item.service)),
      categories: uniqueSorted(PUBLIC_PROJECTS.map((item) => item.category)),
      materials: uniqueSorted(PUBLIC_PROJECTS.map((item) => item.material)),
      styles: uniqueSorted(PUBLIC_PROJECTS.map((item) => item.style)),
      projectTypes: uniqueSorted(PUBLIC_PROJECTS.map((item) => item.projectType)),
    },
  };
}
