import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test, { after, before } from "node:test";

let api;
let fixtureDir;

before(async () => {
  fixtureDir = await mkdtemp(join(tmpdir(), "dhp-space-extraction-"));
  const extractionPath = new URL(
    "../src/lib/ai/space-extraction.ts",
    import.meta.url,
  );
  const imageUploadPath = new URL(
    "../src/lib/ai/image-upload.ts",
    import.meta.url,
  );
  const spaceDesignerPath = new URL(
    "../src/lib/ai/space-designer.ts",
    import.meta.url,
  );

  const [extraction, imageUpload, spaceDesigner] = await Promise.all([
    readFile(extractionPath, "utf8"),
    readFile(imageUploadPath, "utf8"),
    readFile(spaceDesignerPath, "utf8"),
  ]);

  const portableExtraction = extraction
    .replace(
      'from "@/lib/ai/image-upload";',
      'from "./image-upload.ts";',
    )
    .replace(
      'from "@/lib/ai/space-designer";',
      'from "./space-designer.ts";',
    );

  await Promise.all([
    writeFile(join(fixtureDir, "space-extraction.ts"), portableExtraction),
    writeFile(join(fixtureDir, "image-upload.ts"), imageUpload),
    writeFile(join(fixtureDir, "space-designer.ts"), spaceDesigner),
  ]);

  api = await import(
    `${pathToFileURL(join(fixtureDir, "space-extraction.ts")).href}?v=${Date.now()}`
  );
});

after(async () => {
  if (fixtureDir) await rm(fixtureDir, { recursive: true, force: true });
});

function validRequest() {
  return {
    image: {
      mimeType: "image/png",
      dataBase64: Buffer.from("fake-image-bytes").toString("base64"),
    },
    context: "Mặt bằng tầng trệt. Chỉ đọc các kích thước nhìn thấy rõ.",
  };
}

function candidateOutput() {
  return JSON.stringify({
    status: "candidate",
    unit: "mm",
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
        bounds: { x: 0, y: 0, width: 4200, depth: 120 },
      },
      {
        id: "door-01",
        roomId: "room-living",
        kind: "door",
        bounds: { x: 0, y: 1200, width: 120, depth: 900 },
      },
      {
        id: "window-01",
        roomId: "room-living",
        kind: "window",
        bounds: { x: 1700, y: 0, width: 1200, depth: 120 },
      },
    ],
    dimensionEvidence: [
      {
        label: "4200",
        valueMm: 4200,
        source: "visible-label",
      },
      {
        label: "3600",
        valueMm: 3600,
        source: "visible-label",
      },
    ],
    assumptions: ["Tọa độ gốc đặt tại góc trái dưới của phòng."],
  });
}

test("Space extraction accepts one bounded canonical project image", () => {
  const parsed = api.parseSpaceExtractionRequest(validRequest());

  assert.equal(parsed.image.mimeType, "image/png");
  assert.equal(parsed.image.dataBase64, validRequest().image.dataBase64);
  assert.match(parsed.context, /mặt bằng/i);
});

test("Space extraction rejects unsupported image MIME types", () => {
  const request = validRequest();
  request.image.mimeType = "image/gif";

  assert.throws(
    () => api.parseSpaceExtractionRequest(request),
    (error) =>
      error instanceof api.SpaceExtractionValidationError &&
      error.code === "INVALID_IMAGE_TYPE",
  );
});

test("Space extraction rejects malformed base64", () => {
  const request = validRequest();
  request.image.dataBase64 = "not@@base64";

  assert.throws(
    () => api.parseSpaceExtractionRequest(request),
    (error) =>
      error instanceof api.SpaceExtractionValidationError &&
      error.code === "INVALID_IMAGE_DATA",
  );
});

test("Space extraction rejects decoded image bytes above the v1 limit", () => {
  const request = validRequest();
  request.image.dataBase64 = Buffer.alloc(
    api.SPACE_EXTRACTION_MAX_IMAGE_BYTES + 1,
  ).toString("base64");

  assert.throws(
    () => api.parseSpaceExtractionRequest(request),
    (error) =>
      error instanceof api.SpaceExtractionValidationError &&
      error.code === "IMAGE_TOO_LARGE",
  );
});

test("Space extraction rejects overlong supplemental context", () => {
  const request = validRequest();
  request.context = "x".repeat(2001);

  assert.throws(
    () => api.parseSpaceExtractionRequest(request),
    (error) =>
      error instanceof api.SpaceExtractionValidationError &&
      error.code === "CONTEXT_TOO_LONG",
  );
});

