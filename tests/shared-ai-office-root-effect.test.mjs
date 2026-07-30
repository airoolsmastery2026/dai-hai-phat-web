import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hookPath = "src/hooks/useAIOfficeRootEffect.ts";
const controllers = [
  "src/components/sections/AIOfficeAccessibilityController.tsx",
  "src/components/analytics/AIFunnelEventController.tsx",
];

test("AI controllers share one React DOM boundary hook", async () => {
  const hook = await readFile(hookPath, "utf8");

  assert.match(hook, /export function useAIOfficeRootEffect/);
  assert.match(hook, /document\.getElementById\("ai-office"\)/);
  assert.match(hook, /return effect\(root\)/);

  for (const controllerPath of controllers) {
    const source = await readFile(controllerPath, "utf8");

    assert.match(source, /useAIOfficeRootEffect/);
    assert.doesNotMatch(source, /document\.getElementById\("ai-office"\)/);
    assert.doesNotMatch(source, /import \{ useEffect/);
  }
});

test("shared root effects preserve controller cleanup and dependencies", async () => {
  const accessibility = await readFile(controllers[0], "utf8");
  const funnel = await readFile(controllers[1], "utf8");

  assert.match(accessibility, /observer\.disconnect\(\)/);
  assert.match(accessibility, /\}, \[\]\);/);
  assert.match(funnel, /window\.removeEventListener\("pagehide", handlePageHide\)/);
  assert.match(funnel, /\}, \[service\]\);/);
});
