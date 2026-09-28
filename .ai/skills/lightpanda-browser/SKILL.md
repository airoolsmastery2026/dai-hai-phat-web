# Lightpanda Browser Skill

## Purpose

Use this skill for DHP-AIOS browser automation, dynamic public-web extraction, repeatable browser research, and browser-runtime selection.

The governing architecture decision is `docs/LIGHTPANDA_BROWSER_RUNTIME.md`. Read it before changing runtime policy.

## Principle

Use the cheapest deterministic capability that satisfies the task without weakening correctness, security, or verification.

Lightpanda is preferred for verified, repeatable, non-visual browser workflows. Playwright/Chromium remains the fallback for visual work and compatibility gaps.

Lightpanda does not replace UMS/DHP orchestration, AI provider routing, Website domain logic, or canonical business-data APIs.

## Routing checklist

Before execution, classify the browser task:

1. Does it require screenshots, pixel/layout checks, rendered visual geometry, canvas/media verification, or other visual fidelity?
   - Yes -> use Playwright/Chromium.
2. Is it a public/read-only, repeatable, non-visual workflow with a verified PandaScript?
   - Yes -> replay with Lightpanda.
3. Is it a repeatable non-visual workflow without a verified PandaScript?
   - Yes -> discover the flow, save a PandaScript, review it, verify output, then register it.
4. Is Lightpanda compatibility unknown or failing?
   - Use bounded diagnosis; fall back to Playwright rather than forcing compatibility.
5. Does the task require bypassing authentication, anti-abuse controls, access restrictions, or site policy?
   - Stop. Do not bypass.

## Zero-token rule

A saved PandaScript can be replayed directly without an LLM:

```bash
lightpanda agent <verified-script>.js
```

Do not label the entire workflow "free" or "zero cost". Discovery/repair may use model quota; infrastructure, network, storage, and external services may have costs.

When DHP free-only mode is active, obey `AGENTS.md`: never switch automatically to a paid or metered model/provider.

## Discovery workflow

For a new eligible workflow:

```text
inspect target + expected output
  -> establish browser interaction
  -> save PandaScript
  -> review script
  -> verify representative outputs
  -> define output schema + provenance
  -> register workflow
  -> deterministic replay
```

Lightpanda Agent may be used for discovery when an approved model/provider is available. Slash-command/manual discovery is also valid.

Never treat generated browser code as trusted merely because it executed successfully once.

## Review requirements

A reusable PandaScript must pass all of these checks:

- scope is explicit and bounded
- target domains are expected
- no secrets, tokens, cookies, session material, or PII are embedded
- no hidden write/destructive side effects
- extraction has a defined output contract
- required source/provenance data is preserved
- failure is explicit rather than returning plausible empty data
- selectors/extraction logic have been tested on representative pages
- authenticated access, if any, has explicit project approval and least-privilege credentials
- target policy/robots/rate limits are respected where applicable

## Output contract

Browser extraction for DHP knowledge/product/material/supplier/price workflows should return candidate observations with provenance, conceptually:

```json
{
  "schemaVersion": "1.0",
  "workflowId": "supplier-catalog-example",
  "workflowVersion": "1",
  "sourceUrl": "https://example.invalid/item",
  "observedAt": "ISO-8601 UTC",
  "data": {},
  "validation": {
    "schemaValid": true,
    "canonicalWriteAllowed": false
  }
}
```

`canonicalWriteAllowed` must not become true solely because browser extraction succeeded. Canonical DHP writes belong to the owning Website domain/API after business validation.

## Fallback rules

Use Playwright/Chromium immediately for:

- screenshot capture
- visual regression
- responsive/layout verification
- CSS/font/rendering assertions
- unsupported Lightpanda/CDP/Web API behavior
- previously classified incompatibilities

For a read-only workflow, one bounded retry may be reasonable for a transient navigation timeout. Do not loop retries blindly.

When a workflow falls back, record the reason at the orchestration/job layer when available:

- `RUNTIME_UNAVAILABLE`
- `BROWSER_COMPATIBILITY`
- `NAVIGATION_TIMEOUT`
- `SOURCE_CHANGED`

Do **not** fall back past these stop conditions:

- `OUTPUT_SCHEMA_INVALID`
- `AUTH_REQUIRED` without an approved credentialed flow
- `POLICY_BLOCKED`
- business validation failure

## Repair workflow

When a registered flow breaks:

1. reproduce the failure;
2. identify whether it is runtime, compatibility, selector/source change, or validation;
3. use Playwright fallback if the job must continue and fallback is safe;
4. repair the PandaScript only for a source-change/compatibility issue that Lightpanda can support;
5. repeat review + verification;
6. increment workflow version before replacing the registered version.

Never silently mutate a registered automation after a failed run.

## Security

- Default to public and read-only automation.
- Never commit credentials or browser session artifacts.
- Do not log full customer conversations or unnecessary PII.
- Do not use browser automation to defeat access controls.
- Keep external writes idempotent where the owning API supports writes.
- Browser extraction never receives authority to write directly to DHP storage.

## Runtime/dependency discipline

Do not add `@lightpanda/browser`, a Docker image, a Lightpanda cloud token, or a new service merely because this skill exists.

Add a runtime dependency only when a deployable component actually owns a browser workload and has tests/deployment configuration for it. Pin/constrain operational dependencies and document licensing implications before production adoption.

Lightpanda is currently treated as beta; verify upstream commands and compatibility against current official documentation before implementation changes.

## Verification before completion

For each production candidate workflow verify:

- expected page(s) load
- required fields are extracted
- output schema passes
- provenance is present
- no secret/PII leakage
- failure path is explicit
- Playwright fallback works when declared
- no canonical DHP write occurs without owning-domain validation

Do not claim a workflow is production-ready based only on script generation or one successful run.
