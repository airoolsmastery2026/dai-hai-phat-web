---
name: dhp-core
description: Core Đại Hải Phát project rules and operating context for DeepSeek Harness agents working in this repository.
---

# DHP Core

Use this skill for every task in the Đại Hải Phát repository.

## Source of truth

1. Treat this Git repository as the project source of truth.
2. Read `AGENTS.md` and `README.md` before non-trivial work.
3. For UI work also read `DESIGN.md`, `COMPONENTS.md`, and `.ai/UI_PROMPT.md`.
4. Prefer repository facts over assumptions. Never invent business data, prices, specifications, credentials, or deployment state.

## Architecture lock

- Keep Next.js + TypeScript.
- Keep the existing Tailwind v3/design-token approach.
- Do not add packages or files unless they are necessary.
- Do not perform random redesigns or framework migrations.
- Keep changes scoped and reversible.

## DHP priorities

Apply this order when trade-offs exist:

1. Mobile First
2. Performance
3. Customer Experience
4. AI capability
5. SEO
6. Security
7. Maintainability

## Model and cost policy

- `.ai/FREE_MODEL_ROUTER.json` is the runtime routing source of truth.
- Cloud providers only for LLM inference.
- Prefer verified free tier/free quota providers.
- Route DSH/UMS through the DHP virtual provider `dhp-free` when configured.
- Rotate between compatible cloud providers on quota/rate-limit/health failure behind the DHP gateway.
- Never fall back to local LLM/Ollama.
- Never enable paid or metered fallback automatically.
- Never commit API keys or secrets.

## Completion gate

For substantial code changes, do not claim completion until the repository quality gate succeeds:

```bash
npm run quality
```

If the quality gate cannot be run, report that limitation explicitly and do not present the change as production-verified.