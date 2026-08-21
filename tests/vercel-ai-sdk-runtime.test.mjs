import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const runtimeUrl = new URL(
  "../src/lib/server/vercel-ai-sdk-runtime.ts",
  import.meta.url,
);
const capabilityUrl = new URL(
  "../src/lib/server/model-runtime-capability.ts",
  import.meta.url,
);
const packageUrl = new URL("../package.json", import.meta.url);
const envUrl = new URL("../.env.example", import.meta.url);

test("Vercel AI SDK dependencies are explicit and provider-scoped", async () => {
  const packageJson = JSON.parse(await readFile(packageUrl, "utf8"));
  assert.equal(packageJson.dependencies.ai, "7.0.66");
  assert.equal(packageJson.dependencies["@ai-sdk/google"], "4.0.44");
});

test("direct AI SDK execution is opt-in, verified-free, and paid-blocked", async () => {
  const runtime = await readFile(runtimeUrl, "utf8");

  assert.match(runtime, /DHP_AI_SDK_RUNTIME/);
  assert.match(runtime, /google-direct/);
  assert.match(runtime, /DHP_AI_SDK_VERIFIED_FREE/);
  assert.match(runtime, /DHP_AI_ALLOW_PAID/);
  assert.match(runtime, /GEMINI_API_KEY/);
  assert.match(runtime, /createGoogleGenerativeAI/);
  assert.match(runtime, /generateText/);
  assert.match(runtime, /AbortSignal\.timeout/);
  assert.doesNotMatch(runtime, /NEXT_PUBLIC_/);
});

test("runtime readiness reports only safe configuration states", async () => {
  const runtime = await readFile(runtimeUrl, "utf8");
  const capability = await readFile(capabilityUrl, "utf8");

  assert.match(runtime, /getVercelAiSdkRuntimeReadiness/);
  assert.match(runtime, /"runtime-selector"/);
  assert.match(runtime, /"verified-free"/);
  assert.match(runtime, /"paid-execution-blocked"/);
  assert.match(runtime, /"missing-api-key"/);
  assert.match(runtime, /"ready"/);

  assert.match(capability, /directReadinessReason/);
  assert.match(capability, /directModel/);
  assert.match(capability, /directFailure/);
  assert.match(capability, /errorName/);
  assert.match(capability, /statusCode/);
  assert.doesNotMatch(capability, /error\.message/);
});

test("canonical free gateway remains the fail-safe and image path", async () => {
  const capability = await readFile(capabilityUrl, "utf8");

  assert.match(capability, /getVercelAiSdkRuntimeReadiness/);
  assert.match(capability, /executeVercelAiSdkText/);
  assert.match(capability, /images\.length === 0/);
  assert.match(capability, /executeGatewayModelRuntime\(task, prompt, images\)/);
  assert.match(capability, /freeOnly:\s*true/);
  assert.match(capability, /allowPaid:\s*false/);
  assert.match(capability, /data\.verifiedFree !== true/);
});

test("environment contract keeps the direct runtime disabled by default", async () => {
  const env = await readFile(envUrl, "utf8");

  assert.match(env, /DHP_AI_SDK_RUNTIME=\n/);
  assert.match(env, /DHP_AI_SDK_VERIFIED_FREE=false/);
  assert.match(env, /DHP_AI_ALLOW_PAID=false/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_(?:GEMINI|DHP_AI_SDK)/);
});
