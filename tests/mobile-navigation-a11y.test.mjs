import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps mobile navigation keyboard accessible", async () => {
  const navigation = await readFile(
    new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navigation, /menuButtonRef/);
  assert.match(navigation, /mobileNavigationRef/);
  assert.match(navigation, /firstMenuItem\?\.focus\(\)/);
  assert.match(navigation, /event\.key === "Escape"[\s\S]*closeMenu\(true\)/);
  assert.match(navigation, /event\.key !== "Tab"/);
  assert.match(navigation, /lastElement\.focus\(\)/);
  assert.match(navigation, /firstElement\.focus\(\)/);
  assert.match(navigation, /requestAnimationFrame\(\(\) => menuButtonRef\.current\?\.focus\(\)\)/);
  assert.match(navigation, /role="dialog"/);
  assert.match(navigation, /aria-modal="true"/);
  assert.match(navigation, /aria-labelledby="mobile-navigation-title"/);
  assert.match(navigation, /window\.matchMedia\("\(min-width: 1280px\)"\)/);
  assert.match(navigation, /className="hidden items-center gap-\[var\(--space-6\)\] xl:flex"/);
  assert.match(navigation, /focus-visible:ring-\[var\(--color-focus\)\] xl:hidden/);
  assert.match(navigation, /shadow-\[var\(--shadow-md\)\] xl:hidden/);

  const closeHandlers = navigation.match(/onClick=\{\(\) => closeMenu\(\)\}/g) ?? [];
  assert.ok(closeHandlers.length >= 3, "All mobile navigation actions should close the menu");
});

test("keeps navigation and canonical brand text readable on the light surface", async () => {
  const [navigation, brand] = await Promise.all([
    readFile(
      new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/brand/BrandLogo.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(navigation, /bg-\[var\(--color-surface\)\]\/95/);
  assert.match(navigation, /<BrandLogo compact/);
  assert.match(navigation, /font-semibold[^\"]*text-\[var\(--color-text-muted\)\]/);
  assert.match(navigation, /text-\[var\(--color-primary-contrast\)\]/);

  assert.match(brand, /font-black uppercase/);
  assert.match(brand, /"text-\[var\(--color-text\)\]"/);
  assert.match(brand, /"text-\[var\(--color-metal-strong\)\]"/);
  assert.match(brand, /ĐẠI HẢI PHÁT/);
});
