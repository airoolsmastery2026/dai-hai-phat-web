import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("lets customers start the AI intake directly from service cards", async () => {
  const homepageServices = await readFile(
    new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
    "utf8",
  );
  const serviceCard = await readFile(
    new URL("../src/components/services/ServiceCard.tsx", import.meta.url),
    "utf8",
  );

  for (const source of [homepageServices, serviceCard]) {
    assert.match(source, /encodeURIComponent\(service\.aiService\)/);
    assert.match(source, /#ai-office/);
    assert.match(source, /Tư vấn hạng mục/);
    assert.match(source, /href=\{aiHref\}/);
  }

  assert.match(serviceCard, /<article/);
  assert.doesNotMatch(serviceCard, /return \(\s*<Link[\s\S]*<Link/);
  assert.match(serviceCard, /Xem chi tiết/);
  assert.match(homepageServices, /Bắt đầu hồ sơ tư vấn ngay/);
  assert.match(homepageServices, /const ServiceIcon = service\.icon/);
  assert.match(homepageServices, /<ServiceIcon/);
  assert.match(homepageServices, /min-h-\[var\(--control-min-size\)\]/);
});
