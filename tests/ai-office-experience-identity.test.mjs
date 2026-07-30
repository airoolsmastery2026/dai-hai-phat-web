import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const experiencePath = "src/components/sections/AIOfficeExperience.tsx";
const identityPath = "src/lib/ai/experience.ts";

test("AI office session identity is centralized", async () => {
  const source = await readFile(identityPath, "utf8");

  assert.match(source, /export function getAIOfficeSessionKey/);
  assert.match(source, /service:none/);
  assert.match(source, /`service:\$\{servicePreset\}`/);
  assert.doesNotMatch(source, /window|document|localStorage|sessionStorage/);
});

test("AI office experience delegates remount identity", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(source, /<AIOfficeSection key=\{sessionKey\} \/>/);
  assert.doesNotMatch(source, /no-service-preset/);
  assert.doesNotMatch(source, /key=\{servicePreset/);
});
