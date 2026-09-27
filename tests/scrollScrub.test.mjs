import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  clamp,
  computeScrubProgress,
  formatTimecode,
  getActiveStageIndex,
  interpolateStageTime,
  normalizeStages,
  resolveScrubState,
} from "../src/lib/scrollScrub.ts";

const STAGES = [
  { time: 0, label: "Khảo sát" },
  { time: 4, label: "Gia công" },
  { time: 9, label: "Hoàn thiện" },
];

test("clamp keeps progress inside the requested range and rejects non-finite input", () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(0.5), 0.5);
  assert.equal(clamp(2), 1);
  assert.equal(clamp(Number.NaN), 0);
  assert.equal(clamp(5, 0, 10), 5);
});

test("computeScrubProgress maps sticky geometry to a clamped 0..1 value", () => {
  const geometry = { containerHeight: 3000, viewportHeight: 1000 };

  assert.equal(computeScrubProgress({ ...geometry, containerTop: 1000 }), 0);
  assert.equal(computeScrubProgress({ ...geometry, containerTop: 0 }), 0);
  assert.equal(computeScrubProgress({ ...geometry, containerTop: -1000 }), 0.5);
  assert.equal(computeScrubProgress({ ...geometry, containerTop: -2000 }), 1);
  assert.equal(computeScrubProgress({ ...geometry, containerTop: -4000 }), 1);
});

test("computeScrubProgress degrades safely when the container has no scroll range", () => {
  const geometry = { containerHeight: 800, viewportHeight: 1000 };

  assert.equal(computeScrubProgress({ ...geometry, containerTop: 40 }), 0);
  assert.equal(computeScrubProgress({ ...geometry, containerTop: -40 }), 1);
});

test("normalizeStages sorts by time, trims labels and drops invalid entries", () => {
  const result = normalizeStages([
    { time: 9, label: "  Hoàn thiện " },
    { time: -1, label: "Âm" },
    { time: Number.NaN, label: "NaN" },
    { time: 0, label: "Khảo sát" },
    { time: 4, label: "   " },
  ]);

  assert.deepEqual(result, [
    { time: 0, label: "Khảo sát" },
    { time: 9, label: "Hoàn thiện" },
  ]);
});

test("normalizeStages preserves verified stage media without inventing fields", () => {
  const result = normalizeStages([
    { time: 0, label: "Khảo sát", image: " /images/gates/gate02.webp ", alt: " Bản vẽ kỹ thuật " },
    { time: 4, label: "Gia công" },
  ]);

  assert.deepEqual(result, [
    { time: 0, label: "Khảo sát", image: "/images/gates/gate02.webp", alt: "Bản vẽ kỹ thuật" },
    { time: 4, label: "Gia công" },
  ]);
});

test("getActiveStageIndex walks stages across equal progress segments", () => {
  assert.equal(getActiveStageIndex(0, 3), 0);
  assert.equal(getActiveStageIndex(0.33, 3), 0);
  assert.equal(getActiveStageIndex(0.34, 3), 1);
  assert.equal(getActiveStageIndex(0.99, 3), 2);
  assert.equal(getActiveStageIndex(1, 3), 2);
  assert.equal(getActiveStageIndex(0.5, 1), 0);
  assert.equal(getActiveStageIndex(0.5, 0), -1);
});

test("interpolateStageTime follows stage timecodes with the scroll position", () => {
  assert.equal(interpolateStageTime(0, STAGES), 0);
  assert.equal(interpolateStageTime(0.25, STAGES), 2);
  assert.equal(interpolateStageTime(0.5, STAGES), 4);
  assert.equal(interpolateStageTime(0.75, STAGES), 6.5);
  assert.equal(interpolateStageTime(1, STAGES), 9);
  assert.equal(interpolateStageTime(0.5, [{ time: 3, label: "Một" }]), 3);
  assert.equal(interpolateStageTime(0.5, []), 0);
});

test("resolveScrubState returns progress, active label and media time together", () => {
  assert.deepEqual(resolveScrubState(0, STAGES), {
    progress: 0,
    activeIndex: 0,
    activeLabel: "Khảo sát",
    mediaTime: 0,
  });

  const middle = resolveScrubState(0.5, STAGES);
  assert.equal(middle.activeIndex, 1);
  assert.equal(middle.activeLabel, "Gia công");
  assert.equal(middle.mediaTime, 4);

  const end = resolveScrubState(1.4, STAGES);
  assert.equal(end.progress, 1);
  assert.equal(end.activeLabel, "Hoàn thiện");
  assert.equal(end.mediaTime, 9);

  assert.deepEqual(resolveScrubState(0.5, []), {
    progress: 0.5,
    activeIndex: -1,
    activeLabel: "",
    mediaTime: 0,
  });
});

test("formatTimecode prints mm:ss and guards invalid input", () => {
  assert.equal(formatTimecode(0), "00:00");
  assert.equal(formatTimecode(4), "00:04");
  assert.equal(formatTimecode(9.9), "00:09");
  assert.equal(formatTimecode(65), "01:05");
  assert.equal(formatTimecode(-3), "00:00");
  assert.equal(formatTimecode(Number.NaN), "00:00");
});

test("scroll scrub component stays dependency-free, accessible and motion-safe", async () => {
  const component = await readFile(
    new URL("../src/components/video/ScrollScrubMedia.tsx", import.meta.url),
    "utf8",
  );
  const lib = await readFile(new URL("../src/lib/scrollScrub.ts", import.meta.url), "utf8");

  assert.match(component, /^"use client";/m);
  assert.match(component, /playsInline/);
  assert.match(component, /\bmuted\b/);
  assert.match(component, /preload="metadata"/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /from "next\/image"/);
  assert.match(component, /opacity-100/);
  assert.match(component, /opacity-0/);
  assert.match(component, /aria-current=/);
  assert.match(component, /role="progressbar"/);
  assert.doesNotMatch(component, /gsap|ScrollTrigger|three/i);
  assert.doesNotMatch(lib, /window\.|document\./);
});

test("project video stages are truthful verified local assets that exist on disk", async () => {
  const data = await readFile(
    new URL("../src/data/project-video-stages.ts", import.meta.url),
    "utf8",
  );

  const labels = [...data.matchAll(/label:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(labels, ["Khảo sát", "Gia công", "Hoàn thiện"]);

  const images = [...data.matchAll(/image:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.equal(images.length, 3);

  for (const image of images) {
    assert.match(image, /^\/images\/[a-z]+\/[a-z0-9]+\.webp$/);
    await access(new URL(`../public${image}`, import.meta.url));
  }
});

test("homepage video section wires the scroll scrub to the verified stages", async () => {
  const section = await readFile(
    new URL("../src/components/sections/VideoShowcaseSection.tsx", import.meta.url),
    "utf8",
  );

  assert.match(section, /<ScrollScrubMedia/);
  assert.match(section, /PROJECT_VIDEO_STAGES/);
  assert.doesNotMatch(section, /\bAI\b/);
});
