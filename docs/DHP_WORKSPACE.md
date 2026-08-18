# DHP Workspace v2

## Purpose

DHP Workspace is the internal work surface for Đại Hải Phát AI OS. It borrows familiar document-workspace interaction patterns without copying Notion branding, proprietary assets, or making Notion a runtime dependency.

Workspace v2 provides:

1. a protected internal page/block work surface under `/admin/workspace`;
2. the existing DHP zero-cost model runtime through a narrow OpenAI-compatible facade for trusted clients such as DSH Desktop and Universal Master Skills;
3. verified Đại Hải Phát proposal evidence through existing DHP APIs instead of duplicating product/price/knowledge data; and
4. a durable Document Inbox for controlled workspace-document ingestion.

## Ownership boundary

DHP Workspace is **not** a second business system of record.

There are three deliberately separate data states:

1. **Local draft** — page/block content under `dhp-workspace-v2` in browser localStorage.
2. **Workspace document** — uploaded raw document plus provenance metadata in the private Document Inbox. It is not official business knowledge.
3. **Official DHP Knowledge** — reviewed/verified business data owned by DHP APIs and knowledge stores.

Products, services, prices, project evidence, quotes, CRM and durable business knowledge remain owned by the DHP Website APIs and backend stores. Neither a local draft nor a Document Inbox upload is automatically promoted into PRODUCT_DB, PRICE_DB, CRM_DB or any official knowledge source.

## Page/block editor

Route: `/admin/workspace`

Workspace supports:

- multiple local pages;
- paragraph blocks;
- heading blocks;
- checklist blocks;
- add/delete pages and blocks;
- manual browser-local save;
- local import for TXT, Markdown, CSV and JSON.

Local import is for working drafts only and does not persist the source file server-side.

## Durable Document Inbox

Route: `/admin/workspace/documents`

Protected API:

- `GET /api/admin/workspace/documents`
- `POST /api/admin/workspace/documents`

Upload writes require same-origin validation in addition to the existing admin authentication boundary.

### Accepted formats and limits

Direct text extraction:

- TXT
- Markdown
- CSV
- JSON
- maximum 512 KB

Raw ingestion pending a trusted extractor:

- PDF
- XLS
- XLSX
- JPG/JPEG
- PNG
- WEBP
- maximum 4 MB

For every accepted file the server:

1. validates filename extension and MIME type;
2. enforces size limits;
3. calculates SHA-256;
4. reuses an existing record when the same content hash already exists;
5. uploads the raw object to the private `dhp-workspace-documents` Supabase Storage bucket;
6. records provenance and extraction status in `public.dhp_workspace_documents`; and
7. removes the newly uploaded object if metadata insertion fails.

Text formats are decoded server-side and stored with `extraction_status = 'extracted'`. PDF, Excel and images are stored with `extraction_status = 'pending_extraction'`; the system does not invent or guess their contents.

The metadata table has RLS enabled and public/authenticated access revoked. Browser code never receives the Supabase service-role key.

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

Document Inbox content is likewise not automatically passed to the model. A later reviewed extraction/promotion flow must explicitly decide which extracted evidence may become AI context or official DHP Knowledge.

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

The existing `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are also required server-side for the durable Document Inbox.

Secret values must be configured in Vercel, never committed to Git.

## Next extraction/promotion slice

The next safe increment is an extractor worker for records in `pending_extraction`, followed by an explicit review/promotion workflow. Extraction must preserve document ID, SHA-256, source filename and extraction status. Promotion into official DHP Knowledge must be a separate auditable action rather than a side effect of upload.
