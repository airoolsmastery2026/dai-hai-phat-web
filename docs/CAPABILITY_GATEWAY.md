# DHP Backend Capability Gateway

Status: Accepted — 2026-08-15

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
| `model-runtime` | Optional model runtime | Ollama or another adapter |
| `media` | Media workflow / media library | Immich; existing `/v1/media` remains native |
| `notifications` | Email/SMS/push/in-app orchestration | Novu |
| `analytics` | Privacy-friendly product analytics | Plausible |
| `internal-tools` | Back-office dashboards/tools | ToolJet |
| `content` | Optional headless content service | Strapi |
| `platform-services` | Optional platform services without replacing Website data ownership | Appwrite |
| `external-data` | Curated external APIs for concrete features | APIs selected from public-apis |
| `oss-discovery` | Discover self-hosted alternatives | awesome-selfhosted; discovery only |

Candidate names are backend metadata, not application dependencies. A candidate can be replaced without changing the public website contract.

## Capability states

- `native`: DHP already has a first-party Control Plane route for the capability.
- `configured`: a server-side HTTP adapter is configured and can be invoked.
- `reserved`: the stable slot exists but no external adapter is configured yet.
- `catalog`: discovery-only capability; it is never invoked by the public web.

A missing optional adapter must not degrade Website availability.

## HTTP adapter contract

The backend gateway exposes authenticated capability discovery and, only for configured runtime adapters, a constrained JSON execution contract.

```text
GET  /v1/capabilities
GET  /v1/capabilities/:capability
POST /v1/capabilities/:capability/execute
```

Execution requires the existing project-scoped DHP key and the `admin` role. Provider credentials stay in the backend environment. The adapter receives a versioned JSON envelope containing the capability ID, project ID, actor ID and input payload.

The gateway does not expose an arbitrary URL proxy. Capability IDs and route segments are allowlisted, request bodies are size-limited, outbound requests have a timeout, and provider failures are isolated from the public web.

## Web integration

Server code uses `src/lib/server/capability-gateway.ts`. It does not import provider packages or provider names.

The current Supabase deployment runs the capability backend as the sibling Edge Function `dhp-capability-gateway`. `DHP_CAPABILITY_GATEWAY_URL` is an optional server-side override for future hosting changes; when omitted on the current Supabase topology the URL is derived from `DHP_CONTROL_PLANE_URL`.

The admin proxy keeps `/api/ai/control-plane/*` protected by the existing Basic Auth boundary and forwards the `capabilities` root to the capability backend.

## Activation rule for a provider

1. Prove a concrete DHP feature needs the capability.
2. Keep the provider outside the Next.js runtime.
3. Expose the provider through a stable DHP HTTP adapter.
4. Configure the adapter URL/token only in backend secrets.
5. Verify health, timeout, authentication, failure handling and rollback.
6. Call the stable capability ID from server code.
7. Do not change Website data ownership merely to adopt a provider.

This keeps the website fast and replaceable while preserving a ready backend socket for future capabilities.
