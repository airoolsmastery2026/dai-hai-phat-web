import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("protects client handoff state across slow requests and session resets", async () => {
  const hook = await readFile(
    new URL("../src/hooks/useAI.ts", import.meta.url),
    "utf8",
  );

  assert.match(hook, /useRef/);
  assert.match(hook, /const HANDOFF_TIMEOUT_MS = 20_000/);
  assert.match(hook, /if \(handoffControllerRef\.current\) return/);
  assert.match(hook, /signal: controller\.signal/);
  assert.match(hook, /caughtError\.name === "AbortError"/);
  assert.match(hook, /readClientSession\(\)\.id !== sessionId/);
  assert.match(hook, /handoffControllerRef\.current\?\.abort\(\)/);
  assert.match(hook, /setHandoff\(null\)/);
  assert.match(hook, /setHandoffError\(null\)/);
  assert.match(hook, /setHandoffStatus\("idle"\)/);
});
