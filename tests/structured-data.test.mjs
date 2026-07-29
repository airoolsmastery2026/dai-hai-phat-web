import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("publishes only verified business and service structured data", async () => {
  const jsonLd = await readFile(
    new URL("../src/components/seo/JsonLd.tsx", import.meta.url),
    "utf8",
  );
  const layout = await readFile(
    new URL("../src/app/layout.tsx", import.meta.url),
    "utf8",
  );
  const servicePage = await readFile(
    new URL("../src/app/services/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(jsonLd, /JSON\.stringify\(data\)\.replace\(\/<\/g/);
  assert.match(jsonLd, /type="application\/ld\+json"/);
  assert.match(layout, /"@type": "LocalBusiness"/);
  assert.match(layout, /COMPANY_CONFIG\.coordinates\.lat/);
  assert.match(layout, /hasOfferCatalog/);
  assert.match(layout, /SERVICES\.map/);
  assert.match(layout, /<JsonLd id="dhp-local-business"/);
  assert.doesNotMatch(
    layout,
    /aggregateRating|reviewCount|priceRange|openingHours|award/,
  );

  assert.match(servicePage, /"@type": "BreadcrumbList"/);
  assert.match(servicePage, /"@type": "FAQPage"/);
  assert.match(servicePage, /\.\.\.service\.schema/);
  assert.match(servicePage, /provider: \{ "@id":/);
  assert.match(servicePage, /openGraph:/);
  assert.match(servicePage, /twitter:/);
  assert.match(servicePage, /alternates: \{ canonical \}/);
});
