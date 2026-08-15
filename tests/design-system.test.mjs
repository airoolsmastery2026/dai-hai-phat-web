import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (path) => readFileSync(join(ROOT, path), "utf8");

test("design foundation has one canonical contract", () => {
  const design = read("DESIGN.md");
  const components = read("COMPONENTS.md");
  const globals = read("src/app/globals.css");
  const tailwind = read("tailwind.config.ts");

  assert.match(design, /DESIGN\.md/);
  assert.match(components, /DESIGN\.md/);
  assert.match(globals, /--color-primary/);
  assert.match(tailwind, /var\(--color-primary\)/);
});

test("Tailwind v3 remains connected to the production CSS pipeline", () => {
  const globals = read("src/app/globals.css");
  const packageJson = read("package.json");

  assert.match(globals, /@tailwind base;/);
  assert.match(globals, /@tailwind components;/);
  assert.match(globals, /@tailwind utilities;/);
  assert.match(packageJson, /"tailwindcss": "\^3/);
});

test("runtime exposes the required semantic tokens", () => {
  const globals = read("src/app/globals.css");

  for (const token of [
    "--color-background",
    "--color-surface",
    "--color-text",
    "--color-text-muted",
    "--color-primary",
    "--color-primary-contrast",
    "--color-border",
    "--color-focus",
    "--space-container",
    "--space-section",
    "--space-card",
    "--radius-md",
    "--radius-lg",
    "--shadow-md",
  ]) {
    assert.match(globals, new RegExp(token));
  }
});

test("components do not reintroduce legacy literal colors or broken CTA hashes", () => {
  const files = [
    "src/components/layout/SiteHeader.tsx",
    "src/components/layout/SiteFooter.tsx",
    "src/components/sections/HeroSection.tsx",
    "src/components/sections/ServicesSection.tsx",
    "src/components/sections/ProjectsSection.tsx",
    "src/components/sections/ContactSection.tsx",
    "src/components/sections/AIOfficeSection.tsx",
  ];

  for (const path of files) {
    const source = read(path);
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}\b/);
    assert.doesNotMatch(source, /href="#contact"/);
  }
});

test("the shared application shell is rendered once", () => {
  const layout = read("src/app/layout.tsx");
  const homepage = read("src/app/page.tsx");

  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /<SiteFooter \/>/);
  assert.doesNotMatch(homepage, /<SiteHeader \/>/);
  assert.doesNotMatch(homepage, /<SiteFooter \/>/);
});

test("fake and duplicate surfaces stay removed", () => {
  for (const path of [
    "src/components/layout/SiteHeader.tsx",
    "src/components/layout/TopBar.tsx",
    "src/components/sections/FloatingActions.tsx",
    "src/components/sections/QuoteFormSection.tsx",
    "src/components/ui/ActionButton.tsx",
    "src/components/ui/LazySection.tsx",
  ]) {
    assert.equal(existsSync(join(ROOT, path)), false, `${path} must stay removed`);
  }

  assert.doesNotMatch(read("src/app/contact/page.tsx"), /<form\b/);
  assert.match(
    read("src/components/sections/AIOfficeSection.tsx"),
    /chưa tự động gửi tới\s+kỹ sư hoặc CRM/,
  );
});

test("homepage conversion surfaces preserve accessibility and the public AI Office", () => {
  const hero = read("src/components/sections/HeroSection.tsx");
  const home = read("src/app/page.tsx");
  const button = read("src/components/ui/Button.tsx");
  const aiOffice = read("src/components/sections/AIOfficeSection.tsx");
  const aiOfficeLoading = read("src/components/sections/AIOfficeLoadingState.tsx");

  assert.match(hero, /<Button href="#ai-office">/);
  assert.match(hero, /Thiết kế &amp; thi công nhà ở/);
  assert.match(hero, /hero-luxury-materials-v1\.webp/);
  assert.doesNotMatch(hero, /min-h-\[calc\(100svh/);
  assert.match(home, /AIOfficeRouteEntry/);
  assert.match(home, /AIOfficeLoadingState/);
  assert.match(aiOfficeLoading, /id="ai-office"/);
  assert.match(aiOfficeLoading, /aria-live="polite"/);
  assert.match(button, /touch-manipulation/);
  assert.doesNotMatch(button, /backdrop-blur/);
  assert.match(aiOffice, /id="ai-office"/);
  assert.match(aiOffice, /title="Tiến trình làm việc"/);
  assert.match(aiOffice, /title="Dữ liệu hồ sơ"/);
  assert.match(aiOffice, /title="Độ đầy đủ"/);
  assert.doesNotMatch(aiOffice, /title="(?:Working Timeline|Memory|Confidence)"/);
});
