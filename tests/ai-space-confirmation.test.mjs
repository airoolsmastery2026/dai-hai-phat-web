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
  const confirmationPath = new URL(
    "../src/lib/ai/space-confirmation.ts",
    import.meta.url,
  );
  const designerPath = new URL(
    "../src/lib/ai/space-designer.ts",
    import.meta.url,
  );

  const [confirmation, designer] = await Promise.all([
    readFile(confirmationPath, "utf8"),
    readFile(designerPath, "utf8"),
  ]);
  const portableConfirmation = confirmation.replace(
    'from "@/lib/ai/space-designer";',
    'from "./space-designer.ts";',
  );

  await Promise.all([
    writeFile(join(fixtureDir, "space-confirmation.ts"), portableConfirmation),
    writeFile(join(fixtureDir, "space-designer.ts"), designer),
  ]);

  api = await import(
    `${pathToFileURL(join(fixtureDir, "space-confirmation.ts")).href}?v=${Date.now()}`
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
      rooms: [
        {
          id: "room-living",
          type: "living-room",
          polygon: [
            { x: 0, y: 0 },
            { x: 4200, y: 0 },
            { x: 4200, y: 3600 },
            { x: 0, y: 3600 },
          ],
        },
      ],
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

function verifiedReviews() {
  return [
    {
      label: "4200",
      valueMm: 4200,
      source: "visible-label",
      status: "verified",
    },
    {
      label: "3600",
      valueMm: 3600,
      source: "visible-label",
      status: "verified",
    },
  ];
}

async function confirm(overrides = {}) {
  return api.confirmSpaceCandidate(
    {
      candidate: candidate(),
      dimensionReviews: verifiedReviews(),
      ...overrides,
    },
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
  assert.equal(confirmed.verification.geometryStatus, "confirmed-for-design");
  assert.equal(confirmed.verification.dimensionStatus, "reviewed-verified");
  assert.equal(confirmed.verification.engineeringStatus, "not-engineer-verified");
});

test("geometry digest is deterministic across room/element array ordering", async () => {
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
  const rightDigest = await api.computeSpaceGeometryDigest(right, right.revision);

  assert.equal(leftDigest, rightDigest);
});

test("source revision is part of geometry integrity", async () => {
  const model = candidate().model;
  const left = await api.computeSpaceGeometryDigest(model, "space-candidate-001");
  const right = await api.computeSpaceGeometryDigest(model, "space-candidate-002");

  assert.notEqual(left, right);
});

test("G4 preserves HARD and CONTROLLED server lock policy", async () => {
  const confirmed = await confirm();

  assert.equal(confirmed.model.structuralElements[0].lock, "hard");
  assert.equal(confirmed.model.structuralElements[0].blocksPlacement, true);
  assert.equal(confirmed.model.structuralElements[1].lock, "controlled");
  assert.equal(confirmed.model.structuralElements[1].blocksPlacement, true);
});

test("candidate with relaxed wall policy is rejected", async () => {
  const badCandidate = candidate();
  badCandidate.model.structuralElements[0].lock = "controlled";

  await assert.rejects(
    () =>
      api.confirmSpaceCandidate(
        { candidate: badCandidate, dimensionReviews: verifiedReviews() },
        TEST_SEAL_KEY,
      ),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "LOCK_POLICY_VIOLATION",
  );
});

test("every visible dimension evidence item needs one exact review", async () => {
  const missing = verifiedReviews().slice(0, 1);

  await assert.rejects(
    () =>
      api.confirmSpaceCandidate(
        { candidate: candidate(), dimensionReviews: missing },
        TEST_SEAL_KEY,
      ),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "DIMENSION_REVIEW_MISMATCH",
  );

  const mismatched = verifiedReviews();
  mismatched[1].valueMm = 3500;
  await assert.rejects(
    () =>
      api.confirmSpaceCandidate(
        { candidate: candidate(), dimensionReviews: mismatched },
        TEST_SEAL_KEY,
      ),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "DIMENSION_REVIEW_MISMATCH",
  );
});

test("assumed dimensions stay explicit and require a reason", async () => {
  const reviews = verifiedReviews();
  reviews[1].status = "assumed";

  await assert.rejects(
    () =>
      api.confirmSpaceCandidate(
        { candidate: candidate(), dimensionReviews: reviews },
        TEST_SEAL_KEY,
      ),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "INVALID_DIMENSION_REVIEW",
  );

  reviews[1].note = "Chưa đo hiện trường; dùng tạm nhãn trên bản vẽ để thiết kế concept.";
  const confirmed = await api.confirmSpaceCandidate(
    { candidate: candidate(), dimensionReviews: reviews },
    TEST_SEAL_KEY,
  );

  assert.equal(
    confirmed.verification.dimensionStatus,
    "reviewed-with-assumptions",
  );
  assert.equal(confirmed.verification.engineeringStatus, "not-engineer-verified");
  assert.equal(confirmed.verification.dimensionReviews[1].status, "assumed");
});

test("client cannot submit digest/revision authority fields", async () => {
  await assert.rejects(
    () =>
      api.confirmSpaceCandidate(
        {
          candidate: candidate(),
          dimensionReviews: verifiedReviews(),
          geometryDigest: "sha256:" + "0".repeat(64),
        },
        TEST_SEAL_KEY,
      ),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "CLIENT_AUTHORITY_FIELD",
  );
});

test("post-confirmation geometry mutation fails closed", async () => {
  const confirmed = await confirm();
  confirmed.model.rooms[0].polygon[1].x = 4300;

  await assert.rejects(
    () => api.verifyConfirmedSpace(confirmed, TEST_SEAL_KEY),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "GEOMETRY_DIGEST_MISMATCH",
  );
});

test("post-confirmation review mutation fails closed", async () => {
  const confirmed = await confirm();
  confirmed.verification.dimensionReviews[0].status = "assumed";
  confirmed.verification.dimensionReviews[0].note = "Đã bị sửa sau xác nhận.";
  confirmed.verification.dimensionStatus = "reviewed-with-assumptions";

  await assert.rejects(
    () => api.verifyConfirmedSpace(confirmed, TEST_SEAL_KEY),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "CONFIRMATION_DIGEST_MISMATCH",
  );
});

test("a client cannot recompute public digests and forge a new server confirmation", async () => {
  const confirmed = await confirm();
  confirmed.model.rooms[0].polygon[1].x = 4300;
  confirmed.geometryDigest = await api.computeSpaceGeometryDigest(
    confirmed.model,
    confirmed.sourceRevision,
  );
  confirmed.confirmationDigest = await api.computeSpaceConfirmationDigestForTest(
    confirmed.geometryDigest,
    confirmed.verification.dimensionReviews,
    confirmed.verification.sourceAssumptions,
  );
  const digestHex = confirmed.confirmationDigest.slice("sha256:".length);
  confirmed.confirmedRevision = `space-confirmed:${digestHex}`;
  confirmed.model.revision = confirmed.confirmedRevision;

  await assert.rejects(
    () => api.verifyConfirmedSpace(confirmed, TEST_SEAL_KEY),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "CONFIRMATION_SEAL_MISMATCH",
  );
});

test("confirmation sealed with another server key is rejected", async () => {
  const confirmed = await confirm();

  await assert.rejects(
    () => api.verifyConfirmedSpace(confirmed, "different-server-key-32-bytes-minimum"),
    (error) =>
      error instanceof api.SpaceConfirmationError &&
      error.code === "CONFIRMATION_SEAL_MISMATCH",
  );
});

test("valid confirmed envelope re-verifies without mutation", async () => {
  const confirmed = await confirm();
  const verified = await api.verifyConfirmedSpace(confirmed, TEST_SEAL_KEY);

  assert.deepEqual(verified, confirmed);
});
