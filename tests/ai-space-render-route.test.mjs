import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/render/route.ts",
  import.meta.url,
);

test("G6 route is JSON-only, bounded, same-origin and rate limited", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /application\/json/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*7_500_000/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
});

test("G6 verifies G4 and deterministic G5 before calling shared render adapter", async () => {
  const source = await readFile(routePath, "utf8");
  const verifyIndex = source.indexOf("verifyConfirmedSpaceAtBoundary(");
  const gateIndex = source.indexOf("evaluateConfirmedLayout(");
  const renderIndex = source.indexOf("renderConceptPresentation({ prompt, images })");

  assert.ok(verifyIndex >= 0);
  assert.ok(gateIndex > verifyIndex);
  assert.ok(renderIndex > gateIndex);
  assert.match(source, /SPACE_LAYOUT_REJECTED/);
  assert.match(source, /G6_RENDER_ADAPTER/);
  assert.match(source, /concept-presentation|SPACE_RENDER_ARTIFACT_CLASS/);
  assert.match(source, /not-engineer-verified|SPACE_RENDER_ENGINEERING_STATUS/);
});

test("G6 route reuses Concept Studio adapter without direct provider or persistence coupling", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /concept-render-adapter/);
  assert.match(source, /renderConceptPresentation/);
  assert.doesNotMatch(source, /generativelanguage\.googleapis|GEMINI_API_KEY|OPENROUTER_API_KEY/i);
  assert.doesNotMatch(source, /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i);
});
