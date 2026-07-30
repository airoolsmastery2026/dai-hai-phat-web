import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps proposal and Gemini evidence inside the residential scope", async () => {
  const scope = await readFile(
    new URL("../src/lib/ai/public-evidence.ts", import.meta.url),
    "utf8",
  );
  const evidenceRoute = await readFile(
    new URL(
      "../src/app/api/ai/proposal-evidence/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const analysisRoute = await readFile(
    new URL(
      "../src/app/api/ai/project-analysis/route.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(scope, /"Cửa cổng"/);
  assert.match(scope, /"Cầu thang và lan can"/);
  assert.match(scope, /"Mái che"/);
  assert.match(scope, /"Nội thất"/);
  assert.match(scope, /"Cải tạo không gian"/);
  assert.match(scope, /projectType: "Nhà ở"/);
  assert.match(scope, /image\.projectType === "Nhà ở"/);
  assert.match(scope, /Hạng mục không thuộc phạm vi tư vấn dân dụng/);
  assert.match(scope, /evidence\.prices\.map/);

  assert.match(evidenceRoute, /buildResidentialProposalEvidenceResponse/);
  assert.doesNotMatch(evidenceRoute, /buildProposalEvidenceResponse/);
  assert.match(analysisRoute, /buildResidentialProposalEvidenceResponse/);
  assert.match(analysisRoute, /ProposalEvidenceValidationError/);
  assert.doesNotMatch(analysisRoute, /from "@\/lib\/ai\/catalog";\n.*buildProposalEvidenceResponse/s);
});
