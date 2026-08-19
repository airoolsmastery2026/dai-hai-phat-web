import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/layout/validate/route.ts",
  import.meta.url,
);

test("G5 route is bounded, same-origin, rate limited and JSON-only", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*512 \* 1024/);
  assert.match(source, /application\/json/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
});

test("G5 route requires shared G4 seal key and sealed layout evaluator", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /getSpaceConfirmationSealKey/);
  assert.match(source, /evaluateConfirmedLayout\(payload, sealKey\)/);
  assert.match(source, /SPACE_CONFIRMATION_NOT_CONFIGURED/);
  assert.doesNotMatch(source, /DHP_SPACE_CONFIRMATION_SECRET|DHP_CONTROL_PLANE_SECRET/);
});

test("G5 route is provider-free and non-persistent", async () => {
  const source = await readFile(routePath, "utf8");
  assert.doesNotMatch(source, /model-runtime|openrouter|gemini|GEMINI_API_KEY|OPENROUTER_API_KEY/i);
  assert.doesNotMatch(source, /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i);
  assert.doesNotMatch(source, /fetch\(/);
});
