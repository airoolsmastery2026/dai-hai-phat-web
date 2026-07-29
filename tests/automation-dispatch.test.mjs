import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import test, { afterEach } from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/server/automation.ts", import.meta.url),
  "utf8",
);
const signatureSource = await readFile(
  new URL("../src/lib/server/webhook-signature.ts", import.meta.url),
  "utf8",
);
const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
};
const signatureModule = `data:text/javascript;base64,${Buffer.from(
  ts.transpileModule(signatureSource, { compilerOptions }).outputText,
).toString("base64")}`;
const transpiled = ts.transpileModule(
  source.replace(
    '"@/lib/server/webhook-signature"',
    JSON.stringify(signatureModule),
  ),
  { compilerOptions },
);
const automation = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const lead = {
  sessionId: "session-123",
  source: "ai-office",
  project: { service: "Cửa cổng", imageCount: 2 },
  contact: { name: "Nguyễn Văn A", phone: "0901 234 567" },
  qualification: { confidence: 90, leadScore: 80 },
};
const handoff = {
  leadId: "lead-456",
  receivedAt: "2026-07-29T04:30:00.000Z",
};

const originalFetch = globalThis.fetch;
const originalUrl = process.env.AUTOMATION_WEBHOOK_URL;
const originalToken = process.env.AUTOMATION_WEBHOOK_TOKEN;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.AUTOMATION_WEBHOOK_URL;
  else process.env.AUTOMATION_WEBHOOK_URL = originalUrl;
  if (originalToken === undefined) delete process.env.AUTOMATION_WEBHOOK_TOKEN;
  else process.env.AUTOMATION_WEBHOOK_TOKEN = originalToken;
});

test("skips dispatch safely when automation is not configured", async () => {
  delete process.env.AUTOMATION_WEBHOOK_URL;
  delete process.env.AUTOMATION_WEBHOOK_TOKEN;

  const result = await automation.dispatchLeadAutomation(
    lead,
    handoff,
    "request-1",
  );

  assert.equal(result.status, "not_configured");
});

test("dispatches a minimal idempotent lead event", async () => {
  process.env.AUTOMATION_WEBHOOK_URL =
    "https://automation.example.com/webhooks/lead";
  process.env.AUTOMATION_WEBHOOK_TOKEN = "secret-token";
  let request;
  globalThis.fetch = async (url, init) => {
    request = { url, init };
    return new Response(null, { status: 202 });
  };

  const result = await automation.dispatchLeadAutomation(
    lead,
    handoff,
    "request-2",
  );
  const body = JSON.parse(request.init.body);

  assert.equal(result.status, "delivered");
  assert.equal(request.url, "https://automation.example.com/webhooks/lead");
  assert.equal(request.init.headers.Authorization, "Bearer secret-token");
  assert.equal(
    request.init.headers["Idempotency-Key"],
    "session-123:lead-received",
  );
  const timestamp = request.init.headers["X-DHP-Timestamp"];
  const expectedSignature = `v1=${createHmac("sha256", "secret-token")
    .update(`${timestamp}.${request.init.body}`, "utf8")
    .digest("hex")}`;
  assert.match(timestamp, /^\d{10}$/);
  assert.equal(request.init.headers["X-DHP-Signature"], expectedSignature);
  assert.equal(body.schemaVersion, "1.0");
  assert.equal(body.eventId, "request-2");
  assert.equal(body.event, "lead.received");
  assert.equal(body.leadId, "lead-456");
  assert.equal(body.project.imageCount, 2);
  assert.equal(body.images, undefined);
});

test("reports rejection without failing the CRM handoff", async () => {
  process.env.AUTOMATION_WEBHOOK_URL =
    "https://automation.example.com/webhooks/lead";
  process.env.AUTOMATION_WEBHOOK_TOKEN = "secret-token";
  globalThis.fetch = async () => new Response(null, { status: 503 });

  const result = await automation.dispatchLeadAutomation(
    lead,
    handoff,
    "request-3",
  );

  assert.equal(result.status, "rejected");
});
