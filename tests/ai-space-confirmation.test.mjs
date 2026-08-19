import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test, { after, before } from "node:test";

let api;
let fixtureDir;
const TEST_SEAL_KEY = "test-space-confirmation-key-32-bytes-minimum";

before(async () => {
  fixtureDir = await mkdtemp(join(tmpdir(), "dhp-space-confirmation-"));
  const [confirmation, designer] = await Promise.all([
    readFile(new URL("../src/lib/ai/space-confirmation.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/ai/space-designer.ts", import.meta.url), "utf8"),
  ]);
  const portable = confirmation.replace(
    'from "@/lib/ai/space-designer";',
    'from "./space-designer.ts";',
  );
  await Promise.all([
    writeFile(join(fixtureDir, "space-confirmation.ts"), portable),
    writeFile(join(fixtureDir, "space-designer.ts"), designer),
  ]);
  api = await import(
    `${pathToFileURL(join(fixtureDir, "space-confirmation.ts")).href}?v=${Date.now()}`,
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
      revision: "space-candidate-001",
      rooms: [{
        id: "room-living",
        type: "living-room",
        polygon: [
          { x: 0, y: 0 },
          { x: 4200, y: 0 },
          { x: 4200, y: 3600 },
          { x: 0, y: 3600 },
        ],
      }],
      structuralElements: [
        {
          id: "wall-01",
          roomId: "room-living",
          kind: "wall",
          lock: "hard",
          bounds: { x: 0, y: 0, width: 4200, depth: 120 },
          blocksPlacement: true,
        },
        {
          id: "door-01",
          roomId: "room-living",
          kind: "door",
          lock: "controlled",
          bounds: { x: 0, y: 1200, width: 120, depth: 900 },
          blocksPlacement: true,
        },
      ],
    },
    verification: {
      geometryStatus: "candidate-unverified",
      dimensionStatus: "unverified-ai-extraction",
      dimensionEvidence: [
        { label: "4200", valueMm: 4200, source: "visible-label" },
        { label: "3600", valueMm: 3600, source: "visible-label" },
      ],
      assumptions: ["Gốc tọa độ là quy ước trình bày."],
    },
  };
}

function reviews() {
  return [
    { label: "4200", valueMm: 4200, source: "visible-label", status: "verified" },
    { label: "3600", valueMm: 3600, source: "visible-label", status: "verified" },
  ];
}

async function confirm(input = {}) {
  return api.confirmSpaceCandidate(
    { candidate: candidate(), dimensionReviews: reviews(), ...input },
    TEST_SEAL_KEY,
  );
}

test("G4 creates server-owned digests, confirmed revision and authenticated seal", async () => {
  const confirmed = await confirm();
  assert.equal(confirmed.status, "confirmed-for-design");
  assert.match(confirmed.geometryDigest, /^sha256:[a-f0-9]{64}$/);
  assert.match(confirmed.confirmationDigest, /^sha256:[a-f0-9]{64}$/);
  assert.match(confirmed.confirmationSeal, /^hmac-sha256:[a-f0-9]{64}$/);
  assert.match(confirmed.confirmedRevision, /^space-confirmed:[a-f0-9]{64}$/);
  assert.equal(confirmed.model.revision, confirmed.confirmedRevision);
  assert.equal(confirmed.sourceRevision, "space-candidate-001");
  assert.equal(confirmed.verification.dimensionStatus, "reviewed-verified");
  assert.equal(confirmed.verification.engineeringStatus, "not-engineer-verified");
});

test("geometry digest is deterministic across element ordering and binds source revision", async () => {
  const left = candidate().model;
  left.structuralElements.push({
    id: "window-01",
    roomId: "room-living",
    kind: "window",
    lock: "controlled",
    bounds: { x: 1700, y: 0, width: 1200, depth: 120 },
    blocksPlacement: false,
  });
  const right = structuredClone(left);
  right.structuralElements.reverse();
  const leftDigest = await api.computeSpaceGeometryDigest(left, left.revision);
  const reorderedDigest = await api.computeSpaceGeometryDigest(right, right.revision);
  const newRevisionDigest = await api.computeSpaceGeometryDigest(left, "space-candidate-002");
  assert.equal(leftDigest, reorderedDigest);
  assert.notEqual(leftDigest, newRevisionDigest);
});

