import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function read(path) {
  return readFileSync(join(ROOT, path), "utf8").replaceAll("\r\n", "\n");
}

test("robots keeps public pages crawlable while excluding API and admin surfaces", () => {
  const robots = read("src/app/robots.ts");

  assert.match(robots, /allow:\s*"\/"/);
  assert.match(robots, /disallow:\s*\["\/api\/",\s*"\/admin\/"\]/);
  assert.match(robots, /sitemap:/);
  assert.match(robots, /host:/);
});

test("public sitemap never exposes admin or API routes", () => {
  const sitemap = read("src/app/sitemap.ts");

  assert.doesNotMatch(sitemap, /`\$\{baseUrl\}\/admin/);
  assert.doesNotMatch(sitemap, /`\$\{baseUrl\}\/api/);
});

test("conversion pages publish page-specific OpenGraph and Twitter metadata", () => {
  const pages = [
    ["src/app/ai-tu-van/page.tsx", "/ai-tu-van"],
    ["src/app/services/page.tsx", "/services"],
    ["src/app/bao-gia/page.tsx", "/bao-gia"],
    ["src/app/contact/page.tsx", "/contact"],
  ];

  for (const [path, route] of pages) {
    const source = read(path);
    assert.match(source, /openGraph:\s*\{/);
    assert.match(source, /twitter:\s*\{/);
    assert.match(source, /card:\s*"summary_large_image"/);
    assert.match(source, /images:\s*\[/);
    assert.match(source, new RegExp(`websiteUrl\\}\\${route.replaceAll("/", "\\/")}`));
  }
});
