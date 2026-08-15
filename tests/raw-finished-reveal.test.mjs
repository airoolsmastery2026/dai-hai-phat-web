import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const clientPath = new URL(
  "../src/components/ai/RawFinishedRevealStudio.tsx",
  import.meta.url,
);
const protectedClientPath = new URL(
  "../src/components/ai/ProtectedConceptStudio.tsx",
  import.meta.url,
);
const routePath = new URL(
  "../src/app/api/ai/raw-finished/route.ts",
  import.meta.url,
);
const crossfadePath = new URL(
  "../src/lib/media/crossfade.ts",
  import.meta.url,
);

test("raw-finished studio stays behind the existing readiness gate", async () => {
  const source = await readFile(protectedClientPath, "utf8");

  assert.match(source, /ConceptReadinessGate/);
  assert.match(source, /RawFinishedRevealStudio/);
  assert.match(
    source,
    /<ConceptReadinessGate>[\s\S]*<RawFinishedRevealStudio enabled=\{enabled\}/,
  );
});

test("raw-finished generation keeps provider credentials server-side", async () => {
  const [client, route] = await Promise.all([
    readFile(clientPath, "utf8"),
    readFile(routePath, "utf8"),
  ]);

  assert.match(client, /fetch\("\/api\/ai\/raw-finished"/);
  assert.match(route, /process\.env\.GEMINI_API_KEY/);
  assert.match(route, /isSameOriginRequest/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /MAX_IMAGE_BYTES/);
  assert.match(route, /UPSTREAM_TIMEOUT_MS/);
  assert.match(route, /AI_CONCEPT_MODEL/);
  assert.doesNotMatch(client, /localStorage/);
  assert.doesNotMatch(client, /gemini_api_key|kling_access_key|kling_secret_key/i);
  assert.doesNotMatch(client, /formData\.set\(["']api[_-]?key/i);
  assert.doesNotMatch(client, /NEXT_PUBLIC_(?:GEMINI|KLING)/i);
  assert.doesNotMatch(route, /NEXT_PUBLIC_GEMINI/);
});

test("raw-finished module provides zero-provider crossfade fallback", async () => {
  const [client, crossfade] = await Promise.all([
    readFile(clientPath, "utf8"),
    readFile(crossfadePath, "utf8"),
  ]);

  assert.match(client, /buildCrossfadeVideo/);
  assert.match(client, /Tạo Crossfade miễn phí/);
  assert.match(crossfade, /MediaRecorder/);
  assert.match(crossfade, /canvas\.captureStream\(30\)/);
  assert.doesNotMatch(crossfade, /fetch\(/);
});
