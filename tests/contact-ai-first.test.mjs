import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the contact page human-first and evidence safe", async () => {
  const contactPage = await readFile(
    new URL("../src/app/contact/page.tsx", import.meta.url),
    "utf8",
  );

  const zaloCta = contactPage.indexOf("Gửi nhu cầu qua Zalo");
  const phoneCta = contactPage.indexOf("Gọi {COMPANY_CONFIG.phones[0].display}");

  assert.ok(zaloCta >= 0, "Zalo CTA must be present");
  assert.ok(phoneCta > zaloCta, "Hotline must remain available after Zalo");
  assert.match(contactPage, /Liên hệ kỹ thuật/);
  assert.match(contactPage, /Gửi hiện trạng, kỹ sư sẽ tiếp nhận/);
  assert.match(contactPage, /Báo giá chính thức chỉ được lập/);
  assert.match(contactPage, /CONTACT_DESCRIPTION/);
  assert.doesNotMatch(contactPage, /#ai-office|Lập hồ sơ với AI|Tư vấn AI/i);
  assert.doesNotMatch(
    contactPage,
    /nhận tư vấn báo giá và đặt lịch thi công/i,
  );
});
