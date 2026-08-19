import {
  type SpaceModel,
  type SpaceStructuralElement,
  type StructuralElementKind,
  validateSpaceModel,
} from "@/lib/ai/space-designer";
import type {
  SpaceCandidateVerification,
  SpaceDimensionEvidence,
} from "@/lib/ai/space-extraction";

const MAX_REVIEW_NOTE_CHARS = 500;
const MIN_SEAL_KEY_CHARS = 32;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

type UnknownRecord = Record<string, unknown>;

export type DimensionReviewStatus = "verified" | "assumed";
export type ConfirmedDimensionStatus =
  | "reviewed-verified"
  | "reviewed-with-assumptions";

export interface SpaceDimensionReview {
  label: string;
  valueMm: number;
  source: "visible-label";
  status: DimensionReviewStatus;
  note?: string;
}

export interface SpaceCandidateForConfirmation {
  model: SpaceModel;
  verification: SpaceCandidateVerification;
}

export interface ConfirmedSpaceVerification {
  geometryStatus: "confirmed-for-design";
  dimensionStatus: ConfirmedDimensionStatus;
  dimensionReviews: SpaceDimensionReview[];
  sourceAssumptions: string[];
  engineeringStatus: "not-engineer-verified";
}

export interface ConfirmedSpaceEnvelope {
  status: "confirmed-for-design";
  sourceRevision: string;
  geometryDigest: `sha256:${string}`;
  confirmationDigest: `sha256:${string}`;
  confirmationSeal: `hmac-sha256:${string}`;
  confirmedRevision: string;
  model: SpaceModel;
  verification: ConfirmedSpaceVerification;
}

export type SpaceConfirmationErrorCode =
  | "INVALID_CONFIRMATION_REQUEST"
  | "INVALID_CANDIDATE"
  | "INVALID_DIMENSION_REVIEW"
  | "DIMENSION_REVIEW_MISMATCH"
  | "LOCK_POLICY_VIOLATION"
  | "CLIENT_AUTHORITY_FIELD"
  | "INVALID_CONFIRMED_ENVELOPE"
  | "INVALID_SEAL_KEY"
  | "GEOMETRY_DIGEST_MISMATCH"
  | "CONFIRMATION_DIGEST_MISMATCH"
  | "CONFIRMATION_SEAL_MISMATCH"
  | "CONFIRMED_REVISION_MISMATCH";

export class SpaceConfirmationError extends Error {
  readonly code: SpaceConfirmationErrorCode;

