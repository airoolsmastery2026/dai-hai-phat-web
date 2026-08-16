import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/ai/handoff.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const handoff = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const base = {
  sessionId: "session-quality-gate",
  state: "DONE",
  consent: true,
  source: "ai-office",
  project: {
    intent: "Khảo sát",
    service: "Cửa cổng",
    projectType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    imageCount: 0,
    dimensions: "Cần khảo sát đo đạc",
    style: "Hiện đại",
    material: "Sắt hoặc thép",
    budget: "Cần tư vấn ngân sách",
    timeline: "Cần tư vấn tiến độ",
    priority: "Độ bền",
    surveyWindow: "Sáng ngày làm việc",
    quoteRequest: "Proposal và báo giá",
  },
  contact: {
    name: "Nguyễn Văn An",
    phone: "0901234567",
    surveyAddress: "12 Đường Mẫu, Thới Hòa, TP. Hồ Chí Minh",
  },
  qualification: { confidence: 90, leadScore: 80 },
};

test("CRM boundary rejects the junk values seen in the mobile report", () => {
  assert.throws(
    () => handoff.parseCRMHandoffRequest({
      ...base,
      contact: { ...base.contact, name: "Adxre" },
    }),
    /Tên liên hệ/,
  );

  assert.throws(
    () => handoff.parseCRMHandoffRequest({
      ...base,
      contact: { ...base.contact, phone: "442556633288" },
    }),
    /Số điện thoại Việt Nam/,
  );

  assert.throws(
    () => handoff.parseCRMHandoffRequest({
      ...base,
      contact: { ...base.contact, surveyAddress: "Stxguj kjch Hyde kiggf" },
    }),
    /Địa chỉ khảo sát/,
  );
});

test("CRM boundary keeps realistic Vietnamese contact data", () => {
  const parsed = handoff.parseCRMHandoffRequest(base);
  assert.equal(parsed.contact.name, base.contact.name);
  assert.equal(parsed.contact.phone, base.contact.phone);
  assert.equal(parsed.contact.surveyAddress, base.contact.surveyAddress);
});
