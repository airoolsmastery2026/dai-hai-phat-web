import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const floating = readFileSync(
  new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
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

test("mobile consultation avoids viewport-width overflow and keeps Zalo safe-area aware", () => {
  assert.doesNotMatch(panel, /\bw-screen\b/);
  assert.match(panel, /w-full max-w-full/);
  assert.match(panel, /overflow-x-hidden/);
  assert.match(panel, /min-w-0/);
  assert.match(floating, /safe-area-inset-bottom/);
  assert.match(floating, /safe-area-inset-right/);
  assert.match(floating, /aria-label="Liên hệ Đại Hải Phát qua Zalo"/);
});

test("iPhone text input stays at 16px and skip does not share its row", () => {
  assert.match(composer, /text-base[^"\n]*sm:text-sm/);
  assert.match(composer, /grid-cols-\[minmax\(0,1fr\)_2\.75rem\]/);
  assert.match(composer, /Bỏ qua bước này/);
  assert.match(composer, /mt-2 min-h-10 w-full/);
});

test("long customer content cannot force horizontal overflow", () => {
  assert.match(panel, /overflow-x-hidden/);
  assert.match(panel, /\[overflow-wrap:anywhere\]/);
  assert.match(panel, /min-w-0/);
});

test("answer composer applies local and server quality gates before saving", () => {
  assert.match(composer, /validateCustomerAnswer\(question, candidate\)/);
  assert.match(composer, /if \(!validation\.ok\)/);
  assert.match(
    composer,
    /validateContactOnServer\(question, validation\.value\)/,
  );
  assert.match(composer, /if \(!serverValidation\.ok\)/);
  assert.match(
    composer,
    /onAnswer\(serverValidation\.normalizedValue, serverValidation\.receipt\)/,
  );
});
