import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260803015000_add_minimal_identity_and_concept_quota.sql",
  import.meta.url,
);

test("minimal identity and quota migration stays narrow and protected", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table public\.customer_profiles/);
  assert.match(sql, /create table public\.concept_quota_ledger/);
  assert.match(sql, /references auth\.users\(id\) on delete cascade/);
  assert.match(sql, /request_id text not null unique/);
  assert.match(sql, /generation_kind in \('single_view', 'four_view'\)/);
  assert.match(sql, /status in \('reserved', 'completed', 'released'\)/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /using \(\(select auth\.uid\(\)\) = user_id\)/);

  assert.doesNotMatch(sql, /create table public\.customers\b/);
  assert.doesNotMatch(sql, /create table public\.leads\b/);
  assert.doesNotMatch(sql, /create table public\.quotations\b/);
  assert.doesNotMatch(sql, /service_role/);
  assert.doesNotMatch(sql, /grant all/);
});
