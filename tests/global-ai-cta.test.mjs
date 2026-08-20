import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the public consultation assistant reachable from global navigation", async () => {
  const navigation = await readFile(
    new URL("../src/components/layout/SiteNavigation.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    navigation,
    /const CONSULTATION_HREF = "\/ai-tu-van\?ai=1#consultation"/,
  );
  assert.match(navigation, /href=\{CONSULTATION_HREF\}/);
  assert.match(navigation, /Bắt đầu tư vấn/);
  assert.doesNotMatch(navigation, /Tư vấn ngay|Mở trò chuyện|Bắt đầu trò chuyện/);
  assert.doesNotMatch(navigation, /Trợ lý AI|Chat AI|Tư vấn AI/i);
});
