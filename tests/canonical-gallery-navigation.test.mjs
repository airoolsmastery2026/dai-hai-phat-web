import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const footerSource = await readFile(
  new URL("../src/components/layout/SiteFooter.tsx", import.meta.url),
  "utf8",
);
const projectsSource = await readFile(
  new URL("../src/app/projects/page.tsx", import.meta.url),
  "utf8",
);

test("footer links directly to the canonical gallery route", () => {
  assert.match(footerSource, /label:\s*"Công trình",\s*href:\s*"\/gallery"/);
  assert.doesNotMatch(footerSource, /href:\s*"\/projects"/);
});

test("legacy projects route permanently redirects to gallery", () => {
  assert.match(projectsSource, /permanentRedirect\("\/gallery"\)/);
});
