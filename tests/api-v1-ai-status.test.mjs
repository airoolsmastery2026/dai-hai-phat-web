import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/v1/system/ai-status/route.ts",
  import.meta.url,
);
const envExamplePath = new URL("../.env.example", import.meta.url);

test("v1 AI status is protected and reports model-runtime without provider secrets", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /authenticateService/);
  assert.match(source, /\["monitoring", "telegram-control"\]/);
  assert.match(source, /schemaVersion:\s*"1\.0"/);
  assert.match(source, /requestDhpCapability\("model-runtime"\)/);
  assert.match(source, /status:\s*configured \? "available" : "degraded"/);
  assert.match(source, /provider:\s*"model-runtime"/);
  assert.match(source, /policy:\s*"verified-free-only"/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
  assert.doesNotMatch(source, /OPENROUTER_API_KEY/);
  assert.doesNotMatch(source, /apiKey\s*:/);
});

test("ecosystem service authentication is documented for operators", async () => {
  const source = await readFile(envExamplePath, "utf8");

  assert.match(source, /^ECOSYSTEM_SERVICE_API_KEY=/m);
  assert.doesNotMatch(source, /^NEXT_PUBLIC_ECOSYSTEM_SERVICE_API_KEY=/m);
});
