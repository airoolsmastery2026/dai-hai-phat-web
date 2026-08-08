# DAI HAI PHAT AI OS — ARCHITECTURE BLUEPRINT

## Status

This document is the architecture control plane for AI-assisted development in `dai-hai-phat-web`.

It complements, and does not replace:

- `README.md` — product scope and v1 constraints
- `AGENTS.md` — agent execution rules
- `DESIGN.md` — visual system
- `COMPONENTS.md` — UI component contracts
- `docs/ECOSYSTEM_ARCHITECTURE.md` — ecosystem ownership and service boundaries
- `docs/ECOSYSTEM_API_CONTRACTS.md` — cross-service API and webhook contracts

When documents conflict, prefer the narrower authoritative contract for the affected domain. Repository code and tests remain the implementation source of truth.

The purpose of this blueprint is to keep humans in control of architecture while AI agents execute bounded implementation work. It is intentionally conservative: do not introduce infrastructure because it appears in a reference architecture or diagram.

---

## 1. Project Overview

DAI HAI PHAT AI OS is an AI Digital Engineering Office focused on residential construction mechanics and interiors: gates, doors, stairs, railings, awnings, interiors, and home renovation.

Primary users:

- prospective customers seeking consultation and preliminary estimates
- Đại Hải Phát staff handling leads, quotations, and customer follow-up
- operators controlling publishing/monitoring through the wider ecosystem

Primary product flow:

```text
Customer -> Website -> AI consultation -> grounded company knowledge
         -> preliminary estimate -> lead/CRM handoff -> staff follow-up
```

Success means higher conversion, faster response, more accurate intake, safer data handling, and lower operating effort. The system is not an industrial ERP and should not become one without evidence.

## 2. Tech Stack

Current repository baseline:

- Next.js
- React
- TypeScript
- Tailwind CSS v3
- ESLint
- Node.js test runner
- Vercel deployment
- Gemini-backed AI integration where configured

Rules:

- do not replace the framework or language without explicit architectural approval
- do not add a package when platform APIs or existing code already solve the problem cleanly
- pin or constrain versions when a dependency becomes operationally sensitive
- document every newly approved infrastructure dependency in this section before relying on it broadly

Not approved by default merely because a reference diagram uses them: Express, Nginx, PostgreSQL, Redis, BullMQ, MinIO, Prometheus, Grafana, Loki, Kubernetes, or Cloudflare-specific architecture.

## 3. Folder Structure

Use the existing repository structure as the default. Before adding a directory, inspect adjacent conventions.

Placement rules:

- application routes and server endpoints stay with the existing Next.js application conventions
- reusable UI belongs in the established component hierarchy
- canonical design rules stay in `DESIGN.md`, `COMPONENTS.md`, and `design-system/`
- AI-agent guidance belongs in `AGENTS.md` and `.ai/`
- architecture, contracts, audits, and implementation specifications belong in `docs/`
- scripts must serve a repeatable repository operation, not one-off experimentation
- tests belong in the existing test structure and should describe behavior/contracts rather than implementation trivia

No `utils/`, `helpers/`, `common/`, or `shared/` dumping grounds without a clear bounded responsibility.

## 4. System Architecture

### v1 runtime

```text
Browser / Mobile
      |
      v
Next.js Website on Vercel
      |
      +--> AI consultation boundary
      +--> Website-owned knowledge/content
      +--> preliminary estimate / quotation domain
      +--> lead + CRM handoff
      +--> notification adapters
```

### ecosystem boundary

```text
                        Telegram Control
                               |
             +-----------------+-----------------+
             |                                   |
             v                                   v
     Website Control APIs                 Publishing APIs
             |                                   |
             +--------------- APIs/Webhooks -----+
                               |
                         Canonical Website
                         business records
```

The Website is the business brain and system of record. The Publishing Bot is the distribution engine. Telegram is the control plane. Cross-service communication uses versioned APIs/webhooks, never another service's private database or modules.

## 5. Module Breakdown

Core logical domains:

- **Public experience** — service discovery, landing pages, portfolio/content, conversion paths
- **AI consultation** — scoped advisory conversation, information collection, grounded responses
- **Knowledge** — canonical company/product/service/material/pricing sources used for grounded AI
- **Estimation/quotation** — preliminary estimate generation and engineering-validation rules
- **Lead/CRM handoff** — canonical customer/project intake and staff follow-up boundary
- **Content/SEO** — canonical Website content exposed to publishing consumers
- **System/operations** — health, audit, safe operational controls
- **Ecosystem integrations** — versioned APIs, signed webhooks, publishing and Telegram adapters

