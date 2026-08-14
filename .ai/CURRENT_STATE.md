# Current State

Updated: 2026-08-14

## Repository baseline

- Branch base: `main` at `4f37e1b` (`fix: restore public AI chatbot as DHP core`).
- Active implementation branch: `feat/design-engineering-router`.
- Runtime: Next.js App Router, React, TypeScript, Tailwind CSS v3.
- Canonical quality gate: `npm run quality`.
- The checkout was clean before the current Design Engineering batch began.

## Public homepage

The homepage currently renders:

1. `HeroSection`
2. `ServicesSection`
3. `AIOfficeRouteEntry` with a stable `#ai-office` fallback
4. `ProjectsSection`
5. `ContactSection`

The public AI Office is restored and protected by tests covering global entry,
service presets, accessibility, deferred loading, error recovery, Gemini Live,
and composition identity. Do not remove, replace, or hide it.

## Design system

- `DESIGN.md`, `COMPONENTS.md`, `.ai/UI_PROMPT.md`, and
  `design-system/dai-hai-phat/MASTER.md` define the current Light Luxury
  Engineering direction.
- Shared semantic tokens live in `src/app/globals.css`.
- A project-local reference UI research skill already exists.
- `.ai/skills/design-engineering/SKILL.md` now routes Foundation → Design
  intelligence → Taste → Implementation → Audit → Motion and loads each direct
  reference only when its phase applies.
- The homepage hero now uses a tokenized split composition with meaningful
  `next/image` media, one shared four-step consultation path, and the protected
  `#ai-office` primary action. It adds no runtime dependency or client boundary.

## Verification for DE-001

- Design Engineering contract test: passing.
- TypeScript, ESLint, and all 218 unit/contract tests: passing.
- Next.js 16.2.12 production build and compiled CSS verification: passing.
- Browser QA: passing at 320px, 390px, 768px, and 1440px with no horizontal
  overflow or framework error overlay.
- The primary hero action resolves to `#ai-office` and renders the full public
  consultation experience. AI Sales and CRM routes/tests remain unchanged.
- A request for `/favicon.ico` returns 404 on a fresh browser profile; this is
  pre-existing and outside the DE-001 hero/router scope.

## Known operational gap

The four `.ai` control files named in the working protocol did not exist in any
branch or commit before this batch. They now act as concise pointers to
canonical repository truth, not as a competing architecture or design system.
