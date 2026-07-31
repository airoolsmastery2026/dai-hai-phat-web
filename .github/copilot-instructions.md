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
- The Website must not contain social queues, social schedulers, platform publishing adapters, or social platform credentials.
- The Publishing Bot must return social leads and engagement events to Website APIs.
- Telegram command handlers must call service APIs; business logic must remain in the owning service.

## Repository Scope

This repository owns:

- Website UI and technical SEO
- canonical products, services, articles, landing pages, media, and company information
- CRM, leads, customers, quotations, attribution, and customer history
- AI consultant, knowledge base, and business intelligence
- versioned Website APIs
- webhook receivers for social and Telegram events
- service health and control APIs for authorized operators

This repository does not own social platform publishing adapters or Telegram transport/runtime code unless explicitly placed here as a separately deployable control-plane package.

## Publishing Integration Rules

- Publishing content must be derived from canonical Website records through a dedicated DTO. Never expose React components, icon types, database internals, unpublished secrets, or private operational fields.
- Canonical URLs never contain UTM parameters. The Publishing Bot may append UTM parameters only when distributing links.
- Publishing APIs must expose stable IDs, content type, title, normalized content, canonical URL, featured image, SEO metadata, distribution readiness, locale, timestamps, and pagination.
- The initial production endpoint is `GET /api/v1/integrations/publishing/content`.
- The Publishing Bot authenticates server-to-server with `Authorization: Bearer <ECOSYSTEM_SERVICE_API_KEY>` and `X-DHP-Source-Service: publishing-bot`.
- Do not add social publishing, scheduling, token management, or analytics code to this repository.

## API Rules

- New ecosystem APIs use `/api/v1`.
- Use stable request and response schemas.
- Include `requestId` or `eventId`, `schemaVersion`, timestamps, and source service.
- Write operations require idempotency.
- Webhooks require signatures and replay protection.
- Long-running commands return a job ID and expose status.
- Third-party failure must not lose leads or corrupt canonical data.
- Keep secrets server-side in environment variables.
- Preserve existing unversioned routes until consumers have migrated.

## Telegram Rules

Telegram may:

- query Website and Publishing APIs
- execute authorized operational commands
- receive notifications and alerts
- show summaries and status

Telegram may not:

- query databases directly
- store canonical customer, lead, quotation, content, or publishing queue data
- contain unique business logic unavailable through APIs
- expose secrets or unnecessary customer data
- execute destructive commands without confirmation and authorization

## Change Discipline

- Work in the current repository; do not create a replacement project.
- Do not change Next.js, TypeScript, or the existing architecture without a mandatory technical reason.
- Do not add packages unless necessary.
- Do not create duplicate components, schemas, dashboards, or service clients.
- Do not add microservices, message brokers, enterprise CRM features, social schedulers, platform SDKs, or posting logic without a current production requirement.
- Prefer small production-safe changes with validation and tests.
- Do not remove working behavior without proving it violates scope or safety.
- Every integration must identify owner, caller, contract, authentication, failure behavior, and audit event.
