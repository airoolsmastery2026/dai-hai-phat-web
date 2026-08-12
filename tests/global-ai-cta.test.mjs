import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("makes engineer consultation the primary global conversion path", async () => {
  const navigation = await readFile(
    new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
    "utf8",
  );
  const floatingCta = await readFile(
    new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navigation, /href="\/contact"/);
  assert.match(navigation, /Trao đổi với kỹ sư/);
  assert.match(navigation, /Tư vấn kỹ sư/);
  assert.doesNotMatch(navigation, /#ai-office|Tư vấn AI|Bắt đầu tư vấn AI/i);

  assert.match(floatingCta, /label: "Trao đổi với kỹ sư"/);
  assert.match(floatingCta, /href: "\/contact"/);
  assert.match(floatingCta, /label: "Gọi kỹ sư"/);
  assert.match(floatingCta, /label: "Gửi Zalo"/);
  assert.match(floatingCta, /onClick=\{\(\) => setOpen\(false\)\}/);
  assert.match(floatingCta, /bg-\[var\(--color-primary\)\]/);
  assert.doesNotMatch(floatingCta, /#ai-office|Tư vấn AI|mobile-ai-attention|WhatsApp|whatsapp1/i);
});
