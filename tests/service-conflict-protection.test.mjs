import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("protects an existing AI draft when a different service CTA is selected", async () => {
  const notice = await readFile(
    new URL(
      "../src/components/sections/AIServiceConflictNotice.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const routeEntry = await readFile(
    new URL("../src/components/sections/AIOfficeRouteEntry.tsx", import.meta.url),
    "utf8",
  );

  assert.match(notice, /readAIDraft/);
  assert.match(notice, /savedService !== requestedService/);
  assert.match(notice, /Hồ sơ hiện tại sẽ không bị/);
  assert.match(notice, /Tiếp tục hồ sơ hiện tại/);
  assert.match(notice, /Bắt đầu hồ sơ/);
  assert.match(notice, /button\[aria-label=/);
  assert.match(notice, /resetButton\?\.click\(\)/);
  assert.match(notice, /role="alertdialog"/);
  assert.match(notice, /aria-modal="true"/);
  assert.match(notice, /event\.key === "Escape"/);
  assert.match(routeEntry, /SERVICES\.find/);
  assert.match(routeEntry, /<AIServiceConflictNotice requestedService=\{servicePreset\} \/>/);
  assert.doesNotMatch(routeEntry, /reset\(/);
});
