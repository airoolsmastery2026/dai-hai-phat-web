export const SPACE_BOQ_ARTIFACT_CLASS = "preliminary-boq" as const;
export const SPACE_BOQ_ENGINEERING_STATUS = "not-engineer-verified" as const;
export const SPACE_BOQ_GATE = "G7_BOQ_PRICING" as const;

const MAX_SELECTIONS = 100;
const MAX_QUANTITY = 1_000_000;
const QUANTITY_SCALE = 1_000;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

type UnknownRecord = Record<string, unknown>;

export interface SpaceBoqSelection {
  placementId: string;
  priceReferenceId: string;
  quantity: number;
}

export interface SpaceBoqRequest {
  confirmed: unknown;
  proposal: unknown;
  selections: SpaceBoqSelection[];
}

export interface SpaceBoqPriceReference {
  id: string;
  service: string;
  category: string;
  material: string;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  sourceIds: string[];
  eligibleForProposal?: boolean;
  status?: string;
}

export interface SpaceBoqPricingCatalog {
  schemaVersion: string;
  currency: string;
  usage: string;
  updatedAt: string;
  rules: {
    officialQuote: boolean;
    requireConfirmedDimensions: boolean;
    requireConfirmedMaterial: boolean;
    requireSurveyForContractPrice: boolean;
    message: string;
  };
  items: SpaceBoqPriceReference[];
}

export type SpaceBoqLine =
  | {
      placementId: string;
      roomId: string;
      kind: string;
      footprintMm: { width: number; depth: number };
      status: "pending-selection";
      missing: ["price-reference-selection"];
    }
  | {
      placementId: string;
      roomId: string;
      kind: string;
      footprintMm: { width: number; depth: number };
      status: "pending-price-reference";
      requestedPriceReferenceId: string;
      missing: ["eligible-price-reference"];
    }
  | {
      placementId: string;
      roomId: string;
      kind: string;
      footprintMm: { width: number; depth: number };
      status: "reference-range-attached";
      priceReference: {
        id: string;
        service: string;
        category: string;
        material: string;
        unit: string;
        quantity: number;
        quantitySource: "explicit-selection";
        unitRangeVnd: { min: number; max: number };
        subtotalRangeVnd: { min: number; max: number };
        sourceIds: string[];
      };
    };

export interface PreliminarySpaceBoq {
  gate: typeof SPACE_BOQ_GATE;
  artifactClass: typeof SPACE_BOQ_ARTIFACT_CLASS;
  engineeringStatus: typeof SPACE_BOQ_ENGINEERING_STATUS;
  pricing: {
    schemaVersion: string;
    currency: string;
    usage: string;
    updatedAt: string;
    officialQuote: boolean;
    requireConfirmedDimensions: boolean;
    requireConfirmedMaterial: boolean;
    requireSurveyForContractPrice: boolean;
    message: string;
  };
  summary: {
    lineCount: number;
    referenceRangeLineCount: number;
    pendingLineCount: number;
    referenceCoverageComplete: boolean;
    pricedLinesSubtotalRangeVnd: { min: number; max: number };
  };
  lines: SpaceBoqLine[];
}

export type SpaceBoqErrorCode =
  | "INVALID_BOQ_REQUEST"
  | "INVALID_BOQ_SELECTION"
  | "DUPLICATE_PLACEMENT_SELECTION"
  | "UNKNOWN_PLACEMENT_SELECTION"
  | "INVALID_BOQ_PRICING_CATALOG"
  | "BOQ_AMOUNT_OVERFLOW";

export class SpaceBoqError extends Error {
  readonly code: SpaceBoqErrorCode;

