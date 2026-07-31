import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("applies safe global response headers while allowing first-party voice input", async () => {
  const nextConfig = await readFile(
    new URL("../next.config.js", import.meta.url),
    "utf8",
  );

  assert.match(nextConfig, /async headers\(\)/);
  assert.match(nextConfig, /source: "\/:path\*"/);
  assert.match(nextConfig, /key: "X-Content-Type-Options"[\s\S]*value: "nosniff"/);
  assert.match(nextConfig, /key: "X-Frame-Options"[\s\S]*value: "SAMEORIGIN"/);
  assert.match(
    nextConfig,
    /key: "Referrer-Policy"[\s\S]*value: "strict-origin-when-cross-origin"/,
  );
  assert.match(nextConfig, /key: "Permissions-Policy"/);
  assert.match(nextConfig, /microphone=\(self\)/);
  assert.match(nextConfig, /geolocation=\(\)/);
  assert.match(nextConfig, /browsing-topics=\(\)/);
  assert.doesNotMatch(nextConfig, /camera=\(\)/);
  assert.doesNotMatch(nextConfig, /Content-Security-Policy/);
});
