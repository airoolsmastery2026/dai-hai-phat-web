import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const formatter = fs.readFileSync("src/lib/server/support-reference.ts", "utf8");
const projectAnalysis = fs.readFileSync("src/app/api/ai/project-analysis/route.ts", "utf8");
const proposalEvidence = fs.readFileSync("src/app/api/ai/proposal-evidence/route.ts", "utf8");
const crmHandoff = fs.readFileSync("src/app/api/crm/handoff/route.ts", "utf8");

test("support references only expose validated request IDs", () => {
  assert.match(formatter, /REQUEST_ID_PATTERN/);
  assert.match(formatter, /Mã hỗ trợ:/);
  assert.match(formatter, /return normalizedMessage/);
});

test("Gemini failures include a support reference", () => {
  assert.match(projectAnalysis, /formatSupportReference/);
  assert.match(projectAnalysis, /Phân tích AI tạm thời chưa khả dụng/);
  assert.match(projectAnalysis, /Không thể phân tích hồ sơ lúc này/);
});

test("evidence failures include a support reference", () => {
  assert.match(proposalEvidence, /formatSupportReference/);
  assert.match(proposalEvidence, /Không thể đối chiếu Knowledge Base lúc này/);
});

test("CRM failures keep tracing IDs separate from customer-facing errors", () => {
  assert.doesNotMatch(crmHandoff, /formatSupportReference/);
  assert.match(crmHandoff, /requestId/);
  assert.match(crmHandoff, /Kênh gửi tự động đang tạm gián đoạn/);
  assert.match(crmHandoff, /Hồ sơ vẫn được giữ trên thiết bị/);
  assert.doesNotMatch(crmHandoff, /Kênh CRM chưa được cấu hình/);
  assert.doesNotMatch(crmHandoff, /Mã hỗ trợ:/);
});

test("client validation errors stay concise", () => {
  assert.doesNotMatch(projectAnalysis, /formatSupportReference\("Dữ liệu JSON/);
  assert.doesNotMatch(proposalEvidence, /formatSupportReference\("Dữ liệu JSON/);
  assert.doesNotMatch(crmHandoff, /formatSupportReference\("Dữ liệu JSON/);
});
