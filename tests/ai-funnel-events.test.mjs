import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("tracks AI funnel milestones without collecting customer input", async () => {
  const contract = await readFile(
    new URL("../src/lib/analytics/conversion.ts", import.meta.url),
    "utf8",
  );
  const controller = await readFile(
    new URL("../src/components/analytics/AIFunnelEventController.tsx", import.meta.url),
    "utf8",
  );
  const routeEntry = await readFile(
    new URL("../src/components/sections/AIOfficeRouteEntry.tsx", import.meta.url),
    "utf8",
  );

  [
    "ai_step_completed",
    "ai_intake_completed",
    "handoff_consent_given",
    "crm_handoff_started",
    "crm_handoff_succeeded",
    "crm_handoff_failed",
  ].forEach((eventName) => assert.match(contract, new RegExp(`"${eventName}"`)));

  assert.match(controller, /new MutationObserver\(inspectRenderedState\)/);
  assert.match(controller, /target\.id === "crm-handoff-consent"/);
  assert.match(controller, /target\.type === "file"/);
  assert.match(controller, /trackConversionEvent\("ai_step_completed"/);
  assert.match(controller, /emit\("crm_handoff_succeeded"\)/);
  assert.match(controller, /emit\("crm_handoff_failed"\)/);
  assert.doesNotMatch(controller, /\.value/);
  assert.doesNotMatch(controller, /FormData/);
  assert.doesNotMatch(controller, /preventDefault/);
  assert.doesNotMatch(controller, /fetch\(/);
  assert.match(routeEntry, /<AIFunnelEventController service=\{servicePreset \?\? undefined\}/);
});
