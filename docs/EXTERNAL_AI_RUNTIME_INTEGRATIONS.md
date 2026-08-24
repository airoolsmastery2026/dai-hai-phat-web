# DAI HAI PHAT AI OS — EXTERNAL AI RUNTIME INTEGRATIONS

## Status

This document is the project-authoritative placement contract for the optional external capabilities registered in `.ai/EXTERNAL_AI_INTEGRATIONS.json`.

It complements, and does not replace:

- `README.md` — product scope and v1 constraints
- `AGENTS.md` — contributor/provider policy
- `docs/ARCHITECTURE_BLUEPRINT.md` — Website architecture
- `docs/ECOSYSTEM_ARCHITECTURE.md` — service ownership
- `docs/ECOSYSTEM_API_CONTRACTS.md` — cross-service boundaries
- `.ai/FREE_MODEL_ROUTER.json` — coding-provider free-only policy

Repository code, tests, and the narrower owning-domain contract remain the implementation source of truth.

## Decision

DHP integrates four reviewed external capabilities through UMS-style adapters, not by copying their repositories into the Website or installing all of them as production dependencies:

| Capability | DHP role | Default state | Public Website dependency |
| --- | --- | --- | --- |
| OpenViking | optional context/memory engine | approved / opt-in | No |
| Needle 2 | bounded local tool-call/extraction router | registered / disabled | No |
| ip-as-logo | mascot/IP creative specialist | enabled on demand | No |
| DSH Anchored Standard | DeepSeek Harness development modifier | conditional / disabled | No |

The machine-readable source for these placements and reviewed commits is `.ai/EXTERNAL_AI_INTEGRATIONS.json`.

## Non-negotiable ownership

The existing ecosystem remains unchanged:

```text
DHP Website
  = business brain + system of record

Publishing Bot
  = social distribution/execution

Telegram Control
  = operator control plane

UMS
  = skill/router layer

External integrations
  = optional subordinate execution/context specialists
```

No external integration may own or silently duplicate canonical products, services, pricing, quotations, leads, CRM, business rules, or Website knowledge. No external integration may write another DHP service's private database directly.

## Integration pattern

```text
External upstream
   |
   v
Pinned reviewed commit + license
   |
   v
UMS/provider-specific adapter
   |
   v
DHP project policy
   |
   v
Optional runtime activation only where justified
   |
   v
DHP-owned API/domain validation + normal quality gates
```

Registration is deliberately different from installation. A registered provider can remain unavailable or disabled indefinitely without breaking the Website.

## 1. OpenViking — optional Context / Memory Engine

### Intended use

OpenViking may support derived/indexed context and subordinate agent/project memory behind a DHP context boundary.

```text
DHP agent/operator workflow
        |
        v
DHP context boundary
        |
        +--> canonical Website knowledge/source files/APIs
        |
        +--> optional OpenViking
                +--> authorized indexed resources
                +--> subordinate memory
```

### Rules

- Website-owned records remain canonical.
- Prefer authorized exports, files, URLs, or repository resources; do not give OpenViking direct ownership of Website tables.
- Provider memory is subordinate context, not accepted project fact by itself.
- Durable memory requires provenance, project isolation, sensitivity review, and normal UMS/project evidence rules.
- Do not bulk-ingest customer PII, private conversations, credentials, or confidential business records merely for retrieval convenience.
- OpenViking failure must not block the public chatbot, lead capture, CRM handoff, Website availability, Publishing Bot, or Telegram Control.
- Do not add OpenViking synchronously to the public request path without a separate architecture decision that demonstrates measured need, data policy, reliability/error handling, rollback, and operational ownership.

### License/dependency boundary

The reviewed upstream is AGPL-3.0. DHP stores only integration metadata/contracts here. Keep the upstream runtime separately operated unless a future explicit decision accepts the applicable license obligations for a different integration mode.

### Cost/provider boundary

OpenViking supports multiple provider arrangements upstream. DHP must not automatically enable a local model, hosted paid model, new account, subscription, top-up, or metered fallback. Current project provider policy wins.

## 2. Needle 2 — optional Local Tool Router

### Intended use

Needle may later be piloted for a small, explicit tool catalog where a structured call can be validated cheaply before execution, for example a device/operator workflow or schema-constrained extraction task.

It is not a general reasoning model, not a coding model, and not a replacement for the DHP AI provider layer.

### Current state

`registered-disabled`

Needle must not be added automatically to:

- the public Website bundle/runtime;
- the public chatbot critical path;
- `.ai/FREE_MODEL_ROUTER.json` as a local coding-model fallback;
- a privileged tool loop that executes a predicted call before DHP permission/domain validation.

### Pilot gate

Before any runtime pilot, define and verify:

