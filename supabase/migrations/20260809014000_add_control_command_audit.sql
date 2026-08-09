create table public.control_command_audit (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    check (event_type = 'control.command.executed'),
  command_id text not null unique,
  operator_id text not null,
  operator_role text not null
    check (operator_role in ('owner', 'admin', 'operator', 'viewer')),
  target_service text not null,
  command text not null,
  status text not null
    check (status in ('accepted', 'completed', 'failed', 'rejected')),
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index control_command_audit_operator_created_idx
  on public.control_command_audit (operator_id, created_at desc);

create index control_command_audit_command_created_idx
  on public.control_command_audit (command, created_at desc);

alter table public.control_command_audit enable row level security;

comment on table public.control_command_audit is
  'Immutable audit trail for Telegram-issued ecosystem control commands.';
