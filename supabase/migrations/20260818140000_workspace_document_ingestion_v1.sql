create table if not exists public.dhp_workspace_documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null check (char_length(filename) between 1 and 180),
  mime_type text not null check (char_length(mime_type) between 1 and 160),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 4194304),
  sha256 text not null unique check (sha256 ~ '^[0-9a-f]{64}$'),
  storage_bucket text not null default 'dhp-workspace-documents',
  storage_path text not null unique,
  source text not null default 'admin-workspace-upload',
  extraction_status text not null check (extraction_status in ('extracted', 'pending_extraction', 'failed')),
  extracted_text text,
  extraction_error text,
  promoted_to_knowledge boolean not null default false,
  promoted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dhp_workspace_documents_promotion_consistency check (
    (promoted_to_knowledge = false and promoted_at is null)
    or (promoted_to_knowledge = true and promoted_at is not null)
  )
);

create index if not exists dhp_workspace_documents_created_at_idx
  on public.dhp_workspace_documents (created_at desc);

create index if not exists dhp_workspace_documents_extraction_status_idx
  on public.dhp_workspace_documents (extraction_status, created_at desc);

alter table public.dhp_workspace_documents enable row level security;
revoke all on table public.dhp_workspace_documents from anon, authenticated;
grant all on table public.dhp_workspace_documents to service_role;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'dhp-workspace-documents',
  'dhp-workspace-documents',
  false,
  4194304,
  array[
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
