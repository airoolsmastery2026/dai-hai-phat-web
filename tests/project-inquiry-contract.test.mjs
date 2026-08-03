import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260803090000_add_project_inquiries.sql",
  import.meta.url,
);
const routePath = new URL(
  "../src/app/api/project-inquiries/route.ts",
  import.meta.url,
);
const gatePath = new URL(
  "../src/components/ai/ConceptReadinessGate.tsx",
  import.meta.url,
);
const adapterPath = new URL(
  "../src/lib/server/supabase-rest.ts",
  import.meta.url,
);

test("project inquiry schema stays minimal and consent-aware", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table public\.project_inquiries/);
  assert.match(sql, /request_id text not null unique/);
  assert.match(sql, /consented_at timestamptz not null/);
  assert.match(sql, /readiness_score integer not null/);
  assert.match(sql, /enable row level security/);
  assert.doesNotMatch(sql, /payment|invoice|contract|erp/);
});

test("project inquiry API validates, rate limits, persists and optionally notifies", async () => {
  const route = await readFile(routePath, "utf8");
  const adapter = await readFile(adapterPath, "utf8");

  assert.match(route, /isSameOriginRequest/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /evaluateConceptReadiness/);
  assert.match(route, /supabaseRestRequest\("project_inquiries"/);
  assert.match(route, /TELEGRAM_BOT_TOKEN/);
  assert.match(route, /AbortSignal\.timeout/);
  assert.match(adapter, /"project_inquiries"/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
});

test("concept readiness gate saves the project before granting access", async () => {
  const gate = await readFile(gatePath, "utf8");

  assert.match(gate, /fetch\("\/api\/project-inquiries"/);
  assert.match(gate, /requestId/);
  assert.match(gate, /Lưu và kiểm tra hồ sơ/);
  assert.match(gate, /setUnlocked\(result\.decision === "ready"\)/);
});
