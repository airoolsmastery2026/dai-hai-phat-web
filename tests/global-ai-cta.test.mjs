import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the public AI assistant reachable from global navigation", async () => {
  const navigation = await readFile(new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url), "utf8");
  assert.match(navigation, /href="\/#ai-office"/);
  assert.match(navigation, /Trợ lý AI 24\/7/);
});
