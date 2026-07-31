import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [nextConfig, routingSource, pageSource, layoutSource, footerSource] =
  await Promise.all([
    readFile(new URL("../next.config.js", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/routing.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../src/app/services/[slug]/page.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../src/components/layout/SiteFooter.tsx", import.meta.url),
      "utf8",
    ),
  ]);

test("redirects the legacy Unicode interior URL to an ASCII-safe route", () => {
  assert.match(
    nextConfig,
    /source: "\/services\/noi-that-gỗ-mdf-melamine"/,
  );
  assert.match(
    nextConfig,
    /destination: "\/services\/noi-that-go-mdf-melamine"/,
  );
  assert.match(nextConfig, /permanent: true/);
});

test("maps the public ASCII route to the existing service record", () => {
  assert.match(
    routingSource,
    /"noi-that-gỗ-mdf-melamine": "noi-that-go-mdf-melamine"/,
  );
  assert.match(routingSource, /export function normalizeRouteSlug/);
  assert.match(routingSource, /export function getPublicRouteSlug/);
});

test("publishes ASCII URLs in metadata, schema and internal links", () => {
  assert.match(pageSource, /getPublicRouteSlug\(service\.slug\)/);
  assert.match(pageSource, /const canonical = `\/services\/\$\{publicSlug\}`/);
  assert.match(layoutSource, /getPublicRouteSlug\(service\.slug\)/);
  assert.match(footerSource, /getPublicRouteSlug\(service\.slug\)/);

  for (const source of [pageSource, layoutSource, footerSource]) {
    assert.doesNotMatch(
      source,
      /\/services\/\$\{service\.slug\}/,
      "public URLs must not be generated from the legacy slug directly",
    );
  }
});
