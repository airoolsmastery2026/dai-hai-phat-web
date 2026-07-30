import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const domainPath = "src/lib/ai/service-domain.ts";
const consumers = [
  "src/components/sections/AIOfficeRouteEntry.tsx",
  "src/lib/analytics/conversion.ts",
  "src/lib/ai/public-evidence.ts",
];

const expectedServices = [
  "Cửa cổng",
  "Cầu thang và lan can",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
];

test("AI service names have one domain source of truth", async () => {
  const domain = await readFile(domainPath, "utf8");

  for (const service of expectedServices) {
    assert.match(domain, new RegExp(service));
  }
  assert.match(domain, /export type AIService/);
  assert.match(domain, /export function isAIService/);
  assert.match(domain, /export function getAIService/);

  for (const consumerPath of consumers) {
    const source = await readFile(consumerPath, "utf8");
    assert.match(source, /@\/lib\/ai\/service-domain/);
    assert.doesNotMatch(source, /new Set\(\[\s*"Cửa cổng"/);
  }
});

test("route entry no longer depends on presentation service content for validation", async () => {
  const source = await readFile(
    "src/components/sections/AIOfficeRouteEntry.tsx",
    "utf8",
  );

  assert.match(source, /getAIService\(searchParams\.get\("service"\)\)/);
  assert.doesNotMatch(source, /@\/content\/services/);
  assert.doesNotMatch(source, /SERVICES\.find/);
});