  constructor(message: string, code: SpaceConfirmationErrorCode) {
    super(message);
    this.name = "SpaceConfirmationError";
    this.code = code;
  }
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

function isValidRevision(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function assertSealKey(sealKey: string): void {
  if (typeof sealKey !== "string" || sealKey.length < MIN_SEAL_KEY_CHARS) {
    throw new SpaceConfirmationError(
      "Space confirmation seal key chưa được cấu hình an toàn.",
      "INVALID_SEAL_KEY",
    );
  }
}

function requiredStructuralPolicy(kind: StructuralElementKind): {
  lock: "hard" | "controlled";
  blocksPlacement: boolean;
} {
  switch (kind) {
    case "wall":
    case "column":
    case "shaft":
      return { lock: "hard", blocksPlacement: true };
    case "window":
      return { lock: "controlled", blocksPlacement: false };
    case "door":
    case "fixed-fixture":
      return { lock: "controlled", blocksPlacement: true };
  }
}

function assertStructuralPolicy(elements: SpaceStructuralElement[]): void {
  for (const element of elements) {
    const required = requiredStructuralPolicy(element.kind);
    if (
      element.lock !== required.lock ||
      element.blocksPlacement !== required.blocksPlacement
    ) {
      throw new SpaceConfirmationError(
        `Structural policy của ${element.id} không khớp policy server.`,
        "LOCK_POLICY_VIOLATION",
      );
    }
  }
}

function canonicalGeometry(model: SpaceModel, sourceRevision: string) {
  return {
    schemaVersion: model.schemaVersion,
    unit: model.unit,
    sourceRevision,
    rooms: [...model.rooms]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((room) => ({
        id: room.id,
        type: room.type,
        polygon: room.polygon.map((point) => ({ x: point.x, y: point.y })),
      })),
    structuralElements: [...model.structuralElements]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((element) => ({
        id: element.id,
        roomId: element.roomId ?? null,
        kind: element.kind,
        lock: element.lock,
        blocksPlacement: element.blocksPlacement,
        bounds: {
          x: element.bounds.x,
          y: element.bounds.y,
          width: element.bounds.width,
          depth: element.bounds.depth,
        },
      })),
  };
}

function canonicalReviews(reviews: SpaceDimensionReview[]) {
  return [...reviews]
    .sort((left, right) => {
      const labelOrder = left.label.localeCompare(right.label);
      return labelOrder !== 0 ? labelOrder : left.valueMm - right.valueMm;
    })
    .map((review) => ({
      label: review.label,
      valueMm: review.valueMm,
      source: review.source,
      status: review.status,
      note: review.note ?? null,
    }));
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(keyValue: string, value: string): Promise<string> {
  assertSealKey(keyValue);
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyValue),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function secureEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function computeSpaceGeometryDigest(
  model: SpaceModel,
  sourceRevision: string,
): Promise<`sha256:${string}`> {
  const digest = await sha256Hex(
    JSON.stringify(canonicalGeometry(model, sourceRevision)),
  );
  return `sha256:${digest}`;
}

export async function computeSpaceConfirmationDigest(
  geometryDigest: string,
  reviews: SpaceDimensionReview[],
  sourceAssumptions: string[],
): Promise<`sha256:${string}`> {
  const digest = await sha256Hex(
    JSON.stringify({
      geometryDigest,
      dimensionReviews: canonicalReviews(reviews),
      sourceAssumptions: [...sourceAssumptions],
      engineeringStatus: "not-engineer-verified",
    }),
  );
  return `sha256:${digest}`;
}

function sealMessage(
  sourceRevision: string,
  geometryDigest: string,
  confirmationDigest: string,
  confirmedRevision: string,
): string {
  return JSON.stringify({
    status: "confirmed-for-design",
    sourceRevision,
    geometryDigest,
    confirmationDigest,
    confirmedRevision,
  });
}

async function computeConfirmationSeal(
  sealKey: string,
  sourceRevision: string,
  geometryDigest: string,
  confirmationDigest: string,
  confirmedRevision: string,
): Promise<`hmac-sha256:${string}`> {
  const signature = await hmacSha256Hex(
    sealKey,
    sealMessage(
      sourceRevision,
      geometryDigest,
      confirmationDigest,
      confirmedRevision,
    ),
  );
  return `hmac-sha256:${signature}`;
}

function parseEvidence(value: unknown): SpaceDimensionEvidence[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    throw new SpaceConfirmationError(
      "Candidate phải có dimension evidence từ G3.",
      "INVALID_CANDIDATE",
    );
  }

  return value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      !hasOnlyKeys(record, ["label", "valueMm", "source"]) ||
      typeof record.label !== "string" ||
      !record.label.trim() ||
      typeof record.valueMm !== "number" ||
      !Number.isFinite(record.valueMm) ||
      record.valueMm <= 0 ||
      record.source !== "visible-label"
    ) {
      throw new SpaceConfirmationError(
        "Dimension evidence của candidate không hợp lệ.",
        "INVALID_CANDIDATE",
      );
    }
    return {
      label: record.label.trim(),
      valueMm: record.valueMm,
      source: "visible-label",
    };
  });
}

function parseAssumptions(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 40) {
    throw new SpaceConfirmationError(
      "Candidate assumptions không hợp lệ.",
      "INVALID_CANDIDATE",
    );
  }
  return value.map((item) => {
    if (typeof item !== "string" || !item.trim() || item.length > 500) {
      throw new SpaceConfirmationError(
        "Candidate assumptions không hợp lệ.",
        "INVALID_CANDIDATE",
      );
    }
    return item.trim();
  });
}

