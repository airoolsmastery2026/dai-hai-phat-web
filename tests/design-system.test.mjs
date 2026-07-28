import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function read(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

function listCodeFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? listCodeFiles(path)
      : /\.(?:ts|tsx)$/.test(path)
        ? [path]
        : [];
  });
}

test("design foundation has one canonical contract", () => {
  for (const path of [
    "DESIGN.md",
    "COMPONENTS.md",
    ".ai/UI_PROMPT.md",
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
  ]) {
    assert.equal(existsSync(join(ROOT, path)), true, `${path} must exist`);
  }

  const design = read("DESIGN.md");
  assert.match(design, /^---\nversion: alpha\n/);

  const orderedSections = [
    "## Overview",
    "## Colors",
    "## Typography",
    "## Layout",
    "## Elevation & Depth",
    "## Shapes",
    "## Components",
    "## Do's and Don'ts",
  ];

  let previousIndex = -1;
  for (const section of orderedSections) {
    const currentIndex = design.indexOf(section);
    assert.ok(currentIndex > previousIndex, `${section} must follow the spec order`);
    previousIndex = currentIndex;
  }

  const uiPrompt = read(".ai/UI_PROMPT.md");
  for (const required of [
    "DESIGN.md",
    "COMPONENTS.md",
    "Mobile First",
    "WCAG AA",
    "npm run typecheck",
    "npm run build",
  ]) {
    assert.match(uiPrompt, new RegExp(required.replaceAll(".", "\\.")));
  }
});

test("runtime exposes the required semantic tokens", () => {
  const css = read("src/app/globals.css");

  for (const token of [
    "--color-primary",
    "--color-primary-hover",
    "--color-background",
    "--color-surface",
    "--color-text",
    "--color-border",
    "--font-sans",
    "--space-section",
    "--radius-md",
    "--shadow-md",
    "--duration-fast",
    "--container-max",
  ]) {
    assert.match(css, new RegExp(`${token.replaceAll("-", "\\-")}:`));
  }

  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("components do not reintroduce legacy literal colors or broken CTA hashes", () => {
  const sourceFiles = listCodeFiles(join(ROOT, "src"));

  for (const path of sourceFiles) {
    const source = readFileSync(path, "utf8");
    const relative = path.slice(ROOT.length + 1);

    if (relative !== "src/app/layout.tsx") {
      assert.doesNotMatch(
        source,
        /#[0-9a-f]{3,8}\b/i,
        `${relative} must use semantic color tokens`,
      );
    }

    assert.doesNotMatch(source, /#bao-gia/, `${relative} has a missing quote anchor`);
    assert.doesNotMatch(
      source,
      /href=["']#contact["']/,
      `${relative} must navigate to /contact`,
    );
  }
});

test("the shared application shell is rendered once", () => {
  const layout = read("src/app/layout.tsx");
  for (const component of [
    "SiteNavigation",
    "SiteFooter",
    "FloatingCta",
    "BackToTop",
  ]) {
    assert.match(layout, new RegExp(`<${component}\\b`));
  }

  for (const path of [
    "src/app/page.tsx",
    "src/app/gallery/page.tsx",
    "src/app/services/[slug]/page.tsx",
    "src/app/blog/[slug]/page.tsx",
  ]) {
    const source = read(path);
    assert.doesNotMatch(source, /<(?:SiteNavigation|SiteFooter|FloatingCta|BackToTop)\b/);
  }
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
