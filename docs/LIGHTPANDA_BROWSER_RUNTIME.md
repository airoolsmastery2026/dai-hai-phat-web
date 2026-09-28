# DHP-AIOS — Lightpanda Browser Runtime

## Status

**Accepted — 2026-08-15**

This document defines the approved browser-automation boundary for DHP-AIOS.

Lightpanda is an optional execution runtime for repeatable, non-visual browser work. It does **not** replace the DHP-AIOS orchestrator, the Website, Playwright/Chromium, the AI provider router, or any canonical business-data boundary.

The decision exists to reduce recurring LLM/browser cost and execution overhead while preserving deterministic fallbacks and the repository's existing architecture rules.

## Decision

Use a capability-based browser runtime with this order:

```text
DHP-AIOS / UMS task router
        |
        v
Browser task classification
        |
        +--> deterministic + non-visual + supported
        |       -> verified PandaScript
        |       -> Lightpanda runtime
        |
        +--> new/changed workflow
        |       -> Lightpanda Agent or approved AI-assisted discovery
        |       -> save/review PandaScript
        |       -> deterministic replay
        |
        +--> visual / screenshot / layout / unsupported CDP-Web API
                -> Playwright + Chromium fallback
```

### Core invariants

1. **LLM at discovery, not necessarily at replay.** "Zero-token" means a verified PandaScript can replay without an LLM. It must not be interpreted as a guarantee that workflow discovery, repair, verification, hosting, bandwidth, or external services are free.
2. **Playwright remains the compatibility fallback.** Any workflow requiring screenshot fidelity, visual regression, layout/rendering assertions, or unsupported browser APIs must use Playwright/Chromium.
3. **No Website availability dependency.** Failure or absence of Lightpanda must never prevent the public Website, AI consultation, quotation, lead intake, CRM handoff, Publishing Bot, or Telegram control plane from operating.
4. **No direct business-data ownership.** Lightpanda/PandaScript may collect candidate data but must write through the owning DHP domain/API after validation. It may not write directly to Website storage, CRM tables, pricing records, or another service's private runtime.
5. **No secrets in scripts or repository history.** Credentials, cookies, API tokens, session material, customer PII, and private endpoints stay outside committed PandaScripts and are injected only at an approved runtime boundary.
6. **Respect target-site controls.** Crawlers and repeatable browser jobs must obey applicable robots/rate-limit/policy constraints and must not be used to bypass authentication, anti-abuse controls, paywalls, or access restrictions.
7. **Treat Lightpanda as beta.** Compatibility must be verified per workflow. Unsupported or unstable tasks fall back rather than accumulating speculative fixes.

## Approved use cases

Lightpanda is preferred when all required behavior is non-visual and repeatable, including:

- supplier/product catalogue reads
- public price-watch reads
- public material/specification extraction
- public competitor/reference research used as non-canonical input
- dynamic-page knowledge ingestion
- link/content discovery for SEO research
- deterministic browser checks that do not require rendered pixels
- repeated extraction flows previously proven during an AI-assisted discovery run

These jobs produce **candidate observations**, not authoritative DHP records. Canonical products, prices, materials, suppliers, content, leads, quotations, and CRM data remain Website-owned.

## Playwright/Chromium-only cases

Route directly to Playwright/Chromium when the task needs:

- screenshots or PDF visual output
- responsive/layout/pixel assertions
- font, CSS, canvas, media, or rendered geometry validation
- customer-facing visual QA
- browser behavior not verified as compatible with Lightpanda
- a regression path where Lightpanda has already failed compatibility checks

Do not repeatedly retry an incompatible Lightpanda workflow before falling back.

## PandaScript lifecycle

```text
DISCOVER -> REVIEW -> VERIFY -> REGISTER -> REPLAY -> MONITOR
                               ^                 |
                               |                 v
                               +------ REPAIR <--+
```

### DISCOVER

Use Lightpanda Agent, slash commands, or another approved browser-development path to establish the minimal browser interaction.

Natural-language agent use may consume model quota. Free-only rules in `AGENTS.md` still apply.

### REVIEW

Before registration, review the generated script for:

- allowed target/domain
- absence of secrets and customer PII
- bounded navigation and extraction scope
- explicit expected output
- stable selectors or extraction logic
- no hidden write/destructive behavior
- no access-control bypass

### VERIFY

Run the script against representative pages and verify the output contract. A successful process exit alone is insufficient.

For data destined for DHP knowledge/pricing domains, verify required fields, source URL, observation time, and normalization before downstream ingestion.

### REGISTER

Only verified, reusable scripts become registered automation assets. The owning runtime/service should record:

- stable workflow ID
- workflow version
- intended domains/URLs
- output schema/version
- last verification time
- runtime: `lightpanda`
- fallback: `playwright` where applicable

