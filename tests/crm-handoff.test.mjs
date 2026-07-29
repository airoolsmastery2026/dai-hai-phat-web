import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/ai/handoff.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const handoff = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const validLead = {
  sessionId: "session-123",
  state: "DONE",
  consent: true,
  source: "ai-office",
  project: {
    intent: "Thi công",
    service: "Cửa cổng",
    projectType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    imageCount: 2,
    dimensions: "Rộng 4 m × cao 2,6 m",
    style: "Hiện đại",
    material: "Sắt hoặc thép",
    budget: "60–120 triệu",
    timeline: "Trong 1 tháng",
    priority: "Bền và dễ bảo trì",
    surveyWindow: "Sáng thứ Bảy",
    quoteRequest: "Yêu cầu báo giá",
  },
  contact: {
    name: "Nguyễn Văn A",
    phone: "0901 234 567",
    surveyAddress: "Quận 9, TP. Hồ Chí Minh",
    email: "customer@example.com",
  },
  qualification: { confidence: 90, leadScore: 80 },
};

test("accepts a completed consented CRM handoff", () => {
  const parsed = handoff.parseCRMHandoffRequest(validLead);
  assert.equal(parsed.sessionId, validLead.sessionId);
  assert.deepEqual(parsed.project, validLead.project);
  assert.equal(parsed.contact.phone, validLead.contact.phone);
  assert.equal(parsed.consent, true);
});

test("rejects handoffs without consent or with invalid contact data", () => {
  assert.throws(() =>
    handoff.parseCRMHandoffRequest({ ...validLead, consent: false }),
  );
  assert.throws(() =>
    handoff.parseCRMHandoffRequest({
      ...validLead,
      contact: { ...validLead.contact, phone: "123" },
    }),
  );
});

test("retains the honeypot value for the route to reject", () => {
  const parsed = handoff.parseCRMHandoffRequest({
    ...validLead,
    website: "https://spam.example",
  });
  assert.equal(parsed.website, "https://spam.example");
});
