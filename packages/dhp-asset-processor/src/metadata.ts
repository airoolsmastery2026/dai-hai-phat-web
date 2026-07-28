import { readFile } from "node:fs/promises";

import type {
  AssetIssue,
  AssetMetadata,
  LoadedMetadata,
  ScannedAsset,
} from "./types.js";
import { ASSET_TYPES, type AssetType } from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(
  record: Record<string, unknown>,
  field: string,
  issues: AssetIssue[],
  asset: ScannedAsset,
): string {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({
      code: "METADATA_REQUIRED_FIELD",
      message: `Metadata field "${field}" must be a non-empty string`,
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
    return "";
  }

  return value.trim();
}

function readOptionalString(
  record: Record<string, unknown>,
  field: string,
): string | undefined {
  const value = record[field];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readAssetType(
  record: Record<string, unknown>,
  issues: AssetIssue[],
  asset: ScannedAsset,
): AssetType {
  const value = record.assetType;
  if (
    typeof value !== "string" ||
    !ASSET_TYPES.includes(value as AssetType)
  ) {
    issues.push({
      code: "METADATA_ASSET_TYPE_REQUIRED",
      message: `Metadata field "assetType" must be one of: ${ASSET_TYPES.join(", ")}`,
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
    return "reference";
  }
  return value as AssetType;
}

function parseMetadata(value: unknown, asset: ScannedAsset): LoadedMetadata {
  const issues: AssetIssue[] = [];

  if (!isRecord(value)) {
    return {
      issues: [
        {
          code: "METADATA_INVALID",
          message: "Metadata must be a JSON object",
          severity: "error",
          assetPath: asset.relativePath,
          metadataPath: asset.metadataPath,
        },
      ],
    };
  }

  const sourceValue = value.source;
  const seoValue = value.seo;
  if (!isRecord(sourceValue)) {
    issues.push({
      code: "METADATA_SOURCE_REQUIRED",
      message: 'Metadata field "source" must be an object',
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
  }
  if (!isRecord(seoValue)) {
    issues.push({
      code: "METADATA_SEO_REQUIRED",
      message: 'Metadata field "seo" must be an object',
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
  }

  const source = isRecord(sourceValue) ? sourceValue : {};
  const seo = isRecord(seoValue) ? seoValue : {};
  const keywords = seo.keywords;
  const verified = source.verified;

  if (
    !Array.isArray(keywords) ||
    keywords.length === 0 ||
    keywords.some((keyword) => typeof keyword !== "string" || !keyword.trim())
  ) {
    issues.push({
      code: "METADATA_SEO_KEYWORDS_REQUIRED",
      message: 'Metadata field "seo.keywords" must contain verified keywords',
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
  }

  if (verified !== true) {
    issues.push({
      code: "METADATA_SOURCE_UNVERIFIED",
      message: 'Metadata field "source.verified" must be true',
      severity: "error",
      assetPath: asset.relativePath,
      metadataPath: asset.metadataPath,
    });
  }

  const metadata: AssetMetadata = {
    title: readRequiredString(value, "title", issues, asset),
    alt: readRequiredString(value, "alt", issues, asset),
    caption: readRequiredString(value, "caption", issues, asset),
    category: readRequiredString(value, "category", issues, asset),
    assetType: readAssetType(value, issues, asset),
    material: readOptionalString(value, "material"),
    style: readOptionalString(value, "style"),
    projectType: readOptionalString(value, "projectType"),
    service: readOptionalString(value, "service"),
    prompt: readOptionalString(value, "prompt"),
    source: {
      label: readRequiredString(source, "label", issues, asset),
      url: readOptionalString(source, "url"),
      rights: readRequiredString(source, "rights", issues, asset),
      verified: true,
    },
    seo: {
      title: readRequiredString(seo, "title", issues, asset),
      description: readRequiredString(seo, "description", issues, asset),
      keywords: Array.isArray(keywords)
        ? keywords
            .filter((keyword): keyword is string => typeof keyword === "string")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [],
    },
  };

  return issues.some((issue) => issue.severity === "error")
    ? { issues }
    : { metadata, issues };
}

export async function loadMetadata(
  asset: ScannedAsset,
): Promise<LoadedMetadata> {
  let raw: string;

  try {
    raw = await readFile(asset.metadataPath, "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return {
        issues: [
          {
            code: "METADATA_NOT_FOUND",
            message: "Verified metadata file is required before processing",
            severity: "error",
            assetPath: asset.relativePath,
            metadataPath: asset.metadataPath,
          },
        ],
      };
    }
    throw error;
  }

  try {
    return parseMetadata(JSON.parse(raw) as unknown, asset);
  } catch {
    return {
      issues: [
        {
          code: "METADATA_JSON_INVALID",
          message: "Metadata file contains invalid JSON",
          severity: "error",
          assetPath: asset.relativePath,
          metadataPath: asset.metadataPath,
        },
      ],
    };
  }
}
