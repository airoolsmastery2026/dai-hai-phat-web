import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps compact homepage service choices connected to the consultation flow", async () => {
  const homepageServices = await readFile(
    new URL("../src/components/sections/ServicesSection.tsx", import.meta.url),
    "utf8",
  );
  const serviceCard = await readFile(
    new URL("../src/components/services/ServiceCard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(homepageServices, /encodeURIComponent\(service\.aiService\)/);
  assert.match(homepageServices, /\/ai-tu-van\?service=/);
  assert.match(homepageServices, /const ServiceIcon = service\.icon/);
  assert.match(homepageServices, /grid-cols-2/);
  assert.match(homepageServices, /lg:grid-cols-4/);
  assert.match(homepageServices, /service-ticker-track/);
  assert.match(homepageServices, /\{service\.aiService\}/);
  assert.doesNotMatch(homepageServices, />\s*Tư vấn hạng mục\s*</);

  assert.match(serviceCard, /<article/);
  assert.match(serviceCard, /getPublicRouteSlug\(service\.slug\)/);
  assert.match(serviceCard, /encodeURIComponent\(service\.aiService\)/);
  assert.match(serviceCard, /\/ai-tu-van\?service=/);
  assert.match(serviceCard, /Tư vấn hạng mục/);
  assert.match(serviceCard, /Xem chi tiết/);
});
