import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  page: new URL("../src/app/page.tsx", import.meta.url),
  navigation: new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
  hero: new URL("../src/components/sections/HeroSection.tsx", import.meta.url),
  services: new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
  projects: new URL("../src/components/sections/ProjectsSection.tsx", import.meta.url),
  contact: new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
};

test("public homepage keeps human trust language while exposing the AI assistant as a core capability", async () => {
  const sources = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")]),
    ),
  );

  assert.match(sources.navigation, /Văn phòng kỹ thuật số/);
  assert.match(sources.navigation, /Trợ lý AI 24\/7/);
  assert.match(sources.navigation, /href="\/#ai-office"/);
  assert.match(sources.hero, /AI tiếp nhận nhu cầu 24\/7/);
  assert.match(sources.hero, /Bắt đầu tư vấn AI/);
  assert.match(sources.services, /Mở trợ lý AI/);
  assert.match(sources.page, /AIOfficeRouteEntry/);
  assert.match(sources.page, /Boolean\(process\.env\.GEMINI_API_KEY\?\.trim\(\)\)/);
  assert.match(sources.contact, /kỹ sư sẽ tiếp nhận/);
});

test("homepage keeps the AI Office directly below the hero before service proof", async () => {
  const sources = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")]),
    ),
  );

  const orderedComponents = [
    "<HeroSection />",
    "<AIOfficeRouteEntry",
    "<ServicesSection />",
    "<ProjectsSection />",
    "<ContactSection />",
  ];

  let previousIndex = -1;
  for (const component of orderedComponents) {
    const index = sources.page.indexOf(component);
    assert.ok(index > previousIndex, `${component} must preserve the homepage order`);
    previousIndex = index;
  }

  for (const name of ["hero", "services", "projects", "contact"]) {
    assert.doesNotMatch(
      sources[name],
      /--space-section(?:-lg)?/,
      `${name} must keep the compact public spacing rhythm`,
    );
  }

  assert.match(sources.hero, /lg:min-h-\[30rem\]/);
  assert.match(sources.services, /SERVICES\.slice\(0, 4\)/);
  assert.match(sources.projects, /SERVICES\.slice\(0, 4\)/);
  assert.doesNotMatch(sources.contact, /COMPANY_CONFIG\.phones\[1\]/);
});
