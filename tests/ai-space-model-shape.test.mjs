import assert from "node:assert/strict";
import test from "node:test";

import { hasStrictSpaceModelShape } from "../src/lib/ai/space-model-shape.ts";

function model() {
  return {
    schemaVersion: "1.0",
    unit: "mm",
    revision: "space-candidate-001",
    rooms: [{
      id: "room-01",
      type: "living-room",
      polygon: [
        { x: 0, y: 0 },
        { x: 4000, y: 0 },
        { x: 4000, y: 3000 },
        { x: 0, y: 3000 },
      ],
    }],
    structuralElements: [{
      id: "wall-01",
      roomId: "room-01",
      kind: "wall",
      lock: "hard",
      bounds: { x: 0, y: 0, width: 4000, depth: 100 },
      blocksPlacement: true,
    }],
  };
}

test("canonical Space Model shape is accepted", () => {
  assert.equal(hasStrictSpaceModelShape(model()), true);
});

test("top-level hidden state is rejected", () => {
  const input = model();
  input.engineeringVerified = true;
  assert.equal(hasStrictSpaceModelShape(input), false);
});

test("room, point, structural element and bounds hidden fields are rejected", () => {
  const roomExtra = model();
  roomExtra.rooms[0].secret = "hidden";
  assert.equal(hasStrictSpaceModelShape(roomExtra), false);

  const pointExtra = model();
  pointExtra.rooms[0].polygon[0].z = 3000;
  assert.equal(hasStrictSpaceModelShape(pointExtra), false);

  const elementExtra = model();
  elementExtra.structuralElements[0].approved = true;
  assert.equal(hasStrictSpaceModelShape(elementExtra), false);

  const boundsExtra = model();
  boundsExtra.structuralElements[0].bounds.rotation = 90;
  assert.equal(hasStrictSpaceModelShape(boundsExtra), false);
});
