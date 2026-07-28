import { readFile } from "node:fs/promises";
import path from "node:path";

import type { AssetProcessorConfig } from "./types.js";

type ConfigInput = Partial<
  Omit<
    AssetProcessorConfig,
    "rootDir" | "inputDir" | "metadataDir" | "outputDir" | "galleryPath"
  >
> & {
  rootDir?: string;
  inputDir?: string;
  metadataDir?: string;
  outputDir?: string;
  galleryPath?: string;
};

const DEFAULT_CONFIG: Omit<AssetProcessorConfig, "rootDir"> = {
  inputDir: "assets/images",
  metadataDir: "assets/image-metadata",
  outputDir: "public/images/generated",
  galleryPath: "public/images/gallery.json",
  maxWidth: 1920,
  thumbnailWidth: 480,
  blurWidth: 32,
  webpQuality: 82,
  thumbnailQuality: 72,
  concurrency: 2,
  watchDebounceMs: 400,
  strictMetadata: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseConfigInput(value: unknown, source: string): ConfigInput {
  if (!isRecord(value)) {
    throw new Error(`Asset config must be a JSON object: ${source}`);
  }

  const allowedKeys = new Set([
    "rootDir",
    "inputDir",
    "metadataDir",
    "outputDir",
    "galleryPath",
    "maxWidth",
    "thumbnailWidth",
    "blurWidth",
    "webpQuality",
    "thumbnailQuality",
    "concurrency",
    "watchDebounceMs",
    "strictMetadata",
  ]);

  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Unknown asset config field "${key}" in ${source}`);
    }
  }

  return value as ConfigInput;
}

function definedConfig(input: ConfigInput): ConfigInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as ConfigInput;
}

function resolveInsideRoot(rootDir: string, value: string, field: string): string {
  const resolved = path.resolve(rootDir, value);
  const relative = path.relative(rootDir, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${field} must stay inside the repository root`);
  }

  return resolved;
}

function assertInteger(
  value: number,
  field: string,
  minimum: number,
  maximum: number,
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${field} must be an integer from ${minimum} to ${maximum}`);
  }
}

function validateConfig(config: AssetProcessorConfig): void {
  assertInteger(config.maxWidth, "maxWidth", 320, 7680);
  assertInteger(config.thumbnailWidth, "thumbnailWidth", 120, config.maxWidth);
  assertInteger(config.blurWidth, "blurWidth", 8, 96);
  assertInteger(config.webpQuality, "webpQuality", 40, 100);
  assertInteger(config.thumbnailQuality, "thumbnailQuality", 30, 100);
  assertInteger(config.concurrency, "concurrency", 1, 8);
  assertInteger(config.watchDebounceMs, "watchDebounceMs", 100, 5000);

  if (config.inputDir === config.outputDir) {
    throw new Error("inputDir and outputDir must be different");
  }

  if (
    config.outputDir.startsWith(`${config.inputDir}${path.sep}`) ||
    config.metadataDir.startsWith(`${config.inputDir}${path.sep}`)
  ) {
    throw new Error("Generated files and metadata must not be nested in inputDir");
  }
}

export async function loadConfig(
  configPath?: string,
  overrides: ConfigInput = {},
): Promise<AssetProcessorConfig> {
  const safeOverrides = definedConfig(overrides);
  const initialRoot = path.resolve(safeOverrides.rootDir ?? process.cwd());
  let fileConfig: ConfigInput = {};

  if (configPath) {
    const absoluteConfigPath = resolveInsideRoot(
      initialRoot,
      configPath,
      "configPath",
    );
    const raw = await readFile(absoluteConfigPath, "utf8");
    fileConfig = parseConfigInput(JSON.parse(raw) as unknown, absoluteConfigPath);
  }

  const merged = {
    ...DEFAULT_CONFIG,
    ...definedConfig(fileConfig),
    ...safeOverrides,
  };
  const rootDir = path.resolve(initialRoot, merged.rootDir ?? ".");
  const config: AssetProcessorConfig = {
    rootDir,
    inputDir: resolveInsideRoot(rootDir, merged.inputDir, "inputDir"),
    metadataDir: resolveInsideRoot(rootDir, merged.metadataDir, "metadataDir"),
    outputDir: resolveInsideRoot(rootDir, merged.outputDir, "outputDir"),
    galleryPath: resolveInsideRoot(rootDir, merged.galleryPath, "galleryPath"),
    maxWidth: merged.maxWidth,
    thumbnailWidth: merged.thumbnailWidth,
    blurWidth: merged.blurWidth,
    webpQuality: merged.webpQuality,
    thumbnailQuality: merged.thumbnailQuality,
    concurrency: merged.concurrency,
    watchDebounceMs: merged.watchDebounceMs,
    strictMetadata: merged.strictMetadata,
  };

  validateConfig(config);
  return config;
}
