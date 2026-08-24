import assert from "node:assert/strict";
import test from "node:test";

import {
  DhpRuntimeHandshakeError,
  parseDhpRuntimeHandshake,
} from "../src/lib/server/dhp-runtime-handshake.ts";

const validHandshake = {
  nodeId: "dhp-pc-main",
  runtime: "goose-desktop",
  runtimeVersion: "1.47.0-dhp.1",
  transport: "acp-loopback",
  costMode: "absolute-zero",
  capabilities: ["acp", "mcp", "filesystem.read", "unknown.capability"],
  localProviders: ["ollama", "llama.cpp"],
};

test("accepts an absolute-zero Goose runtime and filters capabilities", () => {
  const result = parseDhpRuntimeHandshake(validHandshake);

  assert.equal(result.accepted, true);
  assert.equal(result.costMode, "absolute-zero");
  assert.deepEqual(result.capabilities, ["acp", "mcp", "filesystem.read"]);
  assert.deepEqual(result.localProviders, ["ollama", "llama.cpp"]);
});

test("rejects a runtime that is not absolute-zero", () => {
  assert.throws(
    () =>
      parseDhpRuntimeHandshake({
        ...validHandshake,
        costMode: "metered",
      }),
    (error) =>
      error instanceof DhpRuntimeHandshakeError &&
      error.code === "ZERO_DOLLAR_REQUIRED",
  );
});

test("rejects a runtime without a supported capability", () => {
  assert.throws(
    () =>
      parseDhpRuntimeHandshake({
        ...validHandshake,
        capabilities: ["unknown.capability"],
      }),
    (error) =>
      error instanceof DhpRuntimeHandshakeError &&
      error.code === "NO_SUPPORTED_CAPABILITY",
  );
});

test("rejects invalid node identifiers", () => {
  assert.throws(
    () =>
      parseDhpRuntimeHandshake({
        ...validHandshake,
        nodeId: "../../unsafe",
      }),
    (error) =>
      error instanceof DhpRuntimeHandshakeError && error.code === "INVALID_PAYLOAD",
  );
});
