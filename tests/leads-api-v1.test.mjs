import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const routePath = "src/app/api/v1/leads/route.ts";

async function readRoute() {
  return readFile(routePath, "utf8");
}

test("POST /api/v1/leads is an authenticated service adapter", async () => {
  const source = await readRoute();

  assert.match(source, /authenticateService/);
  assert.match(source, /"publishing-bot"/);
  assert.match(source, /"telegram-control"/);
  assert.doesNotMatch(source, /authenticateService\([\s\S]*?"monitoring"/);
  assert.match(source, /application\/json/);
  assert.match(source, /Idempotency-Key/i);
  assert.match(source, /parseCRMHandoffRequest/);
  assert.match(source, /deliverLeadToCRM/);
});

test("POST /api/v1/leads preserves idempotency and blocks bot payloads", async () => {
  const source = await readRoute();

  assert.match(source, /idempotencyKey/);
  assert.match(source, /lead\.sessionId/);
  assert.match(source, /IDEMPOTENCY_KEY_REQUIRED/);
  assert.match(source, /IDEMPOTENCY_KEY_MISMATCH/);
  assert.match(source, /lead\.website/);
});

test("POST /api/v1/leads uses the ecosystem response contract", async () => {
  const source = await readRoute();

  assert.match(source, /schemaVersion:\s*"1\.0"/);
  assert.match(source, /requestId/);
  assert.match(source, /data:\s*\{/);
  assert.match(source, /leadId/);
  assert.match(source, /receivedAt/);
  assert.match(source, /error:\s*\{/);
  assert.match(source, /INVALID_LEAD_PAYLOAD/);
  assert.match(source, /CRM_UNAVAILABLE/);
  assert.match(source, /private, no-store/);
});
