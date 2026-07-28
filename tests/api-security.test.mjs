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

test("validates request origin and resolves the proxy client address", () => {
  const headers = new Headers({
    origin: "https://daihaiphat.vn",
    "x-forwarded-for": "203.0.113.10, 203.0.113.20",
  });

  assert.equal(
    security.isSameOriginRequest(headers, "daihaiphat.vn"),
    true,
  );
  assert.equal(
    security.isSameOriginRequest(headers, "example.com"),
    false,
  );
  assert.equal(security.getRequestClientKey(headers), "203.0.113.10");
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
  assert.equal(
    security.consumeRateLimit("test-gallery", "client", policy, 300).allowed,
    false,
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
