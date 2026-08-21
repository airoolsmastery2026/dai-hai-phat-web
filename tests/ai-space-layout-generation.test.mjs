import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSpaceLayoutGenerationPrompt,
  parseSpaceLayoutGenerationOutput,
  parseSpaceLayoutGenerationRequest,
  SpaceLayoutGenerationError,
} from "../src/lib/ai/space-layout-generation.ts";

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

test("G5 generation request accepts only confirmed + bounded intent", () => {
  const confirmed = confirmedFixture();
  const parsed = parseSpaceLayoutGenerationRequest({
    confirmed,
    intent: "Bố trí phòng khách tối giản, ưu tiên lối đi rộng.",
  });
  assert.equal(parsed.confirmed, confirmed);
  assert.match(parsed.intent, /phòng khách/);

  assert.throws(
    () => parseSpaceLayoutGenerationRequest({ confirmed, intent: "ok", authority: "admin" }),
    (error) => error instanceof SpaceLayoutGenerationError &&
      error.code === "INVALID_LAYOUT_GENERATION_REQUEST",
  );
  assert.throws(
    () => parseSpaceLayoutGenerationRequest({ confirmed, intent: " ".repeat(20) }),
    (error) => error instanceof SpaceLayoutGenerationError &&
      error.code === "INVALID_LAYOUT_INTENT",
  );
});

test("G5 prompt sends confirmed geometry but never sends confirmation trust secrets", () => {
  const confirmed = confirmedFixture();
  const prompt = buildSpaceLayoutGenerationPrompt(
    confirmed,
    "Sofa hướng về TV, có bàn trà và giữ lối vào cửa chính.",
  );

  assert.match(prompt, new RegExp(confirmed.confirmedRevision.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(prompt, /structuralEdits bắt buộc là mảng rỗng/);
  assert.match(prompt, /room-living/);
  assert.match(prompt, /door-01/);
  assert.match(prompt, /Sofa hướng về TV/);
  assert.doesNotMatch(prompt, new RegExp(confirmed.confirmationSeal));
  assert.doesNotMatch(prompt, new RegExp(confirmed.geometryDigest));
  assert.doesNotMatch(prompt, new RegExp(confirmed.confirmationDigest));
});

test("G5 model output parser is JSON-only and object-only", () => {
  const proposal = {
    baseRevision: "space-confirmed:abc",
    structuralEdits: [],
    placements: [],
  };
  assert.deepEqual(
    parseSpaceLayoutGenerationOutput(JSON.stringify(proposal)),
    proposal,
  );

  assert.throws(
    () => parseSpaceLayoutGenerationOutput("```json\n{}\n```"),
    (error) => error instanceof SpaceLayoutGenerationError &&
      error.code === "INVALID_LAYOUT_MODEL_OUTPUT",
  );
  assert.throws(
    () => parseSpaceLayoutGenerationOutput("[]"),
    (error) => error instanceof SpaceLayoutGenerationError &&
      error.code === "INVALID_LAYOUT_MODEL_OUTPUT",
  );
});
