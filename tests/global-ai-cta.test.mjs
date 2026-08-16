import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the public consultation assistant reachable from global navigation", async () => {
  const navigation = await readFile(
    new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navigation, /href="\/ai-tu-van\?ai=1"/);
  assert.match(navigation, /Tư vấn ngay/);
  assert.match(navigation, /Trợ lý tư vấn/);
  assert.doesNotMatch(navigation, /Trợ lý AI|Chat AI|Tư vấn AI/i);
});
