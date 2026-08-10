# Legacy repository consolidation — `dai-hai-phat-web-deployment`

> Source repository: `airoolsmastery2026/dai-hai-phat-web-deployment`  
> Canonical repository: `airoolsmastery2026/dai-hai-phat-web`  
> Audit date: 2026-08-10  
> Status: legacy snapshot only; **not** a production source of truth.

## Purpose

This document preserves the useful product and business knowledge found in the old deployment repository before that repository is retired. It intentionally does **not** import the old runtime, generated Manus scaffold, MySQL/Drizzle stack, tRPC transport, Vite configuration, duplicate UI primitives, lockfile, or deployment glue into the current Next.js application.

The current `dai-hai-phat-web` repository remains the single source of truth.

## Legacy architecture recovered

The old repository was a separate application generation/deployment snapshot with these major parts:

- React/Vite client under `client/`.
- Express/server utilities under `server/`.
- tRPC routes in `server/routers.ts`.
- MySQL schema and migrations under `drizzle/`.
- Manus-specific runtime/helpers and generated UI scaffold.
- A generic `AIChatBox` component.
- Business home page, services/projects/gallery/blog/consultation/contact concepts.
- A `todo.md` describing the intended website/AI-office roadmap.

This architecture is obsolete for the current product because the canonical application is Next.js + TypeScript with App Router APIs, Supabase persistence, current design tokens, and DHP AI Office/Control Plane integrations.

## Business content preserved

The legacy home page captured the residential/interior positioning that is still valid:

- Core scope: **nội thất & cơ khí dân dụng**.
- Main offer: design and construction for actual residential needs.
- Service examples: interior, gates/doors, stairs, railings, canopies.
- Target project types: townhouses, apartments and villas.
- Primary conversion: build a consultation/project dossier rather than send users into a generic marketing funnel.
- Secondary conversion: view completed projects/gallery.
- Phone CTA recorded in the snapshot: `0785.505.518`.

The current homepage already carries the same business positioning and therefore the old page markup is not migrated.

## AI chat behavior worth retaining

The old `AIChatBox` was generic but contains interaction patterns that remain useful as UX requirements:

- `system | user | assistant` message model.
- System messages hidden from the visible transcript.
- Suggested prompts in the empty state.
- Markdown rendering for assistant output.
- Loading/generating state.
- Auto-scroll to the latest response.
- Enter sends; Shift+Enter inserts a new line.
- Input remains focused after sending.
- Separate visual treatment for user and assistant messages.

These are **behavioral requirements only**. The old component is not copied because the current application already has a substantially richer DHP AI Office implementation (`AIOffice*` components) and a different runtime/API architecture.

## Legacy data model inventory

### `users`

Legacy fields: `openId`, name, email, login method, `user|admin` role, created/updated/last-sign-in timestamps.

Decision: do not migrate the Manus OAuth identity model. Authentication/administration must remain on the current architecture.

### `services`

Useful conceptual fields:

- `slug`, `aiService`
- title/subtitle/summary/full description
- features, benefits, process, gallery, FAQ
- image/icon
- SEO title/description/keywords/canonical
- schema.org service metadata

Current mapping: canonical service content lives in `src/content/services.ts` and current service routes/components. Do not create a duplicate services database unless a future product requirement explicitly needs CMS-backed content.

### `projects`

Useful conceptual fields:

- slug, title, category, location, year, client
- description, challenge, solution, workflow
- materials, technologies
- gallery, before/after images, statistics
- testimonial quote/author/role
- FAQ, summary and SEO metadata
- publication state: `verified | unverified | draft`

Current mapping: project/case-study content already exists in `src/content/projects.ts`. The legacy `publicationStatus` concept remains useful if project content is later moved to a managed database/CMS.

### `gallery_images`

Useful conceptual fields:

- optional project/service association
- image URL, title, description, category
- `verified` flag
- display order

Current mapping: the canonical app already has a Gallery API. Keep the **verified asset + explicit ordering** concept; do not migrate the old MySQL table.

### `blog_posts`

Useful conceptual fields:

- slug, AI-service association, title/category
- excerpt/content/highlights/image
- SEO title/description/keywords

Current mapping: canonical blog content already exists in `src/content/blog.ts`; no duplicate table is imported.

### `consultations`

This is the most valuable legacy business model. Fields captured:

- stable `referenceId`
- customer name/phone/email
- service type and project type
- location and free-form description
- images
- dimensions
- materials
- budget and timeline
- priority
- AI proposal and proposal confidence
- workflow state: `draft | submitted | reviewed | quoted | completed`
- source
- created/updated/submitted timestamps

Current mapping: the modern product uses the project-dossier / `project_inquiries` flow and CRM handoff. The following legacy concepts should remain available to future CRM evolution when needed:

1. stable customer-facing reference ID;
2. attachments/images;
3. structured dimensions and materials;
4. AI proposal + confidence/provenance;
5. explicit lifecycle from draft through quotation/completion;
6. source attribution.

Do not recreate the old `consultations` MySQL table next to `project_inquiries`; extend the canonical model deliberately if those fields become required.

### `contact_submissions`

