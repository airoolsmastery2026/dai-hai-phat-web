import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const experiencePath = "src/components/sections/AIOfficeExperience.tsx";
const routeEntryPath = "src/components/sections/AIOfficeRouteEntry.tsx";

test("AI office experience owns the complete feature composition", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /interface AIOfficeExperienceProps/);
  assert.match(source, /servicePreset: AIService \| null/);
  assert.match(source, /liveVoiceEnabled: boolean/);
  assert.match(source, /const sessionKey = getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(source, /<AIOfficeControllers service=\{servicePreset\} \/>/);
  assert.match(source, /<AIServiceConflictNotice requestedService=\{servicePreset\} \/>/);
  assert.match(source, /<AIOfficeSection key=\{sessionKey\} \/>/);
});

test("route entry defers and activates the AI Office experience", async () => {
  const source = await readFile(routeEntryPath, "utf8");

  assert.match(source, /const servicePreset = useAIServicePreset\(\)/);
  assert.match(source, /useAIOfficeActivation\(\)/);
  assert.match(source, /dynamic\(/);
  assert.match(source, /<AIOfficeExperience/);
  assert.match(source, /servicePreset=\{servicePreset\}/);
  assert.match(source, /liveVoiceEnabled=\{liveVoiceEnabled\}/);
  assert.match(source, /<AIOfficeLoadingState \/>/);
  assert.doesNotMatch(source, /AIServiceConflictNotice/);
  assert.doesNotMatch(source, /AIOfficeSection/);
});
