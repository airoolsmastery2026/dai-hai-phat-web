import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const blogContentPath = new URL("../src/content/blog.ts", import.meta.url);
const nextConfigPath = new URL("../next.config.js", import.meta.url);

test("blog content publishes ASCII-safe slugs", async () => {
  const source = await readFile(blogContentPath, "utf8");

  assert.doesNotMatch(source, /slug:\s*"[^"]*gỗ[^"]*"/);
  assert.match(source, /giai-phap-thiet-ke-tu-quan-ao-go-mdf-melamine/);
  assert.match(source, /mau-giuong-ngu-khung-thep-go-mdf-melamine/);
});

test("legacy Unicode blog URLs permanently redirect to ASCII routes", async () => {
  const source = await readFile(nextConfigPath, "utf8");

  assert.match(source, /giai-phap-thiet-ke-tu-quan-ao-gỗ-mdf-melamine/);
  assert.match(source, /giai-phap-thiet-ke-tu-quan-ao-go-mdf-melamine/);
  assert.match(source, /mau-giuong-ngu-khung-thep-gỗ-mdf-melamine/);
  assert.match(source, /mau-giuong-ngu-khung-thep-go-mdf-melamine/);
});
