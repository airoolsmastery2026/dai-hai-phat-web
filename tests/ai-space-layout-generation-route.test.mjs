import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/layout/generate/route.ts",
  import.meta.url,
);
const generationPath = new URL(
  "../src/lib/ai/space-layout-generation.ts",
  import.meta.url,
);

test("G5 generation route is bounded, same-origin, rate limited and JSON-only", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*512 \* 1024/);
  assert.match(source, /application\/json/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
});

test("G5 generation verifies G4 before model call and reuses deterministic G5 gate", async () => {
  const source = await readFile(routePath, "utf8");
  const verifyIndex = source.indexOf("verifyConfirmedSpaceAtBoundary(");
  const generateIndex = source.indexOf("generateSpaceLayoutWithModelRuntimeCapability(prompt)");
  const gateIndex = source.indexOf("evaluateConfirmedLayout(");

  assert.ok(verifyIndex >= 0);
  assert.ok(generateIndex > verifyIndex);
  assert.ok(gateIndex > generateIndex);
  assert.match(source, /getSpaceConfirmationSealKey/);
  assert.match(source, /parseStrictLayoutProposal/);
  assert.match(source, /SPACE_LAYOUT_REJECTED/);
  assert.match(source, /SPACE_CONFIRMATION_NOT_CONFIGURED/);
});

test("G5 generation stays behind capability boundary and does not persist or couple to providers", async () => {
  const [route, generation] = await Promise.all([
    readFile(routePath, "utf8"),
    readFile(generationPath, "utf8"),
  ]);
  assert.match(route, /generateSpaceLayoutWithModelRuntimeCapability/);
  assert.doesNotMatch(route, /openrouter|gemini|GEMINI_API_KEY|OPENROUTER_API_KEY/i);
  assert.doesNotMatch(route, /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i);
  assert.doesNotMatch(generation, /confirmationSeal|confirmationDigest|geometryDigest/);
  assert.doesNotMatch(generation, /fetch\(|openrouter|gemini/i);
});
