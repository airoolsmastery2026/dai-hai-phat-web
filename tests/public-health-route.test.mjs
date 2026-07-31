import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile("src/app/api/health/route.ts", "utf8");

test("public health route exposes only liveness metadata", () => {
  assert.match(source, /export const runtime = "edge"/);
  assert.match(source, /export function GET\(\)/);
  assert.match(source, /export function HEAD\(\)/);
  assert.match(source, /status: "ok"/);
  assert.match(source, /service: "dai-hai-phat-web"/);
  assert.match(source, /new Date\(\)\.toISOString\(\)/);
  assert.doesNotMatch(source, /process\.env/);
  assert.doesNotMatch(source, /GEMINI|CRM|APILAYER|ECOSYSTEM/);
  assert.doesNotMatch(source, /fetch\(/);
});

test("public health route is not cacheable by intermediaries", () => {
  assert.match(source, /max-age=0, must-revalidate/);
  assert.match(source, /X-Content-Type-Options/);
  assert.match(source, /status: 200/);
});
