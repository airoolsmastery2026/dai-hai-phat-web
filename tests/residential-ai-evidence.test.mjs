import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps proposal and Gemini evidence inside the residential scope", async () => {
  const scope = await readFile("src/lib/ai/public-evidence.ts", "utf8");
  const serviceDomain = await readFile("src/lib/ai/service-domain.ts", "utf8");
  const evidenceRoute = await readFile(
    "src/app/api/ai/proposal-evidence/route.ts",
    "utf8",
  );
  const analysisRoute = await readFile(
    "src/app/api/ai/project-analysis/route.ts",
    "utf8",
  );

  const services = [
    "Cửa cổng",
    "Cầu thang và lan can",
    "Mái che",
    "Nội thất",
    "Cải tạo không gian",
  ];

  for (const service of services) {
    assert.equal(serviceDomain.includes(service), true);
  }

  assert.match(scope, /isAIService\(query\.service\)/);
  assert.match(scope, /projectType: "Nhà ở"/);
  assert.match(scope, /image\.projectType === "Nhà ở"/);
  assert.match(scope, /Hạng mục không thuộc phạm vi tư vấn dân dụng/);
  assert.match(scope, /evidence\.prices\.map/);
  assert.match(evidenceRoute, /buildResidentialProposalEvidenceResponse/);
  assert.equal(evidenceRoute.includes("buildProposalEvidenceResponse"), false);
  assert.match(analysisRoute, /buildResidentialProposalEvidenceResponse/);
  assert.match(analysisRoute, /ProposalEvidenceValidationError/);
});
