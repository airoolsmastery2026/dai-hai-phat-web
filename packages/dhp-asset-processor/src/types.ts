export const SUPPORTED_IMAGE_EXTENSIONS = [
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
] as const;

export type SupportedImageExtension =
  (typeof SUPPORTED_IMAGE_EXTENSIONS)[number];

export interface AssetProcessorConfig {
  rootDir: string;
  inputDir: string;
  metadataDir: string;
  outputDir: string;
  galleryPath: string;
  maxWidth: number;
  thumbnailWidth: number;
  blurWidth: number;
  webpQuality: number;
  thumbnailQuality: number;
  concurrency: number;
  watchDebounceMs: number;
  strictMetadata: boolean;
}

export interface AssetSource {
  label: string;
  url?: string;
  rights: string;
  verified: true;
}

export interface AssetSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface AssetMetadata {
  title: string;
  alt: string;
  caption: string;
  category: string;
  material?: string;
  style?: string;
  projectType?: string;
  service?: string;
  prompt?: string;
  source: AssetSource;
  seo: AssetSeo;
}

export interface ScannedAsset {
  absolutePath: string;
  relativePath: string;
  metadataPath: string;
  extension: SupportedImageExtension;
  baseName: string;
  bytes: number;
  sha256: string;
}

export type IssueSeverity = "error" | "warning";

export interface AssetIssue {
  code: string;
  message: string;
  severity: IssueSeverity;
  assetPath?: string;
  metadataPath?: string;
}

export interface LoadedMetadata {
  metadata?: AssetMetadata;
  issues: AssetIssue[];
}

export interface ImageVariant {
  absolutePath: string;
  relativePath: string;
  publicUrl?: string;
  width: number;
  height: number;
  bytes: number;
  format: "webp";
}

export interface OptimizedAsset {
  id: string;
  original: {
    absolutePath: string;
    relativePath: string;
    bytes: number;
    sha256: string;
    format: SupportedImageExtension;
  };
  webp: ImageVariant;
  thumbnail: ImageVariant;
  blurDataUrl: string;
  metadataOutputPath: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  alt: string;
  caption: string;
  category: string;
  material?: string;
  style?: string;
  projectType?: string;
  service?: string;
  prompt: string;
  source: AssetSource;
  seo: AssetSeo;
  original: Omit<OptimizedAsset["original"], "absolutePath">;
  image: Omit<ImageVariant, "absolutePath">;
  thumbnail: Omit<ImageVariant, "absolutePath">;
  blurDataUrl: string;
}

export interface GalleryIndex {
  schemaVersion: "1.0";
  generatedAt: string;
  total: number;
  filters: {
    categories: string[];
    materials: string[];
    styles: string[];
    projectTypes: string[];
    services: string[];
  };
  items: GalleryItem[];
}

export interface BuildReport {
  scanned: number;
  processed: number;
  skipped: number;
  manifestWritten: boolean;
  galleryPath: string;
  issues: AssetIssue[];
}

export interface BuildOptions {
  dryRun?: boolean;
}

export type BuildGallery = (
  config: AssetProcessorConfig,
  options?: BuildOptions,
) => Promise<BuildReport>;
