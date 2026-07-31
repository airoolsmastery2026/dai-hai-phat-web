import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const healthSource = await readFile("src/lib/server/system-health.ts", "utf8");
const routeSource = await readFile(
  "src/app/api/v1/integrations/system/health/route.ts",
  "utf8",
);

test("health snapshot checks configuration without exposing secret values", () => {
  assert.match(healthSource, /GEMINI_API_KEY/);
  assert.match(healthSource, /CRM_WEBHOOK_URL/);
  assert.match(healthSource, /APILAYER_API_KEY/);
  assert.match(healthSource, /ECOSYSTEM_SERVICE_API_KEY/);
  assert.doesNotMatch(healthSource, /return env\./);
  assert.match(healthSource, /\?\s*"operational"\s*:\s*"degraded"/);
});

test("health endpoint is restricted to control and monitoring services", () => {
  assert.match(routeSource, /"telegram-control"/);
  assert.match(routeSource, /"monitoring"/);
  assert.doesNotMatch(routeSource, /"publishing-bot"/);
  assert.match(routeSource, /health\.state === "operational" \? 200 : 503/);
  assert.match(routeSource, /private, no-store/);
  assert.match(routeSource, /schemaVersion: "1\.0"/);
});
