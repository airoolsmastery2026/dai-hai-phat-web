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
  const routeEntry = await readFile(
    new URL("../src/components/sections/AIOfficeRouteEntry.tsx", import.meta.url),
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
  assert.match(routeEntry, /<AIOfficeAccessibilityController \/>/);
});
