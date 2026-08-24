import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const profileUrl = new URL("../.ai/ums/project-profile.json", import.meta.url);
const publishingClientUrl = new URL("../src/lib/integrations/publishing-bot-client.ts", import.meta.url);

async function loadProfile() {
  return JSON.parse(await readFile(profileUrl, "utf8"));
}

test("DHP UMS pilot is preview-first and approval-gated", async () => {
  const profile = await loadProfile();
  assert.equal(profile.schemaVersion, "1.0");
  assert.equal(profile.id, "dai-hai-phat-ai-os");
  assert.equal(profile.priority, "P0");
  assert.equal(profile.riskPolicy.defaultMode, "preview");
  assert.deepEqual(
    profile.riskPolicy.requireApprovalFor,
    ["external_write", "destructive"],
  );
  assert.equal(profile.pilot.allowExternalWrites, false);
  assert.equal(profile.pilot.defaultTask.mode, "preview");
});

test("DHP profile advertises only commands implemented by the Publishing Bot client", async () => {
  const profile = await loadProfile();
  const clientSource = await readFile(publishingClientUrl, "utf8");
  const publishingCapabilities = profile.capabilities.filter((capability) => (
    capability.startsWith("publishing.")
  ));

  for (const capability of publishingCapabilities) {
    assert.match(clientSource, new RegExp(`["]${capability.replaceAll(".", "\\.")}["]`));
  }
  assert.deepEqual(profile.adapters, ["dhp-publishing"]);
});

test("DHP profile denies unsafe shortcuts and contains no secret material", async () => {
  const profile = await loadProfile();
  assert.ok(profile.riskPolicy.deniedCapabilities.includes("publishing.database.write"));
  assert.ok(profile.riskPolicy.deniedCapabilities.includes("publishing.direct.publish"));
  assert.ok(profile.riskPolicy.deniedCapabilities.includes("publishing.job.delete"));

  const serialized = JSON.stringify(profile).toLowerCase();
  assert.doesNotMatch(serialized, /access_token|api_secret|service_role|private_key/);
});
