import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const policyPath = new URL(
  "../src/lib/performance/ai-office-loading.ts",
  import.meta.url,
);
const hookPath = new URL(
  "../src/hooks/useAIOfficeActivation.ts",
  import.meta.url,
);

test("AI Office loading policy protects constrained mobile networks", async () => {
  const source = await readFile(policyPath, "utf8");

  assert.match(source, /saveData/);
  assert.match(source, /case "slow-2g"/);
  assert.match(source, /case "2g"/);
  assert.match(source, /case "3g"/);
  assert.match(source, /"200px 0px"/);
  assert.match(source, /"500px 0px"/);
  assert.match(source, /"800px 0px"/);
});

test("AI Office activation consumes the shared network loading policy", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /getAIOfficeRootMargin/);
  assert.match(source, /navigator as NavigatorWithConnection/);
  assert.match(source, /rootMargin: getAIOfficeRootMargin\(connection\)/);
  assert.doesNotMatch(source, /AI_OFFICE_ROOT_MARGIN/);
  assert.match(source, /window\.location\.hash === AI_OFFICE_HASH/);
  assert.match(source, /observer\.disconnect\(\)/);
});
