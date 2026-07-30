import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hookPath = new URL(
  "../src/hooks/useAIOfficeActivation.ts",
  import.meta.url,
);

test("AI Office activates from explicit link intent", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /AI_OFFICE_LINK_SELECTOR/);
  assert.match(source, /a\[href\$=\\"#ai-office\\"\]/);
  assert.match(source, /isAIOfficeLinkIntent/);
  assert.match(source, /closest\(AI_OFFICE_LINK_SELECTOR\)/);
  assert.match(source, /document\.addEventListener\("pointerdown", activateFromIntent\)/);
  assert.match(source, /document\.addEventListener\("focusin", activateFromIntent\)/);
});

test("AI Office intent listeners are cleaned up without changing existing activation paths", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /document\.removeEventListener\("pointerdown", activateFromIntent\)/);
  assert.match(source, /document\.removeEventListener\("focusin", activateFromIntent\)/);
  assert.match(source, /window\.location\.hash === AI_OFFICE_HASH/);
  assert.match(source, /getAIOfficeRootMargin\(connection\)/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|FormData/);
});
