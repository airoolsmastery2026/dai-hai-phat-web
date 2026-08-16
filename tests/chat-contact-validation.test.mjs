import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const composer = readFileSync(
  new URL("../src/components/ai/AIChatAnswerComposer.tsx", import.meta.url),
  "utf8",
);
const route = readFileSync(
  new URL("../src/app/api/validation/contact/route.ts", import.meta.url),
  "utf8",
);
const dnsVerifier = readFileSync(
  new URL("../src/lib/server/email-domain-verification.ts", import.meta.url),
  "utf8",
);

test("contact fields must pass the server gate before the conversation advances", () => {
  assert.match(composer, /\/api\/validation\/contact/);
  assert.match(composer, /!response\.ok \|\| payload\.valid !== true/);
  assert.match(composer, /Không thể kiểm tra thông tin liên hệ ở phía máy chủ/);
  assert.doesNotMatch(
    composer,
    /catch\s*\{\s*return\s*\{\s*ok:\s*true\s*\}/s,
    "network/server failures must not silently pass contact validation",
  );
});

test("the server independently validates phone and email before external checks", () => {
  assert.match(route, /normalizeVietnamPhone/);
  assert.match(route, /function normalizeEmail/);
  assert.match(route, /verifyPhoneWithAPILayer/);
  assert.match(route, /verifyEmailDomain/);
  assert.match(route, /verification: "invalid"/);
  assert.match(route, /CONTACT_VALIDATION_UNAVAILABLE/);
  assert.match(route, /503/);
});

test("email verification checks DNS records without claiming mailbox ownership", () => {
  assert.match(dnsVerifier, /resolveMx/);
  assert.match(dnsVerifier, /resolve4/);
  assert.match(dnsVerifier, /resolve6/);
  assert.match(route, /Hộp thư vẫn chưa được xác minh/);
  assert.match(route, /OTP hoặc xác nhận liên hệ thực tế/);
});

test("contact validation keeps one canonical route and verifier path", () => {
  assert.equal(
    existsSync(new URL("../src/app/api/ai/contact-validation/route.ts", import.meta.url)),
    false,
  );
  assert.equal(
    existsSync(new URL("../src/lib/server/contact-verification.ts", import.meta.url)),
    false,
  );
});