function parseCandidate(value: unknown): SpaceCandidateForConfirmation {
  const candidate = asRecord(value);
  if (!candidate || !hasOnlyKeys(candidate, ["model", "verification"])) {
    throw new SpaceConfirmationError(
      "Candidate confirmation không hợp lệ.",
      "INVALID_CANDIDATE",
    );
  }

  const verification = asRecord(candidate.verification);
  if (
    !verification ||
    !hasOnlyKeys(verification, [
      "geometryStatus",
      "dimensionStatus",
      "dimensionEvidence",
      "assumptions",
    ]) ||
    verification.geometryStatus !== "candidate-unverified" ||
    verification.dimensionStatus !== "unverified-ai-extraction"
  ) {
    throw new SpaceConfirmationError(
      "Candidate chưa ở trạng thái G3 hợp lệ.",
      "INVALID_CANDIDATE",
    );
  }

  const report = validateSpaceModel(candidate.model);
  if (!report.valid) {
    throw new SpaceConfirmationError(
      `Candidate không vượt qua G1: ${report.issues
        .map((issue) => issue.code)
        .join(", ")}`,
      "INVALID_CANDIDATE",
    );
  }

  const model = candidate.model as SpaceModel;
  assertStructuralPolicy(model.structuralElements);

  return {
    model,
    verification: {
      geometryStatus: "candidate-unverified",
      dimensionStatus: "unverified-ai-extraction",
      dimensionEvidence: parseEvidence(verification.dimensionEvidence),
      assumptions: parseAssumptions(verification.assumptions),
    },
  };
}

function evidenceKey(label: string, valueMm: number): string {
  return `${label}\u0000${valueMm}`;
}

function parseReviews(
  value: unknown,
  evidence: SpaceDimensionEvidence[],
): SpaceDimensionReview[] {
  if (!Array.isArray(value) || value.length !== evidence.length) {
    throw new SpaceConfirmationError(
      "Mỗi dimension evidence phải có đúng một review.",
      "DIMENSION_REVIEW_MISMATCH",
    );
  }

  const evidenceKeys = new Set<string>();
  for (const item of evidence) {
    const key = evidenceKey(item.label, item.valueMm);
    if (evidenceKeys.has(key)) {
      throw new SpaceConfirmationError(
        "Dimension evidence bị trùng; không thể xác nhận mơ hồ.",
        "INVALID_CANDIDATE",
      );
    }
    evidenceKeys.add(key);
  }

  const reviewKeys = new Set<string>();
  const reviews = value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      !hasOnlyKeys(record, ["label", "valueMm", "source", "status", "note"]) ||
      typeof record.label !== "string" ||
      !record.label.trim() ||
      typeof record.valueMm !== "number" ||
      !Number.isFinite(record.valueMm) ||
      record.valueMm <= 0 ||
      record.source !== "visible-label" ||
      (record.status !== "verified" && record.status !== "assumed") ||
      (record.note !== undefined &&
        (typeof record.note !== "string" ||
          !record.note.trim() ||
          record.note.length > MAX_REVIEW_NOTE_CHARS))
    ) {
      throw new SpaceConfirmationError(
        "Dimension review không hợp lệ.",
        "INVALID_DIMENSION_REVIEW",
      );
    }

    const label = record.label.trim();
    const key = evidenceKey(label, record.valueMm);
    if (!evidenceKeys.has(key) || reviewKeys.has(key)) {
      throw new SpaceConfirmationError(
        "Dimension review không khớp đúng evidence G3.",
        "DIMENSION_REVIEW_MISMATCH",
      );
    }
    if (record.status === "assumed" && typeof record.note !== "string") {
      throw new SpaceConfirmationError(
        "Kích thước assumed phải có ghi chú lý do.",
        "INVALID_DIMENSION_REVIEW",
      );
    }
    reviewKeys.add(key);

    return {
      label,
      valueMm: record.valueMm,
      source: "visible-label",
      status: record.status,
      ...(typeof record.note === "string" ? { note: record.note.trim() } : {}),
    } satisfies SpaceDimensionReview;
  });

  if (reviewKeys.size !== evidenceKeys.size) {
    throw new SpaceConfirmationError(
      "Dimension review chưa bao phủ toàn bộ evidence G3.",
      "DIMENSION_REVIEW_MISMATCH",
    );
  }

  return reviews;
}

function digestValue(value: unknown, prefix: "sha256:" | "hmac-sha256:"): string | null {
  if (typeof value !== "string" || !value.startsWith(prefix)) return null;
  const hex = value.slice(prefix.length);
  return SHA256_HEX_PATTERN.test(hex) ? hex : null;
}

