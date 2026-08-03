create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  zalo_contact text,
  contact_verified boolean not null default false,
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended')),
  quota_override_units integer
    check (quota_override_units is null or quota_override_units >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.concept_quota_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id text not null unique,
  generation_kind text not null
    check (generation_kind in ('single_view', 'four_view')),
  units integer not null check (units > 0),
  status text not null
    check (status in ('reserved', 'completed', 'released')),
  period_started_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index concept_quota_ledger_user_period_idx
  on public.concept_quota_ledger (user_id, period_started_at desc);

create index concept_quota_ledger_user_status_idx
  on public.concept_quota_ledger (user_id, status);

alter table public.customer_profiles enable row level security;
alter table public.concept_quota_ledger enable row level security;

create policy customer_profiles_select_own
  on public.customer_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy concept_quota_ledger_select_own
  on public.concept_quota_ledger
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

comment on table public.customer_profiles is
  'Minimal customer identity and account controls for Đại Hải Phát.';

comment on table public.concept_quota_ledger is
  'Server-written, idempotent quota reservations and settlements for concept generation.';
