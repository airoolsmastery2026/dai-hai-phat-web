# DAI HAI PHAT AI ECOSYSTEM — AI CONTRIBUTOR RULES

Before changing architecture or adding an integration, read:

1. `docs/ECOSYSTEM_ARCHITECTURE.md`
2. `docs/ECOSYSTEM_API_CONTRACTS.md`

## Product Priorities

1. Mobile First
2. Performance First
3. Customer Experience
4. AI First
5. Security and reliability

## Architecture Invariants

- The Website is the business brain and single source of truth.
- The Social Publishing Bot is the marketing and distribution engine.
- The Telegram Bot is the unified remote control and monitoring plane.
- Telegram is not a separate business domain and owns no canonical business records.
- All deployable services communicate only through versioned APIs and signed webhooks.
- Never access another service's database, private modules, runtime memory, or filesystem directly.
- Never duplicate products, services, pricing, CRM, quotations, customers, or AI knowledge outside the Website.
- The Website must not publish directly to social platforms.
- The Publishing Bot must return social leads and engagement events to Website APIs.
- Telegram command handlers must call service APIs; business logic must remain in the owning service.

## Repository Scope

This repository owns:

- Website UI and SEO
- canonical products, services, articles, and company information
- CRM, leads, customers, quotations, and customer history
- AI consultant, knowledge base, and business intelligence
- versioned Website APIs
- webhook receivers for social and Telegram events
- service health and control APIs for authorized operators

This repository does not own social platform publishing adapters or Telegram transport/runtime code unless explicitly placed here as a separately deployable control-plane package.

## API Rules

- New ecosystem APIs use `/api/v1`.
- Use stable request and response schemas.
- Include `requestId` or `eventId`, `schemaVersion`, timestamps, and source service.
- Write operations require idempotency.
- Webhooks require signatures and replay protection.
- Long-running commands return a job ID and expose status.
- Third-party failure must not lose leads or corrupt canonical data.
- Keep secrets server-side.

## Telegram Rules

Telegram may:

- query Website and Publishing APIs
- execute authorized operational commands
- receive notifications and alerts
- show summaries and status

Telegram may not:

- query databases directly
- store the canonical customer, lead, quotation, content, or publishing queue
- contain unique business logic unavailable through APIs
- expose secrets or unnecessary customer data
- execute destructive commands without confirmation and authorization

## Change Discipline

- Do not change Next.js, TypeScript, or the existing architecture without a clear requirement.
- Do not add packages unless necessary.
- Do not create duplicate components, schemas, or service clients.
- Prefer small production-safe changes with tests.
- Preserve backward compatibility while migrating existing unversioned routes.
- Every integration must identify owner, caller, contract, authentication, failure behavior, and audit event.
