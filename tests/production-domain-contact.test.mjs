import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const companySource = await readFile(
  new URL("../src/content/company.ts", import.meta.url),
  "utf8",
);
const layoutSource = await readFile(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);
const contactSectionSource = await readFile(
  new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
  "utf8",
);
const contactPageSource = await readFile(
  new URL("../src/app/contact/page.tsx", import.meta.url),
  "utf8",
);

test("company metadata uses the active Vercel production domain", () => {
  assert.match(
    companySource,
    /websiteUrl:\s*"https:\/\/dai-hai-phat-web\.vercel\.app"/,
  );
  assert.match(companySource, /primaryPhone:\s*"0785\.505\.518"/);
  assert.match(
    layoutSource,
    /metadataBase:\s*new URL\(COMPANY_CONFIG\.websiteUrl\)/,
  );
  assert.doesNotMatch(layoutSource, /new URL\("https:\/\/daihaiphat\.vn"\)/);
});

test("homepage keeps one primary hotline while the contact page preserves all phone numbers", () => {
  assert.match(contactSectionSource, /COMPANY_CONFIG\.phones\[0\]/);
  assert.doesNotMatch(contactSectionSource, /COMPANY_CONFIG\.phones\[1\]/);
  assert.match(contactSectionSource, /href="\/contact"/);
  assert.match(contactSectionSource, /Đầy đủ thông tin liên hệ/);

  assert.match(contactPageSource, /COMPANY_CONFIG\.phones\.map/);
  assert.match(contactPageSource, /phone\.raw/);
  assert.match(contactPageSource, /phone\.display/);
});
