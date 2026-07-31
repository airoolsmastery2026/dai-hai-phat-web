import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8");

test("blog detail exposes article and breadcrumb structured data", () => {
  assert.match(page, /"@type": "Article"/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(page, /position: 1/);
  assert.match(page, /position: 2/);
  assert.match(page, /position: 3/);
  assert.match(page, /dhp-blog-structured-data/);
  assert.match(page, /mainEntityOfPage: canonicalUrl/);
});
