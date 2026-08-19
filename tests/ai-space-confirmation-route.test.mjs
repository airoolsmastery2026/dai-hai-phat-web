import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routePath = new URL(
  "../src/app/api/ai/space/confirm/route.ts",
  import.meta.url,
);
const keyPath = new URL(
  "../src/lib/server/space-confirmation-key.ts",
  import.meta.url,
);

test("G4 confirmation route is bounded, same-origin, rate limited and JSON-only", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /consumeRateLimit/);
  assert.match(source, /BODY_LIMIT_BYTES\s*=\s*256 \* 1024/);
  assert.match(source, /application\/json/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.match(source, /Retry-After/);
  assert.match(source, /G4_GEOMETRY_CONFIRMATION/);
});

test("G4 uses one shared domain-separated server seal-key helper", async () => {
  const [route, keySource] = await Promise.all([
    readFile(routePath, "utf8"),
    readFile(keyPath, "utf8"),
  ]);

  assert.match(route, /getSpaceConfirmationSealKey/);
  assert.match(route, /confirmSpaceCandidateAtBoundary\(payload, sealKey\)/);
  assert.match(route, /space-confirmation-key/);
  assert.doesNotMatch(route, /DHP_SPACE_CONFIRMATION_SECRET|DHP_CONTROL_PLANE_SECRET/);

  assert.match(keySource, /DHP_SPACE_CONFIRMATION_SECRET/);
  assert.match(keySource, /DHP_CONTROL_PLANE_SECRET/);
  assert.match(keySource, /SPACE_CONFIRMATION_KEY_DOMAIN = "dhp-space-confirmation-v1"/);
  assert.match(
    keySource,
    /sha256Hex\(`\$\{SPACE_CONFIRMATION_KEY_DOMAIN\}\\u0000\$\{trustRoot\}`\)/,
  );
  assert.match(keySource, /trustRoot\.length < MIN_TRUST_ROOT_CHARS/);
  assert.doesNotMatch(
    keySource,
    /NEXT_PUBLIC_(?:DHP_SPACE_CONFIRMATION_SECRET|DHP_CONTROL_PLANE_SECRET)/,
  );
  assert.doesNotMatch(
    route + keySource,
    /console\.(?:info|warn|error)[\s\S]{0,200}(?:sealKey|trustRoot|DHP_CONTROL_PLANE_SECRET)/,
  );
});

test("G4 confirmation remains deterministic/provider-free and non-persistent", async () => {
  const source = await readFile(routePath, "utf8");

  assert.doesNotMatch(
    source,
    /model-runtime|openrouter|gemini|GEMINI_API_KEY|OPENROUTER_API_KEY/i,
  );
  assert.doesNotMatch(
    source,
    /supabase\.from|insert\(|update\(|upload\(|writeFile|putObject/i,
  );
  assert.doesNotMatch(source, /fetch\(/);
});
