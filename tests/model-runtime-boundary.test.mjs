import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routerPath = new URL("../src/lib/server/cloud-ai-router.ts", import.meta.url);
const capabilityPath = new URL("../src/lib/server/model-runtime-capability.ts", import.meta.url);
const envPath = new URL("../.env.example", import.meta.url);
const gatewayPath = new URL(
  "../supabase/functions/dhp-capability-gateway/index.ts",
  import.meta.url,
);

test("website model routing stays behind the DHP capability boundary", async () => {
  const [router, capability, env] = await Promise.all([
    readFile(routerPath, "utf8"),
    readFile(capabilityPath, "utf8"),
    readFile(envPath, "utf8"),
  ]);

  assert.match(router, /analyzeProjectWithModelRuntimeCapability/);
  assert.match(capability, /requestDhpCapability\("model-runtime", \["execute"\]/);
  assert.doesNotMatch(router, /openrouter\.ai|DHP_AI_CLOUD_PROVIDERS_JSON|apiKeyEnv|baseUrl/);
  assert.doesNotMatch(capability, /openrouter\.ai|OPENROUTER_API_KEY/);
  assert.doesNotMatch(env, /DHP_AI_CLOUD_PROVIDERS_JSON|DHP_AI_MODEL_CATALOG_URL|OPENROUTER_API_KEY/);
});

test("backend model runtime is cloud-only and zero-cost locked", async () => {
  const gateway = await readFile(gatewayPath, "utf8");

  assert.match(gateway, /model: 'openrouter\/free'/);
  assert.match(gateway, /input\.freeOnly !== true/);
  assert.match(gateway, /input\.allowPaid !== false/);
  assert.match(gateway, /verifiedFree: true/);
  assert.match(gateway, /openrouter-models-api/);
  assert.doesNotMatch(gateway, /ollama|local-runtime|allowPaid:\s*true/i);
});
