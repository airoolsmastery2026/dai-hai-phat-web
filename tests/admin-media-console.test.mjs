import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ADMIN_MEDIA_MAX_BYTES,
  ADMIN_MEDIA_MAX_FILES,
  validateAdminMediaCandidates,
} from "../src/lib/admin/media-validation.ts";

const proxyPath = new URL("../src/proxy.ts", import.meta.url);
const pagePath = new URL("../src/app/admin/media/page.tsx", import.meta.url);
const managerPath = new URL("../src/components/admin/AdminMediaManager.tsx", import.meta.url);

test("admin media validation accepts bounded images and rejects unsafe candidates", () => {
  const result = validateAdminMediaCandidates([
    { name: "valid.webp", type: "image/webp", size: ADMIN_MEDIA_MAX_BYTES },
    { name: "script.svg", type: "image/svg+xml", size: 500 },
    { name: "empty.png", type: "image/png", size: 0 },
    { name: "large.jpg", type: "image/jpeg", size: ADMIN_MEDIA_MAX_BYTES + 1 },
  ]);

  assert.deepEqual(result.accepted.map((item) => item.name), ["valid.webp"]);
  assert.equal(result.rejected.length, 3);
  assert.equal(ADMIN_MEDIA_MAX_FILES, 12);
});

test("admin routes require server credentials and stay out of search indexes", async () => {
  const [proxy, page] = await Promise.all([
    readFile(proxyPath, "utf8"),
    readFile(pagePath, "utf8"),
  ]);

  assert.match(proxy, /ADMIN_USERNAME/);
  assert.match(proxy, /ADMIN_PASSWORD/);
  assert.match(proxy, /www-authenticate/);
  assert.match(proxy, /x-robots-tag/);
  assert.match(proxy, /matcher: \["\/admin\/:path\*"\]/);
  assert.match(page, /index: false/);
  assert.doesNotMatch(proxy, /NEXT_PUBLIC_ADMIN/);
});

test("media manager stages local previews without mutating public content", async () => {
  const manager = await readFile(managerPath, "utf8");

  assert.match(manager, /onDrop/);
  assert.match(manager, /draggable/);
  assert.match(manager, /URL\.createObjectURL/);
  assert.match(manager, /Gửi danh sách chờ duyệt/);
  assert.match(manager, /không tự thay ảnh đang hiển thị/);
  assert.doesNotMatch(manager, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(manager, /fetch\(|axios|deleteFile|updateFile/);
});