A module must own one coherent responsibility and expose a narrow contract. Business logic must not be duplicated in route handlers, Telegram commands, or publishing adapters.

## 6. Request Flow

Default server flow:

```text
Client request
 -> route/API boundary
 -> authentication/validation when required
 -> domain/service logic
 -> canonical data/provider boundary
 -> normalized result
 -> safe response envelope
```

For AI consultation:

```text
Customer message
 -> scope + input validation
 -> conversation state / required-field collection
 -> knowledge retrieval
 -> AI generation with grounded context
 -> safety/business-rule validation
 -> response + next required action
 -> CRM handoff when qualification threshold is reached
```

Do not bypass domain rules by calling storage/provider code directly from UI components.

## 7. Authentication

Authentication must be added only where a protected operator/customer capability requires it.

Rules:

- keep credentials and session secrets server-side
- use secure, HTTP-only cookie/session mechanisms when browser authentication is introduced unless a documented requirement justifies another approach
- never persist long-lived service tokens in browser storage
- refresh/session behavior must be centralized rather than reimplemented per route
- authentication redesign is a high-risk change and requires an explicit spec, threat review, and tests

Do not invent customer accounts merely to support a flow that can safely operate as lead intake.

## 8. Authorization

Use least privilege and policy checks at server boundaries.

Ecosystem operator roles currently defined by contract:

- `viewer`
- `operator`
- `admin`
- `owner`

Rules:

- role names and permissions are canonical contracts, not ad-hoc strings added by individual features
- destructive/emergency controls require explicit confirmation or short-lived confirmation tokens
- Telegram does not bypass Website/Publishing authorization
- authorization checks must be testable and auditable

## 9. Database / Persistent Data

The Website owns business records. Other services must not read or write Website tables directly.

Canonical domains include products, services, content, knowledge sources, pricing rules, quotations, leads, CRM history, and business analytics source events.

Until a persistent database technology is explicitly adopted in the repository:

- do not assume PostgreSQL, Prisma, Redis, or any other database from external diagrams
- keep storage access behind domain contracts so implementation can evolve
- migrations must be forward-safe, reviewable, and tested before production use
- destructive migrations require explicit approval and rollback planning
- indexes and transaction policies must be based on observed query/write behavior, not speculation
- backups and retention policy must be documented before business-critical persistence is considered production-ready

## 10. API Architecture

New ecosystem integrations use `/api/v1`.

Contract rules:

- JSON by default
- ISO 8601 UTC timestamps
- opaque identifiers
- `Idempotency-Key` on writes
- request IDs across service boundaries
- signed webhooks
- stable success/error envelopes
- no provider stack traces or secrets in responses
- pagination and explicit limits for collection reads

Existing unversioned routes remain compatible until consumers migrate to versioned replacements.

See `docs/ECOSYSTEM_API_CONTRACTS.md` for canonical cross-service contracts.

## 11. Business Flow

Primary sales flow:

```text
WELCOME
 -> SERVICE_SELECTION
 -> PROJECT_TYPE
 -> LOCATION
 -> IMAGE_COLLECTION
 -> SIZE_COLLECTION
 -> STYLE_COLLECTION
 -> MATERIAL_COLLECTION
 -> BUDGET_COLLECTION
 -> TIME_COLLECTION
 -> REQUIREMENT_COLLECTION
 -> ANALYSIS
 -> preliminary proposal/estimate
 -> CRM handoff
 -> human follow-up / survey
```

Business invariants:

- the AI acts as a sales/technical consultant for the approved residential/interior scope
- estimates are preliminary unless engineering validation has occurred
- customer data already collected should be preserved through handoff so customers are not asked to re-enter it
- the AI should move the customer toward a proposal/survey/quotation outcome rather than open-ended generic chat
- pricing and technical claims must come from canonical/verified sources where available

## 12. Dependency Graph

Preferred dependency direction:

```text
UI / Routes
    |
    v
Domain contracts / services
    |
    +--> Knowledge
    +--> AI provider adapter
    +--> Lead/CRM adapter
    +--> Notification adapter
    +--> Versioned ecosystem adapter
```

Rules:

