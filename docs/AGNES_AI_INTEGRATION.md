# DHP-AIOS — Agnes AI Integration

## Decision

Agnes AI is registered as an **optional provider/runtime adapter** for DHP-AIOS. It is not a Website production dependency and does not become business, knowledge, CRM, pricing, permission, or orchestration authority.

## Placement

```text
DHP-AIOS
  -> AI Orchestrator / existing chatbot boundary
  -> provider-neutral model route
  -> optional Agnes adapter
       -> Agnes 2.5 Flash (text/vision/coding/reasoning/tools)
       -> Agnes Image 2.1 Flash (image)
       -> Agnes Video V2.0 (video)
```

AgnesCode is a separate optional agent/app runtime. It must not replace the Next.js/TypeScript Website architecture or become a public chatbot dependency.

## Official upstream reviewed

- Skills: `AgnesAI-Labs/skills`
- Reviewed commit: `0723eb7fb8f8c9847d428bf76256d50ca68a10a5`
- Official model reference: `agnes-ai-models`
- Review date: 2026-08-28

The upstream skill documents an OpenAI-compatible API and currently recommends `agnes-2.5-flash`, `agnes-image-2.1-flash`, and `agnes-video-v2.0`. Model availability, limits and terms can change, so production-critical values must be checked at activation time.

## Configuration contract

```text
AGNES_API_KEY=<server-side secret>
AGNES_BASE_URL=https://apihub.agnes-ai.com/v1
```

The API key must never enter source control, browser code, logs, screenshots, or client-side configuration.

## Provider routing

### Default text/vision/coding/reasoning/tool route

```text
model = agnes-2.5-flash
endpoint = /v1/chat/completions
```

### Image route

```text
model = agnes-image-2.1-flash
endpoint = /v1/images/generations
```

### Video route

```text
model = agnes-video-v2.0
endpoint = /v1/videos
```

Video jobs must be treated as asynchronous. Do not report success until the provider result is actually available and the DHP workflow accepts it.

## Endpoint policy

International primary:

```text
https://apihub.agnes-ai.com/v1
```

International alternate:

```text
https://apihub.agnes-ai.cn/v1
```

China service:

```text
https://api.agnes-ai.cn/v1
```

Only use the alternate international endpoint to recover from network/DNS/TLS/connection-timeout failures. Do not rotate endpoints to evade `400`, `401`, `403`, `422`, or `429` responses.

## Cost policy

Agnes is classified as `zero-cost-first`, not `free-unlimited`.

The adapter must never:

- enable billing;
- buy credits;
- top up automatically;
- rotate accounts to evade quotas;
- silently switch to a metered route;
- bypass API authentication or rate limits.

When Agnes is unavailable, use the existing project-approved provider route under the same cost policy.

## Reliability policy

Retry only transient failures (`408`, `429`, `500`, `502`, `503`, `504`, `520`, `522`, `524`) with bounded exponential backoff and jitter. Keep retries within the active request budget and do not blindly repeat consequential side effects.

Minimum provider failure classes:

`unavailable | auth | quota | rate-limit | invalid-schema | provider-change | execution-failed | policy-block`

## DHP security/data boundary

- DHP remains the business system of record.
- Agnes must not write directly to DHP databases.
- Customer PII and private project material may only be sent through an explicitly authorized provider/data-flow boundary.
- Provider output is untrusted evidence until the owning DHP domain validates it.
- Tool calls remain subject to DHP/UMS permission and domain gates.
- Agnes failure must not block public chatbot access, intake, CRM handoff, or canonical Website content.

## Integration modes

### Phase A — enabled provider adapter

Use Agnes for controlled development/smoke/benchmark tasks without changing the public chatbot critical path.

### Phase B — model routing pilot

Allow DHP Orchestrator to select Agnes for suitable low-risk tasks after capability and quota checks. Keep a deterministic fallback provider.

### Phase C — production opt-in

Only after benchmark, reliability, privacy and cost checks pass. Agnes remains removable and optional.

## Acceptance tests

1. No API key appears in client bundles.
2. Missing Agnes configuration does not break the Website build or chatbot.
3. Agnes `429` does not trigger paid fallback or endpoint/account rotation.
4. Network timeout may use the configured alternate international route once, when policy permits.
5. Tool calls still pass the existing permission/domain validation.
6. Agnes output cannot become canonical pricing, CRM, customer, or product truth without normal DHP validation.
7. Public chatbot remains functional when Agnes is disabled.
8. `npm run quality` remains the merge gate.

## Rollback

Disable the Agnes provider registration/configuration. No canonical DHP data migration is allowed or required. The existing provider route becomes the fallback.
