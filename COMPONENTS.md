# DAI HAI PHAT Component Library

This document is the implementation contract for the reusable UI in
`src/components`. `DESIGN.md` owns visual decisions; this file owns component
behavior, composition, state, and accessibility.

## Source structure

```text
src/components/
├── ui/          # Tokens-aware primitives; no business data
├── layout/      # Shared shell, navigation, footer, floating actions
├── sections/    # Homepage and cross-page compositions
├── services/    # Service-domain compositions
├── projects/    # Project-domain compositions
├── gallery/     # Verified asset browsing
└── seo/         # Structured data only
```

Rules:

1. Search this inventory before creating a component.
2. Extend a stable primitive before adding a near-duplicate.
3. Business data comes from `src/content` or typed library functions.
4. Components receive typed props; they do not duplicate content objects.
5. Server Components are the default. Add `"use client"` only for browser state
   or events.
6. Component styles use CSS variables from `globals.css`. Literal colors,
   shadows, radii, and arbitrary spacing are not allowed.

## Implementation inventory

| Capability | Canonical implementation | Status |
|---|---|---|
| Button | `ui/Button.tsx` | Stable |
| Card | `ui/Card.tsx` | Stable |
| Badge | `ui/Badge.tsx` | Stable |
| Alert | `ui/Alert.tsx` | Stable |
| Loading | `ui/Skeleton.tsx` | Stable |
| Empty state | `ui/EmptyState.tsx` | Stable |
| Container | `ui/Container.tsx` | Stable |
| Section | `ui/Section.tsx`, `ui/SectionShell.tsx` | Stable |
| Section heading | `ui/SectionHeading.tsx` | Stable |
| Page hero | `ui/PageHero.tsx` | Stable |
| Breadcrumb | `ui/Breadcrumb.tsx` | Stable |
| Navbar | `layout/SiteNavigation.tsx` | Stable |
| Footer | `layout/SiteFooter.tsx` | Stable |
| Floating CTA | `layout/FloatingCta.tsx` | Stable |
| Timeline | `services/ServiceProcess.tsx`, AI workspace timeline | Domain composition |
| Gallery | `gallery/VerifiedGallery.tsx` | Stable with async states |
| Stats | `about/page.tsx` | Verified content only |
| Accordion / FAQ | `services/ServiceFAQ.tsx` | Stable, native disclosure |
| Service card | `services/ServiceCard.tsx` | Stable |
| Blog card | `blog/page.tsx` | Route-local; extract only after a second consumer |
| Project card | `projects/ProjectCard.tsx` | Publication-gated |
| Pricing | Knowledge pricing contract | UI blocked until verified data |
| Testimonial | No production component | Blocked until consent and source exist |
| Form | No production submission form | Blocked until durable CRM endpoint |

## Shared state contract

State support means purposeful behavior, not rendering every state at once.

| State | Required behavior |
|---|---|
| Default | Semantic HTML, stable dimensions, meaningful content |
| Hover | Pointer-only enhancement; never the only information signal |
| Focus | Visible 2px focus ring with offset |
| Active | Clear selected/pressed state when interaction supports it |
| Disabled | Native disabled semantics or `aria-disabled`; no pointer action |
| Loading | Reserved dimensions, `aria-busy`, descriptive status text |
| Empty | Explain what is absent and the next useful action |
| Error | `role="alert"` or associated field error; recovery action when possible |
| Dark | Semantic surface/text tokens retain AA contrast |
| Reduced motion | No non-essential transform or smooth scrolling |

## Foundations

### `Container`

Path: `src/components/ui/Container.tsx`

Use for every page and section content boundary. It owns maximum width and
responsive gutters. Do not recreate `mx-auto max-w-* px-*` wrappers.

### `Section`

Path: `src/components/ui/Section.tsx`

Use for semantic page regions with anchor offset. A section must have a heading
unless it is an intentionally labelled technical region.

### `SectionShell`

Path: `src/components/ui/SectionShell.tsx`

Variants: `default`, `muted`, `dark`. It owns vertical section rhythm and
semantic background tokens.

### `SectionHeading`

Path: `src/components/ui/SectionHeading.tsx`

Props: `eyebrow`, `title`, optional `description`, `align`. The heading level is
`h2`; page titles use `PageHero`.

## Actions

### `Button`

Path: `src/components/ui/Button.tsx`

Variants:

- `primary`: one principal action per visual region.
- `secondary`: action on a dark or image surface.
- `ghost`: low-emphasis navigation or dismissive action.

Requirements:

- 48px minimum height.
- Verb-first label.
- Optional leading/trailing Lucide icon with `aria-hidden`.
- External URLs include `target="_blank"` and `rel="noreferrer"`.
- Disabled/loading buttons preserve width and announce state.
- A button performs an action; a link navigates.

The previous `ActionButton` duplicate has been removed. Use `Button`.

