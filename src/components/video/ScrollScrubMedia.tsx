"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  clamp,
  computeScrubProgress,
  formatTimecode,
  normalizeStages,
  resolveScrubState,
  type ScrollScrubStage,
} from "@/lib/scrollScrub";

type ScrollScrubMediaProps = {
  stages: readonly ScrollScrubStage[];
  src?: string;
  poster?: string;
  captionsSrc?: string;
  ariaLabel?: string;
  scrubScreens?: number;
  className?: string;
};

const MIN_SEEK_DELTA_SECONDS = 0.04;
const MIN_PROGRESS_DELTA = 0.002;
const MEDIA_SIZES = "(max-width: 1023px) 100vw, 55vw";

export function ScrollScrubMedia({
  stages,
  src,
  poster,
  captionsSrc,
  ariaLabel = "Video quy trình công trình",
  scrubScreens = 2,
  className = "",
}: ScrollScrubMediaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastSeekRef = useRef(-1);
  const unlockedRef = useRef(false);

  const normalizedStages = useMemo(() => normalizeStages(stages), [stages]);
  const hasVideo = typeof src === "string" && src.length > 0;
  const hasImages = normalizedStages.some((stage) => Boolean(stage.image));

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const state = resolveScrubState(progress, normalizedStages);
  const progressPercent = Math.round(state.progress * 100);
  const trackHeight = `${Math.max(1, scrubScreens + 1) * 100}svh`;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = videoRef.current;
    if (!media) return;

    // iOS Safari ignores programmatic currentTime writes until the element has
    // been unlocked by a real user gesture. The first interaction plays and
    // immediately pauses the muted video so later scroll seeks take effect.
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      const playAttempt = media.play();
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt.then(() => media.pause()).catch(() => {
          // The gesture may still be rejected; scrubbing degrades to the poster.
        });
      }
    };

    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const update = () => {
      frameRef.current = null;
      const rect = container.getBoundingClientRect();
      const next = computeScrubProgress({
        containerTop: rect.top,
        containerHeight: rect.height,
        viewportHeight: window.innerHeight,
      });
      setProgress((current) =>
        Math.abs(current - next) < MIN_PROGRESS_DELTA ? current : next,
      );
    };

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const media = videoRef.current;
    if (!media || !hasVideo) return;

    const target = reducedMotion ? (normalizedStages[0]?.time ?? 0) : state.mediaTime;
    const knownDuration =
      Number.isFinite(media.duration) && media.duration > 0 ? media.duration : target;
    const safeTarget = clamp(target, 0, Math.max(0, knownDuration - 0.05));

    if (Math.abs(safeTarget - lastSeekRef.current) < MIN_SEEK_DELTA_SECONDS) return;
    lastSeekRef.current = safeTarget;

    try {
      media.currentTime = safeTarget;
    } catch {
      // Seeking before metadata is ready can throw; the next scroll pass retries.
    }
  }, [hasVideo, normalizedStages, reducedMotion, state.mediaTime]);

  const handleLoadedMetadata = useCallback(() => {
    const media = videoRef.current;
    if (!media) return;
    setDuration(Number.isFinite(media.duration) ? media.duration : 0);
    lastSeekRef.current = -1;
  }, []);

  if (state.activeIndex === -1 || (!hasVideo && !hasImages)) return null;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`.trim()}
      style={{ height: trackHeight }}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center py-[var(--space-8)]">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
          <div className="grid items-center gap-[var(--space-4)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-[var(--space-8)]">
            <div className="relative aspect-video overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-dark)] shadow-[var(--shadow-md)]">
              {hasVideo ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src={src}
                  poster={poster}
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={handleLoadedMetadata}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {captionsSrc ? (
                    <track kind="captions" src={captionsSrc} srcLang="vi" label="Tiếng Việt" default />
                  ) : null}
                  Trình duyệt của bạn chưa hỗ trợ phát video này.
                </video>
              ) : (
                normalizedStages.map((stage, index) =>
                  stage.image ? (
                    <Image
                      key={`${index}-${stage.image}`}
                      src={stage.image}
                      alt={index === state.activeIndex ? (stage.alt ?? "") : ""}
                      fill
                      sizes={MEDIA_SIZES}
                      className={`object-cover transition-opacity duration-[var(--duration-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none ${
                        index === state.activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : null,
                )
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,47,49,0.35)_0%,transparent_45%,rgba(12,47,49,0.55)_100%)]"
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute left-[var(--space-3)] top-[var(--space-3)] rounded-[var(--radius-sm)] bg-[var(--color-surface-dark)] px-[var(--space-3)] py-[var(--space-1)] text-xs font-bold tabular-nums text-[var(--color-text-dark-muted)]">
                {hasVideo
                  ? `${formatTimecode(state.mediaTime)} / ${formatTimecode(duration)}`
                  : `${String(state.activeIndex + 1).padStart(2, "0")} / ${String(normalizedStages.length).padStart(2, "0")}`}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" aria-hidden="true">
                <div
                  className="h-full bg-[var(--color-primary-soft)] transition-[width] duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="h-1 w-16 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
              <ol className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
                {normalizedStages.map((stage, index) => {
                  const isActive = index === state.activeIndex;

                  return (
                    <li
                      key={`${stage.time}-${stage.label}`}
                      aria-current={isActive ? "step" : undefined}
                      className={`flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] transition-colors duration-[var(--duration-fast)] ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)]"
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] text-xs font-black tabular-nums ${
                          isActive
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isActive
                            ? "text-[var(--color-primary-soft-text)]"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {stage.label}
                      </span>
                      {hasVideo ? (
                        <span className="ml-auto text-xs font-semibold tabular-nums text-[var(--color-text-subtle)]">
                          {formatTimecode(stage.time)}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-label="Tiến trình xem quy trình"
                className="mt-[var(--space-3)] h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-strong)]"
              >
                <div
                  className="h-full rounded-[var(--radius-full)] bg-[var(--color-primary)] transition-[width] duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
