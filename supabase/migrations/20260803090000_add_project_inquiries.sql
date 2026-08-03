create table public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  request_id text not null unique,
  full_name text not null,
  phone text not null,
  zalo_contact text,
  project_area text not null,
  service text not null,
  dimensions text not null,
  budget text,
  timeline text,
  purpose text not null
    check (purpose in ('build', 'renovate', 'reference')),
  description text not null,
  has_site_image boolean not null default false,
  has_reference_image boolean not null default false,
  readiness_score integer not null check (readiness_score between 0 and 100),
  readiness_decision text not null
    check (readiness_decision in ('needs_information', 'requires_review', 'ready')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed')),
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_inquiries_status_created_idx
  on public.project_inquiries (status, created_at desc);

create index project_inquiries_phone_created_idx
  on public.project_inquiries (phone, created_at desc);

alter table public.project_inquiries enable row level security;

comment on table public.project_inquiries is
  'Minimal project intake records submitted by customers for Đại Hải Phát staff handoff.';
