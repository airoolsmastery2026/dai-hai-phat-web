import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const nextConfig = await readFile(
  new URL("../next.config.js", import.meta.url),
  "utf8",
);

test("redirects the legacy Unicode interior URL to an ASCII-safe route", () => {
  assert.match(
    nextConfig,
    /source: "\/services\/noi-that-gỗ-mdf-melamine"/,
  );
  assert.match(
    nextConfig,
    /destination: "\/services\/noi-that-go-mdf-melamine"/,
  );
  assert.match(nextConfig, /permanent: true/);
});

test("keeps the ASCII route connected to the existing service record", () => {
  assert.match(nextConfig, /async rewrites\(\)/);
  assert.match(
    nextConfig,
    /source: "\/services\/noi-that-go-mdf-melamine"/,
  );
  assert.match(
    nextConfig,
    /destination: "\/services\/noi-that-gỗ-mdf-melamine"/,
  );
});
