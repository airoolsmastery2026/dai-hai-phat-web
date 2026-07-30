import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const boundaryPath = new URL(
  "../src/components/sections/AIOfficeErrorBoundary.tsx",
  import.meta.url,
);
const experiencePath = new URL(
  "../src/components/sections/AIOfficeExperience.tsx",
  import.meta.url,
);

test("AI Office render failures are isolated behind a feature boundary", async () => {
  const [boundary, experience] = await Promise.all([
    readFile(boundaryPath, "utf8"),
    readFile(experiencePath, "utf8"),
  ]);

  assert.match(boundary, /getDerivedStateFromError/);
  assert.match(boundary, /componentDidCatch/);
  assert.match(boundary, /previousProps\.resetKey !== this\.props\.resetKey/);
  assert.match(boundary, /Dữ liệu đã lưu trên thiết bị vẫn được giữ nguyên/);
  assert.doesNotMatch(boundary, /session\.memory|localStorage|FormData/);

  assert.match(
    experience,
    /<AIOfficeErrorBoundary resetKey=\{sessionKey\}>[\s\S]*<AIOfficeSection key=\{sessionKey\} \/>/,
  );
  assert.match(experience, /<AIOfficeControllers service=\{servicePreset\} \/>/);
  assert.ok(
    experience.indexOf("<AIOfficeControllers") <
      experience.indexOf("<AIOfficeErrorBoundary"),
  );
});
