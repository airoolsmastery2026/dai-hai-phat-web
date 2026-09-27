export type ScrollScrubStage = {
  time: number;
  label: string;
  image?: string;
  alt?: string;
};

export type ScrollScrubState = {
  progress: number;
  activeIndex: number;
  activeLabel: string;
  mediaTime: number;
};

export type ScrubGeometry = {
  containerTop: number;
  containerHeight: number;
  viewportHeight: number;
};

export function clamp(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value === 0 ? 0 : value;
}

export function computeScrubProgress({
  containerTop,
  containerHeight,
  viewportHeight,
}: ScrubGeometry): number {
  const scrollable = containerHeight - viewportHeight;

  if (!Number.isFinite(scrollable) || scrollable <= 0) {
    return containerTop <= 0 ? 1 : 0;
  }

  return clamp(-containerTop / scrollable);
}

export function normalizeStages(
  stages: readonly ScrollScrubStage[],
): ScrollScrubStage[] {
  return stages
    .filter(
      (stage) =>
        Number.isFinite(stage.time) &&
        stage.time >= 0 &&
        typeof stage.label === "string" &&
        stage.label.trim().length > 0,
    )
    .map((stage) => {
      const normalized: ScrollScrubStage = {
        time: stage.time,
        label: stage.label.trim(),
      };

      if (typeof stage.image === "string" && stage.image.trim()) {
        normalized.image = stage.image.trim();
      }
      if (typeof stage.alt === "string" && stage.alt.trim()) {
        normalized.alt = stage.alt.trim();
      }

      return normalized;
    })
    .sort((a, b) => a.time - b.time);
}

export function getActiveStageIndex(progress: number, stageCount: number): number {
  if (stageCount <= 0) return -1;
  if (stageCount === 1) return 0;

  return clamp(Math.floor(clamp(progress) * stageCount), 0, stageCount - 1);
}

function interpolateNormalized(
  progress: number,
  stages: readonly ScrollScrubStage[],
): number {
  if (stages.length === 0) return 0;
  if (stages.length === 1) return stages[0].time;

  const segment = clamp(progress) * (stages.length - 1);
  const index = Math.min(Math.floor(segment), stages.length - 2);
  const local = segment - index;
  const from = stages[index].time;
  const to = stages[index + 1].time;

  return from + (to - from) * local;
}

export function interpolateStageTime(
  progress: number,
  stages: readonly ScrollScrubStage[],
): number {
  return interpolateNormalized(progress, normalizeStages(stages));
}

export function resolveScrubState(
  progress: number,
  stages: readonly ScrollScrubStage[],
): ScrollScrubState {
  const safeProgress = clamp(progress);
  const normalized = normalizeStages(stages);

  if (normalized.length === 0) {
    return { progress: safeProgress, activeIndex: -1, activeLabel: "", mediaTime: 0 };
  }

  const activeIndex = getActiveStageIndex(safeProgress, normalized.length);

  return {
    progress: safeProgress,
    activeIndex,
    activeLabel: normalized[activeIndex].label,
    mediaTime: interpolateNormalized(safeProgress, normalized),
  };
}

export function formatTimecode(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}