function confirmedRevisionFor(digestHex: string): string {
  return `space-confirmed:${digestHex}`;
}

export async function confirmSpaceCandidate(
  input: unknown,
  sealKey: string,
): Promise<ConfirmedSpaceEnvelope> {
  assertSealKey(sealKey);
  const request = asRecord(input);
  if (!request) {
    throw new SpaceConfirmationError(
      "Yêu cầu xác nhận geometry không hợp lệ.",
      "INVALID_CONFIRMATION_REQUEST",
    );
  }
  if (
    "geometryDigest" in request ||
    "confirmationDigest" in request ||
    "confirmationSeal" in request ||
    "confirmedRevision" in request ||
    "status" in request
  ) {
    throw new SpaceConfirmationError(
      "Client không được tự cấp digest, seal, revision hoặc trạng thái xác nhận.",
      "CLIENT_AUTHORITY_FIELD",
    );
  }
  if (!hasOnlyKeys(request, ["candidate", "dimensionReviews"])) {
    throw new SpaceConfirmationError(
      "Yêu cầu xác nhận chứa trường không được hỗ trợ.",
      "INVALID_CONFIRMATION_REQUEST",
    );
  }

  const candidate = parseCandidate(request.candidate);
  const sourceRevision = candidate.model.revision;
  const reviews = parseReviews(
    request.dimensionReviews,
    candidate.verification.dimensionEvidence,
  );

  const geometryDigest = await computeSpaceGeometryDigest(
    candidate.model,
    sourceRevision,
  );
  const confirmationDigest = await computeSpaceConfirmationDigest(
    geometryDigest,
    reviews,
    candidate.verification.assumptions,
  );
  const digestHex = digestValue(confirmationDigest, "sha256:");
  if (!digestHex) {
    throw new SpaceConfirmationError(
      "Không thể tạo confirmation digest hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }
  const confirmedRevision = confirmedRevisionFor(digestHex);
  const confirmationSeal = await computeConfirmationSeal(
    sealKey,
    sourceRevision,
    geometryDigest,
    confirmationDigest,
    confirmedRevision,
  );
  const hasAssumptions = reviews.some((review) => review.status === "assumed");

  return {
    status: "confirmed-for-design",
    sourceRevision,
    geometryDigest,
    confirmationDigest,
    confirmationSeal,
    confirmedRevision,
    model: {
      ...structuredClone(candidate.model),
      revision: confirmedRevision,
    },
    verification: {
      geometryStatus: "confirmed-for-design",
      dimensionStatus: hasAssumptions
        ? "reviewed-with-assumptions"
        : "reviewed-verified",
      dimensionReviews: structuredClone(reviews),
      sourceAssumptions: structuredClone(candidate.verification.assumptions),
      engineeringStatus: "not-engineer-verified",
    },
  };
}

function parseConfirmedReviews(value: unknown): SpaceDimensionReview[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    throw new SpaceConfirmationError(
      "Confirmed dimension reviews không hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  return value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      !hasOnlyKeys(record, ["label", "valueMm", "source", "status", "note"]) ||
      typeof record.label !== "string" ||
      !record.label.trim() ||
      typeof record.valueMm !== "number" ||
      !Number.isFinite(record.valueMm) ||
      record.valueMm <= 0 ||
      record.source !== "visible-label" ||
      (record.status !== "verified" && record.status !== "assumed") ||
      (record.note !== undefined &&
        (typeof record.note !== "string" ||
          !record.note.trim() ||
          record.note.length > MAX_REVIEW_NOTE_CHARS)) ||
      (record.status === "assumed" && typeof record.note !== "string")
    ) {
      throw new SpaceConfirmationError(
        "Confirmed dimension review không hợp lệ.",
        "INVALID_CONFIRMED_ENVELOPE",
      );
    }
    return {
      label: record.label.trim(),
      valueMm: record.valueMm,
      source: "visible-label",
      status: record.status,
      ...(typeof record.note === "string" ? { note: record.note.trim() } : {}),
    } satisfies SpaceDimensionReview;
  });
}

