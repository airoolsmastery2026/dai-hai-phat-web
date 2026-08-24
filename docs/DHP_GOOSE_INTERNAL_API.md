# DHP Goose Internal API

## Status

Implemented first slice for the internal runtime link between the Dai Hai Phat Website and a user-controlled `goose-DHP` local execution node.

Current implementation:

- `POST /api/v1/internal/runtime/handshake`
- service identity `goose-desktop`
- dedicated `GOOSE_DESKTOP_SERVICE_API_KEY`
- strict `absolute-zero` cost-mode gate
- bounded capability/provider metadata
- no new database, queue, package, or public browser credential

The Website remains the business brain and system of record. Goose is an execution runtime only.

## Boundary

```text
DHP Website / canonical business APIs
              ^
              | authenticated /api/v1/internal/*
              |
       DHP Goose Desktop
              |
             ACP
              |
       local runtime / MCP
```

The Website must continue operating when Desktop is absent or offline. A public browser must never receive or store the internal service credential.

## Authentication

Internal Goose runtime requests use a dedicated least-privilege credential:

```http
Authorization: Bearer <GOOSE_DESKTOP_SERVICE_API_KEY>
X-DHP-Source-Service: goose-desktop
Content-Type: application/json
```

`GOOSE_DESKTOP_SERVICE_API_KEY` is separate from `ECOSYSTEM_SERVICE_API_KEY`. A Desktop node must not receive the credential used by Publishing Bot, Telegram Control, or monitoring services. Both credentials remain server/local-runtime configuration and must never be committed or exposed to public browser JavaScript.

## Runtime handshake

```text
POST /api/v1/internal/runtime/handshake
```

Purpose:

- authenticate a DHP Goose execution node;
- establish runtime version and ACP transport;
- prove that the node is operating under `absolute-zero` cost policy;
- advertise supported capabilities and detected local-provider names;
- return the Website-owned policy boundary.

Example request:

```json
{
  "nodeId": "dhp-pc-main",
  "runtime": "goose-desktop",
  "runtimeVersion": "1.47.0-dhp.1",
  "transport": "acp-loopback",
  "costMode": "absolute-zero",
  "capabilities": [
    "acp",
    "mcp",
    "filesystem.read",
    "workspace.execute",
    "research"
  ],
  "localProviders": ["ollama", "llama.cpp"]
}
```

Only these initial capabilities are accepted:

- `acp`
- `mcp`
- `filesystem.read`
- `workspace.execute`
- `research`

Unknown capabilities are ignored. A request with no supported capability is rejected.

Example success envelope:

```json
{
  "schemaVersion": "1.0",
  "requestId": "uuid",
  "data": {
    "service": "dai-hai-phat-web",
    "requestedBy": "goose-desktop",
    "runtimeNode": {
      "accepted": true,
      "nodeId": "dhp-pc-main",
      "runtime": "goose-desktop",
      "runtimeVersion": "1.47.0-dhp.1",
      "transport": "acp-loopback",
      "costMode": "absolute-zero",
      "capabilities": ["acp", "mcp", "filesystem.read"],
      "localProviders": ["ollama", "llama.cpp"],
      "policyVersion": "1.0"
    },
    "policy": {
      "paidApiAutoUse": false,
      "autoTopUp": false,
      "meteredFallback": false,
      "websiteRemainsSourceOfTruth": true,
      "directDatabaseAccess": false,
      "directProductionWrite": false
    }
  }
}
```

## Zero-dollar enforcement

The handshake fails when `costMode` is not exactly `absolute-zero`.

This endpoint does not itself select or launch a model. Provider/model eligibility remains the responsibility of the Zero-$ execution policy before Goose executes a task.

## Data ownership

Handshake data is runtime metadata, not customer or business data. The first slice does not persist node registrations and does not create a new database.

Goose must use Website-owned versioned APIs for business operations. It must never receive direct database credentials merely because it completed the runtime handshake.

## Security invariants

- dedicated Goose credential; no reuse of the ecosystem-wide credential on Desktop;
- no browser-facing service token;
- no direct database access;
- no direct production write granted by handshake;
- no paid/metered runtime accepted;
- no runtime secret is echoed in the response;
- `Cache-Control: private, no-store`;
- node identifiers and versions are length/pattern constrained;
- capability and provider arrays are bounded.

## Next slices

Only add these when a concrete workflow needs them:

```text
GET  /api/v1/internal/runtime/policy
POST /api/v1/internal/runtime/jobs/claim
POST /api/v1/internal/runtime/jobs/:jobId/result
POST /api/v1/internal/runtime/events
```

A job API must be idempotent, authenticated, auditable, and backed by an explicit Website-owned job domain before implementation. Do not create an in-memory or ad-hoc queue just to connect Desktop.