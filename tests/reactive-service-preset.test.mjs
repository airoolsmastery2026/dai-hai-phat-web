import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps reactive service presets connected to the public AI intake", async () => {
  const routeEntry = await readFile(
    "src/components/sections/AIOfficeRouteEntry.tsx",
    "utf8",
  );
  const presetHook = await readFile("src/hooks/useAIServicePreset.ts", "utf8");
  const experience = await readFile(
    "src/components/sections/AIOfficeExperience.tsx",
    "utf8",
  );
  const loadingState = await readFile(
    "src/components/sections/AIOfficeLoadingState.tsx",
    "utf8",
  );
  const homepage = await readFile("src/app/page.tsx", "utf8");

  assert.match(presetHook, /useSearchParams/);
  assert.match(presetHook, /searchParams\.get\("service"\)/);
  assert.match(presetHook, /getAIService/);
  assert.match(routeEntry, /const servicePreset = useAIServicePreset\(\)/);
  assert.match(routeEntry, /<AIOfficeExperience/);
  assert.match(routeEntry, /servicePreset=\{servicePreset\}/);
  assert.match(experience, /const sessionKey = getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(experience, /key=\{sessionKey\}/);
  assert.doesNotMatch(routeEntry, /window\.location|useSyncExternalStore/);

  assert.match(homepage, /import \{ Suspense \} from "react"/);
  assert.match(homepage, /AIOfficeLoadingState/);
  assert.match(homepage, /AIOfficeRouteEntry/);
  assert.match(loadingState, /id="ai-office"/);
  assert.doesNotMatch(homepage, /force-dynamic|connection\(/);
});