export async function verifyConfirmedSpace(
  input: unknown,
  sealKey: string,
): Promise<ConfirmedSpaceEnvelope> {
  assertSealKey(sealKey);
  const envelope = asRecord(input);
  if (
    !envelope ||
    !hasOnlyKeys(envelope, [
      "status",
      "sourceRevision",
      "geometryDigest",
      "confirmationDigest",
      "confirmationSeal",
      "confirmedRevision",
      "model",
      "verification",
    ]) ||
    envelope.status !== "confirmed-for-design" ||
    !isValidRevision(envelope.sourceRevision) ||
    typeof envelope.confirmedRevision !== "string"
  ) {
    throw new SpaceConfirmationError(
      "Confirmed Space envelope không hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  const geometryHex = digestValue(envelope.geometryDigest, "sha256:");
  const confirmationHex = digestValue(envelope.confirmationDigest, "sha256:");
  const sealHex = digestValue(envelope.confirmationSeal, "hmac-sha256:");
  if (!geometryHex || !confirmationHex || !sealHex) {
    throw new SpaceConfirmationError(
      "Digest/seal của confirmed Space envelope không hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  const verification = asRecord(envelope.verification);
  if (
    !verification ||
    !hasOnlyKeys(verification, [
      "geometryStatus",
      "dimensionStatus",
      "dimensionReviews",
      "sourceAssumptions",
      "engineeringStatus",
    ]) ||
    verification.geometryStatus !== "confirmed-for-design" ||
    (verification.dimensionStatus !== "reviewed-verified" &&
      verification.dimensionStatus !== "reviewed-with-assumptions") ||
    verification.engineeringStatus !== "not-engineer-verified"
  ) {
    throw new SpaceConfirmationError(
      "Verification state của confirmed Space envelope không hợp lệ.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  const modelReport = validateSpaceModel(envelope.model);
  if (!modelReport.valid) {
    throw new SpaceConfirmationError(
      "Confirmed Space Model không còn hợp lệ theo G1.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }
  const model = envelope.model as SpaceModel;
  assertStructuralPolicy(model.structuralElements);

  const reviews = parseConfirmedReviews(verification.dimensionReviews);
  const sourceAssumptions = parseAssumptions(verification.sourceAssumptions);
  const hasAssumptions = reviews.some((review) => review.status === "assumed");
  const expectedDimensionStatus = hasAssumptions
    ? "reviewed-with-assumptions"
    : "reviewed-verified";
  if (verification.dimensionStatus !== expectedDimensionStatus) {
    throw new SpaceConfirmationError(
      "Dimension status không khớp review thực tế.",
      "INVALID_CONFIRMED_ENVELOPE",
    );
  }

  const expectedGeometryDigest = await computeSpaceGeometryDigest(
    model,
    envelope.sourceRevision,
  );
  if (expectedGeometryDigest !== envelope.geometryDigest) {
    throw new SpaceConfirmationError(
      "Geometry đã thay đổi sau khi xác nhận.",
      "GEOMETRY_DIGEST_MISMATCH",
    );
  }

  const expectedConfirmationDigest = await computeSpaceConfirmationDigest(
    expectedGeometryDigest,
    reviews,
    sourceAssumptions,
  );
  if (expectedConfirmationDigest !== envelope.confirmationDigest) {
    throw new SpaceConfirmationError(
      "Dimension review/confirmation state đã thay đổi sau khi xác nhận.",
      "CONFIRMATION_DIGEST_MISMATCH",
    );
  }

  const expectedConfirmedRevision = confirmedRevisionFor(confirmationHex);
  if (
    envelope.confirmedRevision !== expectedConfirmedRevision ||
    model.revision !== expectedConfirmedRevision
  ) {
    throw new SpaceConfirmationError(
      "Confirmed revision không khớp confirmation digest.",
      "CONFIRMED_REVISION_MISMATCH",
    );
  }

  const expectedSeal = await computeConfirmationSeal(
    sealKey,
    envelope.sourceRevision,
    expectedGeometryDigest,
    expectedConfirmationDigest,
    expectedConfirmedRevision,
  );
  if (!secureEqual(expectedSeal, envelope.confirmationSeal as string)) {
    throw new SpaceConfirmationError(
      "Server confirmation seal không hợp lệ.",
      "CONFIRMATION_SEAL_MISMATCH",
    );
  }

  return envelope as unknown as ConfirmedSpaceEnvelope;
}
