import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("root layout declares the mobile viewport and safe-area behavior", async () => {
  const source = await readFile(
    new URL("../src/app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /width: "device-width"/);
  assert.match(source, /initialScale: 1/);
  assert.match(source, /viewportFit: "cover"/);
});
