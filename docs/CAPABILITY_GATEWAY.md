# DHP Backend Capability Gateway

Status: Accepted — 2026-08-15; model-runtime boundary clarified 2026-08-18

## Decision

Dai Hai Phat Web stays a lightweight Next.js/TypeScript product. Optional OSS, AI runtimes, media systems, notification systems, analytics, internal tools, CMSs and external-data tools live behind a server-side capability boundary.

The browser and public UI never call those providers directly. Website code calls stable capability IDs through the DHP backend gateway, which reuses the existing server-side DHP Control Plane credentials.

## Runtime boundary

```text
Browser / public UI
        |
        v
Dai Hai Phat Web (Next.js)
        |
        | server-only adapter
        v
DHP Capability Gateway
        |
        +--> provider adapter(s), only when configured
        |
        +--> existing native Control Plane routes
```

The production website must not gain provider SDKs, provider URLs, provider tokens or `NEXT_PUBLIC_*` provider configuration for this layer.

## Stable capability IDs

| Capability | Intended use | Current candidate(s) |
| --- | --- | --- |
| `agent-runtime` | Agent workspace / skill execution | OpenWork; existing `/v1/skills` remains native |
| `workflow` | Agent workflow and RAG orchestration | Dify |
| `knowledge` | Knowledge retrieval / enrichment | Dify or a future adapter |
| `model-runtime` | Cloud-only zero-cost model routing and quota failover | OpenRouter free router first; additional verified-free cloud adapters may be added behind the gateway |
| `media` | Media workflow / media library | Immich; existing `/v1/media` remains native |
| `notifications` | Email/SMS/push/in-app notification orchestration | Novu |
| `analytics` | Privacy-friendly product analytics | Plausible |
| `internal-tools` | Back-office dashboards/tools | ToolJet |
| `content` | Optional headless content service | Strapi |
| `platform-services` | Optional platform services without replacing Website data ownership | Appwrite |
| `external-data` | Curated external APIs for concrete features | APIs selected from public-apis |
| `oss-discovery` | Discover self-hosted alternatives | awesome-selfhosted; discovery only |

Candidate names are backend metadata, not application dependencies. A candidate can be replaced without changing the public website contract.

`model-runtime` is hard-locked to cloud providers with a verifiable zero-cost route. Local/Ollama execution and automatic paid fallback are not part of this capability. A provider credential is eligible only when stored in backend secrets; it is never copied into the Website environment.

## Capability states

- `native`: DHP already has a first-party Control Plane route for the capability.
- `configured`: a server-side HTTP adapter or internal backend implementation is configured and can be invoked.
- `reserved`: the stable slot exists but no external adapter/provider credential is configured yet.
- `catalog`: discovery-only capability; it is never invoked by the public web.

A missing optional adapter must not degrade Website availability.

## HTTP adapter contract

The backend gateway exposes authenticated capability discovery and, only for configured runtime adapters, a constrained JSON execution contract.

```text
GET  /v1/capabilities
GET  /v1/capabilities/:capability
POST /v1/capabilities/:capability/execute
```

`model-runtime` also exposes an authenticated backend-only catalog view:

```text
GET /v1/capabilities/model-runtime/catalog
```

The catalog is discovery/telemetry only. Runtime eligibility is decided by the backend zero-cost verifier; model names alone never prove that a model is free.

Execution requires the existing project-scoped DHP key and the `admin` role. Provider credentials stay in the backend environment. The adapter receives a versioned JSON envelope containing the capability ID, project ID, actor ID and input payload.

The gateway does not expose an arbitrary URL proxy. Capability IDs and route segments are allowlisted, request bodies are size-limited, outbound requests have a timeout, and provider failures are isolated from the public web.

### `model-runtime` core text envelope

Website input is constrained to the allowlisted core text tasks `project-analysis` and `sales-engineer`. Every request must explicitly declare the zero-cost lock:

```json
{
  "task": "project-analysis",
  "schemaVersion": "1.0",
  "freeOnly": true,
  "allowPaid": false,
  "prompt": "..."
}
```

The same envelope is used for `sales-engineer` by changing only `task`. A successful backend response must include `tier: "free"` and `verifiedFree: true` together with provider/model metadata and the generated text. The Website rejects output that cannot prove those flags.

Project Analysis and Sales Engineer are cache-first and have no direct Gemini fallback. If the zero-cost backend is not configured, exhausted or unavailable, those routes fail closed while preserving the project state instead of silently using a provider whose billing status cannot be proven. Sales Engineer provider prompts exclude direct customer identity/contact fields; handoff readiness is derived from trusted server-side tool results.

Specialized image generation and Gemini Live remain separate capabilities until a verified-free backend entitlement exists for them. They must not be described as covered by the core text zero-cost hard-lock.

## Web integration

Server code uses `src/lib/server/capability-gateway.ts`. It does not import provider packages or provider names. `src/lib/server/model-runtime-capability.ts` owns the typed Website contract for the `model-runtime` capability.

The current Supabase deployment runs the capability backend as the sibling Edge Function `dhp-capability-gateway`. `DHP_CAPABILITY_GATEWAY_URL` is an optional server-side override for future hosting changes; when omitted on the current Supabase topology the URL is derived from `DHP_CONTROL_PLANE_URL`.

The admin proxy keeps `/api/ai/control-plane/*` protected by the existing Basic Auth boundary and forwards the `capabilities` root to the capability backend.

## Activation rule for a provider

1. Prove a concrete DHP feature needs the capability.
2. Keep the provider outside the Next.js runtime.
3. Prove the selected route is zero-cost using provider-reported/machine-readable pricing or an explicit current backend policy.
4. Expose the provider through a stable DHP backend adapter or internal capability implementation.
5. Configure provider URL/token only in backend secrets.
6. Verify health, timeout, authentication, quota/rate-limit handling and rollback.
7. Call the stable capability ID from server code.
8. Never auto-enable paid billing/top-up or change Website data ownership merely to adopt a provider.

This keeps the website fast and replaceable while preserving a ready backend socket for future capabilities.
