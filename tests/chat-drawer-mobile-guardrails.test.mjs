import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const drawer = readFileSync(
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

test("mobile drawer never depends on viewport-width units", () => {
  assert.doesNotMatch(drawer, /\bw-screen\b/);
  assert.match(drawer, /w-full max-w-full/);
  assert.match(drawer, /max-h-\[100dvh\]/);
  assert.match(drawer, /safe-area-inset-bottom/);
  assert.match(drawer, /overflow-hidden/);
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
