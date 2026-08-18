import {
  ProposalEvidenceValidationError,
  type ProposalEvidenceRequest,
} from "@/lib/ai/catalog";
import { buildResidentialProposalEvidenceResponse } from "@/lib/ai/public-evidence";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

function errorResponse(message: string, status: number): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    },
  );
}

function stringField(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export async function POST(request: Request): Promise<Response> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return errorResponse("Dữ liệu truy vấn vượt giới hạn.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Dữ liệu gửi lên không phải JSON hợp lệ.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Dữ liệu truy vấn không hợp lệ.", 400);
  }

  const record = body as Record<string, unknown>;
  const service = stringField(record.service, 120);
  if (!service) return errorResponse("Hãy chọn hoặc nhập hạng mục cần tra cứu.", 400);

  const rawKeywords = Array.isArray(record.keywords) ? record.keywords : [];
  const keywords = rawKeywords
    .map((item) => stringField(item, 80))
    .filter((item): item is string => Boolean(item))
    .slice(0, 8);

  const query: ProposalEvidenceRequest = {
    service,
    category: stringField(record.category),
    material: stringField(record.material),
    style: stringField(record.style),
    dimensions: stringField(record.dimensions, 300),
    keywords,
    limit: Math.min(Math.max(Number(record.limit) || 6, 1), 12),
  };

  try {
    const evidence = buildResidentialProposalEvidenceResponse(query);
    return Response.json(
      {
        source: "dhp-proposal-evidence",
        verified: true,
        evidence,
      },
      {
        headers: {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof ProposalEvidenceValidationError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Không thể tra cứu DHP Knowledge lúc này.", 500);
  }
}