test("G4 preserves server lock policy and rejects relaxed structural policy", async () => {
  const confirmed = await confirm();
  assert.equal(confirmed.model.structuralElements[0].lock, "hard");
  assert.equal(confirmed.model.structuralElements[1].lock, "controlled");

  const bad = candidate();
  bad.model.structuralElements[0].lock = "controlled";
  await assert.rejects(
    () => api.confirmSpaceCandidate({ candidate: bad, dimensionReviews: reviews() }, TEST_SEAL_KEY),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "LOCK_POLICY_VIOLATION",
  );
});

test("every visible dimension needs one exact review", async () => {
  await assert.rejects(
    () => api.confirmSpaceCandidate(
      { candidate: candidate(), dimensionReviews: reviews().slice(0, 1) },
      TEST_SEAL_KEY,
    ),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "DIMENSION_REVIEW_MISMATCH",
  );

  const mismatched = reviews();
  mismatched[1].valueMm = 3500;
  await assert.rejects(
    () => api.confirmSpaceCandidate(
      { candidate: candidate(), dimensionReviews: mismatched },
      TEST_SEAL_KEY,
    ),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "DIMENSION_REVIEW_MISMATCH",
  );
});

test("assumed dimensions remain explicit and require a reason", async () => {
  const assumed = reviews();
  assumed[1].status = "assumed";
  await assert.rejects(
    () => api.confirmSpaceCandidate(
      { candidate: candidate(), dimensionReviews: assumed },
      TEST_SEAL_KEY,
    ),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "INVALID_DIMENSION_REVIEW",
  );

  assumed[1].note = "Chưa đo hiện trường; dùng tạm nhãn bản vẽ cho concept.";
  const confirmed = await api.confirmSpaceCandidate(
    { candidate: candidate(), dimensionReviews: assumed },
    TEST_SEAL_KEY,
  );
  assert.equal(confirmed.verification.dimensionStatus, "reviewed-with-assumptions");
  assert.equal(confirmed.verification.engineeringStatus, "not-engineer-verified");
});

test("client cannot submit server authority fields", async () => {
  await assert.rejects(
    () => api.confirmSpaceCandidate(
      {
        candidate: candidate(),
        dimensionReviews: reviews(),
        geometryDigest: "sha256:" + "0".repeat(64),
      },
      TEST_SEAL_KEY,
    ),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "CLIENT_AUTHORITY_FIELD",
  );
});

test("post-confirmation geometry and review mutation fail closed", async () => {
  const geometryTampered = await confirm();
  geometryTampered.model.rooms[0].polygon[1].x = 4300;
  await assert.rejects(
    () => api.verifyConfirmedSpace(geometryTampered, TEST_SEAL_KEY),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "GEOMETRY_DIGEST_MISMATCH",
  );

  const reviewTampered = await confirm();
  reviewTampered.verification.dimensionReviews[0].status = "assumed";
  reviewTampered.verification.dimensionReviews[0].note = "Đã bị sửa sau xác nhận.";
  reviewTampered.verification.dimensionStatus = "reviewed-with-assumptions";
  await assert.rejects(
    () => api.verifyConfirmedSpace(reviewTampered, TEST_SEAL_KEY),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "CONFIRMATION_DIGEST_MISMATCH",
  );
});

test("public digest recomputation cannot forge a new server confirmation", async () => {
  const forged = await confirm();
  forged.model.rooms[0].polygon[1].x = 4300;
  forged.geometryDigest = await api.computeSpaceGeometryDigest(
    forged.model,
    forged.sourceRevision,
  );
  forged.confirmationDigest = await api.computeSpaceConfirmationDigest(
    forged.geometryDigest,
    forged.verification.dimensionReviews,
    forged.verification.sourceAssumptions,
  );
  const hex = forged.confirmationDigest.slice("sha256:".length);
  forged.confirmedRevision = `space-confirmed:${hex}`;
  forged.model.revision = forged.confirmedRevision;

  await assert.rejects(
    () => api.verifyConfirmedSpace(forged, TEST_SEAL_KEY),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "CONFIRMATION_SEAL_MISMATCH",
  );
});

test("wrong server key is rejected and valid envelope re-verifies", async () => {
  const confirmed = await confirm();
  await assert.rejects(
    () => api.verifyConfirmedSpace(confirmed, "different-server-key-32-bytes-minimum"),
    (error) => error instanceof api.SpaceConfirmationError && error.code === "CONFIRMATION_SEAL_MISMATCH",
  );
  assert.deepEqual(await api.verifyConfirmedSpace(confirmed, TEST_SEAL_KEY), confirmed);
});
