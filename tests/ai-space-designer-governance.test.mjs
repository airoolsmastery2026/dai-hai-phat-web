import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contractPath = new URL(
  "../docs/AI_SPACE_DESIGNER_EXECUTION_CONTRACT.md",
  import.meta.url,
);
const skillPath = new URL(
  "../.ai/skills/ai-space-designer-delivery/SKILL.md",
  import.meta.url,
);

test("Space Designer contract keeps geometry truth ahead of generated presentation", async () => {
  const contract = await readFile(contractPath, "utf8");

  assert.match(contract, /DHP Space Model.*source of truth/i);
  assert.match(contract, /generated image.*construction truth/i);
  assert.match(contract, /deterministic TypeScript rules/i);
  assert.match(contract, /existing cloud AI routing boundary/i);
  assert.match(contract, /no new database, queue, microservice, framework, local LLM, or package/i);
});

test("Space Designer contract defines sequential evidence gates from G0 through G9", async () => {
  const contract = await readFile(contractPath, "utf8");

  for (let gate = 0; gate <= 9; gate += 1) {
    assert.match(contract, new RegExp(`G${gate}\\b`), `missing G${gate}`);
  }
  assert.match(contract, /### HARD\b/i);
  assert.match(contract, /### CONTROLLED\b/i);
  assert.match(contract, /Continuous execution contract/i);
  assert.match(contract, /paid\/metred provider activation not already explicitly authorized/i);
});

test("project delivery skill binds UMS roles without creating a second orchestrator", async () => {
  const skill = await readFile(skillPath, "utf8");

  for (const skillId of [
    "K-01",
    "K-02",
    "K-03",
    "K-05",
    "K-06",
    "PM-01",
    "PR-02",
    "SA-03",
    "CB-01",
    "CB-02",
    "AI-01",
    "AI-02",
    "AI-05",
    "AI-06",
    "SE-03",
    "QA-05",
  ]) {
    assert.match(skill, new RegExp(`\\b${skillId}\\b`), `missing ${skillId}`);
  }

  assert.match(skill, /does not create a new orchestration system/i);
  assert.match(skill, /One writable artifact has one final owner/i);
  assert.match(skill, /continue automatically/i);
  assert.match(skill, /Existing `AI Concept Studio` rendering capability must be reused/i);
});
