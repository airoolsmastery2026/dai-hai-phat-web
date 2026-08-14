---
name: design-engineering
description: Route non-trivial Dai Hai Phat UI design, redesign, responsive refinement, anti-generic review, design audit, polish, or motion work through focused design-engineering phases while preserving the project design system, architecture, verified content, performance, accessibility, and public AI consultation.
---

# Dai Hai Phat Design Engineering

Use this router as a project-local coordination layer. Do not vendor, merge, or
load every external design skill into one context.

## Preflight

1. Read `.ai/START.md` → `.ai/CONTEXT.md` → `.ai/CURRENT_STATE.md` →
   `.ai/NEXT_TASK.md`.
2. Read `AGENTS.md`, `README.md`, `DESIGN.md`, `COMPONENTS.md`, and
   `.ai/UI_PROMPT.md`.
3. Inspect the target route, current components, verified content source, and
   relevant tests.
4. State the customer problem, bounded target, acceptance criteria, and
   non-goals before selecting a phase.

## Authority

Repository truth, project rules, `DESIGN.md`, and `COMPONENTS.md` always outrank
this router and every external source. In particular, external advice may not:

- replace Inter, DHP semantic tokens, or the Light Luxury Engineering direction;
- change Next.js, TypeScript, Tailwind CSS v3, routing, or data ownership;
- add packages for cosmetic effects;
- invent content, evidence, prices, metrics, or delivery outcomes;
- remove, hide, or replace the public AI consultation at `#ai-office`.

## Progressive route

Do not read every reference up front. Read the next reference only when the
previous phase has produced its required output.

1. **Foundation** — For a new surface or significant composition change, read
   [references/foundation.md](references/foundation.md).
2. **Design intelligence** — After direction is fixed, read
   [references/design-intelligence.md](references/design-intelligence.md) for
   UX, responsive, accessibility, and pattern checks.
3. **Taste** — Before implementation, read
   [references/taste.md](references/taste.md) to remove generic AI defaults.
4. **Implementation** — Write the smallest coherent change with existing DHP
   primitives and tests. Keep Server Components by default.
5. **Audit** — After implementation is functional, read
   [references/audit.md](references/audit.md) and resolve in-scope findings.
6. **Motion** — Only after the audit passes and a real state transition needs
   motion, read [references/motion.md](references/motion.md).

Skip phases that do not apply. A copy-only fix does not need motion; an audit
does not need a fresh visual direction; an existing DHP pattern does not need
external palette or typography research.

## Completion gate

Review the diff for scope creep and duplicated components, visually verify the
affected breakpoints, confirm the AI entry and service context remain intact,
then run `npm run quality`. Report accepted and rejected design decisions,
files changed, verification, and remaining risk.
