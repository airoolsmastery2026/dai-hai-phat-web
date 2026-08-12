import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps evidence pages connected to human consultation", async () => {
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
  assert.match(cta, /<Button href="\/contact"/);
  assert.match(cta, /Trao đổi với kỹ sư/);
  assert.match(cta, /w-full sm:w-auto/);
  assert.doesNotMatch(cta, /#ai-office|encodeURIComponent\(servicePreset\)|Lập hồ sơ với AI/);

  assert.match(gallery, /<AIConsultationCta/);
  assert.match(gallery, /Kỹ sư sẽ kiểm tra trước khi tư vấn phương án và khảo sát/);
  assert.match(gallery, /secondaryHref="\/services"/);

  assert.match(about, /<AIConsultationCta/);
  assert.match(
    about,
    /Đội ngũ Đại Hải Phát sẽ kiểm tra thông tin và liên hệ để xác nhận bước tiếp theo/,
  );
  assert.match(about, /secondaryHref="\/gallery"/);
});
