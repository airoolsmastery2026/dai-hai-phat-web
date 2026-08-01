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
  const backToTop = await readFile(
    new URL("../src/components/layout/BackToTop.tsx", import.meta.url),
    "utf8",
  );
  const mobileOfficeVisibility = await readFile(
    new URL("../src/hooks/useMobileAIOfficeVisibility.ts", import.meta.url),
    "utf8",
  );
  const globalStyles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(navigation, /href="\/#ai-office"/);
  assert.match(navigation, /Tư vấn AI 24\/7/);
  assert.match(navigation, /Bắt đầu tư vấn AI/);
  assert.match(floatingCta, /label: "Tư vấn AI 24\/7"/);
  assert.match(floatingCta, /href: "\/#ai-office"/);
  assert.match(floatingCta, /onClick=\{\(\) => setOpen\(false\)\}/);
  assert.match(floatingCta, /bg-\[var\(--color-primary\)\]/);
  assert.match(floatingCta, /mobile-ai-attention/);
  assert.match(floatingCta, /isMobileOfficeVisible/);
  assert.match(floatingCta, /if \(isMobileOfficeVisible\) return null/);
  assert.match(backToTop, /useMobileAIOfficeVisibility/);
  assert.match(backToTop, /if \(isMobileOfficeVisible\) return null/);
  assert.match(mobileOfficeVisibility, /document\.getElementById\("ai-office"\)/);
  assert.match(mobileOfficeVisibility, /window\.innerWidth < 1024/);
  assert.match(globalStyles, /@keyframes mobile-ai-attention/);
  assert.match(globalStyles, /animation: mobile-ai-attention[^;]* 2 both/);
  assert.match(
    globalStyles,
    /prefers-reduced-motion: reduce[\s\S]*\.mobile-ai-attention[\s\S]*animation: none !important/,
  );
  assert.doesNotMatch(floatingCta, /WhatsApp|whatsapp1/);
});
