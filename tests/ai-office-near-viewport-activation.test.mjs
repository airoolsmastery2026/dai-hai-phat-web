import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hookPath = new URL("../src/hooks/useAIOfficeActivation.ts", import.meta.url);
const routePath = new URL(
  "../src/components/sections/AIOfficeRouteEntry.tsx",
  import.meta.url,
);

test("AI Office activates near the viewport and from direct anchors", async () => {
  const hook = await readFile(hookPath, "utf8");

  assert.match(hook, /IntersectionObserver/);
  assert.match(hook, /800px 0px/);
  assert.match(hook, /#ai-office/);
  assert.match(hook, /hashchange/);
  assert.match(hook, /observer\.disconnect\(\)/);
  assert.match(hook, /!\("IntersectionObserver" in window\)/);

  assert.doesNotMatch(hook, /localStorage|sessionStorage|FormData|fetch\(/);
});

test("route entry does not render the deferred feature before activation", async () => {
  const route = await readFile(routePath, "utf8");

  assert.match(route, /useAIOfficeActivation/);
  assert.match(route, /ref=\{activationRef\}/);
  assert.match(route, /isActive \? \(/);
  assert.match(route, /<AIOfficeLoadingState \/>/);
  assert.match(route, /dynamic\(/);
  assert.doesNotMatch(route, /ssr:\s*false/);
});
