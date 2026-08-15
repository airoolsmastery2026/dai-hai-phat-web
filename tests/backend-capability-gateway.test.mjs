import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const proxyPath = new URL(
  "../src/app/api/ai/control-plane/[...path]/route.ts",
  import.meta.url,
);
const capabilityGatewayPath = new URL(
  "../src/lib/server/capability-gateway.ts",
  import.meta.url,
);
const clientPath = new URL("../src/lib/dhp-control-plane.ts", import.meta.url);
const envPath = new URL("../.env.example", import.meta.url);

test("optional capabilities stay behind the single server-side Control Plane boundary", async () => {
  const [proxy, capabilityGateway, client, env] = await Promise.all([
    readFile(proxyPath, "utf8"),
    readFile(capabilityGatewayPath, "utf8"),
    readFile(clientPath, "utf8"),
    readFile(envPath, "utf8"),
  ]);

  assert.match(proxy, /capabilities/);
  assert.match(capabilityGateway, /requestControlPlane/);
  assert.match(capabilityGateway, /\/v1\/capabilities\//);
  assert.match(client, /DHP_CONTROL_PLANE_URL/);
  assert.match(client, /DHP_CONTROL_PLANE_SECRET/);
  assert.doesNotMatch(client, /NEXT_PUBLIC_DHP/);

  assert.doesNotMatch(
    env,
    /(?:NEXT_PUBLIC_)?(?:DIFY|OLLAMA|IMMICH|NOVU|TOOLJET|STRAPI|APPWRITE|PLAUSIBLE|OPENWORK)_/,
  );
  assert.doesNotMatch(
    capabilityGateway,
    /dify|ollama|immich|novu|tooljet|strapi|appwrite|plausible|openwork/i,
  );
});

test("capability IDs describe business capabilities instead of providers", async () => {
  const capabilityGateway = await readFile(capabilityGatewayPath, "utf8");

  for (const capability of [
    "agent-runtime",
    "workflow",
    "knowledge",
    "model-runtime",
    "media",
    "notifications",
    "analytics",
    "internal-tools",
    "content",
    "external-data",
  ]) {
    assert.match(capabilityGateway, new RegExp(`"${capability}"`));
  }

  assert.match(capabilityGateway, /SAFE_PATH_SEGMENT/);
  assert.match(capabilityGateway, /encodeURIComponent/);
});
