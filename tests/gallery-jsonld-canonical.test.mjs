import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const galleryPagePath = new URL("../src/app/gallery/page.tsx", import.meta.url);

test("gallery JSON-LD derives URLs from canonical company configuration", async () => {
  const source = await readFile(galleryPagePath, "utf8");

  assert.match(source, /import \{ COMPANY_CONFIG \} from "@\/content\/company"/);
  assert.match(source, /url: `\$\{COMPANY_CONFIG\.websiteUrl\}\/gallery`/);
  assert.match(
    source,
    /image: `\$\{COMPANY_CONFIG\.websiteUrl\}\$\{item\.thumbnail\.url\}`/,
  );
  assert.doesNotMatch(source, /https:\/\/daihaiphat\.vn/);
});
