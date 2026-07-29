import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the contact page AI first and evidence safe", async () => {
  const contactPage = await readFile(
    new URL("../src/app/contact/page.tsx", import.meta.url),
    "utf8",
  );

  const aiCta = contactPage.indexOf("Lập hồ sơ với AI");
  const zaloCta = contactPage.indexOf("Gửi ảnh qua Zalo");
  const phoneCta = contactPage.indexOf("Gọi {COMPANY_CONFIG.phones[0].display}");

  assert.ok(aiCta >= 0, "AI CTA must be present");
  assert.ok(zaloCta > aiCta, "Zalo must follow the AI CTA");
  assert.ok(phoneCta > zaloCta, "Hotline must remain a fallback action");

  assert.match(contactPage, /href="\/#ai-office"/);
  assert.match(contactPage, /Chỉ bàn giao khi khách hàng đồng ý/);
  assert.match(contactPage, /Thông tin chỉ\s+được gửi/);
  assert.match(contactPage, /CONTACT_DESCRIPTION/);
  assert.doesNotMatch(
    contactPage,
    /nhận tư vấn báo giá và đặt lịch thi công/i,
  );
});
