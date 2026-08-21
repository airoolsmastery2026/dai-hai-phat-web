import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/boq/route.ts",
  import.meta.url,
);
const pricingAdapterPath = new URL(
  "../src/lib/server/space-pricing-catalog.ts",
  import.meta.url,
);

test("G7 route is JSON-only, bounded, same-origin and rate limited", async () => {
  const source = await readFile(routePath, "utf8");
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /application\/json/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*512\s*\*\s*1024/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
});

test("G7 verifies sealed G4 and deterministic G5 before reading PRICE_DB", async () => {
  const source = await readFile(routePath, "utf8");
  const verifyIndex = source.indexOf("verifyConfirmedSpaceAtBoundary(");
  const gateIndex = source.indexOf("evaluateConfirmedLayout(");
  const catalogIndex = source.indexOf("getSpacePricingCatalog()");
  const boqIndex = source.indexOf("buildPreliminarySpaceBoq(");

  assert.ok(verifyIndex >= 0);
  assert.ok(gateIndex > verifyIndex);
  assert.ok(catalogIndex > gateIndex);
  assert.ok(boqIndex > catalogIndex);
  assert.match(source, /SPACE_LAYOUT_REJECTED/);
  assert.match(source, /G7|boq/i);
});

test("G7 has no render, model-provider or persistence dependency", async () => {
  const source = await readFile(routePath, "utf8");
  assert.doesNotMatch(source, /renderConceptPresentation|imageBase64|siteImage|referenceImage/);
  assert.doesNotMatch(
    source,
    /generativelanguage\.googleapis|GEMINI_API_KEY|OPENROUTER_API_KEY|model-runtime/i,
  );
  assert.doesNotMatch(source, /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i);
});

test("G7 reuses the existing knowledge pricing source rather than defining a parallel PRICE_DB", async () => {
  const adapter = await readFile(pricingAdapterPath, "utf8");
  assert.match(adapter, /knowledge\/pricing\.json/);
  assert.match(adapter, /SpaceBoqPricingCatalog/);
  assert.doesNotMatch(adapter, /fetch\(|GEMINI|OPENROUTER|SUPABASE/i);
});
