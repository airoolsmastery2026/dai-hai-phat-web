import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSpaceRenderPrompt,
  parseSpaceRenderRequest,
  SPACE_RENDER_ARTIFACT_CLASS,
  SPACE_RENDER_ENGINEERING_STATUS,
  SpaceRenderError,
} from "../src/lib/ai/space-render.ts";

function tinyImage() {
  return { mimeType: "image/png", dataBase64: "AAAA" };
}

function confirmedFixture() {
  return {
    status: "confirmed-for-design",
    sourceRevision: "space-candidate-001",
    geometryDigest: `sha256:${"a".repeat(64)}`,
    confirmationDigest: `sha256:${"b".repeat(64)}`,
    confirmationSeal: `hmac-sha256:${"c".repeat(64)}`,
    confirmedRevision: `space-confirmed:${"d".repeat(64)}`,
    model: {
      schemaVersion: "1.0",
      unit: "mm",
      revision: "space-candidate-001",
      rooms: [{
        id: "room-living",
        type: "living-room",
        polygon: [
          { x: 0, y: 0 },
          { x: 6000, y: 0 },
          { x: 6000, y: 4500 },
          { x: 0, y: 4500 },
        ],
      }],
      structuralElements: [{
        id: "door-01",
        roomId: "room-living",
        kind: "door",
        lock: "controlled",
        bounds: { x: 0, y: 1200, width: 200, depth: 900 },
        blocksPlacement: true,
      }],
    },
    verification: {
      geometryStatus: "confirmed-for-design",
      dimensionStatus: "reviewed-verified",
      dimensionReviews: [],
      sourceAssumptions: [],
      engineeringStatus: "not-engineer-verified",
    },
  };
}

function proposal(revision) {
  return {
    baseRevision: revision,
    structuralEdits: [],
    placements: [{
      id: "sofa-01",
      roomId: "room-living",
      kind: "sofa",
      bounds: { x: 1000, y: 1000, width: 2200, depth: 900 },
      clearanceMm: 100,
    }],
  };
}

test("G6 request parser accepts bounded images and rejects hidden fields", () => {
  const confirmed = confirmedFixture();
  const parsed = parseSpaceRenderRequest({
    confirmed,
    proposal: proposal(confirmed.confirmedRevision),
    siteImage: tinyImage(),
    styleIntent: "Walnut tối, ánh sáng ấm.",
  });
  assert.equal(parsed.confirmed, confirmed);
  assert.equal(parsed.siteImage.mimeType, "image/png");
  assert.match(parsed.styleIntent, /Walnut/);

  assert.throws(
    () => parseSpaceRenderRequest({
      confirmed,
      proposal: proposal(confirmed.confirmedRevision),
      siteImage: tinyImage(),
      engineeringApproved: true,
    }),
    (error) => error instanceof SpaceRenderError &&
      error.code === "INVALID_RENDER_REQUEST",
  );
});

test("G6 prompt carries geometry, layout and camera lock but never trust secrets", () => {
  const confirmed = confirmedFixture();
  const layout = proposal(confirmed.confirmedRevision);
  const prompt = buildSpaceRenderPrompt(
    confirmed,
    layout,
    "Luxury tối giản, walnut và đá sáng.",
    true,
  );

  assert.ok(prompt.includes(confirmed.confirmedRevision));
  assert.match(prompt, /CAMERA ANCHOR/);
  assert.match(prompt, /KHÓA CAMERA/);
  assert.match(prompt, /KHÓA GEOMETRY/);
  assert.match(prompt, /sofa-01/);
  assert.match(prompt, /door-01/);
  assert.match(prompt, /concept\/presentation/);
  assert.doesNotMatch(prompt, new RegExp(confirmed.confirmationSeal));
  assert.doesNotMatch(prompt, new RegExp(confirmed.geometryDigest));
  assert.doesNotMatch(prompt, new RegExp(confirmed.confirmationDigest));
});

test("G6 artifacts are explicitly non-engineering concept presentation", () => {
  assert.equal(SPACE_RENDER_ARTIFACT_CLASS, "concept-presentation");
  assert.equal(SPACE_RENDER_ENGINEERING_STATUS, "not-engineer-verified");
});
