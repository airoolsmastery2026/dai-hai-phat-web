import type { VideoRecord } from "@/lib/video/types";

// Approved DHP brand video. The source is a shared Manus file URL.
export const VIDEO_SHOWCASE_ITEMS: readonly VideoRecord[] = [
  {
    id: "dhp-01",
    source: "upload",
    title: "DHP 01",
    description: "Video giới thiệu Đại Hải Phát và các dịch vụ xây dựng dân dụng, nhà ở, nội thất.",
    sourceUrl: "https://manus.im/share/file/06535933-c5e9-4efb-b101-e37445d05adf",
    featured: true,
    order: 1,
    status: "published",
  },
];

export function getPublishedVideoShowcaseItems(limit = 4): VideoRecord[] {
  return [...VIDEO_SHOWCASE_ITEMS]
    .filter((item) => item.status === "published")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, limit);
}
