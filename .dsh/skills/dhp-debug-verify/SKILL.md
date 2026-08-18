---
name: dhp-debug-verify
description: Systematic debugging and verification workflow for Đại Hải Phát code, builds, deployments, and regressions.
---

# DHP Debug & Verify

Use when a build, runtime, UI, integration, test, or deployment behavior is incorrect.

## Workflow

1. Reproduce or establish concrete evidence of the failure.
2. Read the relevant implementation and configuration before editing.
3. Identify the root cause; do not patch symptoms blindly.
4. Make the smallest coherent fix.
5. Add or update a regression test when practical.
6. Re-run the narrow failing check.
7. Run broader verification for affected boundaries.
8. For substantial repository changes, run `npm run quality`.
9. Review the final diff for accidental edits, secrets, debug code, and scope creep.

## Rules

- Do not silence type/lint/test errors merely to make checks green.
- Do not delete business data to fix a code problem.
- Do not change architecture unless the failure requires it and evidence supports it.
- Do not claim a production issue is fixed without verification evidence.
- Keep provider/model failures separate from application failures when diagnosing AI features.
- If a free cloud provider is rate-limited or quota-exhausted, let the DHP model router rotate; never switch to paid/local inference implicitly.