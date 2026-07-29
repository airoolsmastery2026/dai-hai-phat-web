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

const validSession = {
  id: validLead.sessionId,
  state: "DONE",
  memory: {
    intent: validLead.project.intent,
    service: validLead.project.service,
    projectType: validLead.project.projectType,
    location: validLead.project.location,
    images: [
      {
        storageKey: "private-session:address-photo",
        name: "dia-chi-cong-trinh.webp",
        size: 512_000,
        type: "image/webp",
        lastModified: 1_785_216_000_000,
      },
      {
        storageKey: "private-session:gate-photo",
        name: "hien-trang-cong.webp",
        size: 512_000,
        type: "image/webp",
        lastModified: 1_785_216_000_001,
      },
    ],
    dimensions: validLead.project.dimensions,
    style: validLead.project.style,
    material: validLead.project.material,
    budget: validLead.project.budget,
    timeline: validLead.project.timeline,
    priority: validLead.project.priority,
    surveyWindow: validLead.project.surveyWindow,
    quoteRequest: validLead.project.quoteRequest,
    name: validLead.contact.name,
    phone: validLead.contact.phone,
    surveyAddress: validLead.contact.surveyAddress,
    email: validLead.contact.email,
  },
  confidence: validLead.qualification.confidence,
  leadScore: validLead.qualification.leadScore,
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

test("builds a complete manual handoff without exposing local image metadata", () => {
  const summary = handoff.buildManualHandoffSummary(validSession);

  assert.match(summary, /HỒ SƠ TƯ VẤN ĐẠI HẢI PHÁT/);
  assert.match(summary, /Hạng mục: Cửa cổng/);
  assert.match(summary, /Khung khảo sát: Sáng thứ Bảy/);
  assert.match(summary, /Ảnh hiện trạng: 2 ảnh \(gửi riêng khi trao đổi\)/);
  assert.match(summary, /Điện thoại: 0901 234 567/);
  assert.match(summary, /Địa chỉ khảo sát: Quận 9, TP\. Hồ Chí Minh/);
  assert.doesNotMatch(summary, /private-session|dia-chi-cong-trinh|hien-trang-cong/);
});