Do not create a second source of truth for DHP business data inside the script registry.

### REPLAY

Prefer direct PandaScript execution for a verified flow:

```bash
lightpanda agent <verified-script>.js
```

Replay should not invoke an LLM unless the workflow explicitly enters repair/discovery mode.

### MONITOR / REPAIR

A workflow enters repair when selectors, navigation, required data, or output validation fail. Repair may use an approved model, but the repaired script must pass REVIEW and VERIFY again before replacing the registered version.

## Runtime routing contract

Conceptual task metadata:

```json
{
  "taskId": "opaque-id",
  "kind": "browser.extract",
  "requiresVisual": false,
  "repeatable": true,
  "sourceClass": "public-web",
  "preferredRuntime": "lightpanda",
  "fallbackRuntime": "playwright",
  "outputSchema": "supplier-product-observation.v1"
}
```

Routing rules:

```text
requiresVisual = true
  -> playwright

verified PandaScript exists AND compatibility status = healthy
  -> lightpanda replay

repeatable non-visual task but no verified script
  -> discovery -> verify -> register

Lightpanda compatibility/runtime failure
  -> playwright fallback when the task is permitted there

validation/business-rule failure
  -> stop; do not write canonical data
```

## Data boundary

Browser automation returns observations to an owning domain boundary:

```text
Public source
  -> Lightpanda / Playwright
  -> extraction + provenance
  -> schema validation
  -> business verification
  -> Website-owned API/domain
  -> canonical Knowledge / Product / Material / Supplier / Price data
```

Minimum provenance for externally observed data:

- source URL or source identifier
- observed timestamp
- extraction workflow ID/version
- normalized value
- validation status

Do not let an extraction result silently overwrite a canonical price or technical specification.

## Failure policy

Classify failures before fallback:

- `RUNTIME_UNAVAILABLE` -> fallback if safe
- `BROWSER_COMPATIBILITY` -> fallback and mark workflow for review
- `NAVIGATION_TIMEOUT` -> bounded retry only for idempotent reads, then fallback/stop
- `OUTPUT_SCHEMA_INVALID` -> stop canonical ingestion
- `AUTH_REQUIRED` -> stop unless an approved credentialed workflow already exists
- `POLICY_BLOCKED` -> stop; never bypass
- `SOURCE_CHANGED` -> repair workflow, re-verify before registration

No blind retries for any operation that can create external side effects.

## Security and privacy

- Default to public, read-only sources.
- Keep credentials server-side/runtime-side.
- Do not persist raw customer conversations or unnecessary PII in browser logs.
- Redact secrets from diagnostics.
- Use least-privilege service credentials for any approved authenticated workflow.
- Preserve DHP request/job IDs when a browser job participates in an API-controlled operation.
- Any authenticated write automation requires a separate threat review and explicit contract before implementation.

## Dependency and deployment policy

This architecture decision does **not** by itself authorize adding `@lightpanda/browser`, a container, cloud token, hosted Lightpanda service, or a new always-on service to the Website deployment.

The repository currently treats Lightpanda as an optional browser-automation capability. A concrete runtime dependency is added only in the deployable component that owns the browser workload and only when that component's source, tests, and deployment boundary are present.

If a package or container is later adopted:

- pin/constrain the version or image digest as appropriate
- document AGPL-3.0 licensing implications for the chosen deployment model
- keep tokens/config outside source control
- define timeout/resource limits
- verify fallback behavior
- add automated contract tests for every production workflow

## Operational metrics

Measure the decision rather than assuming benefit:

- successful replay rate
- Lightpanda-to-Playwright fallback rate
- workflow repair frequency
- extraction validation failure rate
- median browser-job duration
- model calls avoided by deterministic replay
- resource consumption where measurable

A persistently high fallback or repair rate is evidence to route that workflow to Playwright rather than forcing Lightpanda.

## Acceptance criteria

This integration is correctly implemented when:

1. every AI contributor knows when to select Lightpanda versus Playwright;
2. repeatable PandaScripts can run without an LLM during replay;
3. visual/unsupported work has an explicit Playwright fallback;
4. extracted data cannot bypass schema/business verification into canonical DHP records;
5. secrets and customer data are not committed into browser scripts;
6. Lightpanda failure cannot break the public Website or core AI consultation flow;
7. adoption is measurable and reversible.

## Rollback

Rollback is routing-only: mark Lightpanda workflows disabled and send eligible tasks to the existing Playwright/Chromium path. No business-data migration is required because Lightpanda owns no canonical records.

## References

Implementation must be re-verified against current upstream Lightpanda documentation before changing runtime commands or compatibility assumptions. As of this decision, relevant upstream capabilities include PandaScript replay without an LLM, the `lightpanda agent` workflow, CDP connectivity, and Playwright/Puppeteer compatibility that remains under active development.
