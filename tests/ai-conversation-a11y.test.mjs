import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("announces AI questions and moves focus after interaction", async () => {
  const controller = await readFile(
    new URL(
      "../src/components/sections/AIOfficeAccessibilityController.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const controllers = await readFile(
    new URL("../src/components/sections/AIOfficeControllers.tsx", import.meta.url),
    "utf8",
  );

  assert.match(controller, /aria-live="polite"/);
  assert.match(controller, /aria-atomic="true"/);
  assert.match(controller, /Câu hỏi mới:/);
  assert.match(controller, /MutationObserver/);
  assert.match(controller, /interactionStartedRef/);
  assert.match(controller, /window\.location\.hash === "#ai-office"/);
  assert.match(controller, /focus\(\{ preventScroll: true \}\)/);
  assert.match(controller, /role", "region"/);
  assert.match(controller, /Hội thoại lập hồ sơ kỹ thuật/);
  assert.match(controllers, /<AIOfficeAccessibilityController \/>/);
});

test("mobile consultation uses one compact, accessible chat surface", async () => {
  const office = await readFile(
    new URL("../src/components/sections/AIOfficeSection.tsx", import.meta.url),
    "utf8",
  );
  const live = await readFile(
    new URL("../src/components/sections/GeminiLivePanel.tsx", import.meta.url),
    "utf8",
  );

  assert.match(office, /Trò chuyện cùng trợ lý Đại Hải Phát/);
  assert.match(office, /Nhắn câu trả lời cho trợ lý AI/);
  assert.match(office, /resolveConversationChoice/);
  assert.match(office, /<MobileProjectSummary session=\{session\} \/>/);
  assert.match(office, /group-open:rotate-180/);
  assert.match(office, /aria-label="Gửi câu trả lời"/);
  assert.match(live, /className="hidden[^"\n]*lg:block"/);
});

test("floating consultation keeps mobile boundaries and customer-safe handoff copy", async () => {
  const floating = await readFile(
    new URL("../src/components/layout/FloatingCta.tsx", import.meta.url),
    "utf8",
  );
  const drawer = await readFile(
    new URL("../src/components/ai/AIChatDrawerPanel.tsx", import.meta.url),
    "utf8",
  );
  const crmRoute = await readFile(
    new URL("../src/app/api/crm/handoff/route.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(floating, /\bw-screen\b/);
  assert.match(floating, /w-full max-w-full/);
  assert.match(floating, /max-h-\[100dvh\]/);
  assert.match(floating, /safe-area-inset-bottom/);
  assert.match(floating, /overflow-hidden/);
  assert.match(floating, /min-w-0 flex-1/);
  assert.match(floating, /break-words/);

  assert.match(drawer, /Hồ sơ của bạn đã sẵn sàng/);
  assert.match(drawer, /Tôi đồng ý gửi thông tin liên hệ/);
  assert.match(drawer, /Gửi hồ sơ cho kỹ sư/);
  assert.match(drawer, /Kênh gửi tự động đang tạm gián đoạn/);
  assert.doesNotMatch(drawer, /Mã hỗ trợ:/);
  assert.doesNotMatch(drawer, /Kênh CRM chưa được cấu hình/);

  assert.doesNotMatch(crmRoute, /formatSupportReference/);
  assert.doesNotMatch(crmRoute, /Mã hỗ trợ:/);
  assert.doesNotMatch(crmRoute, /Kênh CRM chưa được cấu hình/);
  assert.match(crmRoute, /Kênh gửi tự động đang tạm gián đoạn/);
});