1. exact tool catalog and schemas;
2. representative DHP evaluation cases, including wrong-tool and wrong-argument cases;
3. confidence threshold and escalation behavior;
4. permission checks before consequential execution;
5. domain validation after structured extraction/tool routing;
6. target-platform resource and distribution/license requirements;
7. measurable benefit such as latency, offline capability, or provider-cost reduction;
8. a non-Needle fallback.

Needle confidence is routing evidence, not authorization.

## 3. ip-as-logo — Creative / Brand Specialist

`ip-as-logo` is approved as an on-demand external specialist for compact mascot/IP-style character concepts.

Use it when DHP or a DHP client explicitly wants mascot/IP identity exploration. Route through the normal image-generation/brand workflow rather than treating the external skill as brand authority.

```text
brief
 -> UMS image-generation route
 -> optional DHP brand/audience context
 -> pinned ip-as-logo specialist
 -> currently allowed image provider
 -> candidate assets
 -> project/human acceptance
 -> canonical asset only after approval
```

Rules:

- Existing DHP logo, `DESIGN.md`, design tokens, and approved assets remain authoritative.
- Generated concepts are candidates, never automatic replacements.
- User-requested quantity/direction outranks an upstream default batch convention.
- No paid image provider may be activated automatically.
- Do not publish or replace production Website assets outside the normal repository/review path.
- Do not claim assets were generated unless the generation tool actually returned them.

## 4. DeepSeek Harness Anchored Standard — Development Adapter

This integration is development-only and provider-specific.

```text
DHP coding task
 -> DHP/UMS capability + cost policy
 -> provider selected
 -> only if compatible DeepSeek Harness is selected
      -> optional pinned Anchored Standard modifier
 -> normal review
 -> npm run quality
```

Rules:

- Provider selection happens before the preset. The preset never selects or purchases a provider route.
- `.ai/FREE_MODEL_ROUTER.json` remains authoritative for DHP free-only coding-provider behavior.
- `paidApiAutoUse=false`, `autoTopUp=false`, `meteredFallback=false`, and `localRuntime=false` remain intact.
- The upstream preset may gate first-turn context/tool visibility. It may be used only when DHP repository authority, UMS Kernel constraints, security rules, and the active provider/cost policy remain resident outside that gate. If this cannot be proven for the active harness, disable the preset.
- It is not part of the public AI consultant runtime.
- Upstream benchmark/trajectory observations are not DHP acceptance evidence. DHP acceptance remains repository tests, review, security checks, and `npm run quality`.

## Security and privacy

Every activated external runtime must obey the same DHP boundaries as any other provider:

- no secrets in committed configuration;
- no private data sent to an unapproved hosted service;
- least-privilege credentials;
- no direct cross-service database access;
- no bypass of authentication/authorization/platform policy;
- no unnecessary customer PII retention;
- explicit timeout/error handling for network integrations;
- idempotency for writes;
- safe logging without raw credentials or full sensitive payloads.

## Cost policy

Registration never authorizes spending.

Do not automatically:

- buy credits;
- top up balances;
- enable billing;
- upgrade a plan;
- rotate accounts to evade quotas;
- switch from a free-only route to a metered route;
- enable a local coding-model fallback prohibited by current DHP policy.

When an optional provider is unavailable, fall back only within the already-authorized DHP route or report the capability gap.

## Upstream version policy

All four integrations are pinned to a reviewed commit in `.ai/EXTERNAL_AI_INTEGRATIONS.json`.

Do not auto-track upstream `main`. A commit update requires checking:

1. license/terms changes;
2. capability and API/CLI behavior changes;
3. security/privacy changes;
4. compatibility with the UMS adapter;
5. compatibility with DHP architecture/provider policy;
6. relevant DHP/UMS regression tests.

## Rollback

Rollback is provider removal/disablement, not a business-data migration.

- OpenViking: use canonical Website/context sources and standard UMS memory/retrieval paths.
- Needle: use the normal project-approved tool/model route.
- ip-as-logo: use the normal DHP/UMS image-generation workflow.
- DSH Anchored Standard: use the standard project-approved coding-agent harness.

Canonical DHP data must remain usable after any optional integration is removed.

## Definition of Done

An external integration is considered correctly used only when:

- the owning DHP service/domain remains authoritative;
- the actual runtime/provider capability and version were discovered when execution depended on them;
- the reviewed/pinned integration contract was followed;
- project cost, provider, security, privacy, and permission rules were preserved;
- consequential writes passed DHP-owned validation/authorization;
- the public Website did not gain an unapproved hard dependency;
- normal tests/quality gates still pass;
- a defined fallback remains available;
- no canonical DHP data is stranded in the optional runtime.
