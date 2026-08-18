---
name: dhp-frontend
description: Build and improve Đại Hải Phát frontend UI while preserving the project design system, mobile-first behavior, performance, and business flow.
---

# DHP Frontend

Use for pages, components, responsive fixes, interaction, accessibility, visual QA, and frontend performance.

## Required context

Read before editing UI:

- `AGENTS.md`
- `DESIGN.md`
- `COMPONENTS.md`
- `.ai/UI_PROMPT.md`
- the existing component/page being changed

## Rules

- Keep Next.js + TypeScript and the current Tailwind v3 setup.
- Reuse existing components and design tokens before creating new ones.
- Mobile-first is mandatory; verify common phone widths before desktop polish.
- Preserve the Đại Hải Phát visual language: modern, industrial, premium, minimal, trustworthy, professional.
- Do not copy third-party sites verbatim. Research patterns, then implement original DHP UI.
- Preserve accessibility, semantic HTML, focus behavior, loading/error/empty states where applicable.
- Avoid unnecessary client components and packages.
- Optimize images, layout stability, and interaction latency.

## Business flow

UI should help move a customer toward:

`need discovery -> proposal -> survey -> quotation -> contract`

Do not optimize aesthetics at the expense of conversion clarity or trust.

## Verification

Inspect the diff, run targeted checks while working, and finish substantial changes with `npm run quality`.
