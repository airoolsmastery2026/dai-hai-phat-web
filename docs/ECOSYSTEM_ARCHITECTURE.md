# DAI HAI PHAT AI ECOSYSTEM ARCHITECTURE

## Status

This document is the authoritative architecture contract for the Dai Hai Phat AI Ecosystem.

All services remain independently deployable. They communicate only through versioned APIs, signed webhooks, and shared identifiers. No service may access another service's internal database tables, private modules, or runtime state directly.

## Core Principle

The ecosystem is one integrated system with three deployable services:

1. Dai Hai Phat AI Website — business brain and system of record.
2. Social Publishing Bot — marketing automation and distribution engine.
3. Telegram Control Bot — unified remote control and monitoring plane.

Telegram is not a separate business bot and must not own business data or duplicate business logic.

## Component Ownership

### 1. Dai Hai Phat AI Website

The Website is the single source of truth and owns:

- products
- services
- categories
- articles
- landing pages
- SEO source content
- company information
- AI knowledge and retrieval sources
- pricing rules
- quotations
- CRM records
- customer history
- leads and lead status
- customer portal data
- business analytics source events

The Website exposes stable APIs and webhook receivers.

The Website must never publish directly to social platforms.

### 2. Social Publishing Bot

The Publishing Bot owns execution against social platforms:

- Facebook
- Zalo
- TikTok
- YouTube
- Pinterest
- LinkedIn
- Threads
- X

It is responsible for:

- retrieving canonical content from Website APIs
- platform-specific content transformation
- AI content generation based on Website knowledge
- SEO and channel optimization
- publishing queue
- scheduling
- token lifecycle checks
- publication retries
- comment and inbox collection
- social analytics collection
- social lead extraction
- forwarding leads and engagement events to Website APIs

The Publishing Bot must not own or duplicate product, service, pricing, customer, quotation, CRM, or AI knowledge data.

### 3. Telegram Control Bot

The Telegram Bot is the ecosystem control plane.

It is responsible for:

- authenticated operator access
- command routing
- health and incident notifications
- lead notifications and lead actions
- Website operations
- Publishing Bot operations
- AI interaction
- emergency controls
- audit-friendly operator actions

The Telegram Bot must not become a system of record. It may cache short-lived presentation data only.

## Logical Architecture

```text
                         Telegram Control Bot
                                  |
              +-------------------+-------------------+
              |                   |                   |
              v                   v                   v
       Website Control API   Publishing Control API   Monitoring API
              |                   |                   |
              +-------------------+-------------------+
                                  |
                         Shared API Contracts
                                  |
                         Website-Owned Records
```

"Shared Database" means a shared logical data domain owned by the Website. It does not permit the Publishing Bot or Telegram Bot to query Website tables directly.

## API-First Boundaries

Every cross-service operation must use an API or webhook.

Required public/internal contract families:

```text
GET  /api/v1/products
GET  /api/v1/services
GET  /api/v1/articles
GET  /api/v1/seo/content
GET  /api/v1/knowledge/search
GET  /api/v1/quotations/:id
GET  /api/v1/leads/:id
GET  /api/v1/system/health

POST /api/v1/leads
POST /api/v1/ai/consult
POST /api/v1/quotations/quick
POST /api/v1/webhooks/social/comment
POST /api/v1/webhooks/social/message
POST /api/v1/webhooks/social/lead
POST /api/v1/webhooks/publishing/status
POST /api/v1/webhooks/telegram
```

Existing unversioned routes may remain temporarily for backward compatibility. New ecosystem integrations must use `/api/v1` contracts unless a versioned replacement already exists.

## Control Plane Commands

Telegram commands are adapters over service APIs, not direct implementations.

### Website command domain

- check AI status
- inspect Website health
- inspect server health
- search CRM
- review quotations
- view urgent incidents
- request safe AI service restart or recovery action

### Publishing command domain

- publish immediately
- pause scheduler
- resume scheduler
- inspect publishing queue
- retry failed job
- inspect token status
- review channel analytics

### Lead command domain

- notify new lead
- show lead details
- forward lead context to AI consultant
- show conversation summary
- update or inspect lead processing status

### AI command domain

- ask AI consultant
- generate SEO draft from canonical Website data
- summarize customer conversations
- generate quick quotation draft
- search Website knowledge base

## Lead Flow

```text
Website canonical content
        |
        v
Publishing Bot
        |
        v
Social platforms
        |
        v
Customer comment / message
        |
        v
Publishing Bot ingestion
        |
        v
Website Lead API
        |
        v
Website CRM + AI Consultant
        |
        v
Telegram notification
        |
        v
Human operator action when required
```

The Website assigns the canonical lead ID. All downstream systems must preserve that ID.

## Event and Identity Rules

Every cross-service request or event must include:

- `schemaVersion`
- `eventId` or `requestId`
- `occurredAt`
- `sourceService`
- stable entity IDs such as `leadId`, `articleId`, `publicationId`, or `jobId`
- idempotency key for write operations

Webhook deliveries must support retries without creating duplicate records.

## Security Rules

- Service-to-service secrets remain server-side.
- Webhooks require signature verification and replay protection.
- Telegram operator commands require an allowlist and role checks.
- Destructive or emergency commands require explicit confirmation or a two-step command flow.
- Telegram messages must not expose full secrets, access tokens, or unnecessary customer data.
- Each service receives least-privilege credentials.
- All control actions must produce an audit event.

## Failure Isolation

- Website availability must not depend on Telegram availability.
- Website availability must not depend on the Publishing Bot.
- Social publishing failure must not corrupt Website content.
- Telegram failure must not stop scheduled publishing.
- Third-party API failure must degrade gracefully and must not lose leads.
- Commands should be asynchronous for long-running work and return a job ID/status.

## Deployment Model

Each component is independently deployable:

- `dai-hai-phat-web`: Website, business APIs, CRM, AI knowledge, quotation system.
- `BOT-DANG-BAI`: Publishing engine and social platform adapters.
- Telegram Control Bot: control-plane adapter. It may live as a dedicated deployable package or service, but it remains logically part of the ecosystem control plane rather than a fourth business domain.

A deployment boundary does not imply business ownership.

## Prohibited Architecture

Do not:

- duplicate Website products, services, pricing, CRM, or knowledge inside the Publishing Bot
- let Telegram write directly to databases
- let the Publishing Bot call private Website modules
- place social publishing credentials in the Website client
- place business rules only inside Telegram command handlers
- use Telegram as the only event store or job queue
- tightly couple deployments so one service must be released for another to run

## Implementation Order

1. Define versioned API and webhook contracts.
2. Add service authentication, signatures, idempotency, and audit events.
3. Expose Website-owned content, lead, quotation, AI, and health APIs.
4. Adapt Publishing Bot to consume Website APIs and return social events/leads.
5. Implement Telegram command routing over Website and Publishing APIs.
6. Add monitoring, alert routing, retries, and emergency controls.

## Architectural Decision

The final operating model is:

- Website = business brain and single source of truth.
- Publishing Bot = marketing and distribution engine.
- Telegram Bot = unified mobile control and monitoring center.

All future code and design decisions must preserve this separation of responsibilities.
