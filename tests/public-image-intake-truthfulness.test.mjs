import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../src/app/ai-tu-van/page.tsx", import.meta.url);
const hookUrl = new URL("../src/hooks/useAI.ts", import.meta.url);

const read = (url) => readFile(url, "utf8");

test("public consultation describes uploaded images as intake, not model vision", async () => {
  const page = await read(pageUrl);

  assert.match(page, /Ghi nhận hình ảnh/);
  assert.match(page, /Ghi nhận ảnh & hồ sơ/);
  assert.match(page, /lưu cùng bản nháp trên thiết bị/);
  assert.doesNotMatch(page, /Phân tích hình ảnh/);
  assert.doesNotMatch(page, /Phân tích ảnh & hồ sơ/);
  assert.doesNotMatch(page, /đọc hình ảnh và hồ sơ/);
});

test("project-analysis request remains text metadata only until vision is explicitly wired", async () => {
  const hook = await read(hookUrl);

  assert.match(hook, /fetch\("\/api\/ai\/project-analysis"/);
  assert.match(hook, /body: analysisKey/);
  assert.doesNotMatch(hook, /fetch\("\/api\/ai\/project-analysis"[\s\S]{0,500}dataBase64/);
});
