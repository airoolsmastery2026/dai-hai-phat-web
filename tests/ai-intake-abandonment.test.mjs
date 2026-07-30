import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const controllerPath = "src/components/analytics/AIFunnelEventController.tsx";
const conversionPath = "src/lib/analytics/conversion.ts";

test("AI funnel exposes a privacy-safe abandonment event", async () => {
  const conversion = await readFile(conversionPath, "utf8");
  const controller = await readFile(controllerPath, "utf8");

  assert.match(conversion, /\| "intake_abandoned"/);
  assert.match(controller, /window\.addEventListener\("pagehide", handlePageHide\)/);
  assert.match(controller, /window\.removeEventListener\("pagehide", handlePageHide\)/);
  assert.match(controller, /event\.persisted \|\| stepCount === 0 \|\| intakeCompleted/);
  assert.match(controller, /emit\("intake_abandoned"\)/);
});

test("abandonment tracking does not inspect customer-entered values", async () => {
  const controller = await readFile(controllerPath, "utf8");

  assert.doesNotMatch(controller, /FormData/);
  assert.doesNotMatch(controller, /\.value/);
  assert.doesNotMatch(controller, /localStorage|sessionStorage/);
  assert.doesNotMatch(controller, /beforeunload/);
  assert.doesNotMatch(controller, /visibilitychange/);
});

test("completed intakes are excluded before page exit", async () => {
  const controller = await readFile(controllerPath, "utf8");

  assert.match(controller, /let intakeCompleted = false/);
  assert.match(controller, /intakeCompleted = true/);
  assert.match(controller, /stepCount \+= 1/);
});
