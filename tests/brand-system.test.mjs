import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("official DHP brand logo is reused by global navigation and footer", () => {
  const brand = read("src/components/brand/BrandLogo.tsx");
  const navigation = read("src/components/layout/SiteNavigation.tsx");
  const footer = read("src/components/layout/SiteFooter.tsx");
  const icon = read("src/app/icon.svg");

  assert.match(brand, /ĐẠI HẢI PHÁT/);
  assert.match(brand, /VĂN PHÒNG KỸ THUẬT SỐ 24\/7/);
  assert.match(brand, /var\(--color-primary\)/);
  assert.match(brand, /var\(--color-metal\)/);

  assert.match(navigation, /<BrandLogo compact/);
  assert.match(footer, /<BrandLogo inverse/);

  assert.match(icon, /#145d60/);
  assert.match(icon, /#9a7440/);
});

test("homepage hero uses the compact professional heading hierarchy", () => {
  const hero = read("src/components/sections/HeroSection.tsx");

  assert.match(hero, /text-\[length:var\(--font-h1\)\]/);
  assert.match(hero, /<span className="block">Thiết kế &amp; thi công<\/span>/);
  assert.match(hero, />từ nhu cầu đến<\/span>/);
  assert.match(hero, />hồ sơ kỹ thuật\.<\/span>/);
  assert.doesNotMatch(hero, /text-\[length:var\(--font-display\)\]/);
});
