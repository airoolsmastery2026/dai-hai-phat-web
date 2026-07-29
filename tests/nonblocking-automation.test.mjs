import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("returns the CRM handoff before lead automation completes", async () => {
  const route = await readFile(
    new URL("../src/app/api/crm/handoff/route.ts", import.meta.url),
    "utf8",
  );

  assert.match(route, /import \{ after, NextRequest, NextResponse \} from "next\/server"/);
  assert.match(route, /export const maxDuration = 15/);
  assert.match(
    route,
    /after\(async \(\) => \{[\s\S]*await dispatchLeadAutomation\(lead, result, requestId\)[\s\S]*\}\);/,
  );
  assert.doesNotMatch(
    route,
    /const automation = await dispatchLeadAutomation\(lead, result, requestId\);\n\s*console\.info\("DHP CRM handoff delivered"/,
  );
  assert.match(route, /return jsonResponse\(\{ requestId, handoff: result \}, 201\)/);
});
