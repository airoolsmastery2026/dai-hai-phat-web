#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { loadConfig } from "./config.js";
import { loadMetadata } from "./metadata.js";
import { optimizeAsset } from "./optimizer.js";
import {
  generatePrompt,
  normalizeSeoKeywords,
} from "./prompt-generator.js";
import { scanAssets } from "./scanner.js";
import type {
  AssetIssue,
  AssetMetadata,
  AssetProcessorConfig,
  BuildOptions,
  BuildReport,
  GalleryIndex,
  GalleryItem,
  OptimizedAsset,
  ScannedAsset,
} from "./types.js";
import { startWatcher } from "./watcher.js";

interface ValidAsset {
  asset: ScannedAsset;
  metadata: AssetMetadata;
}

interface CliOptions {
  configPath?: string;
  rootDir?: string;
  inputDir?: string;
  metadataDir?: string;
  outputDir?: string;
  galleryPath?: string;
  dryRun: boolean;
  watch: boolean;
  help: boolean;
}

function unique(values: Array<string | undefined>): string[] {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).sort((left, right) => left.localeCompare(right, "vi"));
}

function publicVariant(
  variant: OptimizedAsset["webp"],
): GalleryItem["image"] {
  return {
    relativePath: variant.relativePath,
    publicUrl: variant.publicUrl,
    width: variant.width,
    height: variant.height,
    bytes: variant.bytes,
    format: variant.format,
  };
}

function galleryItem(
  metadata: AssetMetadata,
  optimized: OptimizedAsset,
): GalleryItem {
  return {
    id: optimized.id,
    title: metadata.title,
    alt: metadata.alt,
    caption: metadata.caption,
    category: metadata.category,
    assetType: metadata.assetType,
    material: metadata.material,
    style: metadata.style,
    projectType: metadata.projectType,
    service: metadata.service,
    prompt: generatePrompt(metadata),
    source: metadata.source,
    seo: {
      ...metadata.seo,
      keywords: normalizeSeoKeywords(metadata.seo.keywords),
    },
    original: {
      relativePath: optimized.original.relativePath,
      sourceRelativePath: optimized.original.sourceRelativePath,
      publicUrl: optimized.original.publicUrl,
      bytes: optimized.original.bytes,
      sha256: optimized.original.sha256,
      format: optimized.original.format,
    },
    image: publicVariant(optimized.webp),
    thumbnail: publicVariant(optimized.thumbnail),
    blurDataUrl: optimized.blurDataUrl,
  };
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  operation: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await operation(items[index]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, Math.max(items.length, 1)) },
      () => worker(),
    ),
  );
  return results;
}

export async function buildGallery(
  config: AssetProcessorConfig,
  options: BuildOptions = {},
): Promise<BuildReport> {
  const assets = await scanAssets(config);
  const issues: AssetIssue[] = [];
  const validAssets: ValidAsset[] = [];

  if (assets.length === 0) {
    issues.push({
      code: "ASSET_LIBRARY_EMPTY",
      message: `No supported original images found in ${config.inputDir}`,
      severity: "error",
    });
  }

  for (const asset of assets) {
    const loaded = await loadMetadata(asset);
    issues.push(...loaded.issues);
    if (loaded.metadata) {
      validAssets.push({ asset, metadata: loaded.metadata });
    }
  }

  const hasErrors = issues.some((issue) => issue.severity === "error");
  if (hasErrors && config.strictMetadata) {
    return {
      scanned: assets.length,
      processed: 0,
      skipped: assets.length,
      manifestWritten: false,
      galleryPath: config.galleryPath,
      issues,
    };
  }

  const items = await mapWithConcurrency(
    validAssets,
    config.concurrency,
    async ({ asset, metadata }) => {
      const optimized = await optimizeAsset(
        asset,
        config,
        options.dryRun ?? false,
      );
      const item = galleryItem(metadata, optimized);
      if (!options.dryRun) {
        await writeJson(optimized.metadataOutputPath, item);
      }
      return item;
    },
  );

  const gallery: GalleryIndex = {
    schemaVersion: "1.1",
    generatedAt: new Date().toISOString(),
    total: items.length,
    filters: {
      categories: unique(items.map((item) => item.category)),
      assetTypes: unique(
        items.map((item) => item.assetType),
      ) as GalleryIndex["filters"]["assetTypes"],
      materials: unique(items.map((item) => item.material)),
      styles: unique(items.map((item) => item.style)),
      projectTypes: unique(items.map((item) => item.projectType)),
      services: unique(items.map((item) => item.service)),
    },
    items,
  };

  if (!options.dryRun) {
    await writeJson(config.galleryPath, gallery);
  }

  return {
    scanned: assets.length,
    processed: items.length,
    skipped: assets.length - items.length,
    manifestWritten: !options.dryRun,
    galleryPath: config.galleryPath,
    issues,
  };
}

function nextValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    watch: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === "--config") options.configPath = nextValue(args, index++, flag);
    else if (flag === "--root") options.rootDir = nextValue(args, index++, flag);
    else if (flag === "--input") options.inputDir = nextValue(args, index++, flag);
    else if (flag === "--metadata") options.metadataDir = nextValue(args, index++, flag);
    else if (flag === "--output") options.outputDir = nextValue(args, index++, flag);
    else if (flag === "--gallery") options.galleryPath = nextValue(args, index++, flag);
    else if (flag === "--dry-run") options.dryRun = true;
    else if (flag === "--watch") options.watch = true;
    else if (flag === "--help" || flag === "-h") options.help = true;
    else throw new Error(`Unknown option: ${flag}`);
  }

  return options;
}

function printHelp(): void {
  process.stdout.write(
    [
      "DHP Asset Processor",
      "",
      "Usage: dhp-assets [options]",
      "",
      "  --config <path>    Load JSON configuration",
      "  --root <path>      Set the repository root",
      "  --input <path>     Original image directory",
      "  --metadata <path>  Verified metadata directory",
      "  --output <path>    Generated WebP directory",
      "  --gallery <path>   Gallery index path",
      "  --dry-run          Validate and process without writing files",
      "  --watch            Rebuild when images or metadata change",
      "  --help             Show this help",
      "",
    ].join("\n"),
  );
}

function printReport(report: BuildReport): void {
  process.stdout.write(
    `Scanned ${report.scanned}; processed ${report.processed}; skipped ${report.skipped}.\n`,
  );
  for (const issue of report.issues) {
    process.stderr.write(
      `[${issue.severity}] ${issue.code}: ${issue.message}${issue.assetPath ? ` (${issue.assetPath})` : ""}\n`,
    );
  }
}

async function runCli(): Promise<void> {
  const cli = parseArgs(process.argv.slice(2));
  if (cli.help) {
    printHelp();
    return;
  }

  const config = await loadConfig(cli.configPath, {
    rootDir: cli.rootDir,
    inputDir: cli.inputDir,
    metadataDir: cli.metadataDir,
    outputDir: cli.outputDir,
    galleryPath: cli.galleryPath,
  });

  if (cli.watch) {
    const watcher = startWatcher(config, buildGallery, printReport);
    await watcher.ready;
    process.stdout.write("Watching original images and verified metadata.\n");
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.once(signal, () => {
        watcher.close();
        process.exitCode = 0;
      });
    }
    return;
  }

  const report = await buildGallery(config, { dryRun: cli.dryRun });
  printReport(report);
  if (report.issues.some((issue) => issue.severity === "error")) {
    process.exitCode = 1;
  }
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === entry) {
  runCli().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Asset processor failed: ${message}\n`);
    process.exitCode = 1;
  });
}
