import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import {
  SUPPORTED_IMAGE_EXTENSIONS,
  type AssetProcessorConfig,
  type ScannedAsset,
  type SupportedImageExtension,
} from "./types.js";

function isSupportedExtension(
  extension: string,
): extension is SupportedImageExtension {
  return SUPPORTED_IMAGE_EXTENSIONS.includes(
    extension as SupportedImageExtension,
  );
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

async function hashFile(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk as Buffer);
  }

  return hash.digest("hex");
}

async function collectFiles(directory: string): Promise<string[]> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new Error(`Asset input directory does not exist: ${directory}`);
    }
    throw error;
  }

  const files: string[] = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (entry.name.startsWith(".") || entry.isSymbolicLink()) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

export async function scanAssets(
  config: AssetProcessorConfig,
): Promise<ScannedAsset[]> {
  const inputStats = await stat(config.inputDir).catch(() => undefined);

  if (!inputStats) {
    throw new Error(`Asset input directory does not exist: ${config.inputDir}`);
  }
  if (!inputStats.isDirectory()) {
    throw new Error(`Asset input path is not a directory: ${config.inputDir}`);
  }

  const files = await collectFiles(config.inputDir);
  const assets: ScannedAsset[] = [];

  for (const absolutePath of files) {
    const extension = path.extname(absolutePath).toLowerCase();
    if (!isSupportedExtension(extension)) {
      continue;
    }

    const relativePath = path.relative(config.inputDir, absolutePath);
    const fileStats = await stat(absolutePath);
    const relativeWithoutExtension = relativePath.slice(0, -extension.length);

    assets.push({
      absolutePath,
      relativePath: toPosix(relativePath),
      metadataPath: path.join(
        config.metadataDir,
        `${relativeWithoutExtension}.json`,
      ),
      extension,
      baseName: path.basename(absolutePath, extension),
      bytes: fileStats.size,
      sha256: await hashFile(absolutePath),
    });
  }

  return assets.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath),
  );
}
