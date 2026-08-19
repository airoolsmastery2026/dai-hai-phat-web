import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test, { after, before } from "node:test";

let confirmationApi;
let layoutApi;
let fixtureDir;
const SEAL_KEY = "test-space-layout-gate-key-32-bytes-minimum";

before(async () => {
  fixtureDir = await mkdtemp(join(tmpdir(), "dhp-space-layout-gate-"));
  const paths = {
    layout: new URL("../src/lib/ai/space-layout-gate.ts", import.meta.url),
    boundary: new URL("../src/lib/ai/space-confirmation-boundary.ts", import.meta.url),
    confirmation: new URL("../src/lib/ai/space-confirmation.ts", import.meta.url),
    shape: new URL("../src/lib/ai/space-model-shape.ts", import.meta.url),
    designer: new URL("../src/lib/ai/space-designer.ts", import.meta.url),
  };
  const [layout, boundary, confirmation, shape, designer] = await Promise.all(
    Object.values(paths).map((path) => readFile(path, "utf8")),
  );

  await Promise.all([
    writeFile(
      join(fixtureDir, "space-layout-gate.ts"),
      layout
        .replace(
          'from "@/lib/ai/space-confirmation-boundary";',
          'from "./space-confirmation-boundary.ts";',
        )
        .replace(
          'from "@/lib/ai/space-designer";',
          'from "./space-designer.ts";',
        ),
    ),
    writeFile(
      join(fixtureDir, "space-confirmation-boundary.ts"),
      boundary
        .replace(
          'from "@/lib/ai/space-confirmation";',
          'from "./space-confirmation.ts";',
        )
        .replace(
          'from "@/lib/ai/space-model-shape";',
          'from "./space-model-shape.ts";',
        ),
    ),
    writeFile(
      join(fixtureDir, "space-confirmation.ts"),
      confirmation.replace(
        'from "@/lib/ai/space-designer";',
        'from "./space-designer.ts";',
      ),
    ),
    writeFile(join(fixtureDir, "space-model-shape.ts"), shape),
    writeFile(join(fixtureDir, "space-designer.ts"), designer),
  ]);

  confirmationApi = await import(
    `${pathToFileURL(join(fixtureDir, "space-confirmation.ts")).href}?v=${Date.now()}`,
  );
  layoutApi = await import(
    `${pathToFileURL(join(fixtureDir, "space-layout-gate.ts")).href}?v=${Date.now()}`,
  );
});

after(async () => {
  if (fixtureDir) await rm(fixtureDir, { recursive: true, force: true });
});

function candidate() {
  return {
    model: {
      schemaVersion: "1.0",
      unit: "mm",
      revision: "space-candidate-g5-001",
      rooms: [{
        id: "room-living",
        type: "living-room",
        polygon: [
          { x: 0, y: 0 },
          { x: 10000, y: 0 },
          { x: 10000, y: 8000 },
          { x: 0, y: 8000 },
        ],
      }],
      structuralElements: [
        {
          id: "column-01",
          roomId: "room-living",
          kind: "column",
          lock: "hard",
          bounds: { x: 4000, y: 4000, width: 500, depth: 500 },
          blocksPlacement: true,
        },
        {
          id: "door-01",
          roomId: "room-living",
          kind: "door",
          lock: "controlled",
          bounds: { x: 0, y: 3000, width: 200, depth: 1000 },
          blocksPlacement: true,
        },
      ],
    },
    verification: {
      geometryStatus: "candidate-unverified",
      dimensionStatus: "unverified-ai-extraction",
      dimensionEvidence: [
        { label: "10000", valueMm: 10000, source: "visible-label" },
        { label: "8000", valueMm: 8000, source: "visible-label" },
      ],
      assumptions: ["Gốc tọa độ chỉ là quy ước biểu diễn."],
    },
  };
}

function reviews() {
  return [
    { label: "10000", valueMm: 10000, source: "visible-label", status: "verified" },
    { label: "8000", valueMm: 8000, source: "visible-label", status: "verified" },
  ];
}

async function confirmed() {
  return confirmationApi.confirmSpaceCandidate(
    { candidate: candidate(), dimensionReviews: reviews() },
    SEAL_KEY,
  );
}

function validProposal(revision) {
  return {
    baseRevision: revision,
    structuralEdits: [],
    placements: [
      {
        id: "sofa-01",
        roomId: "room-living",
        kind: "sofa",
        bounds: { x: 1000, y: 1000, width: 2200, depth: 900 },
        clearanceMm: 100,
      },
      {
        id: "table-01",
        roomId: "room-living",
        kind: "table",
        bounds: { x: 6000, y: 1800, width: 1200, depth: 800 },
      },
    ],
  };
}

function codes(report) {
  return report.issues.map((issue) => issue.code);
}

