# Admin Scaffold Integration

## Status

The uploaded `admin-scaffold-dai-hai-phat` package has been adapted to the current Dai Hai Phat Website architecture rather than copied into the repository verbatim.

## Integrated routes

- `/admin` — unified admin hub.
- `/admin/inquiries` — reads the canonical `project_inquiries` store through the existing server-only Supabase REST boundary.
- `/admin/projects` — review-only view over `UNVERIFIED_PROJECT_DRAFTS`; it cannot publish unverified project claims.
- `/admin/pricing` — compatibility route with publishing locked until a verified pricing data migration is specified.
- `/admin/reviews` — compatibility route with publishing locked until consent, provenance, and approval evidence can be persisted.
- `/admin/videos` — compatibility redirect to the existing `/admin/media/videos` manager.

Existing `/admin/ai`, `/admin/media`, `/admin/publishing`, and `/admin/workspace` modules remain unchanged.

## Deliberately not copied

### Supabase browser SDK and Google OAuth

The scaffold expected `@supabase/ssr`, `@supabase/supabase-js`, public Supabase environment variables, `/admin/login`, `/auth/callback`, and middleware-managed Google login.

The current repository already protects the complete `/admin/:path*` namespace with the centralized Basic Auth proxy and keeps the Supabase service-role credential server-side. Introducing the scaffold authentication path would create two competing admin authentication systems, so it is not adopted in this batch.

### Duplicate `inquiries` table

The Website already owns durable customer intake through `project_inquiries`. The scaffold `inquiries` table is not created. The admin view reads the canonical store instead.

### Shadow CMS tables

The scaffold proposed `projects`, `pricing_items`, `reviews`, and `videos` tables with browser-side CRUD and direct publish toggles. They are not introduced in this batch because:

- project publication is gated by verification and current public projects are repository-controlled;
- pricing requires verified source date, range/unit semantics, confidence, and survey/review status;
- testimonials require verified identity/source and consent evidence;
- video management already has a canonical admin module.

Creating parallel tables before migrating the current sources would introduce multiple sources of truth.

## Security and data invariants

- No new dependency is added.
- No `NEXT_PUBLIC_*` Supabase credential is introduced.
- No service-role key reaches the browser.
- `/admin` remains protected by the existing proxy.
- No public content is changed by this integration.
- No destructive database migration is included.

## Follow-up required before write-enabled CMS

A future write-enabled CMS batch should define one migration per content domain, seed or reconcile existing canonical records, preserve verification metadata, use server-side write APIs with auditability, add authorization tests, and switch public readers only after migration verification. Until then, the compatibility routes fail closed instead of creating shadow data.