- UI depends on domain contracts, not provider internals
- provider adapters do not own business policy
- Publishing and Telegram depend on Website contracts, never Website private modules
- avoid cycles; if A and B require each other, extract the shared contract or reconsider ownership
- new dependencies require a documented reason and regression surface

## 13. External Services

Potential/approved integration families include:

- AI provider (Gemini in current deployment configuration where enabled)
- Vercel hosting/runtime
- Telegram notifications/control plane
- email notification adapters where configured
- social-platform APIs through the separate Publishing Bot

Every external integration must define:

- server-side credential boundary
- timeout
- rate-limit behavior
- retry policy
- idempotency for writes
- normalized error mapping
- fallback/degraded behavior
- observability without leaking secrets/customer payloads

No blind retry of non-idempotent writes.

## 14. Configuration

Configuration is environment-specific and secrets stay outside source control.

Rules:

- `.env.example` documents variable names without real secrets
- validate required server configuration at the narrowest practical boundary
- browser-exposed environment variables must contain only intentionally public values
- local, preview, and production behavior should differ through configuration, not code forks
- missing optional integrations should degrade safely
- never log API keys, service tokens, signing secrets, or complete sensitive payloads

## 15. Logging

Structured logging should support diagnosis without becoming a data leak.

Recommended fields where relevant:

- timestamp
- level
- request/event ID
- route/operation
- duration
- stable entity ID
- source service/provider
- outcome/error code

Do not log:

- secrets or tokens
- raw authorization headers
- complete customer conversations by default
- unnecessary PII
- provider responses containing sensitive data

Logging infrastructure should be added only when operational need justifies it; a full Prometheus/Loki/Grafana stack is not a default requirement for v1.

## 16. Error Handling

Errors must be explicit, stable, and safe.

Rules:

- validate at boundaries
- map provider failures to domain/error codes
- keep customer-facing messages useful but non-sensitive
- preserve a request/event ID for operator diagnosis
- distinguish retryable from non-retryable failures
- long-running operations should return job/status semantics instead of holding requests indefinitely
- do not swallow errors merely to keep a UI green

Cross-service APIs follow the standard error envelope in `docs/ECOSYSTEM_API_CONTRACTS.md`.

## 17. Security

Minimum controls:

- server-side secret storage
- input validation at trust boundaries
- output encoding / framework-safe rendering
- secure headers and HTTPS through the deployment platform
- rate limiting/abuse controls on endpoints that need them
- signed webhooks with timestamp/replay protection
- least-privilege service credentials
- authorization on operator controls
- audit events for control actions
- no secrets or private provider configuration in client bundles

Any authentication, payments, file uploads, webhooks, or destructive operations require dedicated threat analysis before implementation.

## 18. Performance

Performance is a product requirement, especially on mobile.

Priorities:

- minimize client JavaScript
- use server rendering/static generation where it improves first load and SEO
- optimize media and avoid unnecessary large assets
- cache only where data freshness/security allows it
- place timeouts on external calls
- avoid request waterfalls
- monitor bundle/build regressions
- keep interaction paths usable on lower-end mobile devices and variable networks

Do not introduce Redis/CDN layers merely to satisfy an architectural pattern; add them only after a measured bottleneck or reliability requirement.

## 19. Scalability

Scale by preserving stateless request handling and explicit external boundaries first.

Order of response to growth:

1. measure the bottleneck
2. optimize query/request behavior
3. cache safe reads where justified
4. isolate long-running work behind job semantics if required
5. scale runtime horizontally through the hosting platform where practical
6. adopt dedicated queues/datastores only when workload evidence warrants them

Do not pre-emptively build sharding, Kubernetes, multi-region replication, or complex queue infrastructure for v1.

## 20. Deployment

Current deployment model:

- GitHub is the source repository
- feature work uses focused branches and pull requests
- GitHub Quality is the independent code gate
- Vercel is the Website deployment platform
- production changes merge only after required checks pass

Workflow:

```text
branch -> tests/review -> PR -> GitHub Quality -> squash merge -> production deployment
```

A Vercel build-rate-limit incident is infrastructure quota, not automatically a code failure when the independent GitHub quality gate is green.

Publishing Bot and Telegram Control remain independently deployable ecosystem components.

## 21. Testing

Canonical repository gate:

```bash
npm run quality
```

It currently combines:

- TypeScript type-check
- ESLint
- unit/contract tests
- production Next.js build

Testing strategy:

