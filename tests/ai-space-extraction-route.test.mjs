import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/extract/route.ts",
  import.meta.url,
);

test("Space extraction route is bounded, same-origin, rate limited and non-persistent", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*3_750_000/);
  assert.match(source, /application\/json/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
  assert.match(source, /parseSpaceExtractionRequest/);
  assert.doesNotMatch(source, /supabase\.from|insert\(|upload\(|writeFile|putObject/i);
});

test("Space extraction route uses the DHP model runtime and never calls a provider directly", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /extractSpaceWithModelRuntimeCapability/);
  assert.match(source, /G3_AI_EXTRACTION/);
  assert.match(source, /INSUFFICIENT_GEOMETRY_EVIDENCE/);
  assert.match(source, /INVALID_AI_GEOMETRY/);
  assert.doesNotMatch(source, /openrouter\.ai/i);
  assert.doesNotMatch(source, /generativelanguage\.googleapis\.com/i);
  assert.doesNotMatch(source, /GEMINI_API_KEY|OPENROUTER_API_KEY/);
});

test("Space extraction route does not log or return uploaded base64 image data", async () => {
  const source = await readFile(routePath, "utf8");
  const loggingSection = source.slice(source.indexOf("console.info"));

  assert.doesNotMatch(loggingSection, /dataBase64|extractionRequest\.image/);
  assert.doesNotMatch(source, /image:\s*extractionRequest\.image/);
});
