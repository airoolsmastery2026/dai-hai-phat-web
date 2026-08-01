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