Useful conceptual fields: reference ID, name, phone, email, message, project scope and `new | contacted | completed` status.

Current mapping: customer intake should feed the canonical inquiry/CRM pipeline rather than a second contact database.

## Legacy API/business operations inventory

The old tRPC router exposed these operations:

- Services: list, get by slug.
- Projects: list, get by slug, filter by category.
- Gallery: list/filter; authenticated create.
- Blog: list, get by slug.
- Consultations: create draft, fetch by reference ID, update, submit.
- Contact: submit, fetch by reference ID.
- Basic Manus-auth `me` / logout.

Current architectural decision:

- Static/catalog content uses current Next.js content/routes where appropriate.
- Customer intake uses the canonical `/api/project-inquiries` and CRM handoff path.
- AI functionality belongs to DHP AI Office / Control Plane contracts.
- Do not reintroduce tRPC solely to preserve this legacy API surface.

## Legacy backlog recovered

The old `todo.md` recorded these intended capabilities:

- AI advisory / LLM integration.
- Step-by-step consultation UI.
- Proposal generation from consultation data.
- Draft consultation persistence.
- Service detail pages.
- Project/gallery filtering.
- Blog/checklist, contact, about and privacy pages.
- Responsive navigation and floating Phone/Zalo/back-to-top CTAs.
- FAQ, consultation and contact components.
- Metadata, sitemap, robots, JSON-LD and Open Graph.
- Design tokens, mobile-first responsive behavior, loading/error states.
- Unit tests, performance, responsive and WCAG-AA audits.
- Production deployment verification.

Most of these concerns are already represented or superseded in the current codebase. This list is retained only as historical product intent; it must not override current architecture, roadmap, issues or acceptance criteria.

## Legacy → canonical mapping

| Legacy concept | Canonical location / direction | Decision |
|---|---|---|
| Vite home page | `src/app/page.tsx`, section components, `src/content/home.ts` | Current implementation wins |
| Services DB/routes | `src/content/services.ts` + current service routes | Do not duplicate |
| Projects DB/routes | `src/content/projects.ts` + current project UI | Do not duplicate |
| Blog DB/routes | `src/content/blog.ts` | Do not duplicate |
| Gallery table/router | current `/api/gallery` | Preserve verification/order concepts only |
| Consultation table/router | `/api/project-inquiries` + `/api/crm/handoff` | Extend canonical model only when required |
| Generic AI chat | DHP `AIOffice*` components + AI APIs | Preserve UX patterns, not code |
| Manus OAuth | current admin/auth boundary | Do not migrate |
| Express + tRPC server | Next.js App Router APIs | Do not migrate |
| MySQL + Drizzle | Supabase/current persistence | Do not migrate |
| Manus helpers/debug collector | none | Delete with legacy repo |
| Vite/patches/legacy lockfile | none | Delete with legacy repo |

## Intentionally not migrated

The following legacy material is intentionally excluded from the canonical repository:

- `client/public/__manus__/debug-collector.js` and Manus-specific helpers.
- Generic generated UI component showcase/scaffold.
- `DashboardLayout*` generated shell where it duplicates current UI.
- Vite build/runtime files.
- Wouter patch and old routing layer.
- Express server bootstrap.
- tRPC transport solely used by the legacy application.
- Drizzle/MySQL connector, schema migrations and snapshots.
- Old OAuth/session implementation tied to Manus `openId`.
- Old package lock and dependency graph.
- Generated template metadata.
- Any environment values or deployment credentials.

This prevents the current repository from becoming a second copy of the legacy stack.

## Deployment dependency check

As of the 2026-08-10 audit, the connected Vercel team exposes the canonical project `dai-hai-phat-web` and does **not** expose a Vercel project named `dai-hai-phat-web-deployment`.

This is a strong indication that the legacy repository is not a currently connected Vercel project. It is not, by itself, proof that no third-party webhook, external CI job, manually configured secret, mirror or historical deployment references the repository.

## Deletion checklist

Do **not** delete the legacy repository until all boxes below are complete:

- [x] Consolidation record is stored in `dai-hai-phat-web`.
- [x] Current Vercel team checked: no project named `dai-hai-phat-web-deployment`.
- [x] No `.github` workflow was present in the audited legacy tree.
- [x] No `vercel.json` was present in the audited legacy tree.
- [ ] Check repository Settings → Webhooks for any external webhook that must be retained.
- [ ] Check repository Settings → Secrets and variables → Actions/Dependabot/Codespaces for unique values that exist nowhere else.
- [ ] Check Deploy keys / GitHub Apps / branch protection if any external system may still read the repository.
- [ ] Optionally create a final GitHub archive/export if historical commit-level recovery matters.
- [ ] Only then delete or archive `dai-hai-phat-web-deployment`.

## Source files audited

High-value files read during consolidation:

- `client/src/pages/Home.tsx`
- `client/src/components/AIChatBox.tsx`
- `drizzle/schema.ts`
- `server/routers.ts`
- `server/db.ts`
- `drizzle/0002_late_hawkeye.sql`
- `todo.md`
- full recursive repository tree

The full source code is intentionally not copied here. This document captures the durable domain knowledge needed after the legacy repository is retired.
