import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sitemapSource = await readFile(
  new URL("../src/app/sitemap.ts", import.meta.url),
  "utf8",
);

test("sitemap publishes service URLs through the public ASCII slug helper", () => {
  assert.match(
    sitemapSource,
    /getPublicRouteSlug\(service\.slug\)/,
  );
  assert.doesNotMatch(
    sitemapSource,
    /\/services\/\$\{service\.slug\}/,
  );
});
