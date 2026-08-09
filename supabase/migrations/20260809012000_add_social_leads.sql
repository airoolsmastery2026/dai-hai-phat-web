create table public.social_leads (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null
    check (event_type = 'social.lead.created'),
  occurred_at timestamptz not null,
  source_service text not null
    check (source_service = 'publishing-bot'),
  platform text not null,
  external_lead_id text not null,
  publication_id text,
  source_content_id text,
  customer_display_name text not null,
  platform_user_id text not null,
  message text not null,
  consent_context text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_lead_id)
);

create index social_leads_status_created_idx
  on public.social_leads (status, created_at desc);

create index social_leads_source_content_idx
  on public.social_leads (source_content_id, created_at desc)
  where source_content_id is not null;

alter table public.social_leads enable row level security;

comment on table public.social_leads is
  'Canonical social lead intake records received from signed ecosystem webhooks.';
