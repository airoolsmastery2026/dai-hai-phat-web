import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps evidence pages connected to the AI intake", async () => {
  const cta = await readFile(
    new URL("../src/components/sections/AIConsultationCta.tsx", import.meta.url),
    "utf8",
  );
  const gallery = await readFile(
    new URL("../src/app/gallery/page.tsx", import.meta.url),
    "utf8",
  );
  const about = await readFile(
    new URL("../src/app/about/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(cta, /export function AIConsultationCta/);
  assert.match(cta, /"\/#ai-office"/);
  assert.match(cta, /encodeURIComponent\(servicePreset\)/);
  assert.match(cta, /Lập hồ sơ với AI/);
  assert.match(cta, /w-full sm:w-auto/);

  assert.match(gallery, /<AIConsultationCta/);
  assert.match(gallery, /không thay thế khảo sát hiện trạng/);
  assert.match(gallery, /secondaryHref="\/services"/);

  assert.match(about, /<AIConsultationCta/);
  assert.match(about, /chủ động đồng ý/);
  assert.match(about, /secondaryHref="\/gallery"/);
});
