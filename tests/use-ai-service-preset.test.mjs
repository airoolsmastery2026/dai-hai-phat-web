import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hookPath = "src/hooks/useAIServicePreset.ts";
const routeEntryPath = "src/components/sections/AIOfficeRouteEntry.tsx";

test("AI service preset hook owns URL parsing and domain normalization", async () => {
  const source = await readFile(hookPath, "utf8");

  assert.match(source, /useSearchParams/);
  assert.match(source, /getAIService\(searchParams\.get\("service"\)\)/);
  assert.match(source, /AIService \| null/);
});

test("AI office route entry is composition only", async () => {
  const source = await readFile(routeEntryPath, "utf8");

  assert.match(source, /useAIServicePreset/);
  assert.match(source, /const servicePreset = useAIServicePreset\(\)/);
  assert.doesNotMatch(source, /next\/navigation/);
  assert.doesNotMatch(source, /getAIService/);
  assert.doesNotMatch(source, /searchParams/);
});
