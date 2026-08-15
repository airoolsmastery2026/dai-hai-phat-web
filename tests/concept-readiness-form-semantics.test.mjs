import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../src/components/ai/ConceptReadinessGate.tsx",
  import.meta.url,
);

test("concept readiness form exposes mobile-friendly field semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /autoComplete="on"/);
  assert.match(source, /name="name"[\s\S]*autoComplete="name"/);
  assert.match(source, /name="phone"[\s\S]*type="tel"[\s\S]*autoComplete="tel"/);
  assert.match(source, /name="projectArea"[\s\S]*autoComplete="street-address"/);
  assert.match(source, /name="description"[\s\S]*minLength=\{10\}[\s\S]*maxLength=\{2000\}/);
  assert.match(source, /name="consent"[\s\S]*type="checkbox"/);
});

test("concept readiness client limits mirror server input boundaries", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /name="name"[\s\S]*maxLength=\{120\}/);
  assert.match(source, /name="phone"[\s\S]*maxLength=\{30\}/);
  assert.match(source, /name="zalo"[\s\S]*maxLength=\{30\}/);
  assert.match(source, /name="projectArea"[\s\S]*maxLength=\{200\}/);
  assert.match(source, /name="dimensions"[\s\S]*maxLength=\{160\}/);
});
