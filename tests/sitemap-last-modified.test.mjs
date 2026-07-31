import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sitemapPath = new URL("../src/app/sitemap.ts", import.meta.url);

test("sitemap exposes canonical routes with freshness metadata", async () => {
  const source = await readFile(sitemapPath, "utf8");

  assert.match(source, /const lastModified = new Date\(\)/);
  assert.match(source, /url: baseUrl,/);
  assert.match(source, /\/services\/\$\{service\.slug\}/);
  assert.match(source, /\/blog\/\$\{article\.slug\}/);
  assert.ok(
    (source.match(/lastModified,/g) ?? []).length >= 9,
    "Every sitemap route family should include lastModified metadata",
  );
});
