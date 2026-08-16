import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/server/system-health.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const health = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const NOW = new Date("2026-08-16T06:30:00.000Z");

test("health is degraded when required phone verification is not configured", () => {
  const snapshot = health.createSystemHealthSnapshot(
    {
      GEMINI_API_KEY: "gemini-secret",
      CRM_WEBHOOK_URL: "https://crm.example.com/hook",
      ECOSYSTEM_SERVICE_API_KEY: "ecosystem-secret",
    },
    NOW,
  );

  assert.equal(snapshot.state, "degraded");
  assert.equal(snapshot.services.ai, "configured");
  assert.equal(snapshot.services.crm, "configured");
  assert.equal(snapshot.services.phoneVerification, "not-configured");
});

test("health is operational only when AI CRM and phone verification are configured", () => {
  const snapshot = health.createSystemHealthSnapshot(
    {
      GEMINI_API_KEY: "gemini-secret",
      CRM_WEBHOOK_URL: "https://crm.example.com/hook",
      APILAYER_API_KEY: "phone-secret",
    },
    NOW,
  );

  assert.equal(snapshot.state, "operational");
  assert.equal(snapshot.services.phoneVerification, "configured");
  assert.equal(snapshot.services.ecosystemApi, "not-configured");
  assert.equal(snapshot.checkedAt, NOW.toISOString());
});

test("health snapshot exposes readiness statuses but never secret values", () => {
  const snapshot = health.createSystemHealthSnapshot(
    {
      GEMINI_API_KEY: "do-not-expose-gemini",
      CRM_WEBHOOK_URL: "https://crm.example.com/private-hook",
      APILAYER_API_KEY: "do-not-expose-phone",
      ECOSYSTEM_SERVICE_API_KEY: "do-not-expose-ecosystem",
    },
    NOW,
  );
  const serialized = JSON.stringify(snapshot);

  assert.equal(snapshot.state, "operational");
  assert.doesNotMatch(serialized, /do-not-expose/);
  assert.doesNotMatch(serialized, /private-hook/);
  assert.match(serialized, /"phoneVerification":"configured"/);
});
