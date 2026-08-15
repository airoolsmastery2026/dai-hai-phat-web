import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/v1/system/ai-status/route.ts",
  import.meta.url,
);
const envExamplePath = new URL("../.env.example", import.meta.url);

test("v1 AI status is protected and does not expose the Gemini key", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /authenticateService/);
  assert.match(source, /\["monitoring", "telegram-control"\]/);
  assert.match(source, /schemaVersion:\s*"1\.0"/);
  assert.match(source, /status:\s*geminiConfigured \? "available" : "degraded"/);
  assert.match(source, /configured:\s*geminiConfigured/);
  assert.doesNotMatch(source, /GEMINI_API_KEY\s*[:,]/);
  assert.doesNotMatch(source, /apiKey\s*:/);
});

test("ecosystem service authentication is documented for operators", async () => {
  const source = await readFile(envExamplePath, "utf8");

  assert.match(source, /^ECOSYSTEM_SERVICE_API_KEY=/m);
  assert.doesNotMatch(source, /^NEXT_PUBLIC_ECOSYSTEM_SERVICE_API_KEY=/m);
});
