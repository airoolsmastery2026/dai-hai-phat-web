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
const phoneVerifierPath = new URL(
  "../src/lib/server/phone-verification.ts",
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
const envExamplePath = new URL("../.env.example", import.meta.url);

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

test("phone verifier configuration is mandatory instead of silently becoming format-only", async () => {
  const route = await readFile(routePath, "utf8");
  const verifier = await readFile(phoneVerifierPath, "utf8");
  const envExample = await readFile(envExamplePath, "utf8");

  assert.match(verifier, /process\.env\.APILAYER_API_KEY/);
  assert.match(verifier, /reason: "not_configured"/);
  assert.match(route, /result\.reason === "not_configured"/);
  assert.match(route, /code: "PHONE_VERIFICATION_NOT_CONFIGURED"/);
  assert.match(route, /503/);
  assert.match(envExample, /^APILAYER_API_KEY=$/m);
});

test("temporary phone provider failures remain explicitly unverified rather than invalid", async () => {
  const verifier = await readFile(phoneVerifierPath, "utf8");
  const route = await readFile(routePath, "utf8");

  assert.match(
    verifier,
    /reason\?: "not_configured" \| "timeout" \| "upstream" \| "invalid_response"/,
  );
  assert.match(verifier, /error\.name === "AbortError"/);
  assert.match(verifier, /\? "timeout"/);
  assert.match(verifier, /: "upstream"/);
  assert.match(verifier, /reason: "invalid_response"/);
  assert.match(route, /verification: "format_only"/);
  assert.match(route, /tạm thời chưa xác nhận được/);
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
  assert.match(source, /phoneVerification\.reason === "not_configured"/);
  assert.match(source, /code: "PHONE_VERIFICATION_NOT_CONFIGURED"/);
  assert.match(source, /503/);
  assert.match(source, /verifyEmailDomain\(lead\.contact\.email\)/);
  assert.match(source, /emailVerification\?\.status === "invalid"/);
  assert.match(source, /code: "EMAIL_DOMAIN_INVALID"/);
});
