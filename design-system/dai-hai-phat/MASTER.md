# Đại Hải Phát — Light Luxury Engineering

**Project:** Dai Hai Phat
**Reviewed:** 2026-08-01
**Design dials:** variance 4/10 · motion 3/10 · density 7/10

This file records the visual synthesis made from the UI/UX Pro Max research.
`DESIGN.md` and `src/app/globals.css` remain the normative implementation
sources.

## Visual direction

- Bright residential design studio supported by precise engineering.
- Ivory and pale mineral-blue surfaces; no automatic dark-mode takeover.
- Deep mineral teal for primary actions and trust.
- Brushed champagne metal for small accents and dividers.
- American walnut for editorial warmth and material cues.
- Real project/material imagery carries luxury; avoid artificial glow and
  decorative glass stacks.

## Core palette

| Role | Value |
|---|---|
| Primary / action | `#145D60` |
| Primary hover | `#0E484B` |
| Primary soft | `#DCEEED` |
| Background | `#F3F7F6` |
| Surface / ivory | `#FFFEFA` |
| Surface muted | `#EAF2F1` |
| Text | `#183436` |
| Text muted | `#466164` |
| Border | `#C8DAD7` |
| Champagne metal | `#9A7440` |
| Walnut | `#744833` |
| Deep surface | `#123F41` |

## Type and scale

- Inter only, including Vietnamese subset.
- Display: `clamp(2.35rem, 4.2vw, 3.65rem)`.
- Page H1: `clamp(2.05rem, 3.4vw, 3rem)`.
- Section H2: `clamp(1.7rem, 2.5vw, 2.2rem)`.
- Body: 16px, 1.6–1.7 line height, 55–75 characters per line.
- Short technical labels may be uppercase; headings remain sentence case.

## Density and components

- Content max width: 1216px.
- Section rhythm: 56px mobile, 80px desktop.
- Cards: 14px radius, 16–24px internal padding, quiet 1px border.
- Major panels: 18px radius maximum.
- Touch target: 48px; icon-only controls may be 44px.
- Navigation: light, 64px mobile / 72px desktop.
- AI consultation: one light conversation surface on mobile; secondary
  engineering data stays collapsed or desktop-only.

## Motion and accessibility

- 160–240ms state transitions; animate opacity/transform only.
- No looping decorative motion except the existing finite mobile AI attention
  cue; respect `prefers-reduced-motion`.
- WCAG AA text contrast, visible keyboard focus, semantic buttons and links.
- Test 375px, 768px, 1024px, and 1440px without horizontal overflow.

## Do not use

- Pure black foundations, black/gold “luxury” clichés, neon AI glow.
- Oversized 72px+ marketing headings in the normal desktop layout.
- Giant cards, excessive pills, layout-shifting hover transforms.
- Decorative fonts, emoji icons, unverified project claims, invented prices.
