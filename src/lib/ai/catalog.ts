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

  return priceCatalog.items
    .filter(
      (reference) =>
        query.includeRevalidationRequired ||
        reference.eligibleForProposal !== false,
    )
    .map((reference) => {
      const score =
        fieldScore(query.service, reference.service, 80, 45) +
        fieldScore(query.category, reference.category, 60, 30) +
        fieldScore(query.material, reference.material, 30, 15);
      const missing = [
        !query.dimensions?.trim() && "kích thước",
        !normalizedMaterial && "vật liệu",
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
