create table if not exists public.ai_memory_objects (
  namespace text not null,
  source_key text not null,
  kind text not null,
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  facts jsonb not null,
  source_version text not null default '1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (namespace, source_key)
);

create index if not exists ai_memory_objects_hash_idx
  on public.ai_memory_objects (content_hash);

create index if not exists ai_memory_objects_kind_updated_idx
  on public.ai_memory_objects (kind, updated_at desc);

alter table public.ai_memory_objects enable row level security;
revoke all on table public.ai_memory_objects from anon, authenticated;

comment on table public.ai_memory_objects is
  'Server-only content-addressed AI brain facts. PII remains in domain tables; unchanged sources are reused by hash.';
