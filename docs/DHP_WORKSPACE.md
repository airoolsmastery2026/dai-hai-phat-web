# DHP Workspace v2

## Purpose

DHP Workspace is the internal work surface for Đại Hải Phát AI OS. It borrows familiar document-workspace interaction patterns without copying Notion branding, proprietary assets, or making Notion a runtime dependency.

Workspace v2 has four responsibilities:

1. provide a protected internal page/block work surface under `/admin/workspace`;
2. expose the existing DHP zero-cost model runtime through a narrow OpenAI-compatible facade for trusted clients such as DSH Desktop and Universal Master Skills;
3. search verified Đại Hải Phát proposal evidence through existing DHP APIs instead of duplicating product/price/knowledge data; and
4. import small local TXT/MD/CSV/JSON files into browser-local draft pages without treating them as official business knowledge.

## Ownership boundary

DHP Workspace is **not** a second business system of record.

- Products, services, prices, project evidence, quotes, CRM and durable business knowledge remain owned by the DHP Website APIs and backend stores.
- Workspace pages and blocks are browser-local drafts under `dhp-workspace-v2` in this slice.
- DHP Knowledge lookup calls the existing residential proposal-evidence implementation on the server.
- Imported local files create draft page content only; they do not overwrite PRODUCT_DB, PRICE_DB, CRM_DB or project records.
- Provider credentials never enter browser code.

## Page/block editor

Route: `/admin/workspace`

Workspace v2 supports:

- multiple local pages;
- paragraph blocks;
- heading blocks;
- checklist blocks;
- add/delete pages and blocks;
- manual browser-local save;
- local import for TXT, Markdown, CSV and JSON up to 2 MB.

PDF, Excel workbook and image ingestion are deliberately not faked in the browser. Those formats require the later server-side ingestion/parser pipeline so provenance, file limits, extraction quality and persistence can be controlled centrally.

## DHP Knowledge lookup

Protected endpoint:

`POST /api/admin/workspace/knowledge`

The endpoint validates the query and calls `buildResidentialProposalEvidenceResponse`. It returns verified materials, price references and image references from the same DHP evidence sources already used by proposal workflows.

The browser may pass a bounded JSON summary of this verified result into the Workspace AI request. Page drafts are **not** automatically sent to the model.

## Workspace AI

Protected endpoint:

`POST /api/admin/workspace/chat`

Request:

```json
{
  "message": "Tóm tắt vật liệu phù hợp",
  "knowledgeContext": "{...bounded verified DHP evidence...}"
}
```

`knowledgeContext` is optional and limited to 8,000 characters. It is intended only for structured evidence already returned by the DHP Knowledge endpoint. The current page body is intentionally not auto-attached, reducing accidental disclosure of customer or internal notes to external model providers.

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

## OpenAI-compatible facade

Base URL:

`https://dai-hai-phat-web.vercel.app/api/v1/llm`

Authentication:

`Authorization: Bearer <DHP_LLM_API_KEY>`

Endpoints:

- `GET /models`
- `POST /chat/completions`

The facade advertises one stable virtual model: `dhp-free`. DSH/UMS should request this virtual model instead of pinning a volatile free upstream model. The backend remains responsible for selecting an eligible zero-cost cloud route.

## Production configuration still required

The Vercel production project must have these server-side variables before the protected workspace and external LLM facade are operational:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DHP_LLM_API_KEY`

The values must be configured in Vercel, never committed to Git.

## Next ingestion slice

The next safe server-side ingestion increment should add PDF, XLS/XLSX and image intake with explicit file limits, content-type validation, provenance metadata and a durable workspace-document store. Extracted content must remain workspace material until a separate reviewed workflow promotes it into official DHP knowledge.
