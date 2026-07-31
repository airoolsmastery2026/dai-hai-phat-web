# DAI HAI PHAT AI OS — AI Contributor Guide

This file is the entry point for every AI coding agent working in `dai-hai-phat-web`.

The repository is the single source of truth. Inspect the current code, tests, branch, and pull request before making assumptions.

## Required reading

Read `README.md` before starting. For every UI change, also read these files completely:

1. `DESIGN.md`
2. `COMPONENTS.md`
3. `.ai/UI_PROMPT.md`

## Product scope

The product serves residential gates, doors, stairs, railings, awnings, interiors, and home renovation. Do not expand toward industrial mechanical works or large structural projects unless explicitly requested.

## Priority order

1. Mobile First
2. Performance First
3. Customer Experience
4. AI First
5. SEO
6. Security
7. Maintainability

## Architecture rules

- Keep Next.js, TypeScript, Tailwind CSS v3, verified content, and the current architecture.
- Do not add packages, files, components, or abstractions without a clear need.
- Reuse existing sources of truth and design tokens.
- Never hardcode or expose secrets, tokens, API keys, or private configuration.
- Work only inside the explicit task or current batch scope.

## Continuous execution mode

AI agents are authorized to execute continuously on GitHub. Do not ask for repeated confirmation and do not stop after each file or commit.

Stop only for a real code or test error, missing access, mandatory missing data, or a high-risk change such as framework replacement, destructive migration, authentication redesign, data deletion, or major architecture change.

## GitHub workflow

1. Inspect `main`, open pull requests, related implementation, and existing tests.
2. Create one branch for one coherent objective.
3. Batch related changes together.
4. Use `[skip ci]` on intermediate commits to avoid repeated GitHub Actions and Vercel runs.
5. Create one final commit without `[skip ci]` when the batch is ready.
6. Require lint, type-check, unit tests, and production build to pass.
7. Merge only after GitHub Quality succeeds.
8. Use squash merge to keep `main` history concise.

A Vercel `build-rate-limit` result is an infrastructure quota issue, not a code failure, when GitHub Quality has succeeded.

## Quality rules

- Fix root causes instead of disabling lint rules.
- Do not skip or delete tests to make CI pass.
- Prefer behavior and contract tests over brittle implementation-detail checks.
- Apply explicit timeouts to upstream requests.
- Do not add blind retries to write operations that can create duplicates.
- Use idempotency for webhook writes.
- Never log secrets or full sensitive customer payloads.
- Keep customer-facing errors useful without exposing internal service details.

## UI rules

- Design for mobile before desktop refinement.
- Do not redesign randomly.
- Reuse existing components and design tokens.
- Prioritize speed, accessibility, clarity, one-hand usability, and conversion.
- Avoid effects that reduce performance or distract from the customer journey.

## Definition of done

A batch is complete only when its scope is coherent, the diff has no unrelated changes, lint passes, type-check passes, unit tests pass, production build passes, and the pull request is squash-merged into `main`.
