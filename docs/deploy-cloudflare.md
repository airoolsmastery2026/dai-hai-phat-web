# Cloudflare Workers deployment

## Scope

This is a parallel deployment path for the existing Next.js + TypeScript application. It does not replace Vercel, change DNS, or use output: "export".

Cloudflare currently recommends vinext for full-stack Next.js applications on Workers. vinext is non-destructive: the existing Next.js configuration and next dev workflow remain available. OpenNext remains the fallback if a vinext compatibility gap blocks this repository.

References:
- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- https://github.com/cloudflare/vinext/releases

## Repository setup

Pinned deployment toolchain:
- Next.js: 16.2.12
- React / React DOM: 19.2.8
- eslint-config-next: 16.2.12
- vinext: 1.0.0-beta.12
- @vinext/cloudflare: 1.0.0-beta.10
- Vite: 8.3.1
- @cloudflare/vite-plugin: 1.61.0
- Wrangler: 4.142.0

The Cloudflare adapter is isolated to vite.config.ts and wrangler.jsonc. Shared application routes, domain logic, and next.config.js remain unchanged.

## Local verification

Install from the committed lockfile:

```bash
npm ci
```

Run the normal Next.js development server (unchanged):

```bash
npm run dev
```

Run the vinext compatibility scan:

```bash
npx vinext check
```

Build the Workers target:

```bash
npm run build:vinext
```

Preview the built application in the Workers runtime:

```bash
npm run preview:cloudflare
```

Inspect the Worker bundle without deploying:

```bash
npx wrangler deploy --outdir .wrangler-bundle --dry-run
```

The dry-run reports both Total Upload (uncompressed) and gzip size.

## Bundle gate

The historical 3 MiB compressed Worker limit is no longer the Cloudflare platform limit. Since September 4, 2026, Cloudflare checks the uncompressed Worker bundle and allows up to 64 MiB on both Free and Paid plans. The gzip number remains useful as a project-level size regression signal.

For this migration, record both values. The project acceptance gate remains the conservative target of gzip < 3 MiB; regardless of that internal target, the actual Cloudflare platform hard limit is 64 MiB uncompressed.

Do not switch to Workers Paid if the bundle or workload exceeds the Free plan limits. Stop and report the blocker.

## Deploy

Authenticate Wrangler locally:

```bash
npx wrangler login
```

Verify the account:

```bash
npx wrangler whoami
```

Dry-run first:

```bash
npx wrangler deploy --outdir .wrangler-bundle --dry-run
```

Preview:

```bash
npx wrangler dev
```

Production deployment, only after the PR has passed its quality and Cloudflare preview checks:

```bash
npm run deploy:cloudflare
```

No billing upgrade, prepaid balance, or paid Worker plan is required or should be enabled for this deployment path.

## Runtime secrets / variables

Declare values in Cloudflare Workers Variables & Secrets. Never commit values.

Observed server-side configuration required by the current application:

### Customer data persistence
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

SUPABASE_SERVICE_ROLE_KEY is server-only and must never use a NEXT_PUBLIC_* name.

### Telegram notification
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID

### AI direct-runtime controls
- GEMINI_API_KEY
- DHP_AI_SDK_RUNTIME
- DHP_AI_SDK_VERIFIED_FREE
- DHP_AI_ALLOW_PAID
- DHP_AI_SDK_MODEL

Keep paid execution disabled for the $0 path and only enable direct Google runtime when its quota is independently verified as free.

### DHP control-plane / capability gateway
- DHP_CONTROL_PLANE_URL
- DHP_CAPABILITY_GATEWAY_URL (optional when it can be derived from DHP_CONTROL_PLANE_URL)
- DHP_CONTROL_PLANE_KEY_ID
- DHP_CONTROL_PLANE_SECRET
- DHP_CONTROL_PLANE_TIMEOUT_MS (optional; defaults to 30000 ms)

Do not expose any of these server credentials to the browser.

## Cloudflare Builds

When connecting the repository to Workers Builds, configure the Worker to listen to the intended production branch. Keep production on main until Cloudflare preview verification and the PR are complete.

Recommended commands:
- Build: npm run build:vinext
- Deploy: npm run deploy:cloudflare
- Preview: npm run preview:cloudflare

Vercel remains the existing production platform until DNS and production cutover are explicitly performed.

## Rollback

1. Do not change DNS during this migration.
2. If Cloudflare preview fails, leave Vercel untouched.
3. Close or revert the Cloudflare PR if necessary.
4. Continue serving the existing Vercel deployment.
5. Only after a separately approved cutover should DNS be changed.
6. If Cloudflare production has later been enabled, restore the previous DNS target and keep Vercel available until rollback is verified.

## Zero-cost guardrails

- No Workers Paid plan.
- No automatic billing or plan upgrade.
- No paid AI fallback.
- No API keys in Git.
- No output: "export".
- No Cloudflare-specific business logic in shared application modules.
- Vercel and Cloudflare remain independently deployable until cutover.
