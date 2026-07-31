import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const verifierPath = new URL(
  "../src/lib/server/phone-verification.ts",
  import.meta.url,
);
const routePath = new URL(
  "../src/app/api/crm/handoff/route.ts",
  import.meta.url,
);
const crmPath = new URL("../src/lib/server/crm.ts", import.meta.url);

test("APILayer phone verification remains server-side and resilient", async () => {
  const source = await readFile(verifierPath, "utf8");

  assert.match(source, /process\.env\.APILAYER_API_KEY/);
  assert.match(source, /api\.apilayer\.com\/number_verification\/validate/);
  assert.match(source, /headers: \{ apikey: apiKey \}/);
  assert.match(source, /PHONE_VERIFICATION_TIMEOUT_MS = 3_500/);
  assert.match(source, /status: "unverified"/);
  assert.match(source, /reason: "not_configured"/);
  assert.match(source, /country_code/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_APILAYER/);
});

test("CRM handoff verifies phone without blocking lead delivery", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /verifyPhoneWithAPILayer\(lead\.contact\.phone\)/);
  assert.match(source, /deliverLeadToCRM\(lead, requestId, \{/);
  assert.match(source, /phone: phoneVerification/);
  assert.match(source, /phoneVerification: phoneVerification\.status/);
});

test("CRM webhook carries verification metadata in schema 1.1", async () => {
  const source = await readFile(crmPath, "utf8");

  assert.match(source, /schemaVersion: "1\.1"/);
  assert.match(source, /verification\?: CRMVerificationMetadata/);
  assert.match(source, /\.\.\.\(verification \? \{ verification \} : \{\}\)/);
  assert.match(source, /PhoneVerificationResult/);
});
