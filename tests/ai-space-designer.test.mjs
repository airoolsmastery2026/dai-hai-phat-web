import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateSpaceProposal,
  SPACE_MODEL_SCHEMA_VERSION,
  SPACE_MODEL_UNIT,
  validateSpaceModel,
} from "../src/lib/ai/space-designer.ts";

function createSpaceModel() {
  return {
    schemaVersion: SPACE_MODEL_SCHEMA_VERSION,
    unit: SPACE_MODEL_UNIT,
    revision: "space-rev-001",
    rooms: [
      {
        id: "room-living",
        type: "living-room",
        polygon: [
          { x: 0, y: 0 },
          { x: 10_000, y: 0 },
          { x: 10_000, y: 8_000 },
          { x: 0, y: 8_000 },
        ],
      },
    ],
    structuralElements: [
      {
        id: "column-01",
        roomId: "room-living",
        kind: "column",
        lock: "hard",
        bounds: { x: 4_000, y: 4_000, width: 500, depth: 500 },
        blocksPlacement: true,
      },
      {
        id: "door-01",
        roomId: "room-living",
        kind: "door",
        lock: "controlled",
        bounds: { x: 0, y: 3_000, width: 200, depth: 1_000 },
        blocksPlacement: true,
      },
    ],
  };
}

function createValidProposal() {
  return {
    baseRevision: "space-rev-001",
    structuralEdits: [],
    placements: [
      {
        id: "sofa-01",
        roomId: "room-living",
        kind: "sofa",
        bounds: { x: 1_500, y: 1_500, width: 2_200, depth: 900 },
        clearanceMm: 100,
      },
      {
        id: "table-01",
        roomId: "room-living",
        kind: "table",
        bounds: { x: 6_000, y: 2_000, width: 1_200, depth: 800 },
      },
    ],
  };
}

function issueCodes(report) {
  return report.issues.map((issue) => issue.code);
}

test("valid Space Model v1 is accepted", () => {
  const report = validateSpaceModel(createSpaceModel());

  assert.equal(report.valid, true);
  assert.deepEqual(report.issues, []);
});

test("Space Model rejects duplicate canonical IDs and degenerate room geometry", () => {
  const model = createSpaceModel();
  model.structuralElements[0].id = "room-living";
  model.rooms[0].polygon = [
    { x: 0, y: 0 },
    { x: 1_000, y: 0 },
    { x: 2_000, y: 0 },
  ];

  const report = validateSpaceModel(model);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("DUPLICATE_ID"));
  assert.ok(issueCodes(report).includes("DEGENERATE_POLYGON"));
});

test("Space Model rejects self-intersecting room polygons", () => {
  const model = createSpaceModel();
  model.rooms[0].polygon = [
    { x: 0, y: 0 },
    { x: 4_000, y: 4_000 },
    { x: 0, y: 4_000 },
    { x: 4_000, y: 0 },
    { x: 5_000, y: 2_000 },
  ];

  const report = validateSpaceModel(model);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("NON_SIMPLE_POLYGON"));
});

test("proposal must target the exact current geometry revision", () => {
  const proposal = createValidProposal();
  proposal.baseRevision = "space-rev-stale";

  const report = evaluateSpaceProposal(createSpaceModel(), proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("REVISION_MISMATCH"));
});

test("HARD geometry cannot be changed by a proposal", () => {
  const proposal = createValidProposal();
  proposal.structuralEdits.push({
    elementId: "column-01",
    action: "move",
  });

  const report = evaluateSpaceProposal(createSpaceModel(), proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("HARD_LOCK_VIOLATION"));
});

test("CONTROLLED geometry stays blocked until explicit approval", () => {
  const proposal = createValidProposal();
  proposal.structuralEdits.push({
    elementId: "door-01",
    action: "resize",
  });

  const blocked = evaluateSpaceProposal(createSpaceModel(), proposal);
  assert.equal(blocked.valid, false);
  assert.ok(issueCodes(blocked).includes("CONTROLLED_CHANGE_REQUIRES_APPROVAL"));

  proposal.structuralEdits[0].approved = true;
  const approved = evaluateSpaceProposal(createSpaceModel(), proposal);
  assert.equal(approved.valid, true);
  assert.ok(issueCodes(approved).includes("CONTROLLED_CHANGE_APPROVED"));
});

test("placement cannot leave its room polygon, including requested clearance", () => {
  const proposal = createValidProposal();
  proposal.placements = [
    {
      id: "wardrobe-01",
      roomId: "room-living",
      kind: "wardrobe",
      bounds: { x: 9_300, y: 1_000, width: 600, depth: 1_500 },
      clearanceMm: 200,
    },
  ];

  const report = evaluateSpaceProposal(createSpaceModel(), proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("OUTSIDE_ROOM"));
});

test("placement cannot bridge across a concave room notch even when all corners are inside", () => {
  const model = createSpaceModel();
  model.structuralElements = [];
  model.rooms[0].polygon = [
    { x: 0, y: 0 },
    { x: 10_000, y: 0 },
    { x: 10_000, y: 8_000 },
    { x: 7_000, y: 8_000 },
    { x: 7_000, y: 3_000 },
    { x: 3_000, y: 3_000 },
    { x: 3_000, y: 8_000 },
    { x: 0, y: 8_000 },
  ];

  const proposal = {
    baseRevision: model.revision,
    structuralEdits: [],
    placements: [
      {
        id: "bridge-01",
        roomId: "room-living",
        kind: "cabinet",
        bounds: { x: 2_000, y: 5_000, width: 6_000, depth: 1_000 },
      },
    ],
  };

  const report = evaluateSpaceProposal(model, proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("OUTSIDE_ROOM"));
});

test("placement cannot collide with blocking structural geometry", () => {
  const proposal = createValidProposal();
  proposal.placements = [
    {
      id: "chair-01",
      roomId: "room-living",
      kind: "chair",
      bounds: { x: 3_900, y: 3_900, width: 700, depth: 700 },
    },
  ];

  const report = evaluateSpaceProposal(createSpaceModel(), proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("STRUCTURAL_COLLISION"));
});

test("placements cannot overlap after clearance is applied", () => {
  const proposal = createValidProposal();
  proposal.placements = [
    {
      id: "sofa-01",
      roomId: "room-living",
      kind: "sofa",
      bounds: { x: 1_000, y: 1_000, width: 2_000, depth: 900 },
      clearanceMm: 200,
    },
    {
      id: "table-01",
      roomId: "room-living",
      kind: "table",
      bounds: { x: 3_100, y: 1_200, width: 1_000, depth: 700 },
    },
  ];

  const report = evaluateSpaceProposal(createSpaceModel(), proposal);

  assert.equal(report.valid, false);
  assert.ok(issueCodes(report).includes("PLACEMENT_OVERLAP"));
});

test("valid free placements pass all deterministic foundation constraints", () => {
  const report = evaluateSpaceProposal(createSpaceModel(), createValidProposal());

  assert.equal(report.valid, true);
  assert.deepEqual(report.issues, []);
});

test("validation is pure and does not mutate model or proposal inputs", () => {
  const model = createSpaceModel();
  const proposal = createValidProposal();
  const modelBefore = structuredClone(model);
  const proposalBefore = structuredClone(proposal);

  evaluateSpaceProposal(model, proposal);

  assert.deepEqual(model, modelBefore);
  assert.deepEqual(proposal, proposalBefore);
});
