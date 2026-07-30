import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routeEntryPath = new URL(
  "../src/components/sections/AIOfficeRouteEntry.tsx",
  import.meta.url,
);
const loadingStatePath = new URL(
  "../src/components/sections/AIOfficeLoadingState.tsx",
  import.meta.url,
);

test("AI Office defers the full feature boundary", async () => {
  const source = await readFile(routeEntryPath, "utf8");

  assert.match(source, /import dynamic from "next\/dynamic"/);
  assert.match(source, /import\("@\/components\/sections\/AIOfficeExperience"\)/);
  assert.match(source, /module\.AIOfficeExperience/);
  assert.match(source, /loading: AIOfficeLoadingState/);
  assert.doesNotMatch(source, /import\("@\/components\/sections\/AIOfficeSection"\)/);
  assert.doesNotMatch(source, /ssr:\s*false/);
});

test("deferred loading state preserves the AI Office anchor and accessibility status", async () => {
  const source = await readFile(loadingStatePath, "utf8");

  assert.match(source, /id="ai-office"/);
  assert.match(source, /aria-busy="true"/);
  assert.match(source, /aria-live="polite"/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|FormData|session\.memory/);
});