  constructor(message: string, code: SpaceBoqErrorCode) {
    super(message);
    this.name = "SpaceBoqError";
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

function normalizeQuantity(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0 ||
    value > MAX_QUANTITY
  ) {
    throw new SpaceBoqError(
      "Khối lượng tham chiếu phải là số dương trong giới hạn cho phép.",
      "INVALID_BOQ_SELECTION",
    );
  }

  const scaled = Math.round(value * QUANTITY_SCALE);
  if (
    !Number.isSafeInteger(scaled) ||
    Math.abs(value * QUANTITY_SCALE - scaled) > 1e-7
  ) {
    throw new SpaceBoqError(
      "Khối lượng tham chiếu chỉ được có tối đa 3 chữ số thập phân.",
      "INVALID_BOQ_SELECTION",
    );
  }
  return scaled / QUANTITY_SCALE;
}

function parseSelection(value: unknown): SpaceBoqSelection {
  const selection = asRecord(value);
  if (
    !selection ||
    !hasOnlyKeys(selection, ["placementId", "priceReferenceId", "quantity"]) ||
    typeof selection.placementId !== "string" ||
    !ID_PATTERN.test(selection.placementId) ||
    typeof selection.priceReferenceId !== "string" ||
    !ID_PATTERN.test(selection.priceReferenceId)
  ) {
    throw new SpaceBoqError(
      "Lựa chọn đơn giá BOQ không đúng schema.",
      "INVALID_BOQ_SELECTION",
    );
  }

  return {
    placementId: selection.placementId,
    priceReferenceId: selection.priceReferenceId,
    quantity: normalizeQuantity(selection.quantity),
  };
}

export function parseSpaceBoqRequest(input: unknown): SpaceBoqRequest {
  const request = asRecord(input);
  if (
    !request ||
    !hasOnlyKeys(request, ["confirmed", "proposal", "selections"]) ||
    !("confirmed" in request) ||
    !("proposal" in request)
  ) {
    throw new SpaceBoqError(
      "Yêu cầu lập BOQ không hợp lệ.",
      "INVALID_BOQ_REQUEST",
    );
  }

  const rawSelections = request.selections ?? [];
  if (!Array.isArray(rawSelections) || rawSelections.length > MAX_SELECTIONS) {
    throw new SpaceBoqError(
      "Danh sách lựa chọn đơn giá BOQ không hợp lệ.",
      "INVALID_BOQ_SELECTION",
    );
  }

  return {
    confirmed: request.confirmed,
    proposal: request.proposal,
    selections: rawSelections.map(parseSelection),
  };
}

interface BoqPlacement {
  id: string;
  roomId: string;
  kind: string;
  width: number;
  depth: number;
}

function readPlacement(value: unknown): BoqPlacement {
  const placement = asRecord(value);
  const bounds = placement ? asRecord(placement.bounds) : null;
  if (
    !placement ||
    typeof placement.id !== "string" ||
    !ID_PATTERN.test(placement.id) ||
    typeof placement.roomId !== "string" ||
    !ID_PATTERN.test(placement.roomId) ||
    typeof placement.kind !== "string" ||
    !placement.kind.trim() ||
    !bounds ||
    typeof bounds.width !== "number" ||
    !Number.isFinite(bounds.width) ||
    bounds.width <= 0 ||
    typeof bounds.depth !== "number" ||
    !Number.isFinite(bounds.depth) ||
    bounds.depth <= 0
  ) {
    throw new SpaceBoqError(
      "Layout đã duyệt không chứa placement hợp lệ cho BOQ.",
      "INVALID_BOQ_REQUEST",
    );
  }

  return {
    id: placement.id,
    roomId: placement.roomId,
    kind: placement.kind.trim(),
    width: bounds.width,
    depth: bounds.depth,
  };
}

function validateCatalog(catalog: SpaceBoqPricingCatalog): void {
  if (
    catalog.currency !== "VND" ||
    catalog.usage !== "reference-range-only" ||
    catalog.rules.officialQuote !== false ||
    !catalog.rules.requireConfirmedDimensions ||
    !catalog.rules.requireConfirmedMaterial ||
    !catalog.rules.requireSurveyForContractPrice ||
    !catalog.rules.message.trim() ||
    !Array.isArray(catalog.items)
  ) {
    throw new SpaceBoqError(
      "PRICE_DB không đáp ứng policy tham chiếu an toàn của G7.",
      "INVALID_BOQ_PRICING_CATALOG",
    );
  }
}

function eligibleReference(
  catalog: SpaceBoqPricingCatalog,
  id: string,
): SpaceBoqPriceReference | null {
  const reference = catalog.items.find((item) => item.id === id);
  if (!reference || reference.eligibleForProposal === false) return null;
  if (
    !Number.isSafeInteger(reference.range.min) ||
    !Number.isSafeInteger(reference.range.max) ||
    reference.range.min < 0 ||
    reference.range.max < reference.range.min ||
    !reference.unit.trim() ||
    !reference.material.trim() ||
    !Array.isArray(reference.sourceIds) ||
    reference.sourceIds.length === 0
  ) {
    return null;
  }
  return reference;
}

function multiplyVnd(unitAmount: number, quantity: number): number {
  const quantityMilli = Math.round(quantity * QUANTITY_SCALE);
  const raw = unitAmount * quantityMilli;
  if (!Number.isSafeInteger(raw)) {
    throw new SpaceBoqError(
      "Giá trị BOQ vượt giới hạn tính toán an toàn.",
      "BOQ_AMOUNT_OVERFLOW",
    );
  }
  const amount = Math.round(raw / QUANTITY_SCALE);
  if (!Number.isSafeInteger(amount)) {
    throw new SpaceBoqError(
      "Giá trị BOQ vượt giới hạn tính toán an toàn.",
      "BOQ_AMOUNT_OVERFLOW",
    );
  }
  return amount;
}

export function buildPreliminarySpaceBoq(
  proposalInput: unknown,
  selections: readonly SpaceBoqSelection[],
  catalog: SpaceBoqPricingCatalog,
): PreliminarySpaceBoq {
  validateCatalog(catalog);
  const proposal = asRecord(proposalInput);
  if (!proposal || !Array.isArray(proposal.placements)) {
    throw new SpaceBoqError(
      "Layout đã duyệt không hợp lệ cho BOQ.",
      "INVALID_BOQ_REQUEST",
    );
  }
  const placements = proposal.placements.map(readPlacement);
  const placementIds = new Set(placements.map((placement) => placement.id));
  const selectionMap = new Map<string, SpaceBoqSelection>();

  for (const selection of selections) {
    if (selectionMap.has(selection.placementId)) {
      throw new SpaceBoqError(
        `Placement ${selection.placementId} có nhiều lựa chọn đơn giá.`,
        "DUPLICATE_PLACEMENT_SELECTION",
      );
    }
    if (!placementIds.has(selection.placementId)) {
      throw new SpaceBoqError(
        `Placement ${selection.placementId} không thuộc layout G5 đã duyệt.`,
        "UNKNOWN_PLACEMENT_SELECTION",
      );
    }
    selectionMap.set(selection.placementId, selection);
  }

  let subtotalMin = 0;
  let subtotalMax = 0;
  let referenceRangeLineCount = 0;

  const lines: SpaceBoqLine[] = placements.map((placement) => {
    const common = {
      placementId: placement.id,
      roomId: placement.roomId,
      kind: placement.kind,
      footprintMm: { width: placement.width, depth: placement.depth },
    };
    const selection = selectionMap.get(placement.id);
    if (!selection) {
      return {
        ...common,
        status: "pending-selection" as const,
        missing: ["price-reference-selection"] as ["price-reference-selection"],
      };
    }

    const reference = eligibleReference(catalog, selection.priceReferenceId);
    if (!reference) {
      return {
        ...common,
        status: "pending-price-reference" as const,
        requestedPriceReferenceId: selection.priceReferenceId,
        missing: ["eligible-price-reference"] as ["eligible-price-reference"],
      };
    }

    const lineMin = multiplyVnd(reference.range.min, selection.quantity);
    const lineMax = multiplyVnd(reference.range.max, selection.quantity);
    if (
      !Number.isSafeInteger(subtotalMin + lineMin) ||
      !Number.isSafeInteger(subtotalMax + lineMax)
    ) {
      throw new SpaceBoqError(
        "Tổng tham chiếu BOQ vượt giới hạn tính toán an toàn.",
        "BOQ_AMOUNT_OVERFLOW",
      );
    }
    subtotalMin += lineMin;
    subtotalMax += lineMax;
    referenceRangeLineCount += 1;

    return {
      ...common,
      status: "reference-range-attached" as const,
      priceReference: {
        id: reference.id,
        service: reference.service,
        category: reference.category,
        material: reference.material,
        unit: reference.unit,
        quantity: selection.quantity,
        quantitySource: "explicit-selection" as const,
        unitRangeVnd: { ...reference.range },
        subtotalRangeVnd: { min: lineMin, max: lineMax },
        sourceIds: [...reference.sourceIds],
      },
    };
  });

  const pendingLineCount = lines.length - referenceRangeLineCount;
  return {
    gate: SPACE_BOQ_GATE,
    artifactClass: SPACE_BOQ_ARTIFACT_CLASS,
    engineeringStatus: SPACE_BOQ_ENGINEERING_STATUS,
    pricing: {
      schemaVersion: catalog.schemaVersion,
      currency: catalog.currency,
      usage: catalog.usage,
      updatedAt: catalog.updatedAt,
      officialQuote: catalog.rules.officialQuote,
      requireConfirmedDimensions: catalog.rules.requireConfirmedDimensions,
      requireConfirmedMaterial: catalog.rules.requireConfirmedMaterial,
      requireSurveyForContractPrice: catalog.rules.requireSurveyForContractPrice,
      message: catalog.rules.message,
    },
    summary: {
      lineCount: lines.length,
      referenceRangeLineCount,
      pendingLineCount,
      referenceCoverageComplete: pendingLineCount === 0,
      pricedLinesSubtotalRangeVnd: { min: subtotalMin, max: subtotalMax },
    },
    lines,
  };
}
