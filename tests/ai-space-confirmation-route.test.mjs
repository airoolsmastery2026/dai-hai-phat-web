import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/confirm/route.ts",
  import.meta.url,
);

test("G4 confirmation route is bounded, same-origin, rate limited and JSON-only", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*256 \* 1024/);
  assert.match(source, /application\/json/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
  assert.match(source, /G4_GEOMETRY_CONFIRMATION/);
});

test("G4 confirmation requires a server secret without exposing it", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /DHP_SPACE_CONFIRMATION_SECRET/);
  assert.match(source, /value\.length >= 32/);
  assert.match(source, /SPACE_CONFIRMATION_NOT_CONFIGURED/);
  assert.match(source, /confirmSpaceCandidate\(payload, sealKey\)/);
  assert.doesNotMatch(source, /console\.(?:info|warn|error)[\s\S]{0,200}sealKey/);
  assert.doesNotMatch(source, /confirmationSealKey\(\)[\s\S]{0,120}console/);
});

test("G4 confirmation is deterministic/provider-free and non-persistent", async () => {
  const source = await readFile(routePath, "utf8");

  assert.doesNotMatch(source, /model-runtime|openrouter|gemini|GEMINI_API_KEY|OPENROUTER_API_KEY/i);
  assert.doesNotMatch(source, /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i);
  assert.doesNotMatch(source, /fetch\(/);
});
