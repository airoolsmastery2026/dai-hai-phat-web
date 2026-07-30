import {
  buildProposalEvidenceResponse,
  ProposalEvidenceValidationError,
  type ProposalEvidenceRequest,
  type ProposalEvidenceResponse,
} from "@/lib/ai/catalog";
import { isAIService } from "@/lib/ai/service-domain";

export function buildResidentialProposalEvidenceResponse(
  query: ProposalEvidenceRequest,
): ProposalEvidenceResponse {
  if (!isAIService(query.service)) {
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
