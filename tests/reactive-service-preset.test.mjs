import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("reacts to service preset changes during client navigation", async () => {
  const routeEntry = await readFile(
    new URL(
      "../src/components/sections/AIOfficeRouteEntry.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const homepage = await readFile(
    new URL("../src/app/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(routeEntry, /useSearchParams/);
  assert.match(routeEntry, /searchParams\.get\("service"\)/);
  assert.match(routeEntry, /key=\{servicePreset \?\? "no-service-preset"\}/);
  assert.doesNotMatch(routeEntry, /window\.location|useSyncExternalStore/);

  assert.match(homepage, /import \{ Suspense \} from "react"/);
  assert.match(homepage, /<Suspense fallback=\{<AIOfficeFallback \/>\}>/);
  assert.match(homepage, /<AIOfficeRouteEntry \/>/);
  assert.match(homepage, /id="ai-office"/);
  assert.doesNotMatch(homepage, /force-dynamic|connection\(/);
});
