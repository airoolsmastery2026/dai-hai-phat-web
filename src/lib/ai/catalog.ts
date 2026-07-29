import galleryData from "../../../public/images/gallery.json";
import pricingData from "../../../knowledge/pricing.json";

export type CatalogAssetType =
  | "project"
  | "reference"
  | "technical"
  | "material"
  | "brand";

interface CatalogImage {
  publicUrl?: string;
  width: number;
  height: number;
}

export interface CatalogAsset {
  id: string;
  title: string;
  alt: string;
  caption: string;
  category: string;
  assetType: CatalogAssetType;
  material?: string;
  style?: string;
  projectType?: string;
  service?: string;
  seo: {
    keywords: string[];
  };
  original: {
    publicUrl?: string;
  };
  image: CatalogImage;
  thumbnail: CatalogImage;
  blurDataUrl: string;
}

interface AssetCatalog {
  schemaVersion: "1.1";
  items: CatalogAsset[];
}

interface PriceRange {
  min: number;
  max: number;
}

export interface PriceReference {
  id: string;
  service: string;
  category: string;
  material: string;
  unit: string;
  range: PriceRange;
  variants?: Array<{
    label: string;
    amount: number;
  }>;
  referenceConditions?: string[];
  requiredInputs: string[];
  sourceIds: string[];
  eligibleForProposal?: boolean;
  status?: string;
}

interface PricingCatalog {
  schemaVersion: "1.0";
  currency: "VND";
  rules: {
    message: string;
  };
  items: PriceReference[];
}

export interface AssetSearchQuery {
  service?: string;
  category?: string;
  material?: string;
  style?: string;
  projectType?: string;
  keywords?: string[];
  assetTypes?: CatalogAssetType[];
  limit?: number;
}

export interface AssetSearchMatch {
  score: number;
  asset: CatalogAsset;
}

export interface PriceSearchQuery {
  service: string;
  category?: string;
  material?: string;
  dimensions?: string;
  includeRevalidationRequired?: boolean;
  limit?: number;
}

export interface PriceSearchMatch {
  score: number;
  readyForRange: boolean;
  missing: string[];
  reference: PriceReference;
}

export interface ProposalEvidence {
  images: AssetSearchMatch[];
  prices: PriceSearchMatch[];
  canShowCostRange: boolean;
  pricingRule: string;
}

export interface ProposalEvidenceRequest {
  service: string;
  category?: string;
  material?: string;
  style?: string;
  projectType?: string;
  dimensions?: string;
  keywords?: string[];
  limit?: number;
}

export interface ProposalEvidenceImage {
  id: string;
  title: string;
  alt: string;
  caption: string;
  category: string;
  material?: string;
  style?: string;
  projectType?: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  blurDataUrl: string;
}

export interface ProposalEvidencePrice {
  id: string;
  material: string;
  unit: string;
  min: number;
  max: number;
  conditions: string[];
}

export interface ProposalEvidenceResponse {
  images: ProposalEvidenceImage[];
  materials: string[];
  prices: ProposalEvidencePrice[];
  canShowCostRange: boolean;
  pricingRule: string;
}

export interface VerifiedGalleryRequest {
  search?: string;
  service?: string;
  category?: string;
  material?: string;
  style?: string;
  projectType?: string;
  cursor?: number;
  limit: number;
}

export interface VerifiedGalleryItem {
  id: string;
  title: string;
  alt: string;
  caption: string;
  service?: string;
  category: string;
  material?: string;
  style?: string;
  projectType?: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  blurDataUrl: string;
}

export interface VerifiedGalleryFilters {
  services: string[];
  categories: string[];
  materials: string[];
  styles: string[];
  projectTypes: string[];
}

export interface VerifiedGalleryResponse {
  items: VerifiedGalleryItem[];
  total: number;
  nextCursor: string | null;
  filters: VerifiedGalleryFilters;
}

export class ProposalEvidenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProposalEvidenceValidationError";
  }
}

const assetCatalog = galleryData as unknown as AssetCatalog;
const priceCatalog = pricingData as unknown as PricingCatalog;

const ALIASES: Record<string, string> = {
  gate: "cua cong",
  gates: "cua cong",
  stair: "cau thang",
  stairs: "cau thang",
  railing: "lan can",
  railings: "lan can",
  canopy: "mai che",
  canopies: "mai che",
  interior: "noi that",
  factory: "gia cong tai xuong",
  material: "vat lieu",
  materials: "vat lieu",
  "sat hoac thep": "kim loai",
  "go hoac mdf": "mdf",
  "nhom kinh": "nhom",
};

