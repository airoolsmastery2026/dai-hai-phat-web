import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/project-analysis/route.ts",
  import.meta.url,
);

test("project analysis returns an explicit timeout response", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /const timedOut = error\.code === "timeout"/);
  assert.match(source, /"AI_TIMEOUT"/);
  assert.match(source, /timedOut \? 504 : 503/);
  assert.match(source, /Phân tích AI phản hồi quá lâu/);
  assert.match(source, /Hồ sơ vẫn được giữ nguyên/);
});

test("rate limiting and generic upstream failures remain distinct", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /"RATE_LIMITED"/);
  assert.match(source, /"AI_UNAVAILABLE"/);
  assert.match(source, /rateLimited \? 429/);
  assert.match(source, /"Retry-After": "30"/);
});
