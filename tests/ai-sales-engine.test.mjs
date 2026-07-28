import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/ai/index.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const engine = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const {
  answerConversation,
  CONVERSATION_STATES,
  createAIConversation,
  getConversationQuestion,
  restoreAIConversation,
} = engine;

const validImages = [
  {
    storageKey: "session:image:1",
    name: "hien-trang.webp",
    size: 512_000,
    type: "image/webp",
    lastModified: 1_785_216_000_000,
  },
];

const collectionAnswers = [
  "Dự án mới",
  "Khảo sát",
  "Cửa cổng",
  "Nhà phố",
  "TP. Hồ Chí Minh",
  validImages,
  "rộng 4 m × cao 2,6 m",
  "Hiện đại",
  "Sắt hoặc thép",
  "60–120 triệu",
  "Trong 1 tháng",
  "Độ bền",
];

function completeCollection() {
  return collectionAnswers.reduce(
    (session, answer) => answerConversation(session, answer),
    createAIConversation(),
  );
}

test("conversation follows every required state in order", () => {
  const session = completeCollection();

  assert.equal(session.state, "CONFIDENCE_CHECK");
  assert.deepEqual(
    session.visitedStates,
    CONVERSATION_STATES.slice(0, CONVERSATION_STATES.indexOf("CONFIDENCE_CHECK") + 1),
  );
  assert.equal(session.proposal.progress, 90);
  assert.equal(session.proposal.costRange, null);
  assert.equal(session.proposal.missing.length, 0);
});

test("every visible question has one target and no more than six choices", () => {
  let session = createAIConversation();

  for (const answer of collectionAnswers) {
    const question = getConversationQuestion(session);
    assert.ok(question);
    assert.ok(question.field);
    assert.ok((question.options?.length ?? 0) <= 6);
    session = answerConversation(session, answer);
  }

  const completionAnswers = [
    "Yêu cầu khảo sát",
    "Sáng ngày làm việc",
    "Proposal và báo giá",
    "Nguyễn Văn An",
    "0901234567",
    "12 Đường Mẫu, Thới Hòa, TP. Hồ Chí Minh",
    "",
    "",
  ];

  for (const answer of completionAnswers) {
    const question = getConversationQuestion(session);
    assert.ok(question);
    assert.ok((question.options?.length ?? 0) <= 6);
    session = answerConversation(session, answer);
  }

  assert.equal(session.state, "DONE");
  assert.equal(session.proposal.progress, 100);
  assert.ok(session.leadScore > 70);
  assert.equal(session.memory.phone, "0901234567");
  assert.equal(getConversationQuestion(session), null);
});

test("intent routing identifies every required intent without grouping the result", () => {
  const intents = ["Dự án mới", "Sau thi công", "Hợp tác / Khác"].flatMap((group) => {
    const grouped = answerConversation(createAIConversation(), group);
    return getConversationQuestion(grouped)?.options?.map((item) => item.value) ?? [];
  });

  assert.deepEqual(intents.sort(), [
    "Bảo hành",
    "Hỏi giá",
    "Hợp tác",
    "Khác",
    "Khảo sát",
    "Khiếu nại",
    "So sánh",
    "Thi công",
    "Xin tư vấn",
    "Xem mẫu",
  ].sort());
});

test("invalid or missing images cannot advance the session", () => {
  let session = createAIConversation();
  for (const answer of collectionAnswers.slice(0, 5)) {
    session = answerConversation(session, answer);
  }

  assert.equal(session.state, "IMAGE_COLLECTION");
  assert.throws(() => answerConversation(session, []), /ít nhất một ảnh/);
  assert.throws(
    () =>
      answerConversation(session, [
        {
          storageKey: "session:video:1",
          name: "video.mp4",
          size: 1024,
          type: "video/mp4",
          lastModified: 1_785_216_000_000,
        },
      ]),
    /không đúng định dạng/,
  );
  assert.equal(session.state, "IMAGE_COLLECTION");
});

test("untrusted choices and restored client state are validated", () => {
  const initial = createAIConversation();
  assert.throws(() => answerConversation(initial, "Lựa chọn tự chèn"), /không hợp lệ/);

  const tampered = {
    ...completeCollection(),
    state: "DONE",
    memory: {
      images: [],
      service: 123,
      phone: "<script>",
    },
  };
  const restored = restoreAIConversation(JSON.stringify(tampered));

  assert.equal(restored.state, "WELCOME");
  assert.equal(restored.memory.service, undefined);
  assert.equal(restored.memory.phone, undefined);
  assert.deepEqual(restored.memory.images, []);
});

test("proposal and confidence grow only from confirmed customer data", () => {
  let session = createAIConversation();
  assert.equal(session.proposal.progress, 10);
  assert.equal(session.confidence, 0);

  session = answerConversation(session, collectionAnswers[0]);
  session = answerConversation(session, collectionAnswers[1]);
  session = answerConversation(session, collectionAnswers[2]);
  assert.equal(session.proposal.progress, 20);
  assert.ok(session.confidence > 0);

  session = collectionAnswers
    .slice(3)
    .reduce((current, answer) => answerConversation(current, answer), session);
  assert.equal(session.proposal.progress, 90);
  assert.ok(session.confidence >= 80);
  assert.match(session.proposal.verificationNote, /khảo sát thực tế/);
});

test("session restoration preserves memory and rejects corrupted data", () => {
  const session = completeCollection();
  const restored = restoreAIConversation(JSON.stringify(session));

  assert.equal(restored.state, "CONFIDENCE_CHECK");
  assert.equal(restored.memory.service, "Cửa cổng");
  assert.equal(restored.memory.images[0]?.name, "hien-trang.webp");

  const fallback = restoreAIConversation('{"version":2,"state":"DONE"}');
  assert.equal(fallback.state, "WELCOME");
  assert.deepEqual(fallback.memory.images, []);
});
