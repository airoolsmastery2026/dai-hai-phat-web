import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const memoryPath = new URL("../src/lib/server/sales-engineer-memory.ts", import.meta.url);
const routerPath = new URL(
  "../src/lib/server/sales-engineer-cloud-router.ts",
  import.meta.url,
);

test("sales engineer exact-response cache uses SHA-256 and returns HIT before model execution", async () => {
  const [memory, router] = await Promise.all([
    readFile(memoryPath, "utf8"),
    readFile(routerPath, "utf8"),
  ]);

  assert.match(memory, /createHash\("sha256"\)/);
  assert.match(memory, /kind: MEMORY_KIND/);
  assert.match(memory, /ai_analysis_memory/);
  assert.match(router, /if \(memory\.agent\)/);
  assert.match(router, /cache: "HIT"/);
  assert.match(router, /runSalesEngineerWithModelRuntimeCapability/);
});

test("sales engineer fingerprint excludes direct customer contact identity", async () => {
  const memory = await readFile(memoryPath, "utf8");
  const start = memory.indexOf("function technicalMemory");
  const end = memory.indexOf("function canonicalPayload", start);
  const technicalSection = memory.slice(start, end);

  assert.match(technicalSection, /service: memory\.service/);
  assert.match(technicalSection, /dimensions: memory\.dimensions/);
  assert.doesNotMatch(technicalSection, /memory\.(name|phone|email|zalo|surveyAddress)/);
});
