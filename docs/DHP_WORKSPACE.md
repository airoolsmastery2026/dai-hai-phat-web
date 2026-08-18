# DHP Workspace v1

## Purpose

DHP Workspace is the internal work surface for Đại Hải Phát AI OS. It borrows familiar document-workspace interaction patterns without copying Notion branding, proprietary assets, or making Notion a runtime dependency.

The workspace has two responsibilities:

1. provide a calm internal note/work surface under `/admin/workspace`; and
2. expose the existing DHP zero-cost model runtime through a narrow OpenAI-compatible facade for trusted clients such as DSH Desktop and Universal Master Skills.

## Ownership boundary

DHP Workspace is **not** a second business system of record.

- Products, services, prices, project evidence, quotes, CRM and durable business knowledge remain owned by the DHP Website APIs and backend stores.
- The v1 editor stores only a personal browser-local draft under `dhp-workspace-draft-v1`.
- The workspace must use DHP APIs when durable business data is connected in later slices.
- Provider credentials never enter browser code.

## Zero-cost LLM policy

All workspace text inference goes through the existing `model-runtime` Capability Gateway.

Every request from the Website runtime to that capability includes:

```json
{
  "freeOnly": true,
  "allowPaid": false
}
```

The successful gateway envelope must still prove:

```json
{
  "tier": "free",
  "verifiedFree": true
}
```

If no verified zero-cost cloud route is configured or quota is unavailable, the request fails closed. DHP Workspace does not automatically enable a paid provider and does not add a local-model fallback.

## Admin workspace

Route: `/admin/workspace`

The existing `/admin/*` protection applies. The right-hand assistant calls the same-origin protected endpoint:

`POST /api/admin/workspace/chat`

Request:

```json
{
  "message": "Tóm tắt kế hoạch này"
}
```

The response reports the actual routed provider/model together with the free-tier verification flag. The browser never receives provider credentials.

## OpenAI-compatible facade

Base URL:

`https://<your-dhp-domain>/api/v1/llm`

Authentication:

`Authorization: Bearer <DHP_LLM_API_KEY>`

Endpoints:

- `GET /models`
- `POST /chat/completions`

The facade advertises one stable virtual model: `dhp-free`. Clients should request this virtual model instead of pinning a volatile free upstream model. The backend remains responsible for selecting an eligible zero-cost cloud route.

### Example client configuration

```text
Provider type: OpenAI-compatible
Base URL: https://<your-dhp-domain>/api/v1/llm
API key: <DHP_LLM_API_KEY>
Model: dhp-free
```

This is the intended integration point for DSH Desktop / UMS provider registries once the endpoint is deployed and verified.

## v1 limitations

- text chat only;
- non-streaming chat completions (`stream: true` is rejected);
- no fake token-usage accounting;
- browser editor drafts are local only;
- no claim of unlimited free usage: upstream zero-cost quotas and availability remain finite and volatile;
- no direct CRM/product/price reads are implied by the assistant unless those records are explicitly supplied through future DHP API context tools.

These limits keep the first slice small, reversible, and aligned with the accepted Capability Gateway boundary.
