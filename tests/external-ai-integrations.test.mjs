import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const registryUrl = new URL("../.ai/EXTERNAL_AI_INTEGRATIONS.json", import.meta.url);
const freeRouterUrl = new URL("../.ai/FREE_MODEL_ROUTER.json", import.meta.url);
const contractUrl = new URL("../docs/EXTERNAL_AI_RUNTIME_INTEGRATIONS.md", import.meta.url);
const readmeUrl = new URL("../README.md", import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

test("external AI integrations are pinned, optional, and non-production by default", async () => {
  const registry = await readJson(registryUrl);
  const expectedIds = [
    "openviking",
    "needle",
    "ip-as-logo-skill",
    "deepseek-dsh-anchored-standard",
  ];

  assert.equal(registry.schemaVersion, "1.0");
  assert.deepEqual(registry.integrations.map(({ id }) => id), expectedIds);
  assert.equal(registry.hardLocks.websiteRemainsBusinessSystemOfRecord, true);
  assert.equal(registry.hardLocks.noDirectCrossServiceDatabaseAccess, true);
  assert.equal(registry.hardLocks.noExternalRuntimeProductionDependencyByDefault, true);
  assert.equal(registry.hardLocks.vendorSourceIntoWebsiteRepository, false);
  assert.equal(registry.hardLocks.paidApiAutoUse, false);
  assert.equal(registry.hardLocks.autoTopUp, false);
  assert.equal(registry.hardLocks.meteredFallback, false);
  assert.equal(registry.hardLocks.preservePublicChatbotCriticalPath, true);
  assert.equal(registry.hardLocks.preserveQualityGate, "npm run quality");

  for (const integration of registry.integrations) {
    assert.match(integration.reviewedCommit, /^[0-9a-f]{40}$/);
    assert.equal(integration.productionWebsiteDependency, false);
    assert.equal(integration.policy.noSilentPaidFallback, true);
    assert.ok(integration.umsAdapter.length > 0);
    assert.ok(integration.policy.fallback.length > 0);
  }
});

test("OpenViking remains subordinate context and Needle is not a local coding fallback", async () => {
  const registry = await readJson(registryUrl);
  const freeRouter = await readJson(freeRouterUrl);
  const openViking = registry.integrations.find(({ id }) => id === "openviking");
  const needle = registry.integrations.find(({ id }) => id === "needle");

  assert.ok(openViking);
  assert.equal(openViking.license, "AGPL-3.0-only");
  assert.equal(openViking.defaultState, "approved-opt-in");
  assert.ok(openViking.forbiddenPlacement.includes("direct-website-database-writes"));
  assert.ok(openViking.forbiddenPlacement.includes("public-chatbot-hard-dependency"));
  assert.equal(openViking.policy.projectIsolationRequired, true);
  assert.equal(openViking.policy.provenanceRequired, true);
  assert.equal(openViking.policy.localModelAutoEnable, false);

  assert.ok(needle);
  assert.equal(needle.defaultState, "registered-disabled");
  assert.equal(needle.policy.routeOnlyDefault, true);
  assert.equal(needle.policy.confidenceIsNotAuthorization, true);
  assert.equal(needle.policy.permissionGateBeforeConsequentialExecution, true);
  assert.ok(needle.forbiddenPlacement.includes("coding-agent-free-model-fallback"));
  assert.equal(registry.hardLocks.localCodingFallback, false);
  assert.equal(freeRouter.hardLocks.localRuntime, false);
});

test("creative and DeepSeek adapters cannot silently replace DHP authority", async () => {
  const registry = await readJson(registryUrl);
  const creative = registry.integrations.find(({ id }) => id === "ip-as-logo-skill");
  const anchored = registry.integrations.find(({ id }) => id === "deepseek-dsh-anchored-standard");

  assert.ok(creative);
  assert.equal(creative.defaultState, "enabled-on-demand");
  assert.equal(creative.entrySkill, "MV-02:image-generation");
  assert.equal(creative.policy.projectBrandAuthorityWins, true);
  assert.equal(creative.policy.userRequestedOutputCountWins, true);
  assert.equal(creative.policy.candidateAssetsRequireAcceptance, true);
  assert.ok(creative.forbiddenPlacement.includes("automatic-dhp-logo-replacement"));

  assert.ok(anchored);
  assert.equal(anchored.defaultState, "conditional-disabled");
  assert.equal(anchored.policy.providerSelectedBeforePreset, true);
  assert.equal(anchored.policy.freeModelRouterStillAuthoritative, true);
  assert.equal(anchored.policy.mandatoryProjectAndUmsAuthorityMustRemainResident, true);
  assert.equal(anchored.policy.benchmarkClaimsAreNotAcceptanceEvidence, true);
  assert.ok(anchored.forbiddenPlacement.includes("public-ai-consultant-runtime"));
});

test("project documentation exposes the integration contract without secret material", async () => {
  const [contract, readme, registryText] = await Promise.all([
    readFile(contractUrl, "utf8"),
    readFile(readmeUrl, "utf8"),
    readFile(registryUrl, "utf8"),
  ]);

  assert.match(readme, /\.ai\/EXTERNAL_AI_INTEGRATIONS\.json/);
  assert.match(readme, /docs\/EXTERNAL_AI_RUNTIME_INTEGRATIONS\.md/);
  assert.match(contract, /OpenViking/);
  assert.match(contract, /Needle 2/);
  assert.match(contract, /ip-as-logo/);
  assert.match(contract, /Anchored Standard/);
  assert.match(contract, /Website\s*= business brain \+ system of record/);

  const lower = registryText.toLowerCase();
  assert.doesNotMatch(lower, /access_token|api_secret|service_role|private_key/);
});
