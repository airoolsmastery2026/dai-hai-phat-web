# Coding Rules

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
