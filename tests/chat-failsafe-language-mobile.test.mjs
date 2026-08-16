import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const route = readFileSync(
  new URL("../src/app/api/validation/contact/route.ts", import.meta.url),
  "utf8",
);
const composer = readFileSync(
  new URL("../src/components/ai/AIChatAnswerComposer.tsx", import.meta.url),
  "utf8",
);
const panel = readFileSync(
  new URL("../src/components/ai/AIChatDrawerPanel.tsx", import.meta.url),
  "utf8",
);
const acknowledgements = readFileSync(
  new URL("../src/lib/ai/conversation-acknowledgement.ts", import.meta.url),
  "utf8",
);
const contactVerification = readFileSync(
  new URL("../src/lib/ai/contact-verification.ts", import.meta.url),
  "utf8",
);
const drawer = readFileSync(
  new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
  "utf8",
);
const validator = readFileSync(
  new URL("../src/lib/ai/customer-input.ts", import.meta.url),
  "utf8",
);

test("contact validation fails closed when the server gate is unavailable", () => {
  assert.match(route, /CONTACT_VALIDATION_UNAVAILABLE/);
  assert.match(route, /503/);
  assert.doesNotMatch(
    route,
    /catch[\s\S]*?valid:\s*true[\s\S]*?verification:\s*"format_only"/,
  );
  assert.match(composer, /!response\.ok \|\|[\s\S]*?payload\.valid !== true/);
  assert.match(composer, /Không thể kiểm tra thông tin liên hệ ở phía máy chủ/);
  assert.doesNotMatch(composer, /catch\s*\{\s*return\s*\{\s*ok:\s*true/);
});

test("the server independently normalizes contact input", () => {
  assert.match(route, /normalizeVietnamPhone/);
  assert.match(route, /function normalizeEmail/);
  assert.match(route, /normalizedValue/);
  assert.match(route, /example\.com/);
});

test("customer garbage is rejected before conversation progression", () => {
  assert.match(validator, /looksLikeKeyboardNoise/);
  assert.match(validator, /looksLikeSuspiciousSingleName/);
  assert.match(validator, /\^0\[35789\]\\d\{8\}\$/);
  assert.match(validator, /Địa chỉ này chưa đủ rõ để khảo sát/);
});

test("assistant acknowledgements explain business meaning instead of repeating one template", () => {
  assert.match(panel, /buildConversationAcknowledgement/);
  assert.match(acknowledgements, /case "material"/);
  assert.match(acknowledgements, /chưa phải vật liệu đã chốt/);
  assert.match(acknowledgements, /case "budget"/);
  assert.match(acknowledgements, /không phải báo giá/);
  assert.match(acknowledgements, /case "timeline"/);
  assert.match(acknowledgements, /case "priority"/);
  assert.match(acknowledgements, /case "surveyAddress"/);
  assert.match(acknowledgements, /getContactVerificationAcknowledgement/);
  assert.match(contactVerification, /quyền sở hữu vẫn cần OTP/i);
});

test("iPhone drawer keeps width, dynamic viewport and non-zooming inputs guarded", () => {
  assert.match(drawer, /w-full max-w-full/);
  assert.match(drawer, /max-h-\[100dvh\]/);
  assert.match(drawer, /safe-area-inset-bottom/);
  assert.doesNotMatch(drawer, /\bw-screen\b/);
  assert.match(composer, /px-3 text-base/);
  assert.match(composer, /grid-cols-\[minmax\(0,1fr\)_2\.75rem\]/);
  assert.match(panel, /overflow-x-hidden/);
  assert.match(panel, /\[overflow-wrap:anywhere\]/);
});
