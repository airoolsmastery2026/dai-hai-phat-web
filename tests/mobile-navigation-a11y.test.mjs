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
  assert.match(navigation, /window\.matchMedia\("\(min-width: 1024px\)"\)/);

  const closeHandlers = navigation.match(/onClick=\{\(\) => closeMenu\(\)\}/g) ?? [];
  assert.ok(closeHandlers.length >= 3, "All mobile navigation actions should close the menu");
});
