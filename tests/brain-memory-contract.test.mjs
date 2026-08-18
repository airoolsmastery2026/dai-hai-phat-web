import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const memoryPath = new URL("../src/lib/server/brain-memory.ts", import.meta.url);
const inquiryPath = new URL("../src/lib/server/project-inquiries.ts", import.meta.url);
const migrationPath = new URL(
  "../supabase/migrations/20260818093000_ai_brain_memory.sql",
  import.meta.url,
);

test("brain memory is content-addressed and reuses unchanged facts", async () => {
  const memory = await readFile(memoryPath, "utf8");

  assert.match(memory, /createHash\("sha256"\)/);
  assert.match(memory, /current\?\.contentHash === contentHash/);
  assert.match(memory, /return "HIT"/);
  assert.match(memory, /on_conflict: "namespace,source_key"/);
});

test("project brain facts do not duplicate customer contact identity", async () => {
  const inquiry = await readFile(inquiryPath, "utf8");
  const helperStart = inquiry.indexOf("async function rememberProjectFacts");
  const helperEnd = inquiry.indexOf("export async function persistProjectInquiry", helperStart);
  const helper = inquiry.slice(helperStart, helperEnd);

  assert.match(helper, /namespace: "project-intake"/);
  assert.match(helper, /service: lead\.project\.service/);
  assert.doesNotMatch(helper, /lead\.contact\.(name|phone|zalo|email|surveyAddress)/);
});

test("brain table is server-only and unavailable to browser roles", async () => {
  const migration = await readFile(migrationPath, "utf8");

  assert.match(migration, /enable row level security/i);
  assert.match(migration, /revoke all on table public\.ai_memory_objects from anon, authenticated/i);
  assert.match(migration, /content_hash/);
});
