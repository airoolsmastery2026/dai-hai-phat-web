import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../src/app/admin/ai/page.tsx", import.meta.url);
const consolePath = new URL("../src/components/admin/AdminAiControlPlane.tsx", import.meta.url);
const gatewayPath = new URL("../src/app/api/ai/control-plane/[...path]/route.ts", import.meta.url);
const clientPath = new URL("../src/lib/dhp-control-plane.ts", import.meta.url);

test("AI admin console exposes skill and media workflow controls without browser secrets", async () => {
  const [page, panel, gateway, client] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(consolePath, "utf8"),
    readFile(gatewayPath, "utf8"),
    readFile(clientPath, "utf8"),
  ]);

  assert.match(page, /index: false/);
  assert.match(panel, /\/api\/ai\/control-plane\/skills/);
  assert.match(panel, /\/api\/ai\/control-plane\/media\/jobs/);
  assert.match(panel, /Chạy bước/);
  assert.match(panel, /Duyệt/);
  assert.match(gateway, /\['skills', 'media'\]/);
  assert.match(client, /DHP_CONTROL_PLANE_SECRET/);
  assert.doesNotMatch(panel, /DHP_CONTROL_PLANE_SECRET|NEXT_PUBLIC_DHP/);
  assert.doesNotMatch(gateway, /NEXT_PUBLIC_DHP/);
});
