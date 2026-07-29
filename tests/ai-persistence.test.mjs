import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/lib/ai/persistence.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const persistence = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const {
  AI_DRAFT_RETENTION_MS,
  readAIDraft,
  serializeAIDraft,
} = persistence;

function createSession() {
  return {
    version: 1,
    id: "session-verified-1",
    state: "DONE",
    visitedStates: ["START", "WELCOME", "DONE"],
    memory: {
      images: [
        {
          storageKey: "session-verified-1:image:1",
          name: "hien-trang.webp",
          size: 512_000,
          type: "image/webp",
          lastModified: 1_785_216_000_000,
        },
      ],
      service: "Cửa cổng",
      dimensions: "rộng 4 m × cao 2,6 m",
      name: "Nguyễn Văn An",
      phone: "0901234567",
      surveyAddress: "12 Đường Mẫu, TP. Hồ Chí Minh",
      email: "an@example.com",
      zalo: "0901234567",
    },
    handoverStep: 5,
    confidence: 95,
    leadScore: 90,
    proposal: {
      progress: 100,
      summary: "Hồ sơ cửa cổng.",
      facts: [],
      missing: [],
      costRange: null,
      verificationNote: "Cần khảo sát thực tế.",
    },
    updatedAt: "2026-07-29T00:00:00.000Z",
  };
}

test("persistent AI drafts keep project context but remove private contact fields", () => {
  const now = 1_785_283_200_000;
  const serialized = serializeAIDraft(createSession(), now);
  const stored = JSON.parse(serialized);

  assert.equal(stored.savedAt, now);
  assert.equal(stored.expiresAt, now + AI_DRAFT_RETENTION_MS);
  assert.equal(stored.session.memory.service, "Cửa cổng");
  assert.equal(stored.session.memory.images.length, 1);
  assert.equal(stored.session.memory.name, undefined);
  assert.equal(stored.session.memory.phone, undefined);
  assert.equal(stored.session.memory.surveyAddress, undefined);
  assert.equal(stored.session.memory.email, undefined);
  assert.equal(stored.session.memory.zalo, undefined);
});

test("persistent AI drafts are readable before expiry and rejected at expiry", () => {
  const now = 1_785_283_200_000;
  const serialized = serializeAIDraft(createSession(), now);
  const ready = readAIDraft(serialized, now + AI_DRAFT_RETENTION_MS - 1);
  const expired = readAIDraft(serialized, now + AI_DRAFT_RETENTION_MS);

  assert.equal(ready.status, "ready");
  assert.equal(ready.session.id, "session-verified-1");
  assert.deepEqual(expired, {
    status: "expired",
    sessionId: "session-verified-1",
  });
});

test("persistent AI drafts reject malformed or unsupported envelopes", () => {
  assert.deepEqual(readAIDraft(null), { status: "missing" });
  assert.deepEqual(readAIDraft("{"), { status: "invalid" });
  assert.deepEqual(
    readAIDraft(JSON.stringify({ version: 2, session: createSession() })),
    { status: "invalid" },
  );
});
