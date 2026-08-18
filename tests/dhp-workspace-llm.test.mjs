import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../src/app/admin/workspace/page.tsx", import.meta.url);
const workspacePath = new URL("../src/components/admin/DhpWorkspace.tsx", import.meta.url);
const adminChatPath = new URL("../src/app/api/admin/workspace/chat/route.ts", import.meta.url);
const knowledgePath = new URL("../src/app/api/admin/workspace/knowledge/route.ts", import.meta.url);
const chatPath = new URL("../src/app/api/v1/llm/chat/completions/route.ts", import.meta.url);
const modelsPath = new URL("../src/app/api/v1/llm/models/route.ts", import.meta.url);
const authPath = new URL("../src/lib/server/llm-client-auth.ts", import.meta.url);
const compatibilityPath = new URL("../src/lib/server/openai-compatible-llm.ts", import.meta.url);
const capabilityPath = new URL("../src/lib/server/model-runtime-capability.ts", import.meta.url);
const gatewayPath = new URL("../supabase/functions/dhp-capability-gateway/index.ts", import.meta.url);
const proxyPath = new URL("../src/proxy.ts", import.meta.url);
const envPath = new URL("../.env.example", import.meta.url);

test("DHP Workspace v2 is protected, block-based, and keeps browser secrets out", async () => {
  const [page, workspace, adminChat, knowledge, proxy] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(workspacePath, "utf8"),
    readFile(adminChatPath, "utf8"),
    readFile(knowledgePath, "utf8"),
    readFile(proxyPath, "utf8"),
  ]);

  assert.match(page, /DHP Workspace/);
  assert.match(page, /index: false/);
  assert.match(workspace, /DHP Workspace v2/);
  assert.match(workspace, /Page \+ block editor/);
  assert.match(workspace, /dhp-workspace-v2/);
  assert.match(workspace, /\/api\/admin\/workspace\/chat/);
  assert.match(workspace, /\/api\/admin\/workspace\/knowledge/);
  assert.match(workspace, /Source of truth/);
  assert.match(workspace, /Import TXT\/MD\/CSV\/JSON/);
  assert.match(adminChat, /knowledgeContext/);
  assert.match(adminChat, /runWorkspaceChatWithModelRuntimeCapability/);
  assert.match(knowledge, /buildResidentialProposalEvidenceResponse/);
  assert.match(knowledge, /source: "dhp-proposal-evidence"/);
  assert.match(proxy, /\/admin\/:path\*/);
  assert.match(proxy, /\/api\/admin\/workspace\/:path\*/);
  assert.match(proxy, /ADMIN_WORKSPACE_API_PREFIX/);
  assert.doesNotMatch(workspace, /DHP_LLM_API_KEY|OPENROUTER_API_KEY|DHP_CONTROL_PLANE_SECRET/);
  assert.doesNotMatch(workspace, /notion\.so|notion\.com/i);
});

test("workspace knowledge context is bounded and does not auto-send page drafts", async () => {
  const [workspace, adminChat] = await Promise.all([
    readFile(workspacePath, "utf8"),
    readFile(adminChatPath, "utf8"),
  ]);

  assert.match(adminChat, /MAX_KNOWLEDGE_CONTEXT_CHARS = 8_000/);
  assert.match(adminChat, /DHP_KNOWLEDGE_CONTEXT/);
  assert.match(workspace, /knowledgeContext/);
  assert.doesNotMatch(workspace, /activePage\.blocks.*knowledgeContext/s);
  assert.match(workspace, /Draft trang hiện tại không tự động gửi sang model/);
});

test("OpenAI-compatible facade uses a dedicated credential and the capability boundary", async () => {
  const [chat, models, auth, compatibility, capability, env] = await Promise.all([
    readFile(chatPath, "utf8"),
    readFile(modelsPath, "utf8"),
    readFile(authPath, "utf8"),
    readFile(compatibilityPath, "utf8"),
    readFile(capabilityPath, "utf8"),
    readFile(envPath, "utf8"),
  ]);

  assert.match(chat, /authenticateLlmClient/);
  assert.match(chat, /parseOpenAiChatRequest/);
  assert.match(chat, /runWorkspaceChatWithModelRuntimeCapability/);
  assert.match(models, /dhp-free/);
  assert.match(auth, /DHP_LLM_API_KEY/);
  assert.match(env, /DHP_LLM_API_KEY=/);
  assert.match(compatibility, /streaming is not supported/i);
  assert.match(compatibility, /model 'dhp-free'/);
  assert.match(capability, /requestDhpCapability\("model-runtime", \["execute"\]/);
  assert.doesNotMatch(chat, /openrouter\.ai|OPENROUTER_API_KEY|GEMINI_API_KEY/);
  assert.doesNotMatch(models, /openrouter\.ai|OPENROUTER_API_KEY|GEMINI_API_KEY/);
});

test("workspace chat remains free-cloud-only and fails through the shared model runtime", async () => {
  const gateway = await readFile(gatewayPath, "utf8");

  assert.match(gateway, /workspace-chat/);
  assert.match(gateway, /input\.freeOnly !== true/);
  assert.match(gateway, /input\.allowPaid !== false/);
  assert.match(gateway, /verifiedFree: true/);
  assert.match(gateway, /input\.task !== 'workspace-chat'/);
  assert.doesNotMatch(gateway, /ollama|local-runtime|allowPaid:\s*true/i);
});
