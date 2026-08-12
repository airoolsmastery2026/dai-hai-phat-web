# OpenCodeReview gate

OpenCodeReview (OCR) is the AI review layer for code changes in DAI HAI PHAT AI OS. It complements the existing deterministic Quality workflow; it does not replace lint, TypeScript, tests, `npm audit`, or the production build.

## Install once on a developer machine

```bash
npm install -g @alibaba-group/open-code-review
```

OCR requires Git 2.41 or newer.

## Preferred mode for Codex / Claude Code

Use delegation mode so the active coding agent performs the LLM reasoning while OCR keeps deterministic file selection and review-rule resolution.

```bash
ocr delegate preview
```

For Codex, install the official Open Code Review plugin from the `alibaba/open-code-review` marketplace. For Claude Code, install the official `open-code-review@open-code-review` plugin.

## Required review sequence

Before a pull request is finalized:

```bash
ocr review --from main --to HEAD
npm run typecheck
npm run lint
npm test
npm run build
```

When using an agent plugin, request: review the branch against `main`, fix high-confidence issues, then rerun affected tests.

## Base freshness and dependency audit

Quality decisions must be based on the pull request merged with the current `main`, not on an old workflow result from an earlier base revision.

- If `main` changes materially while a pull request is open, trigger a fresh Quality run before merge.
- A previous `npm audit` failure is not waived. Re-run the gate after dependency fixes land on `main` and verify the current merge result.
- Do not disable or lower the `npm audit --audit-level=high` threshold just to make a stale pull request green.
- If the current merge result still reports a high-severity dependency issue, fix or explicitly replace the affected dependency before merge.

## Decision rules

- `critical` / `high` with high confidence: fix before merge unless evidence proves it is a false positive.
- Medium/low findings: fix when they affect correctness, security, accessibility, performance, maintainability, or customer experience; otherwise record them as backlog instead of broadening the current task.
- Never weaken tests, disable lint rules, suppress TypeScript errors, or change product behavior solely to silence a review comment.
- Review only the current coherent branch scope. Unrelated findings go to backlog.
- Re-run OCR after material fixes to ensure the branch is clean.

## Security

Do not commit OCR provider keys or model credentials. Store secrets only in the local OCR configuration or approved CI secret storage. Prefer delegation mode when a separate OCR model credential is not needed.

## Source

Official project: `alibaba/open-code-review` (Apache-2.0).
