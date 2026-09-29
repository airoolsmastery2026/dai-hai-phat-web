# DHP Zero-Cost / Long-Term Safety Policy

Status: Active baseline
Scope: DAI HAI PHAT AI OS / dai-hai-phat-web

## Objective

Operate DHP with a $0-first posture without trading away security, data ownership, portability, reliability, or predictable cost.

"$0-first" is a constraint on default operation, not a promise that every production business workload will remain free forever.

## Non-negotiable invariants

1. No surprise billing: paid APIs, metered fallbacks, auto-top-up, and automatic plan upgrades are disabled by default.
2. Data ownership: business data must remain exportable from the primary platform.
3. Vendor portability: business logic must not depend on one hosting, database, storage, or AI vendor.
4. Fail closed: validation/auth/security failures must not become implicit success.
5. Graceful degradation: optional AI/automation features may fail without taking down the public website or losing a validated inquiry.
6. Secrets never enter source control, client bundles, logs, screenshots, or test fixtures.
7. Backups are independent of the primary SaaS provider for business-critical data.
8. Free-tier claims are treated as temporary operational facts and must be re-verified before they become architecture assumptions.

## Current provider posture

- Vercel may remain the deployment platform, but the repository must remain portable. Vercel Hobby is documented by Vercel as personal/non-commercial, so a commercial DHP deployment must use an appropriate plan or another deployment target.
- Supabase Free may be used for development or low-volume workloads. It currently provides two active free projects, 500 MB database/project, 1 GB file storage and 5 GB egress; free projects can pause after one week of inactivity. It is not the sole backup location.
- GitHub is the source-of-truth repository and quality gate. Production changes must pass the repository quality workflow before merge.

## Cost guardrails

The application must not:
- automatically enable a paid AI provider;
- automatically consume prepaid credits;
- automatically upgrade a hosting/database plan;
- silently switch from a verified-free provider to a paid provider;
- store provider credentials in NEXT_PUBLIC_* variables.

The application may:
- use a verified free quota;
- use cached/static content to reduce provider usage;
- disable optional features when a quota is exhausted;
- route to another verified-free adapter when explicitly configured.

## Data resilience

Business-critical data classes:
- customer inquiries;
- contact details;
- project requirements;
- approved content;
- project media metadata;
- operational configuration.

For each critical data class, define an export format and an independent backup path before production reliance.

## AI boundary

AI is an optional capability layer, not the system of record.

AI outputs are untrusted input and must pass the same validation, authorization, and business-rule boundaries as non-AI input.

No AI provider may become the only place where customer data, business rules, or approved content exists.

## Change policy

Architecture changes require:
- a stated problem;
- a bounded proposal;
- security and cost impact review;
- migration/rollback consideration;
- tests;
- documentation of the resulting decision.

## Operational checklist

Before production:
- [ ] no secrets in Git;
- [ ] paid execution disabled unless explicitly authorized;
- [ ] production data export tested;
- [ ] independent backup tested;
- [ ] authentication/authorization boundary tested;
- [ ] rate limiting or abuse controls reviewed;
- [ ] logs exclude secrets and unnecessary customer payloads;
- [ ] quality gate passes;
- [ ] deployment target is contractually suitable for commercial use.