test("valid layout passes only on an authentic confirmed revision", async () => {
  const envelope = await confirmed();
  const report = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal: validProposal(envelope.confirmedRevision) },
    SEAL_KEY,
  );

  assert.equal(report.gate, "G5_LAYOUT_CONSTRAINTS");
  assert.equal(report.confirmedRevision, envelope.confirmedRevision);
  assert.equal(report.valid, true);
  assert.deepEqual(report.issues, []);
});

test("candidate/unsealed input is rejected before layout evaluation", async () => {
  await assert.rejects(
    () => layoutApi.evaluateConfirmedLayout(
      { confirmed: candidate(), proposal: validProposal("space-candidate-g5-001") },
      SEAL_KEY,
    ),
    (error) => error?.code === "INVALID_CONFIRMED_ENVELOPE",
  );
});

test("tampered confirmed geometry and wrong seal fail closed", async () => {
  const tampered = await confirmed();
  tampered.model.rooms[0].polygon[1].x = 9900;
  await assert.rejects(
    () => layoutApi.evaluateConfirmedLayout(
      { confirmed: tampered, proposal: validProposal(tampered.confirmedRevision) },
      SEAL_KEY,
    ),
    (error) => error?.code === "GEOMETRY_DIGEST_MISMATCH",
  );

  const wrongSeal = await confirmed();
  const last = wrongSeal.confirmationSeal.at(-1);
  wrongSeal.confirmationSeal = `${wrongSeal.confirmationSeal.slice(0, -1)}${last === "0" ? "1" : "0"}`;
  await assert.rejects(
    () => layoutApi.evaluateConfirmedLayout(
      { confirmed: wrongSeal, proposal: validProposal(wrongSeal.confirmedRevision) },
      SEAL_KEY,
    ),
    (error) => error?.code === "CONFIRMATION_SEAL_MISMATCH",
  );
});

test("stale proposal revision is rejected deterministically", async () => {
  const envelope = await confirmed();
  const proposal = validProposal("space-confirmed:stale");
  const report = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal },
    SEAL_KEY,
  );

  assert.equal(report.valid, false);
  assert.ok(codes(report).includes("REVISION_MISMATCH"));
});

test("any structural edit is rejected even when client sends approved=true", async () => {
  const envelope = await confirmed();
  const proposal = validProposal(envelope.confirmedRevision);
  proposal.structuralEdits = [{
    elementId: "door-01",
    action: "move",
    approved: true,
  }];

  const report = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal },
    SEAL_KEY,
  );

  assert.equal(report.valid, false);
  assert.deepEqual(codes(report), ["STRUCTURAL_EDIT_REQUIRES_RECONFIRMATION"]);
});

test("outside-room, structural-collision and overlap rules are reused from deterministic geometry core", async () => {
  const envelope = await confirmed();

  const outside = validProposal(envelope.confirmedRevision);
  outside.placements = [{
    id: "outside-01",
    roomId: "room-living",
    kind: "cabinet",
    bounds: { x: 9500, y: 1000, width: 800, depth: 600 },
  }];
  const outsideReport = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal: outside },
    SEAL_KEY,
  );
  assert.ok(codes(outsideReport).includes("OUTSIDE_ROOM"));

  const collision = validProposal(envelope.confirmedRevision);
  collision.placements = [{
    id: "collision-01",
    roomId: "room-living",
    kind: "chair",
    bounds: { x: 3900, y: 3900, width: 700, depth: 700 },
  }];
  const collisionReport = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal: collision },
    SEAL_KEY,
  );
  assert.ok(codes(collisionReport).includes("STRUCTURAL_COLLISION"));

  const overlap = validProposal(envelope.confirmedRevision);
  overlap.placements = [
    {
      id: "left-01",
      roomId: "room-living",
      kind: "sofa",
      bounds: { x: 1000, y: 1000, width: 2000, depth: 900 },
      clearanceMm: 200,
    },
    {
      id: "right-01",
      roomId: "room-living",
      kind: "table",
      bounds: { x: 3100, y: 1200, width: 1000, depth: 700 },
    },
  ];
  const overlapReport = await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal: overlap },
    SEAL_KEY,
  );
  assert.ok(codes(overlapReport).includes("PLACEMENT_OVERLAP"));
});

test("layout gate rejects hidden proposal fields and does not mutate inputs", async () => {
  const envelope = await confirmed();
  const proposal = validProposal(envelope.confirmedRevision);
  const envelopeBefore = structuredClone(envelope);
  const proposalBefore = structuredClone(proposal);

  await layoutApi.evaluateConfirmedLayout(
    { confirmed: envelope, proposal },
    SEAL_KEY,
  );
  assert.deepEqual(envelope, envelopeBefore);
  assert.deepEqual(proposal, proposalBefore);

  proposal.engineeringVerified = true;
  await assert.rejects(
    () => layoutApi.evaluateConfirmedLayout(
      { confirmed: envelope, proposal },
      SEAL_KEY,
    ),
    (error) => error instanceof layoutApi.SpaceLayoutGateError && error.code === "INVALID_LAYOUT_PROPOSAL",
  );
});
