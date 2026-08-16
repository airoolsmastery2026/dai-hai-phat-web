import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps reactive service presets connected to the public consultation flow", async () => {
  const routeEntry = await readFile(
    "src/components/sections/AIOfficeRouteEntry.tsx",
    "utf8",
  );
  const loadingState = await readFile(
    "src/components/sections/AIOfficeLoadingState.tsx",
    "utf8",
  );
  const presetHook = await readFile("src/hooks/useAIServicePreset.ts", "utf8");
  const experience = await readFile(
    "src/components/sections/AIOfficeExperience.tsx",
    "utf8",
  );
  const consultationPage = await readFile("src/app/ai-tu-van/page.tsx", "utf8");

  assert.match(presetHook, /useSearchParams/);
  assert.match(presetHook, /searchParams\.get\("service"\)/);
  assert.match(presetHook, /getAIService/);
  assert.match(routeEntry, /const servicePreset = useAIServicePreset\(\)/);
  assert.match(routeEntry, /<AIOfficeExperience/);
  assert.match(routeEntry, /servicePreset=\{servicePreset\}/);
  assert.match(routeEntry, /AIOfficeLoadingState/);
  assert.match(experience, /const sessionKey = getAIOfficeSessionKey\(servicePreset\)/);
  assert.match(experience, /key=\{sessionKey\}/);
  assert.doesNotMatch(routeEntry, /window\.location|useSyncExternalStore/);

  assert.match(consultationPage, /import \{ Suspense \} from "react"/);
  assert.match(consultationPage, /AIOfficeLoadingState/);
  assert.match(consultationPage, /AIOfficeRouteEntry/);
  assert.match(loadingState, /id="ai-office"/);
  assert.doesNotMatch(consultationPage, /force-dynamic|connection\(/);
});
