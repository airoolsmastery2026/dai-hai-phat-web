import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const adapterPath = new URL(
  "../src/lib/server/concept-render-adapter.ts",
  import.meta.url,
);
const conceptRoutePath = new URL(
  "../src/app/api/ai/concept/route.ts",
  import.meta.url,
);
const spaceRoutePath = new URL(
  "../src/app/api/ai/space/render/route.ts",
  import.meta.url,
);

test("Concept Studio and G6 share one narrow server-side render adapter", async () => {
  const [adapter, conceptRoute, spaceRoute] = await Promise.all([
    readFile(adapterPath, "utf8"),
    readFile(conceptRoutePath, "utf8"),
    readFile(spaceRoutePath, "utf8"),
  ]);

  assert.match(conceptRoute, /renderConceptPresentation/);
  assert.match(spaceRoute, /renderConceptPresentation/);
  assert.match(adapter, /AI_CONCEPT_MODEL/);
  assert.match(adapter, /process\.env\.GEMINI_API_KEY/);
  assert.match(adapter, /generativelanguage\.googleapis/);
  assert.match(adapter, /UPSTREAM_TIMEOUT_MS/);
  assert.match(adapter, /responseModalities: \["TEXT", "IMAGE"\]/);
  assert.match(adapter, /aspectRatio: "16:9"/);
  assert.match(adapter, /imageSize: "1K"/);
  assert.doesNotMatch(conceptRoute, /generativelanguage\.googleapis/);
  assert.doesNotMatch(spaceRoute, /generativelanguage\.googleapis/);
});
