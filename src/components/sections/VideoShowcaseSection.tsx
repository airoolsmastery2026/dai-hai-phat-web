import { ArrowRight, Clapperboard } from "lucide-react";
import Link from "next/link";

import { ScrollScrubMedia } from "@/components/video/ScrollScrubMedia";
import { VideoCard } from "@/components/video/VideoCard";
import { PROJECT_VIDEO_STAGES } from "@/data/project-video-stages";
import { getPublishedVideoShowcaseItems } from "@/data/video-showcase";

function PendingVideoNotice() {
  return (
    <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-[var(--space-3)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Clapperboard className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
          Video thực tế sẽ được bổ sung theo từng công trình. Hình bên dưới là tư liệu đã xác minh cho quy trình khảo sát, gia công và hoàn thiện.
        </p>
      </div>
      <Link
        href="/gallery"
        className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
      >
        Xem công trình <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function VideoShowcaseSection() {
  const videos = getPublishedVideoShowcaseItems(4);

  return (
    <section id="videos" className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">Video công trình</p>
          <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">
            Xem cách Đại Hải Phát thực hiện ngoài thực tế
          </h2>
          <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
            Video ngắn về khảo sát, gia công và hoàn thiện để bạn hình dung rõ quy trình trước khi trao đổi.
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => <VideoCard key={video.id} video={video} />)}
          </div>
        ) : (
          <PendingVideoNotice />
        )}
      </div>

      {videos.length === 0 ? (
        <ScrollScrubMedia
          stages={PROJECT_VIDEO_STAGES}
          ariaLabel="Quy trình khảo sát, gia công và hoàn thiện của Đại Hải Phát"
          className="mt-[var(--space-6)]"
        />
      ) : null}
    </section>
  );
}
