import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const experiencePath = "src/components/sections/AIOfficeExperience.tsx";
const routeEntryPath = "src/components/sections/AIOfficeRouteEntry.tsx";

test("AI office experience owns the complete feature composition", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /interface AIOfficeExperienceProps/);
  assert.match(source, /servicePreset: AIService \| null/);
  assert.match(source, /<AIOfficeControllers service=\{servicePreset\} \/>/);
  assert.match(source, /<AIServiceConflictNotice requestedService=\{servicePreset\} \/>/);
  assert.match(source, /<AIOfficeSection key=\{servicePreset \?\? "no-service-preset"\} \/>/);
});

test("route entry only resolves the preset and renders the experience", async () => {
  const source = await readFile(routeEntryPath, "utf8");

  assert.match(source, /const servicePreset = useAIServicePreset\(\)/);
  assert.match(source, /return <AIOfficeExperience servicePreset=\{servicePreset\} \/>/);
  assert.doesNotMatch(source, /AIOfficeControllers/);
  assert.doesNotMatch(source, /AIServiceConflictNotice/);
  assert.doesNotMatch(source, /AIOfficeSection/);
});
