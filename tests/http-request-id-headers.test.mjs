import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  "src/app/api/ai/project-analysis/route.ts",
  "src/app/api/ai/proposal-evidence/route.ts",
  "src/app/api/crm/handoff/route.ts",
];
const helperPath = "src/lib/server/api-json-response.ts";

test("AI and CRM APIs use the shared traced JSON response helper", async () => {
  const helper = await readFile(helperPath, "utf8");

  assert.match(helper, /function readResponseRequestId\(body: unknown\)/);
  assert.match(helper, /typeof requestId === "string" && requestId\.length <= 100/);
  assert.match(helper, /"X-Request-ID": requestId/);
  assert.match(helper, /\.\.\.extraHeaders/);
  assert.match(helper, /"Cache-Control": "private, no-store"/);
  assert.match(helper, /"X-Content-Type-Options": "nosniff"/);

  for (const route of routes) {
    const source = await readFile(route, "utf8");

    assert.match(source, /import \{ apiJsonResponse \} from "@\/lib\/server\/api-json-response"/);
    assert.match(source, /apiJsonResponse\(/);
    assert.doesNotMatch(source, /function readResponseRequestId/);
    assert.doesNotMatch(source, /NextResponse\.json/);
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
