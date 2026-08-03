import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillUrl = new URL(
  "../prompts/skills/dhp-copywriter/SKILL.md",
  import.meta.url,
);

async function readSkill() {
  return readFile(skillUrl, "utf8");
}

test("DHP copywriter skill has a portable metadata contract", async () => {
  const source = await readSkill();

  assert.match(source, /^---\nname: dhp-copywriter\n/m);
  assert.match(source, /description:/);
  assert.match(source, /version: "1\.0\.0"/);
});

test("DHP copywriter keeps public copy evidence-safe and engineer-led", async () => {
  const source = await readSkill();

  assert.match(source, /Không tự tạo số liệu, giá, thời gian thi công/);
  assert.match(source, /Tham khảo ý tưởng/);
  assert.match(source, /Kỹ sư xác nhận/);
  assert.match(source, /không phải bản vẽ kỹ thuật/);
  assert.match(source, /Không tự đưa ra giá hoặc khoảng giá/);
});

test("DHP copywriter defines customer-facing terminology and concrete actions", async () => {
  const source = await readSkill();

  assert.match(source, /AI tư vấn \| Nhận tư vấn \/ Kênh tư vấn/);
  assert.match(source, /AI phối cảnh \| Phối cảnh ý tưởng/);
  assert.match(source, /Gửi hồ sơ để kỹ sư xem/);
  assert.match(source, /Liên hệ Zalo để xin duyệt/);
});
