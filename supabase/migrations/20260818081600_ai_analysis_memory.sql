create table if not exists public.ai_analysis_memory (
  fingerprint text primary key,
  kind text not null,
  prompt_version text not null,
  schema_version text not null,
  response jsonb not null,
  provider text not null,
  model text not null,
  created_at timestamptz not null default now(),
  last_hit_at timestamptz not null default now()
);

create index if not exists ai_analysis_memory_kind_version_idx
  on public.ai_analysis_memory (kind, prompt_version, schema_version);

alter table public.ai_analysis_memory enable row level security;

revoke all on table public.ai_analysis_memory from anon, authenticated;
comment on table public.ai_analysis_memory is
  'Server-only cache for deterministic DHP AI analyses; keyed by SHA-256 fingerprint to avoid repeated model quota use.';
