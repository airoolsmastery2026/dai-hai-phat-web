import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const companySource = await readFile(
  new URL("../src/content/company.ts", import.meta.url),
  "utf8",
);
const contactSource = await readFile(
  new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
  "utf8",
);

test("company metadata uses the active Vercel production domain", () => {
  assert.match(
    companySource,
    /websiteUrl:\s*"https:\/\/dai-hai-phat-web\.vercel\.app"/,
  );
  assert.match(companySource, /primaryPhone:\s*"0785\.505\.518"/);
});

test("contact section distinguishes primary and support hotlines", () => {
  assert.match(contactSource, /label="Hotline chính"/);
  assert.match(contactSource, /label="Hotline hỗ trợ"/);
  assert.match(contactSource, /COMPANY_CONFIG\.phones\[0\]/);
  assert.match(contactSource, /COMPANY_CONFIG\.phones\[1\]/);
});
