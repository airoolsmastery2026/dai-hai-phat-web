import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260818140000_workspace_document_ingestion_v1.sql",
  import.meta.url,
);
const servicePath = new URL("../src/lib/server/workspace-documents.ts", import.meta.url);
const routePath = new URL(
  "../src/app/api/admin/workspace/documents/route.ts",
  import.meta.url,
);
const pagePath = new URL(
  "../src/app/admin/workspace/documents/page.tsx",
  import.meta.url,
);
const componentPath = new URL(
  "../src/components/admin/DhpWorkspaceDocumentInbox.tsx",
  import.meta.url,
);
const supabaseRestPath = new URL("../src/lib/server/supabase-rest.ts", import.meta.url);

test("workspace document storage is private and separated from official DHP knowledge", async () => {
  const [migration, service, route, component, supabaseRest] = await Promise.all([
    readFile(migrationPath, "utf8"),
    readFile(servicePath, "utf8"),
    readFile(routePath, "utf8"),
    readFile(componentPath, "utf8"),
    readFile(supabaseRestPath, "utf8"),
  ]);

  assert.match(migration, /create table if not exists public\.dhp_workspace_documents/i);
  assert.match(migration, /alter table public\.dhp_workspace_documents enable row level security/i);
  assert.match(migration, /revoke all on table public\.dhp_workspace_documents from anon, authenticated/i);
  assert.match(migration, /'dhp-workspace-documents'/);
  assert.match(migration, /public\s*,[\s\n]*file_size_limit/);
  assert.match(migration, /false,[\s\n]*4194304/);
  assert.match(migration, /promoted_to_knowledge boolean not null default false/i);

  assert.match(service, /WORKSPACE_BUCKET = "dhp-workspace-documents"/);
  assert.match(service, /createHash\("sha256"\)/);
  assert.match(service, /findDocumentByHash/);
  assert.match(service, /pending_extraction/);
  assert.match(service, /TEXT_EXTENSIONS/);
  assert.match(service, /deleteStorageObject/);
  assert.match(service, /storage\/v1\/object/);
  assert.match(supabaseRest, /"dhp_workspace_documents"/);

  assert.match(route, /isSameOriginRequest/);
  assert.match(route, /multipart\/form-data/);
  assert.match(route, /ingestWorkspaceDocument/);
  assert.match(component, /workspace material, chưa phải DHP Knowledge/);
  assert.doesNotMatch(component, /SUPABASE_SERVICE_ROLE_KEY|DHP_LLM_API_KEY|OPENROUTER_API_KEY/);
});

test("document inbox accepts bounded text and binary formats without pretending extraction", async () => {
  const [service, component] = await Promise.all([
    readFile(servicePath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  for (const extension of ["txt", "md", "csv", "json", "pdf", "xls", "xlsx", "jpg", "jpeg", "png", "webp"]) {
    assert.match(service, new RegExp(`${extension}:`));
  }
  assert.match(service, /MAX_BINARY_BYTES = 4 \* 1024 \* 1024/);
  assert.match(service, /MAX_TEXT_BYTES = 512 \* 1024/);
  assert.match(component, /PDF\/XLS\/XLSX\/JPG\/PNG\/WEBP tối đa 4 MB được lưu raw và đánh dấu chờ extractor/);
  assert.match(component, /TXT\/MD\/CSV\/JSON tối đa 512 KB được trích text trực tiếp/);
});

test("document inbox stays under protected workspace admin namespace", async () => {
  const [page, route, component] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(routePath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /DhpWorkspaceDocumentInbox/);
  assert.match(component, /href="\/admin\/workspace"/);
  assert.match(component, /\/api\/admin\/workspace\/documents/);
  assert.match(route, /cache-control/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_/);
});
