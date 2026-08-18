import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/server/api-security.ts", import.meta.url),
  "utf8",
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const security = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

test("validates same-origin requests and rejects cross-site or malformed origins", () => {
  assert.equal(
    security.isSameOriginRequest(
      new Headers({ origin: "https://daihaiphat.vn" }),
      "daihaiphat.vn",
    ),
    true,
  );
  assert.equal(
    security.isSameOriginRequest(
      new Headers({ origin: "https://daihaiphat.vn:8443" }),
      "daihaiphat.vn",
    ),
    false,
  );
  assert.equal(
    security.isSameOriginRequest(
      new Headers({ origin: "https://example.com" }),
      "daihaiphat.vn",
    ),
    false,
  );
  assert.equal(
    security.isSameOriginRequest(
      new Headers({ origin: "not a url" }),
      "daihaiphat.vn",
    ),
    false,
  );
  assert.equal(
    security.isSameOriginRequest(
      new Headers({ "sec-fetch-site": "cross-site" }),
      "daihaiphat.vn",
    ),
    false,
  );
  assert.equal(
    security.isSameOriginRequest(new Headers(), "daihaiphat.vn"),
    true,
  );
});

test("resolves the proxy client address with deterministic fallbacks", () => {
  assert.equal(
    security.getRequestClientKey(
      new Headers({
        "x-real-ip": "198.51.100.8",
        "x-forwarded-for": "203.0.113.10, 203.0.113.20",
      }),
    ),
    "198.51.100.8",
  );
  assert.equal(
    security.getRequestClientKey(
      new Headers({ "x-forwarded-for": " 203.0.113.10, 203.0.113.20" }),
    ),
    "203.0.113.10",
  );
  assert.equal(security.getRequestClientKey(new Headers()), "anonymous");
});

test("isolates API rate limits by scope and resets after the window", () => {
  const policy = { maxRequests: 2, windowMs: 1_000 };

  assert.equal(
    security.consumeRateLimit("test-gallery", "client", policy, 100).allowed,
    true,
  );
  assert.equal(
    security.consumeRateLimit("test-gallery", "client", policy, 200).allowed,
    true,
  );
  assert.deepEqual(
    security.consumeRateLimit("test-gallery", "client", policy, 300),
    { allowed: false, retryAfterSeconds: 1 },
  );
  assert.equal(
    security.consumeRateLimit("test-proposal", "client", policy, 300).allowed,
    true,
  );
  assert.equal(
    security.consumeRateLimit("test-gallery", "client", policy, 1_101).allowed,
    true,
  );
});

test("rounds retry timing up and never returns less than one second", () => {
  const policy = { maxRequests: 1, windowMs: 2_500 };

  assert.equal(
    security.consumeRateLimit("test-retry", "client", policy, 10_000).allowed,
    true,
  );
  assert.deepEqual(
    security.consumeRateLimit("test-retry", "client", policy, 10_001),
    { allowed: false, retryAfterSeconds: 3 },
  );
  assert.deepEqual(
    security.consumeRateLimit("test-retry", "client", policy, 12_499),
    { allowed: false, retryAfterSeconds: 1 },
  );
});
