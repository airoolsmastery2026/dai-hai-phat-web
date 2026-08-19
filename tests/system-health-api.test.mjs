import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const healthSource = await readFile("src/lib/server/system-health.ts", "utf8");
const routeSource = await readFile(
  "src/app/api/v1/integrations/system/health/route.ts",
  "utf8",
);
const healthModule = ts.transpileModule(healthSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const health = await import(
  `data:text/javascript;base64,${Buffer.from(healthModule.outputText).toString("base64")}`
);

const completeEnv = {
  DHP_CONTROL_PLANE_URL:
    "https://example.supabase.co/functions/v1/dhp-control-plane-cloud",
  DHP_CONTROL_PLANE_KEY_ID: "monitoring-key",
  DHP_CONTROL_PLANE_SECRET: "control-plane-secret",
  CRM_WEBHOOK_URL: "https://crm.example.com/webhooks/lead",
  CRM_WEBHOOK_TOKEN: "crm-secret",
  APILAYER_API_KEY: "apilayer-secret",
  ECOSYSTEM_SERVICE_API_KEY: "ecosystem-secret",
};

test("health snapshot checks configuration without exposing secret values", () => {
  const snapshot = health.createSystemHealthSnapshot(completeEnv);
  const serialized = JSON.stringify(snapshot);

  assert.equal(snapshot.state, "operational");
  assert.equal(snapshot.services.ai, "configured");
  assert.equal(snapshot.services.crm, "configured");
  assert.equal(snapshot.services.phoneVerification, "configured");
  assert.doesNotMatch(
    serialized,
    /control-plane-secret|crm-secret|apilayer-secret|ecosystem-secret/,
  );
});

test("AI health requires an authenticated HTTPS capability gateway boundary", () => {
  const missingGatewaySecret = health.createSystemHealthSnapshot({
    ...completeEnv,
    DHP_CONTROL_PLANE_SECRET: "",
  });
  const insecureControlPlane = health.createSystemHealthSnapshot({
    ...completeEnv,
    DHP_CONTROL_PLANE_URL:
      "http://example.supabase.co/functions/v1/dhp-control-plane-cloud",
  });
  const unrelatedControlPlanePath = health.createSystemHealthSnapshot({
    ...completeEnv,
    DHP_CONTROL_PLANE_URL:
      "https://example.supabase.co/functions/v1/not-the-control-plane",
  });

  assert.equal(missingGatewaySecret.state, "degraded");
  assert.equal(missingGatewaySecret.services.ai, "not-configured");
  assert.equal(insecureControlPlane.state, "degraded");
  assert.equal(insecureControlPlane.services.ai, "not-configured");
  assert.equal(unrelatedControlPlanePath.state, "degraded");
  assert.equal(unrelatedControlPlanePath.services.ai, "not-configured");
});

test("critical sales dependencies degrade protected health when not ready", () => {
  const missingPhoneProvider = health.createSystemHealthSnapshot({
    ...completeEnv,
    APILAYER_API_KEY: "",
  });
  const missingCrmToken = health.createSystemHealthSnapshot({
    ...completeEnv,
    CRM_WEBHOOK_TOKEN: "",
  });
  const insecureCrmUrl = health.createSystemHealthSnapshot({
    ...completeEnv,
    CRM_WEBHOOK_URL: "http://crm.example.com/webhooks/lead",
  });

  assert.equal(missingPhoneProvider.state, "degraded");
  assert.equal(missingPhoneProvider.services.phoneVerification, "not-configured");
  assert.equal(missingCrmToken.state, "degraded");
  assert.equal(missingCrmToken.services.crm, "not-configured");
  assert.equal(insecureCrmUrl.state, "degraded");
  assert.equal(insecureCrmUrl.services.crm, "not-configured");
});

test("health endpoint is restricted to control and monitoring services", () => {
  assert.match(routeSource, /"telegram-control"/);
  assert.match(routeSource, /"monitoring"/);
  assert.doesNotMatch(routeSource, /"publishing-bot"/);
  assert.match(routeSource, /health\.state === "operational" \? 200 : 503/);
  assert.match(routeSource, /private, no-store/);
  assert.match(routeSource, /schemaVersion: "1\.0"/);
});
