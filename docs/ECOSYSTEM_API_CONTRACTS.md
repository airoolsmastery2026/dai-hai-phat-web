# DAI HAI PHAT AI ECOSYSTEM API CONTRACTS

## Purpose

This document defines the initial integration boundary between:

- `website` — Dai Hai Phat AI Website
- `publishing-bot` — Social Publishing Bot
- `telegram-control` — Telegram Control Bot
- `monitoring` — monitoring and alerting services

It defines ownership and envelope rules. Endpoint payload schemas should be implemented incrementally with tests.

## Base Rules

- New integration endpoints use `/api/v1`.
- JSON is the default representation.
- Times use ISO 8601 UTC strings.
- IDs are opaque strings and must not be parsed for business meaning.
- All write requests use an `Idempotency-Key` header.
- All service calls use server-side credentials.
- All webhook payloads are signed.
- API responses use `Cache-Control: private, no-store` unless explicitly public content.

## Standard Request Context

Service requests should include:

```http
Authorization: Bearer <service-token>
X-DHP-Request-Id: <uuid>
X-DHP-Source-Service: website|publishing-bot|telegram-control|monitoring
Idempotency-Key: <stable-write-key>
Content-Type: application/json
```

## Standard Success Envelope

```json
{
  "schemaVersion": "1.0",
  "requestId": "uuid",
  "data": {}
}
```

## Standard Error Envelope

```json
{
  "schemaVersion": "1.0",
  "requestId": "uuid",
  "error": {
    "code": "STABLE_MACHINE_CODE",
    "message": "Safe operator-facing message",
    "retryable": false
  }
}
```

Do not return secrets, raw provider responses, internal stack traces, or sensitive configuration.

## Standard Webhook Envelope

```json
{
  "schemaVersion": "1.0",
  "eventId": "uuid",
  "eventType": "social.lead.created",
  "occurredAt": "2026-07-31T00:00:00.000Z",
  "sourceService": "publishing-bot",
  "data": {}
}
```

Webhook headers:

```http
X-DHP-Event-Id: <uuid>
X-DHP-Timestamp: <unix-seconds>
X-DHP-Signature: <hmac-signature>
```

Receivers must reject invalid signatures, stale timestamps, and replayed event IDs.

## Website-Owned Read APIs

### Products

```text
GET /api/v1/products
GET /api/v1/products/:productId
```

Consumers: Publishing Bot, Telegram Control.

### Services

```text
GET /api/v1/services
GET /api/v1/services/:serviceId
```

Consumers: Publishing Bot, Telegram Control, AI tools.

### Articles and canonical SEO content

```text
GET /api/v1/articles
GET /api/v1/articles/:articleId
GET /api/v1/seo/content
```

The Publishing Bot transforms this content for channels but does not overwrite the canonical Website record.

### Knowledge

```text
POST /api/v1/knowledge/search
POST /api/v1/ai/consult
```

Consumers receive grounded answers and source identifiers, not direct database access.

### Leads and CRM

```text
POST /api/v1/leads
GET  /api/v1/leads/:leadId
GET  /api/v1/leads/:leadId/summary
PATCH /api/v1/leads/:leadId/status
```

The Website assigns and owns `leadId`.

### Quotations

```text
POST /api/v1/quotations/quick
GET  /api/v1/quotations/:quotationId
```

Quick quotations are drafts and must preserve the requirement for engineering validation.

### Health and operations

```text
GET  /api/v1/system/health
GET  /api/v1/system/ai-status
POST /api/v1/system/ai-recovery-jobs
GET  /api/v1/system/jobs/:jobId
```

Restart or recovery operations must be job-based, authorized, audited, and safe for retries.

## Publishing Bot Control APIs

These APIs are owned by the Publishing Bot and called by Telegram Control.

```text
GET  /api/v1/publishing/health
GET  /api/v1/publishing/queue
GET  /api/v1/publishing/jobs/:jobId
GET  /api/v1/publishing/tokens/status
GET  /api/v1/publishing/analytics
POST /api/v1/publishing/jobs
POST /api/v1/publishing/scheduler/pause
POST /api/v1/publishing/scheduler/resume
POST /api/v1/publishing/jobs/:jobId/retry
```

The Publishing Bot references Website entities by stable IDs such as `articleId`, `productId`, or `serviceId`.

## Website Webhook Receivers

```text
POST /api/v1/webhooks/social/comment
POST /api/v1/webhooks/social/message
POST /api/v1/webhooks/social/lead
POST /api/v1/webhooks/publishing/status
POST /api/v1/webhooks/telegram
```

### Social lead minimum data

```json
{
  "platform": "facebook",
  "externalLeadId": "provider-id",
  "publicationId": "publishing-job-id",
  "sourceContentId": "website-article-or-product-id",
  "customer": {
    "displayName": "Customer",
    "platformUserId": "opaque-provider-id"
  },
  "message": "Customer-provided content",
  "consentContext": "platform-message",
  "metadata": {}
}
```

The Website normalizes this event and creates the canonical lead.

## Telegram Command Contract

Telegram receives operator messages and maps them to structured commands.

Internal command representation:

```json
{
  "schemaVersion": "1.0",
  "commandId": "uuid",
  "operatorId": "telegram-user-id",
  "operatorRole": "owner|admin|operator|viewer",
  "command": "publishing.scheduler.pause",
  "arguments": {},
  "requestedAt": "2026-07-31T00:00:00.000Z"
}
```

Telegram must call the owning service API. It must not implement the business operation itself.

## Command Authorization

Suggested roles:

- `viewer`: health, queue, analytics, lead summaries
- `operator`: publish, retry, lead status updates, AI queries
- `admin`: pause/resume, token diagnostics, recovery jobs
- `owner`: destructive or emergency controls

High-risk commands require a confirmation token with a short expiry.

## Audit Events

Every operator command should generate:

```json
{
  "eventType": "control.command.executed",
  "commandId": "uuid",
  "operatorId": "telegram-user-id",
  "targetService": "publishing-bot",
  "command": "publishing.scheduler.pause",
  "status": "accepted|completed|failed|rejected",
  "occurredAt": "2026-07-31T00:00:00.000Z"
}
```

Audit logs are owned by the Website or a dedicated monitoring service, never only by Telegram chat history.

## Reliability Requirements

- Webhook retries use exponential backoff.
- Receivers are idempotent.
- Failed events enter a dead-letter workflow or retry queue.
- Long-running actions return `202 Accepted` with `jobId`.
- Read APIs define pagination and limits.
- Third-party provider errors map to stable ecosystem error codes.
- Publishing and Telegram outages must not block Website lead capture.

## Migration Rule

Existing routes such as `/api/crm/handoff` remain operational until versioned replacements are implemented and consumers migrate. Do not remove or silently change existing contracts.

## First Implementation Slice

The first implementation phase should add:

1. service authentication and request context utilities
2. `/api/v1/system/health`
3. `/api/v1/leads` adapter over the existing CRM handoff domain
4. signed social lead webhook receiver
5. audit event model for Telegram-issued commands
6. Publishing Bot client contracts without direct database coupling
