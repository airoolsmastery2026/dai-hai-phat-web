import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPreliminarySpaceBoq,
  parseSpaceBoqRequest,
  SPACE_BOQ_ARTIFACT_CLASS,
  SPACE_BOQ_ENGINEERING_STATUS,
  SpaceBoqError,
} from "../src/lib/ai/space-boq.ts";

function proposal() {
  return {
    baseRevision: `space-confirmed:${"d".repeat(64)}`,
    structuralEdits: [],
    placements: [
      {
        id: "wardrobe-01",
        roomId: "room-bedroom",
        kind: "wardrobe",
        bounds: { x: 100, y: 100, width: 2400, depth: 600 },
        clearanceMm: 100,
      },
      {
        id: "bed-01",
        roomId: "room-bedroom",
        kind: "bed",
        bounds: { x: 3000, y: 1000, width: 1800, depth: 2000 },
        clearanceMm: 100,
      },
    ],
  };
}

function catalog() {
  return {
    schemaVersion: "1.0",
    currency: "VND",
    usage: "reference-range-only",
    updatedAt: "2026-07-28",
    rules: {
      officialQuote: false,
      requireConfirmedDimensions: true,
      requireConfirmedMaterial: true,
      requireSurveyForContractPrice: true,
      message: "Chỉ dùng làm khoảng chi phí tham khảo.",
    },
    items: [
      {
        id: "interior-wardrobe",
        service: "Nội thất",
        category: "Tủ quần áo",
        material: "MFC An Cường chống ẩm",
        unit: "m²",
        range: { min: 2_650_000, max: 3_750_000 },
        sourceIds: ["interior-material-price-list-01"],
      },
      {
        id: "archived-price",
        service: "Nội thất",
        category: "Tủ quần áo",
        material: "MFC",
        unit: "m²",
        range: { min: 1_000_000, max: 2_000_000 },
        sourceIds: ["old-source"],
        eligibleForProposal: false,
        status: "requires-revalidation",
      },
    ],
  };
}

test("G7 request parser is strict and quantity is explicit to 3 decimals", () => {
  const confirmed = { sealed: true };
  const parsed = parseSpaceBoqRequest({
    confirmed,
    proposal: proposal(),
    selections: [
      {
        placementId: "wardrobe-01",
        priceReferenceId: "interior-wardrobe",
        quantity: 5.125,
      },
    ],
  });
  assert.equal(parsed.confirmed, confirmed);
  assert.equal(parsed.selections[0].quantity, 5.125);

  assert.throws(
    () => parseSpaceBoqRequest({
      confirmed,
      proposal: proposal(),
      selections: [],
      inferredFromRender: true,
    }),
    (error) => error instanceof SpaceBoqError &&
      error.code === "INVALID_BOQ_REQUEST",
  );
  assert.throws(
    () => parseSpaceBoqRequest({
      confirmed,
      proposal: proposal(),
      selections: [
        {
          placementId: "wardrobe-01",
          priceReferenceId: "interior-wardrobe",
          quantity: 1.2345,
        },
      ],
    }),
    (error) => error instanceof SpaceBoqError &&
      error.code === "INVALID_BOQ_SELECTION",
  );
});

test("G7 never infers billable quantity from G5 footprint", () => {
  const boq = buildPreliminarySpaceBoq(proposal(), [], catalog());
  assert.equal(boq.summary.lineCount, 2);
  assert.equal(boq.summary.referenceRangeLineCount, 0);
  assert.equal(boq.summary.pendingLineCount, 2);
  assert.deepEqual(boq.summary.pricedLinesSubtotalRangeVnd, { min: 0, max: 0 });
  assert.equal(boq.lines[0].status, "pending-selection");
  assert.deepEqual(boq.lines[0].footprintMm, { width: 2400, depth: 600 });
});

test("G7 attaches only an explicit eligible PRICE_DB reference and computes reference subtotal", () => {
  const boq = buildPreliminarySpaceBoq(
    proposal(),
    [
      {
        placementId: "wardrobe-01",
        priceReferenceId: "interior-wardrobe",
        quantity: 5.5,
      },
    ],
    catalog(),
  );

  assert.equal(boq.lines[0].status, "reference-range-attached");
  assert.equal(boq.lines[0].priceReference.quantitySource, "explicit-selection");
  assert.deepEqual(boq.lines[0].priceReference.subtotalRangeVnd, {
    min: 14_575_000,
    max: 20_625_000,
  });
  assert.deepEqual(boq.summary.pricedLinesSubtotalRangeVnd, {
    min: 14_575_000,
    max: 20_625_000,
  });
  assert.equal(boq.summary.referenceCoverageComplete, false);
});

test("G7 refuses archived/revalidation-required references without inventing a fallback price", () => {
  const boq = buildPreliminarySpaceBoq(
    proposal(),
    [
      {
        placementId: "wardrobe-01",
        priceReferenceId: "archived-price",
        quantity: 5,
      },
    ],
    catalog(),
  );

  assert.equal(boq.lines[0].status, "pending-price-reference");
  assert.deepEqual(boq.summary.pricedLinesSubtotalRangeVnd, { min: 0, max: 0 });
});

test("G7 rejects duplicate or unknown placement selections", () => {
  const selected = {
    placementId: "wardrobe-01",
    priceReferenceId: "interior-wardrobe",
    quantity: 1,
  };
  assert.throws(
    () => buildPreliminarySpaceBoq(proposal(), [selected, selected], catalog()),
    (error) => error instanceof SpaceBoqError &&
      error.code === "DUPLICATE_PLACEMENT_SELECTION",
  );
  assert.throws(
    () => buildPreliminarySpaceBoq(
      proposal(),
      [{ ...selected, placementId: "unknown-01" }],
      catalog(),
    ),
    (error) => error instanceof SpaceBoqError &&
      error.code === "UNKNOWN_PLACEMENT_SELECTION",
  );
});

test("G7 output can never masquerade as an official engineering quote", () => {
  const boq = buildPreliminarySpaceBoq(proposal(), [], catalog());
  assert.equal(SPACE_BOQ_ARTIFACT_CLASS, "preliminary-boq");
  assert.equal(SPACE_BOQ_ENGINEERING_STATUS, "not-engineer-verified");
  assert.equal(boq.pricing.usage, "reference-range-only");
  assert.equal(boq.pricing.officialQuote, false);
  assert.equal(boq.pricing.requireSurveyForContractPrice, true);
});
