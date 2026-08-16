import Link from "next/link";

import type { VideoRecord } from "@/lib/video/types";

import { VideoPlayer } from "./VideoPlayer";

export function VideoCard({ video }: { video: VideoRecord }) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <VideoPlayer video={video} />
      <div className="p-[var(--space-4)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {video.source === "youtube" ? "YouTube" : "Video công trình"}
        </p>
        <h3 className="mt-[var(--space-1)] text-base font-black leading-6 text-[var(--color-text)]">
          {video.title}
        </h3>
        {video.description ? (
          <p className="mt-[var(--space-2)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {video.description}
          </p>
        ) : null}
        {video.projectSlug ? (
          <Link
            href={`/services/${video.projectSlug}`}
            className="mt-[var(--space-3)] inline-flex min-h-11 items-center text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem hạng mục liên quan
          </Link>
        ) : null}
      </div>
    </article>
  );
}
