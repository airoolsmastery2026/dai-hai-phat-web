import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/validation/contact/route.ts",
  import.meta.url,
);
const emailVerifierPath = new URL(
  "../src/lib/server/email-domain-verification.ts",
  import.meta.url,
);
const composerPath = new URL(
  "../src/components/ai/AIChatAnswerComposer.tsx",
  import.meta.url,
);
const crmRoutePath = new URL(
  "../src/app/api/crm/handoff/route.ts",
  import.meta.url,
);

test("contact validation route is same-origin, rate-limited and distinguishes verification levels", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /verifyPhoneWithAPILayer/);
  assert.match(source, /verifyEmailDomain/);
  assert.match(source, /verification: "network_valid"/);
  assert.match(source, /verification: "domain_valid"/);
  assert.match(source, /verification: "format_only"/);
  assert.match(source, /verification: "invalid"/);
  assert.match(source, /OTP hoặc xác nhận liên hệ thực tế/);
});

test("email verification checks mail routing without pretending to verify mailbox ownership", async () => {
  const source = await readFile(emailVerifierPath, "utf8");

  assert.match(source, /node:dns\/promises/);
  assert.match(source, /resolveMx/);
  assert.match(source, /resolve4/);
  assert.match(source, /resolve6/);
  assert.match(source, /DNS_TIMEOUT_MS = 2_500/);
  assert.match(source, /status: "invalid"/);
  assert.match(source, /status: "unverified"/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
});

test("chat checks phone email and Zalo on the server before progressing", async () => {
  const source = await readFile(composerPath, "utf8");

  assert.match(source, /fetch\("\/api\/validation\/contact"/);
  assert.match(source, /question\.field === "phone"/);
  assert.match(source, /question\.field === "email"/);
  assert.match(source, /question\.field === "zalo"/);
  assert.match(source, /if \(!serverValidation\.ok\)/);
  assert.match(source, /setInputError\(serverValidation\.error\)/);
  assert.match(source, /Đang kiểm tra thông tin trước khi ghi nhận/);
  assert.match(source, /quyền sở hữu vẫn cần OTP/);
});

test("CRM repeats phone and email-domain checks before delivery", async () => {
  const source = await readFile(crmRoutePath, "utf8");

  assert.match(source, /phoneVerification\.status === "invalid"/);
  assert.match(source, /code: "PHONE_INVALID"/);
  assert.match(source, /verifyEmailDomain\(lead\.contact\.email\)/);
  assert.match(source, /emailVerification\?\.status === "invalid"/);
  assert.match(source, /code: "EMAIL_DOMAIN_INVALID"/);
});
