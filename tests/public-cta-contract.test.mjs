import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public CTA contract keeps one consultation entry and a separate Zalo channel", async () => {
  const [navigation, floating, aiPage, aiExperience, hero] = await Promise.all([
    read("src/components/layout/SiteNavigation.tsx"),
    read("src/components/layout/FloatingCta.tsx"),
    read("src/app/ai-tu-van/page.tsx"),
    read("src/components/sections/AIOfficeExperience.tsx"),
    read("src/components/sections/HeroSection.tsx"),
  ]);

  assert.match(navigation, /Bắt đầu tư vấn/);
  assert.match(navigation, /\/ai-tu-van\?ai=1#consultation/);
  assert.doesNotMatch(navigation, /Tư vấn ngay|Trợ lý tư vấn/);

  assert.match(floating, /COMPANY_CONFIG\.socials\.zalo1/);
  assert.match(floating, />Zalo</);
  assert.doesNotMatch(floating, /AIChatDrawerPanel|Tư vấn ngay|Mở trợ lý/);

  assert.match(aiPage, /id="consultation"/);
  assert.match(aiPage, /href="#consultation"/);
  assert.match(aiPage, /Bắt đầu tư vấn/);
  assert.match(aiPage, /Chuẩn bị báo giá/);
  assert.doesNotMatch(aiPage, /Mở trò chuyện|Bắt đầu trò chuyện/);

  assert.match(hero, /Bắt đầu tư vấn/);
  assert.match(hero, /Chuẩn bị báo giá/);
  assert.match(hero, /\/ai-tu-van\?ai=1#consultation/);
  assert.doesNotMatch(hero, /Live workflow|Mở chat ngay|Cần gấp\? Gọi kỹ sư/);

  const mainFlowIndex = aiExperience.indexOf("<AIOfficeSection");
  const voiceIndex = aiExperience.indexOf("<GeminiLivePanel");
  assert.ok(mainFlowIndex >= 0 && voiceIndex > mainFlowIndex);
});

test("footer exposes the canonical company address directly", async () => {
  const footer = await read("src/components/layout/SiteFooter.tsx");

  assert.match(footer, /Văn phòng \/ xưởng:/);
  assert.match(footer, /COMPANY_CONFIG\.address/);
  assert.match(footer, /COMPANY_CONFIG\.googleMapsUrl/);
});
