import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import type {
  AssetProcessorConfig,
  ImageVariant,
  OptimizedAsset,
  ScannedAsset,
} from "./types.js";

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "asset";
}

function toPublicUrl(
  rootDir: string,
  absolutePath: string,
): string | undefined {
  const publicDir = path.join(rootDir, "public");
  const relative = path.relative(publicDir, absolutePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return undefined;
  }

  return `/${toPosix(relative)}`;
}

function imageVariant(
  rootDir: string,
  absolutePath: string,
  info: { width: number; height: number; size: number },
): ImageVariant {
  return {
    absolutePath,
    relativePath: toPosix(path.relative(rootDir, absolutePath)),
    publicUrl: toPublicUrl(rootDir, absolutePath),
    width: info.width,
    height: info.height,
    bytes: info.size,
    format: "webp",
  };
}

function assertSafeSharpVersion(): void {
  const [major = 0, minor = 0] = sharp.versions.sharp
    .split(".")
    .map((value) => Number.parseInt(value, 10));

  if (major === 0 && minor < 35) {
    throw new Error(
      `sharp ${sharp.versions.sharp} is not supported; install sharp 0.35.0 or newer`,
    );
  }
}

export async function optimizeAsset(
  asset: ScannedAsset,
  config: AssetProcessorConfig,
  dryRun = false,
): Promise<OptimizedAsset> {
  assertSafeSharpVersion();

  const relativeDirectory = path.dirname(asset.relativePath);
  const outputDirectory = path.join(config.outputDir, relativeDirectory);
  const stableName = slugify(asset.baseName);
  const relativeWithoutExtension = asset.relativePath.slice(
    0,
    -asset.extension.length,
  );
  const id = slugify(relativeWithoutExtension);
  const originalPath = path.join(
    outputDirectory,
    `${stableName}${asset.extension}`,
  );
  const webpPath = path.join(outputDirectory, `${stableName}.webp`);
  const thumbnailPath = path.join(
    outputDirectory,
    `${stableName}.thumb.webp`,
  );
  const metadataOutputPath = path.join(
    outputDirectory,
    `${stableName}.metadata.json`,
  );
  const sourceBuffer = await readFile(asset.absolutePath);
  const basePipeline = sharp(sourceBuffer, { failOn: "error" }).rotate();
  const full = await basePipeline
    .clone()
    .resize({
      width: config.maxWidth,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: config.webpQuality, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  const thumbnail = await basePipeline
    .clone()
    .resize({
      width: config.thumbnailWidth,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: config.thumbnailQuality, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  const blur = await basePipeline
    .clone()
    .resize({
      width: config.blurWidth,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 40, effort: 2 })
    .toBuffer();

  if (!dryRun) {
    await mkdir(outputDirectory, { recursive: true });
    await Promise.all([
      writeFile(originalPath, sourceBuffer),
      writeFile(webpPath, full.data),
      writeFile(thumbnailPath, thumbnail.data),
    ]);
  }

  return {
    id,
    original: {
      absolutePath: originalPath,
      relativePath: toPosix(path.relative(config.rootDir, originalPath)),
      sourceRelativePath: toPosix(
        path.relative(config.rootDir, asset.absolutePath),
      ),
      publicUrl: toPublicUrl(config.rootDir, originalPath),
      bytes: asset.bytes,
      sha256: asset.sha256,
      format: asset.extension,
    },
    webp: imageVariant(config.rootDir, webpPath, full.info),
    thumbnail: imageVariant(
      config.rootDir,
      thumbnailPath,
      thumbnail.info,
    ),
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    metadataOutputPath,
  };
}
