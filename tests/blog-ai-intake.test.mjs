import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const VALID_PRESETS = [
  "Cửa cổng",
  "Cầu thang và lan can",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
];

test("keeps blog content connected to the AI intake", async () => {
  const contentTypes = await readFile(
    new URL("../src/types/content.ts", import.meta.url),
    "utf8",
  );
  const blogContent = await readFile(
    new URL("../src/content/blog.ts", import.meta.url),
    "utf8",
  );
  const blogIndex = await readFile(
    new URL("../src/app/blog/page.tsx", import.meta.url),
    "utf8",
  );
  const blogDetail = await readFile(
    new URL("../src/app/blog/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(contentTypes, /export interface BlogPost[\s\S]*aiService: AIServicePreset/);

  const declaredPresets = Array.from(
    blogContent.matchAll(/aiService: "([^"]+)"/g),
    (match) => match[1],
  );
  assert.equal(declaredPresets.length, 4);
  declaredPresets.forEach((preset) => {
    assert.ok(VALID_PRESETS.includes(preset), `Unexpected AI preset: ${preset}`);
  });

  assert.match(blogIndex, /<AIConsultationCta/);
  assert.match(blogIndex, /secondaryHref="\/services"/);
  assert.match(blogDetail, /servicePreset=\{article\.aiService\}/);
  assert.match(blogDetail, /Thông tin chỉ được bàn giao/);
});
