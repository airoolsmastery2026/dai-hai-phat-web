import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  page: new URL("../src/app/page.tsx", import.meta.url),
  navigation: new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
  hero: new URL("../src/components/sections/HeroSection.tsx", import.meta.url),
  floatingCta: new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
  services: new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
  contact: new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
};

const forbiddenPublicCopy = [
  "Trò chuyện với AI",
  "Chat với AI",
  "Hỏi AI",
  "AI DIGITAL ENGINEERING OFFICE",
  "AI tư vấn",
  "AI hỗ trợ",
];

test("public homepage uses human-first consultation copy", async () => {
  const sources = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")]),
    ),
  );

  assert.match(sources.navigation, /Văn phòng kỹ thuật số/);
  assert.match(sources.navigation, /Trao đổi với kỹ sư/);
  assert.match(sources.hero, /Tiếp nhận yêu cầu 24\/7/);
  assert.match(sources.hero, /Trao đổi với kỹ sư/);
  assert.match(sources.services, /Nhờ kỹ sư tư vấn/);
  assert.match(sources.contact, /kỹ sư sẽ tiếp nhận/);
  assert.doesNotMatch(sources.page, /AIOfficeRouteEntry|AIOfficeExperience/);

  for (const [name, source] of Object.entries(sources)) {
    for (const copy of forbiddenPublicCopy) {
      assert.equal(
        source.includes(copy),
        false,
        `${name} must not expose public-facing copy: ${copy}`,
      );
    }
  }
});
