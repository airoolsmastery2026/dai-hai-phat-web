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

## Senior-agent workflow

For non-trivial changes, use the combined Superpowers + Skills For Real Engineers workflow. The goal is disciplined execution, not ceremony.

Required sequence:

1. **Brainstorm / clarify** — inspect the current implementation and resolve design ambiguity before coding.
2. **Spec** — write or confirm the behavioral contract, constraints, acceptance criteria, and non-goals.
3. **Plan / tickets** — split the work into small coherent changes with explicit verification steps.
4. **TDD** — for new behavior or bug fixes, create a failing test first when the behavior is testable, then implement the smallest fix, then refactor while green.
5. **Isolated execution** — use focused branches/worktrees and parallel subagents only when tasks are independent and their write scopes do not overlap.
6. **Review** — review the diff for correctness, regressions, architecture, security, accessibility, performance, and dead code.
7. **Verify / ship** — run the repository quality gate and only claim completion after the required checks actually pass.

Preferred Superpowers-style capabilities when available:

- `brainstorming`
- `test-driven-development`
- `systematic-debugging`
- `verification-before-completion`
- `dispatching-parallel-agents`
- `subagent-driven-development`
- `requesting-code-review`
- `using-git-worktrees`
- `finishing-a-development-branch`

Preferred Skills For Real Engineers capabilities when available:

- `grill-with-docs`
- `to-spec`
- `to-tickets`
- `implement`
- `tdd`
- `code-review`
- `improve-codebase-architecture`
- `triage`
- `diagnosing-bugs`
- `prototype`
- `research`
- `handoff`
- `teach`

Do not blindly invoke every skill for tiny content-only or mechanical edits. Use the full workflow for architecture, AI agents, APIs, CRM, data flows, authentication, automation, pricing logic, integrations, and any change with meaningful regression risk.

## Test discipline

- Do not write production behavior first and add tests afterward merely to satisfy coverage.
- For a testable bug, first reproduce the failure with a focused test.
- RED means the new test fails for the expected reason, not because of syntax, fixture, or environment errors.
- GREEN means the smallest implementation change makes the intended test pass without breaking the existing suite.
- REFACTOR only while tests remain green.
- Never weaken, skip, or delete a valid test to make a change pass.
- When a behavior cannot reasonably be unit tested, state the alternative verification method in the PR.

## Debugging discipline

When a test, build, runtime flow, or integration fails:

1. Reproduce the failure reliably.
2. Gather evidence from the failing boundary before changing code.
3. Trace the root cause across data flow, state, configuration, and external dependencies.
4. Fix the root cause rather than suppressing the symptom.
5. Add or improve a regression test when practical.
6. Re-run the narrow test first, then the full quality gate.

Do not stack speculative fixes or repeatedly edit unrelated files hoping the failure disappears.

## Parallel-agent rules

Parallel subagents are allowed only when their tasks are independent.

- Give each agent an explicit objective, file/write scope, inputs, and definition of done.
- Prefer isolated git worktrees or branches for concurrent write tasks.
- Never let multiple agents modify the same files concurrently without explicit coordination.
- The coordinating agent owns integration, conflict resolution, final review, and verification.
- Parallelism must reduce delivery time without reducing traceability or test quality.

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

## Quality gate

The canonical repository gate is:

```bash
npm run quality
```

It currently runs type-check, lint, unit tests, and production build. Run narrower checks during RED/GREEN iteration, but run the complete quality gate before marking work complete.

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

## Verification before completion

Never report "done", "fixed", "production-ready", or equivalent based only on code inspection.

Before completion:

1. Review the final diff for unrelated or dead changes.
2. Run `npm run quality` or document a concrete infrastructure blocker.
3. Verify any affected customer-critical path at the appropriate level.
4. Confirm no secrets or generated junk files entered the diff.
5. Confirm the implementation matches the agreed scope and acceptance criteria.

## Definition of done

A batch is complete only when its scope is coherent, the diff has no unrelated changes, lint passes, type-check passes, unit tests pass, production build passes, and the pull request is squash-merged into `main`.