test("Space extraction prompt forbids invented geometry and uses a valid polygon example", () => {
  const prompt = api.buildSpaceExtractionPrompt(validRequest().context);

  assert.match(prompt, /không được tự bịa/i);
  assert.match(prompt, /visible-label/i);
  assert.match(prompt, /candidate/i);
  assert.match(prompt, /không.*lock/i);
  assert.match(prompt, /không.*giá/i);
  assert.match(prompt, /JSON object/i);
  assert.match(
    prompt,
    /"polygon":\[\{"x":0,"y":0\},\{"x":4200,"y":0\},\{"x":4200,"y":3600\},\{"x":0,"y":3600\}\]/,
  );
});

test("candidate extraction is converted into a server-owned unverified Space Model", () => {
  const parsed = api.parseSpaceExtractionOutput(
    candidateOutput(),
    "space-candidate-001",
  );

  assert.equal(parsed.status, "candidate");
  assert.equal(parsed.candidate.model.schemaVersion, "1.0");
  assert.equal(parsed.candidate.model.unit, "mm");
  assert.equal(parsed.candidate.model.revision, "space-candidate-001");
  assert.equal(parsed.candidate.verification.geometryStatus, "candidate-unverified");
  assert.equal(
    parsed.candidate.verification.dimensionStatus,
    "unverified-ai-extraction",
  );
  assert.equal(parsed.candidate.model.structuralElements[0].lock, "hard");
  assert.equal(parsed.candidate.model.structuralElements[1].lock, "controlled");
  assert.equal(parsed.candidate.model.structuralElements[2].lock, "controlled");
  assert.equal(
    parsed.candidate.model.structuralElements[0].blocksPlacement,
    true,
  );
  assert.equal(
    parsed.candidate.model.structuralElements[2].blocksPlacement,
    false,
  );
});

test("AI cannot supply or relax geometry locks", () => {
  const payload = JSON.parse(candidateOutput());
  payload.structuralElements[0].lock = "free";
  payload.structuralElements[0].blocksPlacement = false;

  assert.throws(
    () =>
      api.parseSpaceExtractionOutput(
        JSON.stringify(payload),
        "space-candidate-002",
      ),
    (error) =>
      error instanceof api.SpaceExtractionOutputError &&
      error.code === "UNTRUSTED_CONTROL_FIELD",
  );
});

test("candidate extraction requires visible dimension evidence", () => {
  const payload = JSON.parse(candidateOutput());
  payload.dimensionEvidence = [];

  assert.throws(
    () =>
      api.parseSpaceExtractionOutput(
        JSON.stringify(payload),
        "space-candidate-003",
      ),
    (error) =>
      error instanceof api.SpaceExtractionOutputError &&
      error.code === "MISSING_DIMENSION_EVIDENCE",
  );
});

test("invalid candidate geometry is rejected by the deterministic G1 validator", () => {
  const payload = JSON.parse(candidateOutput());
  payload.rooms[0].polygon = [
    { x: 0, y: 0 },
    { x: 1000, y: 1000 },
    { x: 0, y: 1000 },
    { x: 1000, y: 0 },
  ];

  assert.throws(
    () =>
      api.parseSpaceExtractionOutput(
        JSON.stringify(payload),
        "space-candidate-004",
      ),
    (error) =>
      error instanceof api.SpaceExtractionOutputError &&
      error.code === "INVALID_SPACE_MODEL",
  );
});

test("insufficient evidence is fail-closed and creates no Space Model", () => {
  const parsed = api.parseSpaceExtractionOutput(
    JSON.stringify({
      status: "insufficient-evidence",
      reasons: ["Không thấy kích thước hoặc tỷ lệ đủ tin cậy."],
      assumptions: [],
    }),
    "space-candidate-005",
  );

  assert.deepEqual(parsed, {
    status: "insufficient-evidence",
    reasons: ["Không thấy kích thước hoặc tỷ lệ đủ tin cậy."],
    assumptions: [],
  });
});

test("insufficient evidence must explain why geometry was not created", () => {
  assert.throws(
    () =>
      api.parseSpaceExtractionOutput(
        JSON.stringify({
          status: "insufficient-evidence",
          reasons: [],
          assumptions: [],
        }),
        "space-candidate-006",
      ),
    (error) =>
      error instanceof api.SpaceExtractionOutputError &&
      error.code === "INVALID_AI_OUTPUT",
  );
});

test("malformed AI JSON is rejected", () => {
  assert.throws(
    () => api.parseSpaceExtractionOutput("not-json", "space-candidate-007"),
    (error) =>
      error instanceof api.SpaceExtractionOutputError &&
      error.code === "INVALID_AI_OUTPUT",
  );
});
