import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/lib/ai/index.ts", import.meta.url),
  "utf8",
);
const scenarios = JSON.parse(
  readFileSync(
    new URL("../knowledge/chatbot-training-scenarios.json", import.meta.url),
    "utf8",
  ),
);
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
  createAIConversation,
  deferImageCollection,
  getConversationQuestion,
  resolveConversationChoice,
} = engine;

function buildSession(setup) {
  return setup.reduce((session, answer) => {
    if (answer === "__DEFER_IMAGES__") {
      return deferImageCollection(session);
    }
    return answerConversation(session, answer);
  }, createAIConversation());
}

test("chatbot training phrases resolve to verified choices without guessing", () => {
  for (const scenario of scenarios) {
    const session = buildSession(scenario.setup);
    const question = getConversationQuestion(session);

    assert.ok(question, `${scenario.id}: expected an active question`);
    assert.equal(question.id, scenario.questionId, `${scenario.id}: wrong training step`);
    assert.equal(
      resolveConversationChoice(question, scenario.message),
      scenario.expected,
      `${scenario.id}: interpreted the customer message incorrectly`,
    );
  }
});

test("training corpus keeps every suggestion grounded in a visible option", () => {
  for (const scenario of scenarios.filter((item) => item.expected !== null)) {
    const session = buildSession(scenario.setup);
    const question = getConversationQuestion(session);
    const visibleValues = question.options.map((item) => item.value);
    assert.ok(
      visibleValues.includes(scenario.expected),
      `${scenario.id}: expected value is not a verified visible choice`,
    );
  }
});
