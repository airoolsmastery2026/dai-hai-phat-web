export type VideoSource = "upload" | "youtube";
export type VideoStatus = "draft" | "published" | "archived";

export type VideoRecord = {
  id: string;
  source: VideoSource;
  title: string;
  description?: string;
  sourceUrl: string;
  posterUrl?: string;
  captionUrl?: string;
  projectSlug?: string;
  featured: boolean;
  order: number;
  status: VideoStatus;
};
