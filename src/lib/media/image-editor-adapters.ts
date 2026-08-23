export type ImageEditorAdapterId = "photogimp" | "gimp" | "web";

export type ImageEditorCapability =
  | "layers"
  | "masks"
  | "selection"
  | "color"
  | "retouch"
  | "composite"
  | "export";

export interface ImageEditorAdapterDescriptor {
  id: ImageEditorAdapterId;
  label: string;
  runtime: "desktop-local" | "web";
  optional: boolean;
  engine: "gimp" | "dhp-web";
  preset?: "photogimp";
  capabilities: readonly ImageEditorCapability[];
}

const desktopCapabilities = [
  "layers",
  "masks",
  "selection",
  "color",
  "retouch",
  "composite",
  "export",
] as const satisfies readonly ImageEditorCapability[];

export const IMAGE_EDITOR_ADAPTERS = {
  photogimp: {
    id: "photogimp",
    label: "GIMP + PhotoGIMP preset",
    runtime: "desktop-local",
    optional: true,
    engine: "gimp",
    preset: "photogimp",
    capabilities: desktopCapabilities,
  },
  gimp: {
    id: "gimp",
    label: "GIMP",
    runtime: "desktop-local",
    optional: true,
    engine: "gimp",
    capabilities: desktopCapabilities,
  },
  web: {
    id: "web",
    label: "DHP Web Editor",
    runtime: "web",
    optional: false,
    engine: "dhp-web",
    capabilities: ["selection", "color", "retouch", "composite", "export"],
  },
} as const satisfies Record<ImageEditorAdapterId, ImageEditorAdapterDescriptor>;

export interface ImageEditorRuntimeAvailability {
  photogimpAvailable?: boolean;
  gimpAvailable?: boolean;
  preferDesktop?: boolean;
}

/**
 * Selects the best available post-process editor without making GIMP or PhotoGIMP
 * a hard dependency of DHP-AIOS. The web editor is always the final fallback.
 */
export function resolveImageEditorAdapter(
  availability: ImageEditorRuntimeAvailability,
): ImageEditorAdapterDescriptor {
  const preferDesktop = availability.preferDesktop !== false;

  if (preferDesktop && availability.photogimpAvailable) {
    return IMAGE_EDITOR_ADAPTERS.photogimp;
  }

  if (preferDesktop && availability.gimpAvailable) {
    return IMAGE_EDITOR_ADAPTERS.gimp;
  }

  return IMAGE_EDITOR_ADAPTERS.web;
}
