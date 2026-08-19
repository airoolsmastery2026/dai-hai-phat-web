import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/validate/route.ts",
  import.meta.url,
);

test("Space validation API keeps a bounded same-origin trust boundary", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /application\/json/);
  assert.match(source, /Retry-After/);
});

test("Space validation API is deterministic and does not invoke an AI provider", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /validateSpaceModel/);
  assert.match(source, /evaluateSpaceProposal/);
  assert.match(source, /G1_SPACE_MODEL/);
  assert.match(source, /G5_LAYOUT_CONSTRAINTS/);
  assert.doesNotMatch(source, /cloud-ai-router/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
  assert.doesNotMatch(source, /generativelanguage\.googleapis\.com/);
});
