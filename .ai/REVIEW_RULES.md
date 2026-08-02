# Review Rules

## Automated Quality Gate

A change must not be approved while any required quality check is failing:

- TypeScript typecheck
- ESLint
- automated tests
- production build

## Test Review Checklist

Reviewers must verify that:

1. Tests validate observable behavior rather than private implementation details.
2. Assertions are specific enough to catch regressions.
3. Happy paths, invalid inputs, and relevant boundary values are represented.
4. Mocks do not hide defects in the code under test.
5. Bug fixes include a regression test whenever technically reasonable.
6. Tests are deterministic and independent of execution order.
7. Existing tests were not removed or weakened merely to make CI pass.
8. Remaining untested risks are stated in the pull request.

## Completion Rule

A pull request is ready to merge only when the implementation, tests, documentation, and quality-gate results agree with the ticket acceptance criteria.