- behavior/contract tests over implementation-detail tests
- RED/GREEN/REFACTOR for new testable behavior and regressions
- focused tests during iteration, full quality gate before completion
- API/webhook contracts require validation, idempotency, auth/signature, and error-path tests as applicable
- critical customer journeys should gain integration/e2e coverage when the repository has the necessary harness

Never weaken/delete a valid test to make CI pass.

## 22. Coding Convention

Follow TypeScript/Next.js conventions and repository lint rules.

Additional rules:

- explicit, domain-oriented names
- small focused functions/components
- avoid duplicated business logic
- prefer existing primitives/tokens/contracts
- no hardcoded secrets
- no magic color/spacing/type values where design tokens exist
- comments explain non-obvious intent/tradeoffs, not syntax
- no speculative abstraction
- one coherent responsibility per component/module

## 23. Design Patterns

Approved patterns are selected by need, not fashion.

Preferred:

- adapter boundaries around external services
- domain/service functions for business rules
- explicit schemas/contracts at API boundaries
- dependency inversion between business logic and providers
- state-machine thinking for the customer consultation flow
- idempotent event/webhook handling

Do not force Repository, Factory, Singleton, dependency-injection containers, event buses, or other patterns without a demonstrated problem they solve.

## 24. Strengths

Current architectural strengths to preserve:

- clear residential/interior product scope
- Next.js + TypeScript stack with low operational complexity
- Website as canonical business source of truth
- separated publishing and Telegram control responsibilities
- API-first cross-service boundaries
- versioned integration contract direction
- explicit mobile/performance/customer priorities
- repository-level AI contributor rules
- quality gate and TDD-oriented execution process
- design system documentation already present

## 25. Technical Debt

Known/expected debt must remain visible instead of being hidden by AI refactors.

Current categories to track:

- migration from legacy/unversioned endpoints to `/api/v1`
- incomplete implementation of the declared ecosystem API contracts
- authentication/authorization hardening as protected operator capabilities expand
- persistent CRM/lead storage strategy and operational backup policy where not yet finalized
- broader integration/e2e coverage for customer-critical paths
- observability appropriate to actual production incidents and scale
- verified knowledge/pricing data completeness

Technical debt is not permission for broad refactoring. Each item should become a scoped ticket/spec when prioritized.

## 26. Improvement Proposal

Near-term architecture evolution should follow evidence and business value:

1. finish a reliable end-to-end consultation -> preliminary estimate -> lead handoff flow
2. strengthen canonical knowledge/pricing grounding
3. implement the first `/api/v1` integration slice with authentication, request IDs, idempotency, signed webhooks, and audit events
4. connect Publishing Bot through versioned Website APIs rather than duplicated data
5. connect Telegram as a control adapter over owning-service APIs
6. add targeted integration/e2e tests around highest-value customer and operator journeys
7. add observability based on real operational failure modes
8. introduce queues/databases/cache layers only when measured workload or durability requirements justify them

Every proposal must state business value, complexity, risk, dependencies, verification, and rollback.

## 27. Appendix

### Authoritative documents

- `README.md`
- `AGENTS.md`
- `DESIGN.md`
- `COMPONENTS.md`
- `.ai/UI_PROMPT.md`
- `docs/ECOSYSTEM_ARCHITECTURE.md`
- `docs/ECOSYSTEM_API_CONTRACTS.md`

### Architecture decision rule

Before changing architecture, answer:

1. What measured/product problem exists?
2. Why can the current architecture not solve it cleanly?
3. What is the smallest reversible change?
4. What new operational burden is introduced?
5. What security/data risks change?
6. How will the change be tested and observed?
7. What is the rollback path?

If these cannot be answered, do not change architecture.

### AI execution rule

AI is an implementation agent, not the architecture authority. For non-trivial work it must:

```text
Inspect -> Brainstorm -> Spec -> Plan/Tickets -> TDD
        -> Isolated Implementation -> Review -> Verify -> Ship
```

It may propose architecture changes, but it must not silently introduce them.

### Reference-diagram warning

External architecture diagrams are learning inputs, not implementation requirements. A diagram containing Cloudflare, Nginx, Express, PostgreSQL, Redis, BullMQ, MinIO, Prometheus, Loki, Grafana, Tempo, or similar infrastructure does not authorize adding those systems to DHP-AIOS. Adopt infrastructure only through the architecture decision rule above.
