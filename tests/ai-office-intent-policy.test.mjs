import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const policyPath = new URL(
  "../src/lib/performance/ai-office-intent.ts",
  import.meta.url,
);
const hookPath = new URL(
  "../src/hooks/useAIOfficeActivation.ts",
  import.meta.url,
);

test("AI Office intent detection is isolated in a shared policy", async () => {
  const source = await readFile(policyPath, "utf8");

  assert.match(source, /a\[href\$="#ai-office"\]/);
  assert.match(source, /target instanceof Element/);
  assert.match(source, /target\.closest\(AI_OFFICE_LINK_SELECTOR\)/);
  assert.doesNotMatch(source, /addEventListener/);
  assert.doesNotMatch(source, /setIsActive/);
});

test("AI Office activation hook delegates intent matching", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /isAIOfficeLinkIntent/);
  assert.match(source, /isAIOfficeLinkIntent\(event\.target\)/);
  assert.doesNotMatch(source, /AI_OFFICE_LINK_SELECTOR/);
  assert.doesNotMatch(source, /event\.target\.closest/);
  assert.match(source, /document\.addEventListener\("pointerdown"/);
  assert.match(source, /document\.addEventListener\("focusin"/);
  assert.match(source, /getAIOfficeRootMargin\(connection\)/);
});
