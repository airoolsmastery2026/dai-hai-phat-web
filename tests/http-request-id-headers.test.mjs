import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  "src/app/api/ai/project-analysis/route.ts",
  "src/app/api/ai/proposal-evidence/route.ts",
  "src/app/api/crm/handoff/route.ts",
];

test("AI and CRM APIs expose the response request ID as a header", async () => {
  for (const route of routes) {
    const source = await readFile(route, "utf8");

    assert.match(source, /function readResponseRequestId\(body: unknown\)/);
    assert.match(source, /typeof requestId === "string" && requestId\.length <= 100/);
    assert.match(source, /"X-Request-ID": requestId/);
    assert.match(source, /\.\.\.extraHeaders/);
    assert.doesNotMatch(source, /request\.headers\.get\("x-request-id"\)/i);
  }
});

test("request IDs remain server generated and present in response bodies", async () => {
  for (const route of routes) {
    const source = await readFile(route, "utf8");

    assert.match(source, /const requestId = globalThis\.crypto\.randomUUID\(\)/);
    assert.match(source, /requestId/);
  }
});
