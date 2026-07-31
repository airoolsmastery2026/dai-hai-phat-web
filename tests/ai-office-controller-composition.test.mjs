import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const controllersPath = "src/components/sections/AIOfficeControllers.tsx";
const experiencePath = "src/components/sections/AIOfficeExperience.tsx";

test("AI office controllers are composed behind one React boundary", async () => {
  const source = await readFile(controllersPath, "utf8");

  assert.match(source, /export function AIOfficeControllers/);
  assert.match(source, /service: AIService \| null/);
  assert.match(source, /service \? \(/);
  assert.match(source, /<AIFunnelEventController service=\{service\} \/>/);
  assert.match(source, /<AIFunnelEventController \/>/);
  assert.match(source, /<AIOfficeAccessibilityController \/>/);
  assert.match(source, /type \{ AIService \}/);
});

test("AI Office experience delegates controller orchestration", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /<AIOfficeControllers service=\{servicePreset\} \/>/);
  assert.doesNotMatch(source, /AIFunnelEventController/);
  assert.doesNotMatch(source, /AIOfficeAccessibilityController/);
  assert.match(source, /<AIServiceConflictNotice requestedService=\{servicePreset\} \/>/);
  assert.match(source, /const sessionKey = getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(source, /<AIOfficeSection key=\{sessionKey\} \/>/);
});
