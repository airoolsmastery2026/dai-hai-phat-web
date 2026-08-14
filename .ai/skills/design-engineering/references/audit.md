# Audit — Impeccable adapter

Read this phase only after the implementation works. The conceptual source is
[`Impeccable`](https://github.com/pbakaus/impeccable); use its critique and
anti-pattern posture as a final DHP audit, not as authority to rewrite the
design system.

## Audit order

1. **Truth and conversion** — verified content, one clear primary action, and a
   reachable public `#ai-office` entry where required.
2. **Hierarchy and copy** — useful headings, plain Vietnamese, no duplicate or
   decorative claims.
3. **System fit** — semantic tokens, existing primitives, consistent density,
   radius, type, and restrained elevation.
4. **Responsive and accessibility** — 320px through wide desktop, focus,
   keyboard, semantics, contrast, reduced motion, and no overflow.
5. **Performance and production** — Server Components by default, optimized
   media, no new CLS, minimal client JavaScript, no dependency drift.
6. **Anti-slop** — no gratuitous glass, gradients, nested cards, excessive
   pills, neon AI styling, or decorative animation.

Fix only findings inside the agreed target. Report valid out-of-scope findings
as follow-up work instead of expanding the batch.
