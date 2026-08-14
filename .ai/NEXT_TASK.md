# Next Task

## DE-001 — Register the Design Engineering Router and apply the first UI pass

Status: implemented and verified locally on `feat/design-engineering-router`;
pending repository review/publish workflow.

### Goal

Integrate a project-local Design Engineering Router that loads external design
guidance by stage, then use it to improve one bounded homepage surface without
changing runtime architecture or weakening the public AI consultation flow.

### Scope

1. Add `.ai/skills/design-engineering/SKILL.md` with progressive routing:
   Anthropic Frontend Design → UI UX Pro Max → Taste → implementation →
   Impeccable audit → Emil motion.
2. Keep detailed phase guidance in direct `references/` files and load only the
   phase needed at that moment.
3. Register the router in `AGENTS.md` and `.ai/UI_PROMPT.md`.
4. Apply the router to the current homepage hero: remove glass-like treatment
   and literal color construction, preserve the verified hero asset, improve
   semantic structure, and keep the primary `#ai-office` entry.
5. Add focused regression coverage before changing the hero implementation.

### Acceptance criteria

- `DESIGN.md`, project rules, verified content, current components, and tests
  outrank all external guidance.
- No external skill is vendored wholesale and no new runtime package is added.
- The router does not load every design source at once.
- The hero remains mobile-first, uses `next/image`, has one `h1`, and keeps the
  public AI CTA.
- The AI Office remains mounted through `AIOfficeRouteEntry`; AI Sales and CRM
  behavior are not removed or bypassed.
- Relevant focused tests pass, followed by `npm run quality`.

### Non-goals

- No framework, data-flow, AI, CRM, authentication, or deployment redesign.
- No site-wide visual rewrite.
- No decorative animation or new motion dependency.
- No fabricated content, project proof, pricing, or contact outcome.

### Verification recorded

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run test`: 218 pass, 0 fail
- `npm run build`: pass
- Browser QA: 320 / 390 / 768 / 1440px, CTA activation, AI Office render, and
  error-overlay checks pass

Do not begin a broader homepage or service-card redesign until DE-001 is
reviewed as one coherent batch.
