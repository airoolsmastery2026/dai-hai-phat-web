import type { VideoRecord } from "@/lib/video/types";

// Only approved, real project media belongs here. Do not add demo videos from third parties.
export const VIDEO_SHOWCASE_ITEMS: readonly VideoRecord[] = [];

export function getPublishedVideoShowcaseItems(limit = 4): VideoRecord[] {
  return [...VIDEO_SHOWCASE_ITEMS]
    .filter((item) => item.status === "published")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, limit);
}
