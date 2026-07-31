import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("reacts to service preset changes during client navigation", async () => {
  const routeEntry = await readFile(
    "src/components/sections/AIOfficeRouteEntry.tsx",
    "utf8",
  );
  const presetHook = await readFile("src/hooks/useAIServicePreset.ts", "utf8");
  const experience = await readFile(
    "src/components/sections/AIOfficeExperience.tsx",
    "utf8",
  );
  const homepage = await readFile("src/app/page.tsx", "utf8");

  assert.match(presetHook, /useSearchParams/);
  assert.match(presetHook, /searchParams\.get\("service"\)/);
  assert.match(presetHook, /getAIService/);
  assert.match(routeEntry, /const servicePreset = useAIServicePreset\(\)/);
  assert.match(routeEntry, /<AIOfficeExperience servicePreset=\{servicePreset\} \/>/);
  assert.match(experience, /const sessionKey = getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(experience, /key=\{sessionKey\}/);
  assert.doesNotMatch(routeEntry, /window\.location|useSyncExternalStore/);

  assert.match(homepage, /import \{ Suspense \} from "react"/);
  assert.match(homepage, /<Suspense fallback=\{<AIOfficeFallback \/>\}>/);
  assert.match(homepage, /<AIOfficeRouteEntry \/>/);
  assert.match(homepage, /id="ai-office"/);
  assert.doesNotMatch(homepage, /force-dynamic|connection\(/);
});
