revoke all on table public.control_command_audit from anon, authenticated;
revoke all on table public.project_inquiries from anon, authenticated;
revoke all on table public.social_leads from anon, authenticated;

drop policy if exists control_command_audit_no_public_access on public.control_command_audit;
create policy control_command_audit_no_public_access
on public.control_command_audit
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists project_inquiries_no_public_access on public.project_inquiries;
create policy project_inquiries_no_public_access
on public.project_inquiries
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists social_leads_no_public_access on public.social_leads;
create policy social_leads_no_public_access
on public.social_leads
for all
to anon, authenticated
using (false)
with check (false);