function normalize(value?: string): string {
  if (!value) return "";
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return ALIASES[normalized] ?? normalized;
}

function boundedLimit(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(Math.trunc(value ?? fallback), 20));
}

function readRequestText(
  record: Record<string, unknown>,
  field: keyof ProposalEvidenceRequest,
  required = false,
): string | undefined {
  const value = record[field];
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new ProposalEvidenceValidationError(`Thiếu trường ${field}.`);
    }
    return undefined;
  }
  if (typeof value !== "string") {
    throw new ProposalEvidenceValidationError(`Trường ${field} không đúng định dạng.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > 120 || /[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new ProposalEvidenceValidationError(`Trường ${field} không hợp lệ.`);
  }
  return normalized;
}

export function parseProposalEvidenceRequest(value: unknown): ProposalEvidenceRequest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ProposalEvidenceValidationError("Dữ liệu yêu cầu không hợp lệ.");
  }

  const record = value as Record<string, unknown>;
  const rawKeywords = record.keywords;
  if (
    rawKeywords !== undefined &&
    (!Array.isArray(rawKeywords) ||
      rawKeywords.length > 5 ||
      rawKeywords.some(
        (keyword) =>
          typeof keyword !== "string" ||
          !keyword.trim() ||
          keyword.trim().length > 80 ||
          /[\u0000-\u001f\u007f]/.test(keyword),
      ))
  ) {
    throw new ProposalEvidenceValidationError("Từ khóa tìm kiếm không hợp lệ.");
  }

  const rawLimit = record.limit;
  if (
    rawLimit !== undefined &&
    (typeof rawLimit !== "number" ||
      !Number.isInteger(rawLimit) ||
      rawLimit < 1 ||
      rawLimit > 10)
  ) {
    throw new ProposalEvidenceValidationError("Giới hạn kết quả không hợp lệ.");
  }

  return {
    service: readRequestText(record, "service", true) as string,
    category: readRequestText(record, "category"),
    material: readRequestText(record, "material"),
    style: readRequestText(record, "style"),
    projectType: readRequestText(record, "projectType"),
    dimensions: readRequestText(record, "dimensions"),
    keywords: Array.isArray(rawKeywords)
      ? rawKeywords.map((keyword) => (keyword as string).trim())
      : undefined,
    limit: rawLimit as number | undefined,
  };
}

function readGalleryParameter(
  searchParams: URLSearchParams,
  field: Exclude<keyof VerifiedGalleryRequest, "cursor" | "limit">,
): string | undefined {
  const value = searchParams.get(field)?.trim();
  if (!value) return undefined;
  if (value.length > 120 || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new ProposalEvidenceValidationError(`Bộ lọc ${field} không hợp lệ.`);
  }
  return value;
}

export function parseVerifiedGalleryRequest(
  searchParams: URLSearchParams,
): VerifiedGalleryRequest {
  const rawCursor = searchParams.get("cursor");
  const rawLimit = searchParams.get("limit");
  const cursor = rawCursor === null ? undefined : Number(rawCursor);
  const limit = rawLimit === null ? 12 : Number(rawLimit);

  if (
    (cursor !== undefined &&
      (!Number.isInteger(cursor) || cursor < 0 || cursor > 10_000)) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 12
  ) {
    throw new ProposalEvidenceValidationError("Phân trang thư viện không hợp lệ.");
  }

  return {
    search: readGalleryParameter(searchParams, "search"),
    service: readGalleryParameter(searchParams, "service"),
    category: readGalleryParameter(searchParams, "category"),
    material: readGalleryParameter(searchParams, "material"),
    style: readGalleryParameter(searchParams, "style"),
    projectType: readGalleryParameter(searchParams, "projectType"),
    cursor,
    limit,
  };
}

function fieldScore(
  expected: string | undefined,
  actual: string | undefined,
  exact: number,
  partial: number,
): number {
  const normalizedExpected = normalize(expected);
  const normalizedActual = normalize(actual);
  if (!normalizedExpected || !normalizedActual) return 0;
  if (normalizedExpected === normalizedActual) return exact;
  return normalizedActual.includes(normalizedExpected) ||
    normalizedExpected.includes(normalizedActual)
    ? partial
    : 0;
}

function keywordScore(query: string[], asset: CatalogAsset): number {
  const haystack = normalize(
    [
      asset.title,
      asset.caption,
      asset.category,
      asset.service,
      asset.material,
      asset.style,
      asset.projectType,
      ...asset.seo.keywords,
    ]
      .filter(Boolean)
      .join(" "),
  );
  return query.reduce(
    (score, keyword) => score + (haystack.includes(normalize(keyword)) ? 6 : 0),
    0,
  );
}

export function searchProjectAssets(
  query: AssetSearchQuery,
): AssetSearchMatch[] {
  const allowedTypes = new Set<CatalogAssetType>(
    query.assetTypes?.length ? query.assetTypes : ["project"],
  );
  const keywords = query.keywords?.filter((keyword) => normalize(keyword)) ?? [];
  const hasQuery = Boolean(
    query.service ||
      query.category ||
      query.material ||
      query.style ||
      query.projectType ||
      keywords.length,
  );

  if (!hasQuery) return [];

  return assetCatalog.items
    .filter(
      (asset) =>
        allowedTypes.has(asset.assetType) &&
        Boolean(asset.image.publicUrl) &&
        Boolean(asset.thumbnail.publicUrl),
    )
    .map((asset) => {
      const score =
        fieldScore(query.service, asset.service, 80, 45) +
        fieldScore(query.category, asset.category, 65, 35) +
        fieldScore(query.material, asset.material, 35, 18) +
        fieldScore(query.style, asset.style, 25, 12) +
        fieldScore(query.projectType, asset.projectType, 20, 10) +
        keywordScore(keywords, asset);
      return { score, asset };
    })
    .filter((match) => match.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.asset.id.localeCompare(right.asset.id, "vi"),
    )
    .slice(0, boundedLimit(query.limit, 10));
}

export function findPriceReferences(
  query: PriceSearchQuery,
): PriceSearchMatch[] {
  const normalizedMaterial = normalize(query.material);
  const hasConfirmedCategory = Boolean(normalize(query.category));
  const hasConfirmedMaterial =
    Boolean(normalizedMaterial) &&
    normalizedMaterial !== normalize("Cần kỹ sư xác định");
  const hasConfirmedDimensions =
    Boolean(query.dimensions?.trim()) &&
    query.dimensions !== "Cần khảo sát đo đạc" &&
    /\d/.test(query.dimensions ?? "");

  return priceCatalog.items
    .filter(
      (reference) =>
        query.includeRevalidationRequired ||
        reference.eligibleForProposal !== false,
    )
    .filter(
      (reference) =>
        fieldScore(query.service, reference.service, 1, 1) > 0,
    )
    .filter(
      (reference) =>
        !hasConfirmedCategory ||
        fieldScore(query.category, reference.category, 1, 1) > 0,
    )
    .filter(
      (reference) =>
        !hasConfirmedMaterial ||
        fieldScore(query.material, reference.material, 1, 1) > 0,
    )
    .map((reference) => {
      const score =
        fieldScore(query.service, reference.service, 80, 45) +
        fieldScore(query.category, reference.category, 60, 30) +
        fieldScore(query.material, reference.material, 30, 15);
      const missing = [
        !hasConfirmedCategory && "hạng mục chi tiết",
        !hasConfirmedDimensions && "kích thước",
        !hasConfirmedMaterial && "vật liệu",
      ].filter((value): value is string => Boolean(value));
      return {
        score,
        readyForRange:
          score > 0 &&
          missing.length === 0 &&
          reference.eligibleForProposal !== false,
        missing,
        reference,
      };
    })
    .filter((match) => match.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.reference.id.localeCompare(right.reference.id, "vi"),
    )
    .slice(0, boundedLimit(query.limit, 5));
}

export function buildProposalEvidence(
  query: AssetSearchQuery & {
    dimensions?: string;
    includeRevalidationRequired?: boolean;
  },
): ProposalEvidence {
  const images = searchProjectAssets(query);
  const prices = query.service
    ? findPriceReferences({
        service: query.service,
        category: query.category,
        material: query.material,
        dimensions: query.dimensions,
        includeRevalidationRequired: query.includeRevalidationRequired,
      })
    : [];

  return {
    images,
    prices,
    canShowCostRange: prices.some((match) => match.readyForRange),
    pricingRule: priceCatalog.rules.message,
  };
}

export function buildProposalEvidenceResponse(
  query: ProposalEvidenceRequest,
): ProposalEvidenceResponse {
  const evidence = buildProposalEvidence(query);
  const images = evidence.images
    .filter(
      ({ asset }) =>
        asset.image.publicUrl?.startsWith("/images/") &&
        asset.thumbnail.publicUrl?.startsWith("/images/"),
    )
    .map(({ asset }) => ({
      id: asset.id,
      title: asset.title,
      alt: asset.alt,
      caption: asset.caption,
      category: asset.category,
      material: asset.material,
      style: asset.style,
      projectType: asset.projectType,
      image: {
        url: asset.image.publicUrl as string,
        width: asset.image.width,
        height: asset.image.height,
      },
      thumbnail: {
        url: asset.thumbnail.publicUrl as string,
        width: asset.thumbnail.width,
        height: asset.thumbnail.height,
      },
      blurDataUrl: asset.blurDataUrl,
    }));
  const prices = evidence.prices
    .filter(({ readyForRange }) => readyForRange)
    .slice(0, 2)
    .map(({ reference }) => ({
      id: reference.id,
      material: reference.material,
      unit: reference.unit,
      min: reference.range.min,
      max: reference.range.max,
      conditions: reference.referenceConditions?.slice(0, 4) ?? [],
    }));
  const materials = Array.from(
    new Set(
      [
        ...images.map((image) => image.material),
        ...evidence.prices.map(({ reference }) => reference.material),
      ].filter((material): material is string => Boolean(material)),
    ),
  ).slice(0, 6);

  return {
    images,
    materials,
    prices,
    canShowCostRange: prices.length > 0,
    pricingRule: evidence.pricingRule,
  };
}

function uniqueSorted(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort(
    (left, right) => left.localeCompare(right, "vi"),
  );
}

export function listVerifiedGallery(
  query: VerifiedGalleryRequest,
): VerifiedGalleryResponse {
  const publishedProjects = assetCatalog.items
    .filter(
      (asset) =>
        asset.assetType === "project" &&
        asset.thumbnail.publicUrl?.startsWith("/images/"),
    )
    .sort((left, right) => left.id.localeCompare(right.id, "vi"));
  const filters: VerifiedGalleryFilters = {
    services: uniqueSorted(publishedProjects.map((asset) => asset.service)),
    categories: uniqueSorted(publishedProjects.map((asset) => asset.category)),
    materials: uniqueSorted(publishedProjects.map((asset) => asset.material)),
    styles: uniqueSorted(publishedProjects.map((asset) => asset.style)),
    projectTypes: uniqueSorted(publishedProjects.map((asset) => asset.projectType)),
  };
  const normalizedSearch = normalize(query.search);
  const matchesFilter = (
    expected: string | undefined,
    actual: string | undefined,
  ) => !expected || normalize(expected) === normalize(actual);
  const filtered = publishedProjects.filter((asset) => {
    if (!matchesFilter(query.service, asset.service)) return false;
    if (!matchesFilter(query.category, asset.category)) return false;
    if (!matchesFilter(query.material, asset.material)) return false;
    if (!matchesFilter(query.style, asset.style)) return false;
    if (!matchesFilter(query.projectType, asset.projectType)) return false;
    if (!normalizedSearch) return true;

    return normalize(
      [
        asset.title,
        asset.alt,
        asset.caption,
        asset.service,
        asset.category,
        asset.material,
        asset.style,
        asset.projectType,
        ...asset.seo.keywords,
      ]
        .filter(Boolean)
        .join(" "),
    ).includes(normalizedSearch);
  });
  const start = Math.min(query.cursor ?? 0, filtered.length);
  const end = Math.min(start + query.limit, filtered.length);
  const items = filtered.slice(start, end).map((asset) => ({
    id: asset.id,
    title: asset.title,
    alt: asset.alt,
    caption: asset.caption,
    service: asset.service,
    category: asset.category,
    material: asset.material,
    style: asset.style,
    projectType: asset.projectType,
    thumbnail: {
      url: asset.thumbnail.publicUrl as string,
      width: asset.thumbnail.width,
      height: asset.thumbnail.height,
    },
    blurDataUrl: asset.blurDataUrl,
  }));

  return {
    items,
    total: filtered.length,
    nextCursor: end < filtered.length ? String(end) : null,
    filters,
  };
}
