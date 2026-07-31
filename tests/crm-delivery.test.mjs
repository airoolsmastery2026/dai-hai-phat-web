import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import test, { afterEach } from "node:test";
import ts from "typescript";

const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
};
const signatureSource = await readFile(
  new URL("../src/lib/server/webhook-signature.ts", import.meta.url),
  "utf8",
);
const signatureModule = `data:text/javascript;base64,${Buffer.from(
  ts.transpileModule(signatureSource, { compilerOptions }).outputText,
).toString("base64")}`;
const crmSource = await readFile(
  new URL("../src/lib/server/crm.ts", import.meta.url),
  "utf8",
);
const crmModule = ts.transpileModule(
  crmSource.replace(
    '"@/lib/server/webhook-signature"',
    JSON.stringify(signatureModule),
  ),
  { compilerOptions },
);
const crm = await import(
  `data:text/javascript;base64,${Buffer.from(crmModule.outputText).toString("base64")}`
);

const lead = {
  sessionId: "session-123",
  state: "DONE",
  consent: true,
  source: "ai-office",
  project: { service: "Cửa cổng", imageCount: 2 },
  contact: { name: "Nguyễn Văn A", phone: "0901 234 567" },
  qualification: { confidence: 90, leadScore: 80 },
};

const originalFetch = globalThis.fetch;
const originalUrl = process.env.CRM_WEBHOOK_URL;
const originalToken = process.env.CRM_WEBHOOK_TOKEN;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.CRM_WEBHOOK_URL;
  else process.env.CRM_WEBHOOK_URL = originalUrl;
  if (originalToken === undefined) delete process.env.CRM_WEBHOOK_TOKEN;
  else process.env.CRM_WEBHOOK_TOKEN = originalToken;
});

function configureCRM() {
  process.env.CRM_WEBHOOK_URL = "https://crm.example.com/webhooks/lead";
  process.env.CRM_WEBHOOK_TOKEN = "crm-secret";
}

test("signs the exact CRM webhook payload with a replay timestamp", async () => {
  configureCRM();
  let request;
  globalThis.fetch = async (url, init) => {
    request = { url, init };
    return Response.json({ leadId: "lead-456" }, { status: 201 });
  };

  const result = await crm.deliverLeadToCRM(lead, "request-1");
  const timestamp = request.init.headers["X-DHP-Timestamp"];
  const expectedSignature = `v1=${createHmac("sha256", "crm-secret")
    .update(`${timestamp}.${request.init.body}`, "utf8")
    .digest("hex")}`;

  assert.equal(result.leadId, "lead-456");
  assert.equal(request.url, "https://crm.example.com/webhooks/lead");
  assert.equal(request.init.headers.Authorization, "Bearer crm-secret");
  assert.equal(request.init.headers["Idempotency-Key"], "session-123");
  assert.match(timestamp, /^\d{10}$/);
  assert.equal(request.init.headers["X-DHP-Signature"], expectedSignature);
  const body = JSON.parse(request.init.body);
  assert.equal(body.schemaVersion, "1.1");
  assert.equal(body.eventId, "request-1");
  assert.equal(body.event, "lead.handoff");
  assert.equal(body.contact.phone, "0901 234 567");
});

test("rejects insecure CRM webhook URLs before sending data", async () => {
  process.env.CRM_WEBHOOK_URL = "http://crm.example.com/webhooks/lead";
  process.env.CRM_WEBHOOK_TOKEN = "crm-secret";
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(null, { status: 201 });
  };

  await assert.rejects(
    crm.deliverLeadToCRM(lead, "request-2"),
    (error) => error.code === "not_configured",
  );
  assert.equal(called, false);
});

test("classifies CRM rate limits and server failures as unavailable", async () => {
  configureCRM();

  for (const status of [408, 425, 429, 500, 503]) {
    globalThis.fetch = async () => new Response(null, { status });
    await assert.rejects(
      crm.deliverLeadToCRM(lead, `request-${status}`),
      (error) => error.code === "unavailable" && error.upstreamStatus === status,
    );
  }
});

test("classifies permanent CRM client errors as rejected", async () => {
  configureCRM();
  globalThis.fetch = async () => new Response(null, { status: 422 });

  await assert.rejects(
    crm.deliverLeadToCRM(lead, "request-422"),
    (error) => error.code === "rejected" && error.upstreamStatus === 422,
  );
});
