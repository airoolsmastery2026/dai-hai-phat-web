# Coding Rules

## Free model router

Before selecting or switching a coding model/provider, read `.ai/FREE_MODEL_ROUTER.json` and treat it as the machine-readable routing contract for contributor agents.

The router applies only to development/contributor execution. It must not silently alter the public DHP customer chatbot runtime, business state machine, CRM flow, quotation rules, or production AI provider configuration.

When `mode` is `free-only`:

- zero-cost execution is a hard constraint
- never auto-enable billing, top-up, prepaid balance usage, or a metered fallback
- rotate providers only when the next provider/model is currently verified as zero-cost and supports the required capability
- preserve task/spec/repository state when rotating providers
- reserve scarce high-capability free quota for hard planning, debugging, and review work
- return recovered providers to the eligible pool after quota reset/cooldown
- use local runtime as the terminal execution fallback when practical
- if no compatible zero-cost option remains, stop metered provider execution rather than incur cost

Provider availability and pricing change over time. Re-verify current provider terms before relying on any cloud model as free infrastructure.

## Unit Test Policy

Any change to business logic must include meaningful automated tests.

Any bug fix must include a regression test that fails before the fix and passes after the fix, unless automated reproduction is not technically reasonable. The exception and remaining risk must be documented.

Do not:

- delete valid tests to make CI pass
- weaken assertions without a documented reason
- mock the behavior being tested
- test private implementation details when observable behavior is available
- use snapshots as the only verification for critical behavior
- commit skipped or commented-out tests without an explicit tracking issue

A ticket is not complete until all applicable checks pass:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Test Design Requirements

Tests should cover, where applicable:

- expected behavior
- invalid input
- empty input
- boundary values
- failure handling
- regression scenarios

Prefer deterministic tests that do not depend on execution order, external services, current time, or network access.

## Change Strategy

Do not stop delivery to retrofit the entire legacy codebase at once. Apply the boy-scout rule: every business-critical module changed by a ticket should leave the branch with equal or better test coverage.
