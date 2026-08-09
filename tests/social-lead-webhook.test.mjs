import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import {
  createWebhookSignature,
  verifyWebhookSignature,
  WebhookVerificationError,
} from "../src/lib/server/webhook-signature.ts";

const routeSource = await readFile(
  "src/app/api/v1/webhooks/social/lead/route.ts",
  "utf8",
).catch(() => "");
const persistenceSource = await readFile(
  "src/lib/server/social-lead-webhook.ts",
  "utf8",
).catch(() => "");
const migrationSource = await readFile(
  "supabase/migrations/20260809012000_add_social_leads.sql",
  "utf8",
).catch(() => "");

test("webhook signature verifier accepts a valid fresh v1 signature", () => {
  const payload = JSON.stringify({ eventId: "evt-1" });
  const timestamp = "1760000000";
  const secret = "unit-test-secret";
  const signature = createWebhookSignature(payload, timestamp, secret);

  assert.doesNotThrow(() =>
    verifyWebhookSignature(payload, timestamp, signature, secret, {
      nowSeconds: 1760000060,
      maxAgeSeconds: 300,
      maxFutureSkewSeconds: 60,
    }),
  );
});

test("webhook signature verifier rejects stale timestamps", () => {
  const payload = "{}";
  const timestamp = "1760000000";
  const secret = "unit-test-secret";
  const signature = createWebhookSignature(payload, timestamp, secret);

  assert.throws(
    () =>
      verifyWebhookSignature(payload, timestamp, signature, secret, {
        nowSeconds: 1760000401,
        maxAgeSeconds: 300,
        maxFutureSkewSeconds: 60,
      }),
    (error) =>
      error instanceof WebhookVerificationError && error.code === "stale",
  );
});

test("webhook signature verifier rejects invalid signatures", () => {
  assert.throws(
    () =>
      verifyWebhookSignature("{}", "1760000000", "v1=deadbeef", "secret", {
        nowSeconds: 1760000010,
      }),
    (error) =>
      error instanceof WebhookVerificationError && error.code === "invalid_signature",
  );
});

test("social lead route enforces signed idempotent webhook headers", () => {
  assert.match(routeSource, /ECOSYSTEM_WEBHOOK_SECRET/);
  assert.match(routeSource, /X-DHP-Signature/i);
  assert.match(routeSource, /X-DHP-Timestamp/i);
  assert.match(routeSource, /X-DHP-Event-Id/i);
  assert.match(routeSource, /Idempotency-Key/i);
  assert.match(routeSource, /verifyWebhookSignature/);
  assert.match(routeSource, /eventId !== eventHeader/);
  assert.match(routeSource, /idempotencyKey !== envelope\.eventId/);
  assert.match(routeSource, /sourceService !== "publishing-bot"/);
  assert.match(routeSource, /eventType !== "social\.lead\.created"/);
  assert.match(routeSource, /recordSocialLead/);
  assert.match(routeSource, /private, no-store/);
});

test("social lead persistence records canonical rows and detects replay conflicts", () => {
  assert.match(persistenceSource, /social_leads/);
  assert.match(persistenceSource, /event_id/);
  assert.match(persistenceSource, /external_lead_id/);
  assert.match(persistenceSource, /SocialLeadReplayError/);
  assert.match(persistenceSource, /23505/);
});

test("social lead migration provides durable replay protection", () => {
  assert.match(migrationSource, /create table public\.social_leads/i);
  assert.match(migrationSource, /event_id text not null unique/i);
  assert.match(migrationSource, /external_lead_id text not null/i);
  assert.match(migrationSource, /unique \(platform, external_lead_id\)/i);
  assert.match(migrationSource, /enable row level security/i);
});
