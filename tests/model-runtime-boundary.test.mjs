import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routerPath = new URL("../src/lib/server/cloud-ai-router.ts", import.meta.url);
const salesRouterPath = new URL(
  "../src/lib/server/sales-engineer-cloud-router.ts",
  import.meta.url,
);
const salesRoutePath = new URL(
  "../src/app/api/ai/sales-engineer/route.ts",
  import.meta.url,
);
const salesAgentPath = new URL(
  "../src/lib/ai/sales-engineer-agent.ts",
  import.meta.url,
);
const capabilityPath = new URL("../src/lib/server/model-runtime-capability.ts", import.meta.url);
const envPath = new URL("../.env.example", import.meta.url);
const gatewayPath = new URL(
  "../supabase/functions/dhp-capability-gateway/index.ts",
  import.meta.url,
);

test("core text model routing stays behind the DHP capability boundary", async () => {
  const [router, salesRouter, salesRoute, capability, env] = await Promise.all([
    readFile(routerPath, "utf8"),
    readFile(salesRouterPath, "utf8"),
    readFile(salesRoutePath, "utf8"),
    readFile(capabilityPath, "utf8"),
    readFile(envPath, "utf8"),
  ]);

  assert.match(router, /analyzeProjectWithModelRuntimeCapability/);
  assert.match(salesRouter, /runSalesEngineerWithModelRuntimeCapability/);
  assert.match(salesRoute, /runSalesEngineerWithCloudRouter/);
  assert.match(capability, /requestDhpCapability\("model-runtime", \["execute"\]/);
  assert.match(capability, /"project-analysis" \| "sales-engineer" \| "workspace-chat"/);
  assert.match(capability, /runWorkspaceChatWithModelRuntimeCapability/);
  assert.doesNotMatch(router, /Gemini|generativelanguage\.googleapis|GEMINI_API_KEY/);
  assert.doesNotMatch(salesRouter, /Gemini|generativelanguage\.googleapis|GEMINI_API_KEY/);
  assert.doesNotMatch(salesRoute, /runSalesEngineerWithGemini|GeminiSalesEngineerError/);
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
  assert.match(gateway, /project-analysis/);
  assert.match(gateway, /sales-engineer/);
  assert.match(gateway, /workspace-chat/);
  assert.match(gateway, /input\.task !== 'workspace-chat'/);
  assert.doesNotMatch(gateway, /ollama|local-runtime|allowPaid:\s*true/i);
});

test("sales engineer provider prompt excludes direct customer contact PII", async () => {
  const source = await readFile(salesAgentPath, "utf8");
  const promptStart = source.indexOf("function modelSafeProjectMemory");
  const promptEnd = source.indexOf("export function parseSalesEngineerAgentOutput", promptStart);
  const promptSection = source.slice(promptStart, promptEnd);

  assert.match(promptSection, /service: memory\.service/);
  assert.match(promptSection, /dimensions: memory\.dimensions/);
  assert.doesNotMatch(promptSection, /memory\.(name|phone|email|zalo|surveyAddress)/);
  assert.match(promptSection, /Danh tính và thông tin liên hệ không được gửi tới model/);
});
