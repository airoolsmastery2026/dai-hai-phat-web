import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routerPath = new URL("../.ai/FREE_MODEL_ROUTER.json", import.meta.url);
const registryPath = new URL("../tools/dsh-dhp-bundle/provider-registry.json", import.meta.url);
const pluginPath = new URL("../tools/dsh-dhp-bundle/index.js", import.meta.url);
const installerPath = new URL("../tools/dsh-dhp-bundle/install-dhp-dsh.ps1", import.meta.url);
const coreSkillPath = new URL("../.dsh/skills/dhp-core/SKILL.md", import.meta.url);

test("DSH/UMS prefers the DHP zero-cost virtual provider", async () => {
  const [routerRaw, registryRaw, plugin, installer, coreSkill] = await Promise.all([
    readFile(routerPath, "utf8"),
    readFile(registryPath, "utf8"),
    readFile(pluginPath, "utf8"),
    readFile(installerPath, "utf8"),
    readFile(coreSkillPath, "utf8"),
  ]);

  const router = JSON.parse(routerRaw);
  const registry = JSON.parse(registryRaw);
  const dhpProvider = registry.providers.find((provider) => provider.id === "dhp-free");
  const routerProvider = router.providers.find((provider) => provider.id === "dhp-free");

  assert.equal(router.mode, "free-cloud-only");
  assert.equal(router.hardLocks.localRuntime, false);
  assert.equal(router.hardLocks.paidApiAutoUse, false);
  assert.equal(router.hardLocks.meteredFallback, false);
  assert.equal(router.routing.preferredGateway, "dhp-free");
  assert.equal(registry.preferredProvider, "dhp-free");
  assert.equal(registry.hardLocks.localLlmFallback, false);
  assert.equal(registry.hardLocks.ollamaFallback, false);
  assert.equal(registry.hardLocks.paidFallback, false);
  assert.equal(registry.hardLocks.meteredFallback, false);

  assert.ok(dhpProvider);
  assert.equal(dhpProvider.protocol, "openai-compatible");
  assert.equal(dhpProvider.baseUrl, "https://dai-hai-phat-web.vercel.app/api/v1/llm");
  assert.equal(dhpProvider.apiKeyEnv, "DHP_LLM_API_KEY");
  assert.equal(dhpProvider.model, "dhp-free");
  assert.equal(dhpProvider.streaming, false);

  assert.ok(routerProvider);
  assert.deepEqual(routerProvider.models, ["dhp-free"]);
  assert.equal(routerProvider.apiKeyEnv, "DHP_LLM_API_KEY");

  assert.match(plugin, /preferredProvider: 'dhp-free'/);
  assert.match(plugin, /local LLM\/Ollama fallback is forbidden/);
  assert.match(installer, /DHP_LLM_API_KEY/);
  assert.match(installer, /dhp-free/);
  assert.match(coreSkill, /Route DSH\/UMS through the DHP virtual provider `dhp-free`/);
});

test("DSH bundle never embeds provider secrets", async () => {
  const files = await Promise.all([
    readFile(registryPath, "utf8"),
    readFile(pluginPath, "utf8"),
    readFile(installerPath, "utf8"),
  ]);
  const combined = files.join("\n");

  assert.doesNotMatch(combined, /sk-[A-Za-z0-9_-]{16,}/);
  assert.doesNotMatch(combined, /Bearer\s+[A-Za-z0-9._-]{16,}/);
  assert.doesNotMatch(combined, /allowPaid\s*[:=]\s*true/i);
  assert.doesNotMatch(combined, /localLlmFallback\s*[:=]\s*true/i);
});
