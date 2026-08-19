import { verifyConfirmedSpaceAtBoundary } from "@/lib/ai/space-confirmation-boundary";
import {
  evaluateSpaceProposal,
  type SpaceValidationIssue,
  type SpaceValidationReport,
} from "@/lib/ai/space-designer";

type UnknownRecord = Record<string, unknown>;

export type SpaceLayoutGateErrorCode =
  | "INVALID_LAYOUT_REQUEST"
  | "INVALID_LAYOUT_PROPOSAL";

export class SpaceLayoutGateError extends Error {
  readonly code: SpaceLayoutGateErrorCode;

  constructor(message: string, code: SpaceLayoutGateErrorCode) {
    super(message);
    this.name = "SpaceLayoutGateError";
    this.code = code;
  }
}

export interface ConfirmedLayoutGateReport extends SpaceValidationReport {
  gate: "G5_LAYOUT_CONSTRAINTS";
  confirmedRevision: string;
}

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function hasOnlyKeys(record: UnknownRecord, allowed: readonly string[]): boolean {
  const allowedSet = new Set(allowed);
  return Object.keys(record).every((key) => allowedSet.has(key));
}

function hasStrictBoundsShape(value: unknown): boolean {
  const bounds = asRecord(value);
  return Boolean(
    bounds && hasOnlyKeys(bounds, ["x", "y", "width", "depth"]),
  );
}

function hasStrictPlacementShape(value: unknown): boolean {
  const placement = asRecord(value);
  return Boolean(
    placement &&
      hasOnlyKeys(placement, [
        "id",
        "roomId",
        "kind",
        "bounds",
        "clearanceMm",
      ]) &&
      hasStrictBoundsShape(placement.bounds),
  );
}

function assertStrictProposalShape(value: unknown): UnknownRecord {
  const proposal = asRecord(value);
  if (
    !proposal ||
    !hasOnlyKeys(proposal, ["baseRevision", "structuralEdits", "placements"]) ||
    typeof proposal.baseRevision !== "string" ||
    !Array.isArray(proposal.structuralEdits) ||
    !Array.isArray(proposal.placements) ||
    !proposal.placements.every(hasStrictPlacementShape)
  ) {
    throw new SpaceLayoutGateError(
      "Layout proposal chứa field ngoài schema hoặc shape không hợp lệ.",
      "INVALID_LAYOUT_PROPOSAL",
    );
  }
  return proposal;
}

function structuralEditIssue(): SpaceValidationIssue {
  return {
    code: "STRUCTURAL_EDIT_REQUIRES_RECONFIRMATION",
    severity: "error",
    path: "proposal.structuralEdits",
    message:
      "G5 chỉ chấp nhận layout không sửa geometry. Mọi thay đổi HARD/CONTROLLED phải tạo và xác nhận lại geometry qua G4.",
  };
}

export async function evaluateConfirmedLayout(
  input: unknown,
  sealKey: string,
): Promise<ConfirmedLayoutGateReport> {
  const request = asRecord(input);
  if (
    !request ||
    !hasOnlyKeys(request, ["confirmed", "proposal"]) ||
    !("confirmed" in request) ||
    !("proposal" in request)
  ) {
    throw new SpaceLayoutGateError(
      "Yêu cầu kiểm tra layout không hợp lệ.",
      "INVALID_LAYOUT_REQUEST",
    );
  }

  // Authenticity/integrity is checked before proposal acceptance. A candidate,
  // stale envelope, mutated geometry or recomputed public digest fails here.
  const confirmed = await verifyConfirmedSpaceAtBoundary(
    request.confirmed,
    sealKey,
  );
  const proposal = assertStrictProposalShape(request.proposal);

  // G5 v1 deliberately does not accept structural changes from a public
  // proposal. In particular, an `approved: true` flag cannot bypass G4.
  if (proposal.structuralEdits.length > 0) {
    return {
      gate: "G5_LAYOUT_CONSTRAINTS",
      confirmedRevision: confirmed.confirmedRevision,
      valid: false,
      issues: [structuralEditIssue()],
    };
  }

  const report = evaluateSpaceProposal(confirmed.model, proposal);
  return {
    gate: "G5_LAYOUT_CONSTRAINTS",
    confirmedRevision: confirmed.confirmedRevision,
    valid: report.valid,
    issues: report.issues,
  };
}
