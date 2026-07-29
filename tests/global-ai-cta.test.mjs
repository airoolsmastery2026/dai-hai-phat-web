import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("makes the AI intake the primary global conversion path", async () => {
  const navigation = await readFile(
    new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
    "utf8",
  );
  const floatingCta = await readFile(
    new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navigation, /href="\/#ai-office"/);
  assert.match(navigation, /Tư vấn AI 24\/7/);
  assert.match(navigation, /Bắt đầu tư vấn AI/);
  assert.match(floatingCta, /label: "Tư vấn AI 24\/7"/);
  assert.match(floatingCta, /href: "\/#ai-office"/);
  assert.match(floatingCta, /onClick=\{\(\) => setOpen\(false\)\}/);
  assert.doesNotMatch(floatingCta, /WhatsApp|whatsapp1/);
});
