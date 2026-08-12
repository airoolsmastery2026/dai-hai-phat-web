import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps service cards compact and routes consultation to engineers", async () => {
  const homepageServices = await readFile(
    new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
    "utf8",
  );
  const serviceCard = await readFile(
    new URL("../src/components/services/ServiceCard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(homepageServices, /href="\/contact"/);
  assert.match(homepageServices, /Nhờ kỹ sư tư vấn/);
  assert.doesNotMatch(homepageServices, /#ai-office|encodeURIComponent\(service\.aiService\)|Tư vấn AI/i);

  assert.match(serviceCard, /<article/);
  assert.match(serviceCard, /getPublicRouteSlug\(service\.slug\)/);
  assert.match(serviceCard, /Xem chi tiết/);
  assert.doesNotMatch(serviceCard, /#ai-office|aiHref|encodeURIComponent\(service\.aiService\)|Bot|bằng AI/i);
  assert.doesNotMatch(serviceCard, /grid[^\n]*sm:grid-cols-2/);
});
