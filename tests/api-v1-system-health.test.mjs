import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/v1/system/health/route.ts",
  import.meta.url,
);

test("versioned system health route follows the v1 response contract", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /schemaVersion:\s*"1\.0"/);
  assert.match(source, /requestId/);
  assert.match(source, /data:\s*\{/);
  assert.match(source, /status:\s*"ok"/);
  assert.match(source, /service:\s*"dai-hai-phat-web"/);
  assert.match(source, /timestamp:\s*new Date\(\)\.toISOString\(\)/);
  assert.match(source, /apiJsonResponse/);
  assert.match(source, /Cache-Control":\s*"private, no-store"/);
  assert.doesNotMatch(source, /process\.env|authorization|token|secret/i);
});

test("versioned system health route supports lightweight HEAD checks", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /export function HEAD\(\)/);
  assert.match(source, /status:\s*200/);
  assert.match(source, /X-Content-Type-Options":\s*"nosniff"/);
});
