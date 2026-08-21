import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/project-analysis/route.ts",
  import.meta.url,
);

test("project analysis degrades cloud timeout to deterministic output", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /buildDeterministicProjectAnalysis/);
  assert.match(source, /fallbackReason: error\.code/);
  assert.match(source, /"X-DHP-AI-Fallback": "deterministic"/);
  assert.match(source, /DHP project analysis using deterministic fallback/);
  assert.match(source, /200,/);
  assert.doesNotMatch(source, /timedOut \? 504 : 503/);
});

test("public abuse rate limiting remains distinct from cloud fallback", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /"RATE_LIMITED"/);
  assert.match(source, /429,/);
  assert.match(source, /"Retry-After": String\(rateLimit\.retryAfterSeconds\)/);
  assert.match(source, /CloudAiRouterError/);
  assert.match(source, /X-DHP-AI-Fallback/);
});
