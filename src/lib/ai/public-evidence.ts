import {
  buildProposalEvidenceResponse,
  ProposalEvidenceValidationError,
  type ProposalEvidenceRequest,
  type ProposalEvidenceResponse,
} from "@/lib/ai/catalog";

const RESIDENTIAL_AI_SERVICES = new Set([
  "Cửa cổng",
  "Cầu thang và lan can",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
]);

export function buildResidentialProposalEvidenceResponse(
  query: ProposalEvidenceRequest,
): ProposalEvidenceResponse {
  if (!RESIDENTIAL_AI_SERVICES.has(query.service)) {
    throw new ProposalEvidenceValidationError(
      "Hạng mục không thuộc phạm vi tư vấn dân dụng.",
    );
  }

  const evidence = buildProposalEvidenceResponse({
    ...query,
    projectType: "Nhà ở",
  });
  const images = evidence.images.filter(
    (image) => image.projectType === "Nhà ở",
  );
  const materials = Array.from(
    new Set(
      [
        ...images.map((image) => image.material),
        ...evidence.prices.map((price) => price.material),
      ].filter((material): material is string => Boolean(material)),
    ),
  ).slice(0, 6);

  return {
    ...evidence,
    images,
    materials,
  };
}
