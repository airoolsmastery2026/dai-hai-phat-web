"use client";

import { Play } from "lucide-react";
import { useMemo, useState } from "react";

import {
  getYouTubePosterUrl,
  getYouTubePrivacyEmbedUrl,
  isSafeHostedVideoUrl,
} from "@/lib/video/source";
import type { VideoRecord } from "@/lib/video/types";

type VideoPlayerProps = {
  video: VideoRecord;
};

function PlayerError({ message }: { message: string }) {
  return (
    <div className="flex aspect-video items-center justify-center bg-[var(--color-surface-muted)] px-6 text-center text-sm font-semibold text-[var(--color-text-muted)]">
      {message}
    </div>
  );
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [started, setStarted] = useState(false);
  const youtubeEmbedUrl = useMemo(
    () => (video.source === "youtube" ? getYouTubePrivacyEmbedUrl(video.sourceUrl, true) : null),
    [video.source, video.sourceUrl],
  );
  const posterUrl = useMemo(
    () => video.posterUrl || (video.source === "youtube" ? getYouTubePosterUrl(video.sourceUrl) : undefined),
    [video.posterUrl, video.source, video.sourceUrl],
  );

  if (video.source === "youtube") {
    if (!youtubeEmbedUrl) {
      return <PlayerError message="Liên kết YouTube chưa hợp lệ." />;
    }

    if (started) {
      return (
        <iframe
          className="aspect-video w-full bg-black"
          src={youtubeEmbedUrl}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      );
    }

    return (
      <div className="relative aspect-video overflow-hidden bg-[var(--color-surface-dark)]">
        {posterUrl ? (
          // YouTube posters are remote and intentionally bypass Next image optimization.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="absolute inset-0 flex min-h-12 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]"
          aria-label={`Phát video: ${video.title}`}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-primary)] shadow-[var(--shadow-lg)] transition-transform duration-[var(--duration-fast)] motion-safe:hover:scale-105">
            <Play className="ml-1 size-6" fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      </div>
    );
  }

  if (!isSafeHostedVideoUrl(video.sourceUrl)) {
    return <PlayerError message="Đường dẫn video chưa hợp lệ." />;
  }

  return (
    <video
      className="aspect-video w-full bg-black object-contain"
      src={video.sourceUrl}
      poster={video.posterUrl}
      controls
      playsInline
      preload="metadata"
      aria-label={video.title}
    >
      {video.captionUrl ? (
        <track kind="captions" src={video.captionUrl} srcLang="vi" label="Tiếng Việt" default />
      ) : null}
      Trình duyệt của bạn chưa hỗ trợ phát video này.
    </video>
  );
}
