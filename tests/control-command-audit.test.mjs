import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const routeSource = await readFile(
  "src/app/api/v1/audit/control-commands/route.ts",
  "utf8",
).catch(() => "");
const auditSource = await readFile(
  "src/lib/server/control-command-audit.ts",
  "utf8",
).catch(() => "");
const migrationSource = await readFile(
  "supabase/migrations/20260809014000_add_control_command_audit.sql",
  "utf8",
).catch(() => "");
const contractsSource = await readFile(
  "docs/ECOSYSTEM_API_CONTRACTS.md",
  "utf8",
);

test("control command audit endpoint is Telegram-only and idempotent", () => {
  assert.match(routeSource, /authenticateService/);
  assert.match(routeSource, /\["telegram-control"\]/);
  assert.match(routeSource, /Idempotency-Key/i);
  assert.match(routeSource, /idempotencyKey !== event\.commandId/);
  assert.match(routeSource, /parseControlCommandAuditEvent/);
  assert.match(routeSource, /recordControlCommandAuditEvent/);
  assert.match(routeSource, /private, no-store/);
});

test("audit event parser bounds operator data and stable status values", () => {
  assert.match(auditSource, /control\.command\.executed/);
  assert.match(auditSource, /owner.*admin.*operator.*viewer/s);
  assert.match(auditSource, /accepted.*completed.*failed.*rejected/s);
  assert.match(auditSource, /commandId/);
  assert.match(auditSource, /operatorId/);
  assert.match(auditSource, /targetService/);
});

test("audit migration owns immutable command identity and replay protection", () => {
  assert.match(migrationSource, /create table public\.control_command_audit/i);
  assert.match(migrationSource, /command_id text not null unique/i);
  assert.match(migrationSource, /operator_role text not null/i);
  assert.match(migrationSource, /status text not null/i);
  assert.match(migrationSource, /enable row level security/i);
});

test("ecosystem contract documents the Website audit write endpoint", () => {
  assert.match(contractsSource, /POST \/api\/v1\/audit\/control-commands/);
});
