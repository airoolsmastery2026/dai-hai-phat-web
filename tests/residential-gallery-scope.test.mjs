import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the public gallery within residential service scope", async () => {
  const publicGallery = await readFile(
    new URL("../src/lib/ai/public-gallery.ts", import.meta.url),
    "utf8",
  );
  const galleryPage = await readFile(
    new URL("../src/app/gallery/page.tsx", import.meta.url),
    "utf8",
  );
  const galleryApi = await readFile(
    new URL("../src/app/api/gallery/route.ts", import.meta.url),
    "utf8",
  );

  assert.match(publicGallery, /const PUBLIC_SERVICES = new Set/);
  assert.match(publicGallery, /"Cửa cổng"/);
  assert.match(publicGallery, /"Cầu thang và lan can"/);
  assert.match(publicGallery, /"Mái che"/);
  assert.match(publicGallery, /"Nội thất"/);
  assert.match(publicGallery, /const PUBLIC_PROJECT_TYPE = "Nhà ở"/);
  assert.match(publicGallery, /PUBLIC_SERVICES\.has\(item\.service\)/);
  assert.match(publicGallery, /item\.projectType === PUBLIC_PROJECT_TYPE/);
  assert.doesNotMatch(publicGallery, /"Nhà xưởng"|"Vật liệu"|"Xưởng gia công"/);

  assert.match(galleryPage, /listPublicResidentialGallery/);
  assert.match(galleryPage, /nội thất và cơ khí dân dụng|nhu cầu thực tế|loại nhà ở/i);
  assert.doesNotMatch(galleryPage, /listVerifiedGallery/);

  assert.match(galleryApi, /listPublicResidentialGallery/);
  assert.doesNotMatch(galleryApi, /const gallery = listVerifiedGallery/);
});