## Surfaces and feedback

### `Card`

Path: `src/components/ui/Card.tsx`

Variants: `default`, `muted`. `hoverable` is only for an interactive card.
Never put a hover lift on static content.

### `Badge`

Status and metadata only. Variants: `neutral`, `brand`, `success`, `warning`,
`danger`. A color-coded badge must also contain a text label.

### `Alert`

Variants: `info`, `success`, `warning`, `error`. Error alerts use
`role="alert"`; passive notices use `role="status"`.

### `Skeleton`

Loading placeholder with fixed dimensions and `aria-hidden="true"`. The parent
owns `aria-busy` and a screen-reader status label. Animation is removed under
reduced motion.

### `EmptyState`

Contains title, short reason, and at most one primary plus one secondary action.
It never invents example data to make the interface look populated.

## Page composition

### `PageHero`

Use for all route-level page introductions. It accepts an eyebrow, `h1`, a
description, and optional actions. It uses the dark technical surface and
consistent top/bottom rhythm.

### `SiteNavigation`

Path: `src/components/layout/SiteNavigation.tsx`

One instance is rendered by the root layout. Desktop and mobile expose the same
destinations. The mobile menu locks background scroll, closes after navigation,
reports `aria-expanded`, and retains a visible call action.

### `SiteFooter`

Path: `src/components/layout/SiteFooter.tsx`

One instance is rendered by the root layout. It contains verified company
information, navigation, service links, and contact channels.

### `FloatingCta`

Path: `src/components/layout/FloatingCta.tsx`

Provides real phone, Zalo, and contact-page handoff. It must not link to a
missing hash, simulate AI, or claim submission to CRM.

## Domain components

| Component | Path | Contract |
|---|---|---|
| Service Card | `services/ServiceCard.tsx` | One verified service summary and detail link |
| Service Hero | `services/ServiceHero.tsx` | Route title, summary, verified media, real CTA |
| Service Features | `services/ServiceFeatures.tsx` | Typed feature list; empty state if none |
| Service Process | `services/ServiceProcess.tsx` | Ordered steps with visible numbers |
| Service Gallery | `services/ServiceGallery.tsx` | Reserved image ratios and accurate alt text |
| Service FAQ | `services/ServiceFAQ.tsx` | Native disclosure, keyboard accessible |
| Project Card | `projects/ProjectCard.tsx` | Only for verified, publishable case studies |
| Verified Gallery | `gallery/VerifiedGallery.tsx` | Loading, empty, error, pagination, filter states |
| AI Office | `sections/AIOfficeSection.tsx` | One question per step; local-storage truth disclosed |
| Contact CTA | `sections/ContactSection.tsx` | Real Zalo, telephone, email, and map handoff |

Project detail components remain internal until their data satisfies the
production truth gate. They must not be surfaced with fabricated case studies.

## Content patterns

### Hero

One `h1`, one clear value proposition, a primary action, and an optional
secondary action. Avoid full-screen height when it hides the next useful
section on mobile.

### Stats

Stats require an auditable source. If a value cannot be verified, replace it
with a process capability or remove the block.

### Timeline

Use an ordered list. Steps use explicit status text in addition to color. A
current step exposes `aria-current="step"`.

### Gallery

Use `next/image`, known aspect ratios, responsive `sizes`, and verified local
assets. Lazy-load below-the-fold media. The first meaningful hero image may be
prioritized only when it is the LCP candidate.

### Accordion and FAQ

Prefer `details/summary`. Keep the question visible, use one `h3` per item, and
ensure JSON-LD matches visible content.

### Forms

Do not render a submit form until a real receiving endpoint exists. Before CRM
integration, use explicit phone/Zalo/email handoff. When forms are enabled,
they require:

- persistent labels and correct input types/autocomplete;
- client and server validation;
- loading, success, validation, rate-limit, network, and server-error states;
- consent and retention copy for personal information;
- spam control without blocking keyboard or assistive technology.

### Tables

Use real table semantics for tabular data. On narrow screens, retain column
labels and provide horizontal overflow or a labelled row layout. Never encode
meaning through alignment alone.

### Pricing

Only verified price records may render. Estimates must show range, unit, source
date, confidence, and “requires survey” status. `review_required` prices cannot
drive a customer quote.

### Testimonial

Render only with a verified person/company, consent, and source. Until then,
use process commitments, evidence, or verified project metadata.

## Definition of done

A new or changed component is complete only when:

- it reuses tokens and primitives;
- TypeScript has no errors and props are exported where reused;
- keyboard, focus, landmarks, labels, and contrast are correct;
- 320px mobile, tablet, and desktop layouts are checked;
- loading/empty/error are implemented when data or async work exists;
- motion honors reduced motion;
- content is truthful and Vietnamese copy is reviewed;
- no new dependency or duplicate component was introduced;
- relevant tests, lint, type-check, and production build pass.
