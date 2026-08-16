import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const inquiryPath = "src/lib/server/project-inquiries.ts";
const handoffRoutePath = "src/app/api/crm/handoff/route.ts";
const healthPath = "src/lib/server/system-health.ts";

async function source(path) {
  return readFile(path, "utf8");
}

test("customer handoff is persisted idempotently in project_inquiries", async () => {
  const code = await source(inquiryPath);

  assert.match(code, /supabaseRestRequest<ProjectInquiryRow\[]>\("project_inquiries"/);
  assert.match(code, /on_conflict:\s*"request_id"/);
  assert.match(code, /resolution=merge-duplicates,return=representation/);
  assert.match(code, /request_id:\s*lead\.sessionId/);
  assert.match(code, /readiness_decision:\s*"ready_for_follow_up"/);
  assert.doesNotMatch(code, /NEXT_PUBLIC_/);
});

test("public handoff accepts a durable store before optional CRM sync", async () => {
  const code = await source(handoffRoutePath);
  const storeIndex = code.indexOf("await persistProjectInquiry(lead)");
  const fallbackCrmIndex = code.indexOf("await deliverLeadToCRM(lead, requestId", storeIndex);
  const backgroundIndex = code.indexOf("after(async () =>", storeIndex);

  assert.ok(storeIndex > -1, "durable inquiry store must be attempted");
  assert.ok(fallbackCrmIndex > storeIndex, "CRM must remain available as a fallback");
  assert.ok(backgroundIndex > fallbackCrmIndex, "background sync must happen only after a channel accepted the handoff");
  assert.match(code, /acceptedBy:\s*"inquiry-store"\s*\|\s*"crm"/);
  assert.match(code, /HANDOFF_UNAVAILABLE/);
});

test("system health requires phone validation and at least one handoff channel", async () => {
  const code = await source(healthPath);

  assert.match(code, /leadStore:\s*configuredSupabase/);
  assert.match(code, /services\.leadStore === "configured" \|\| services\.crm === "configured"/);
  assert.match(code, /services\.phoneVerification === "configured"/);
  assert.match(code, /SUPABASE_SERVICE_ROLE_KEY/);
});
