import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateConceptReadiness,
  normalizeVietnamPhone,
} from "../src/lib/ai/concept-readiness.ts";

const completeProfile = {
  name: "Nguyễn Văn An",
  phone: "0785 505 518",
  zalo: "0785505518",
  projectArea: "Thủ Đức, TP. Hồ Chí Minh",
  service: "Cửa cổng",
  dimensions: "Rộng 3,6 m, cao 2,4 m",
  budget: "20–50 triệu",
  timeline: "Trong 1 tháng",
  purpose: "build",
  description:
    "Cần làm cổng sắt hai cánh phong cách hiện đại, sơn tĩnh điện đen nhám, giữ nguyên hai cột hiện trạng và ưu tiên kết cấu dễ bảo trì.",
  hasSiteImage: true,
  hasReferenceImage: true,
  consent: true,
};

test("normalizes common Vietnamese phone formatting", () => {
  assert.equal(normalizeVietnamPhone("0785 505.518"), "0785505518");
  assert.equal(normalizeVietnamPhone("+84-785-505-518"), "+84785505518");
});

test("complete real-project profile is ready", () => {
  const result = evaluateConceptReadiness(completeProfile);

  assert.equal(result.score, 100);
  assert.equal(result.decision, "ready");
  assert.deepEqual(result.missing, []);
});

test("reference-only requests require engineer review", () => {
  const result = evaluateConceptReadiness({
    ...completeProfile,
    purpose: "reference",
  });

  assert.equal(result.decision, "requires_review");
  assert.ok(result.reasons.some((reason) => reason.includes("chỉ tham khảo")));
});

test("missing identity and consent blocks generation", () => {
  const result = evaluateConceptReadiness({
    ...completeProfile,
    name: "",
    phone: "123",
    consent: false,
  });

  assert.equal(result.decision, "needs_information");
  assert.ok(result.missing.includes("Họ và tên"));
  assert.ok(result.missing.includes("Số điện thoại hợp lệ"));
  assert.ok(result.missing.includes("Đồng ý gửi hồ sơ cho Đại Hải Phát"));
});

test("medium-completeness profile is routed to review", () => {
  const result = evaluateConceptReadiness({
    ...completeProfile,
    zalo: "",
    budget: "",
    timeline: "",
    description: "Cần tư vấn cổng mới.",
    hasReferenceImage: false,
  });

  assert.equal(result.decision, "requires_review");
  assert.ok(result.score >= 55 && result.score < 80);
});
