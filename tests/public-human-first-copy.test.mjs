import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  page: new URL("../src/app/page.tsx", import.meta.url),
  navigation: new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
  brand: new URL("../src/components/brand/BrandLogo.tsx", import.meta.url),
  hero: new URL("../src/components/sections/HeroSection.tsx", import.meta.url),
  services: new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
  projects: new URL("../src/components/sections/ProjectsSection.tsx", import.meta.url),
  contact: new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
};

test("public homepage keeps human trust language and routes consultation to its own surface", async () => {
  const sources = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")]),
    ),
  );

  assert.match(sources.navigation, /<BrandLogo compact/);
  assert.match(sources.brand, /VĂN PHÒNG KỸ THUẬT SỐ 24\/7/);
  assert.match(sources.navigation, /Bắt đầu tư vấn/);
  assert.match(
    sources.navigation,
    /const CONSULTATION_HREF = "\/ai-tu-van\?ai=1#consultation"/,
  );
  assert.match(sources.hero, /Văn phòng kỹ thuật số 24\/7/);
  assert.match(sources.hero, /Bắt đầu tư vấn/);
  assert.match(sources.hero, /Chuẩn bị báo giá/);
  assert.match(sources.services, /Chọn nhanh hạng mục bạn quan tâm/);
  assert.match(sources.services, /service-ticker-track/);
  assert.doesNotMatch(sources.page, /AIOfficeRouteEntry|GEMINI_API_KEY/);
  assert.match(sources.contact, /kỹ sư sẽ tiếp nhận/);

  const publicCopy = [
    sources.navigation,
    sources.brand,
    sources.hero,
    sources.services,
    sources.projects,
    sources.contact,
  ].join("\n");
  assert.doesNotMatch(publicCopy, /Tư vấn ngay|Mở trò chuyện|Bắt đầu trò chuyện/);
  assert.doesNotMatch(publicCopy, />[^<]*(?:Trợ lý AI|Chat AI|Tư vấn AI|AI tiếp nhận)[^<]*</i);
});

test("homepage keeps a compact human-first hierarchy before project proof", async () => {
  const sources = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")]),
    ),
  );

  const orderedComponents = [
    "<HeroSection />",
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

  assert.match(sources.hero, /py-\[var\(--space-8\)\]/);
  assert.match(sources.services, /SERVICES\.slice\(0, 4\)/);
  assert.match(sources.services, /grid-cols-2/);
  assert.match(sources.services, /lg:grid-cols-4/);
  assert.match(sources.projects, /SERVICES\.slice\(0, 4\)/);
  assert.doesNotMatch(sources.contact, /COMPANY_CONFIG\.phones\[1\]/);
});
