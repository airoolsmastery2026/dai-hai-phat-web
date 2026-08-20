import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const footerPath = new URL("../src/components/layout/SiteFooter.tsx", import.meta.url);
const ctaPath = new URL("../src/components/sections/AIConsultationCta.tsx", import.meta.url);

test("footer keeps a translucent token-driven surface with stronger readable text", async () => {
  const source = await readFile(footerPath, "utf8");

  assert.match(source, /bg-\[var\(--color-surface-dark\)\]\/95/);
  assert.match(source, /backdrop-blur-md/);
  assert.match(source, /bg-\[var\(--color-surface-dark-soft\)\]\/70/);
  assert.match(source, /text-\[var\(--color-text-dark-muted\)\]/);
  assert.match(source, /Văn phòng \/ xưởng:/);
  assert.match(source, /COMPANY_CONFIG\.address/);
  assert.match(source, /COMPANY_CONFIG\.socials\.zalo1/);
});

test("consultation panel matches the glass footer and points to the canonical consultation anchor", async () => {
  const source = await readFile(ctaPath, "utf8");

  assert.match(source, /bg-\[var\(--color-surface-dark\)\]\/95/);
  assert.match(source, /bg-\[var\(--color-surface-dark-soft\)\]\/80/);
  assert.match(source, /backdrop-blur-xl/);
  assert.match(source, /shadow-\[var\(--shadow-lg\)\]/);
  assert.match(source, /\/ai-tu-van\?ai=1#consultation/);
  assert.match(source, /&ai=1#consultation/);
  assert.match(source, /Bắt đầu tư vấn/);
});
