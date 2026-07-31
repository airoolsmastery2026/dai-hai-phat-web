import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const attribution = fs.readFileSync("src/lib/marketing/attribution.ts", "utf8");
const capture = fs.readFileSync(
  "src/components/analytics/LeadAttributionCapture.tsx",
  "utf8",
);
const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
const handoff = fs.readFileSync("src/lib/ai/handoff.ts", "utf8");
const route = fs.readFileSync("src/app/api/crm/handoff/route.ts", "utf8");

test("captures only first-touch campaign attribution for 30 days", () => {
  assert.match(attribution, /dhp-lead-attribution-v1/);
  assert.match(attribution, /30 \* 24 \* 60 \* 60/);
  assert.match(attribution, /utm_source/);
  assert.match(attribution, /utm_campaign/);
  assert.match(attribution, /if \(existing\) return existing/);
  assert.doesNotMatch(attribution, /phone|email|customerName/);
});

test("registers lightweight attribution capture globally", () => {
  assert.match(capture, /externalReferrer/);
  assert.match(capture, /SameSite=Lax/);
  assert.match(capture, /window\.localStorage/);
  assert.match(layout, /<LeadAttributionCapture \/>/);
});

test("validates attribution before CRM delivery", () => {
  assert.match(handoff, /parseAttribution/);
  assert.match(handoff, /Date\.parse\(firstTouchAt\)/);
  assert.match(route, /request\.cookies\.get\(ATTRIBUTION_COOKIE_NAME\)/);
  assert.match(route, /parseCRMHandoffRequest\(\{ \.\.\.parsedLead, attribution \}\)/);
  assert.match(route, /attributionSource/);
});
