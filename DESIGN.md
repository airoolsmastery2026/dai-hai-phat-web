---
version: alpha
name: DAI HAI PHAT Industrial Precision
description: A calm digital engineering office for construction, interior, and mechanical consulting.
colors:
  primary: "#C2410C"
  primary-hover: "#9A3412"
  primary-soft: "#FFEDD5"
  primary-on: "#FFFFFF"
  focus: "#2563EB"
  channel-zalo: "#0068FF"
  channel-whatsapp: "#0B6B61"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  surface-muted: "#F1F5F9"
  surface-strong: "#E2E8F0"
  ink: "#0F172A"
  ink-muted: "#475569"
  ink-subtle: "#64748B"
  border: "#CBD5E1"
  dark: "#0B1120"
  dark-surface: "#111827"
  dark-muted: "#CBD5E1"
  dark-subtle: "#94A3B8"
  success: "#047857"
  success-soft: "#D1FAE5"
  warning: "#B45309"
  warning-soft: "#FEF3C7"
  danger: "#B91C1C"
  danger-soft: "#FEE2E2"
typography:
  display:
    fontFamily: Inter
    fontSize: 3.75rem
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.25
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
  32: 128px
  control-height: 48px
  container-gutter: 24px
  section-mobile: 64px
  section-desktop: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-on}"
  button-primary-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-hover}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  button-focus:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  button-zalo:
    backgroundColor: "{colors.channel-zalo}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 12px
    height: "{spacing.control-height}"
  button-whatsapp:
    backgroundColor: "{colors.channel-whatsapp}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 12px
    height: "{spacing.control-height}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  button-dark:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  card-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  skeleton:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.ink}"
    height: 1px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: "{spacing.control-height}"
  navigation:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label-lg}"
    height: "{spacing.20}"
  panel-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-muted}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  panel-dark-subtle:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.dark-subtle}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  status-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 8px
  status-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 8px
  status-error:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 8px
---

# DAI HAI PHAT Design System

## Overview

The product is an **AI Digital Engineering Office**, not a generic corporate
landing page. It should feel like a calm technical workspace: precise,
industrial, premium, minimal, and trustworthy.

The interface combines Apple-like restraint, Linear-like information density,
Stripe-like clarity, and Vercel-like engineering discipline. It must never look
like a neon AI demo, a template marketplace theme, or an unverified project
showcase.

Brand decisions are made in this file. Runtime CSS variables in
`src/app/globals.css` implement these tokens. `COMPONENTS.md` defines the
component contract. `.ai/UI_PROMPT.md` defines how coding agents consume both.

## Colors

- **Primary (`#C2410C`)** is the only action color. It is reserved for the most
  important action, progress, and verified active state.
- **Primary hover (`#9A3412`)** is the pressed/hover state. Orange text on a
  light surface must use one of these two dark values to retain WCAG AA.
- **Primary soft (`#FFEDD5`)** is a quiet highlight surface, never body text.
- **Ink (`#0F172A`)** communicates engineering weight and high legibility.
- **Dark (`#0B1120`)** is used for navigation, technical workspaces, and
  high-confidence hero surfaces.
- **Background and surfaces** use cool slate neutrals. Pure white is a surface,
  not the entire visual identity.
- Zalo and WhatsApp colors are reserved for their verified external channel
  actions and are never used as general interface accents.
- Success, warning, and danger colors are semantic. They may not be used as
  decoration.

Only token values in the front matter and matching CSS variables are allowed in
application components. Project photography is exempt from palette matching,
but overlays and captions are not.

Dark mode uses the same hierarchy: near-black foundations, raised dark
surfaces, light text, and the warm orange action color. Dark mode is driven by
semantic tokens rather than one-off `dark:` fixes.

## Typography

Inter is the only production typeface. The Vietnamese subset is loaded through
`next/font`, with `display: swap`. A second heading font is forbidden because
it creates rendering drift and extra font cost.

- Display and large headlines use 700–800 weight, tight tracking, and short
  line lengths.
- Body copy is 16px by default and uses 1.65 line-height.
- Technical labels use 12px–14px, bold weight, uppercase only when the label is
  short, and restrained tracking.
- Paragraphs should stay between 55 and 75 characters per line.
- Sentence case is the default. Full uppercase is reserved for short eyebrows,
  never long headings or body copy.
- Vietnamese copy must use correct diacritics and consistent terminology.

Fluid type is implemented with `clamp()` between the mobile and desktop token
targets. Do not create arbitrary type sizes in components.

## Layout

The layout is mobile-first. It uses one content container, a 4px base scale, and
an 8px default rhythm.

- Content maximum width: 1344px.
- Mobile gutters: 16px; tablet: 24px; desktop: 32px.
- Section padding: 64px mobile and 96px desktop.
- Reading width: 720px maximum.
- Touch targets: 48px minimum; icon-only controls: 44px absolute minimum.
- Grids collapse to one column before content becomes compressed.
- Sticky or fixed controls must preserve safe area and never cover primary
  content.

Breakpoints follow the existing Tailwind v3 defaults:

| Name | Minimum width | Use |
|---|---:|---|
| `sm` | 640px | Larger mobile and two-column micro-layouts |
| `md` | 768px | Tablet content and card grids |
| `lg` | 1024px | Desktop navigation and split layouts |
| `xl` | 1280px | Wide technical workspace |
| `2xl` | 1536px | No wider container; only additional breathing room |

Motion communicates state, not decoration. Use 160ms for controls, 240ms for
panels, and 360ms for page/section reveals. Animate only `opacity` and
`transform` unless a measured interaction requires another property. Never
animate layout on first paint. When `prefers-reduced-motion: reduce` is active,
remove non-essential motion and smooth scrolling.

## Elevation & Depth

Hierarchy comes from tonal layers, borders, and spacing before shadow.

- Level 0: page background, no shadow.
- Level 1: cards, 1px border plus a restrained soft shadow.
- Level 2: menus and floating actions, medium shadow.
- Level 3: modal or critical overlay only.
- Large black drop shadows, glassmorphism stacks, and glowing orange effects
  are forbidden.

Photography uses a neutral dark overlay only where text must sit above an
image. Gradients must be subtle, token-derived, and functional.

## Shapes

The shape language is engineered softness:

- 6px for compact details.
- 10px for buttons and fields.
- 16px for normal cards.
- 24px only for major feature panels and hero media.
- Full pills only for status, filters, or short badges.

Do not mix four unrelated radii in one view. Icons use `lucide-react`, 1.75–2px
stroke, and sizes from 16px, 20px, 24px, or 32px. Emoji are not UI icons.

## Components

The normative behavior and API for reusable components lives in
`COMPONENTS.md`.

Every new component must:

- use semantic tokens and existing primitives;
- render correctly from 320px through wide desktop;
- expose an accessible name and visible focus state;
- work in light and dark semantic contexts;
- define default, hover/focus, disabled, loading, empty, and error behavior when
  those states are meaningful;
- avoid layout shift by reserving media and loading-state dimensions;
- use CSS motion tokens and honor reduced motion;
- keep server rendering by default and become a Client Component only when
  interaction requires it.

Buttons use an action verb. Cards contain one idea. Forms show persistent
labels, helper text when needed, and inline errors associated through ARIA.
Tables become horizontally scrollable with a visible affordance or transform
into labeled rows on narrow screens. Accordions use native `details/summary`
unless a stronger interaction requirement is proven.

## Do's and Don'ts

- Do preserve the content truth and source metadata already in the repository.
- Do show whether information is verified, estimated, local-only, or requires
  engineer review.
- Do use one primary action per section.
- Do prefer contact channels that really work over forms without a backend.
- Do use real, verified Đại Hải Phát assets and accurate alt text.
- Do maintain WCAG AA contrast and keyboard operation.
- Do run design, lint, type-check, test, and production build gates.
- Don't hardcode colors, spacing, typography, radius, shadow, or motion in JSX.
- Don't use fake AI typing, fake counters, fake testimonials, or fake project
  metrics.
- Don't claim a lead was sent to CRM while it only exists on the device.
- Don't add Framer Motion or another UI dependency for effects achievable with
  CSS.
- Don't introduce a new layout, card, button, or badge when an existing
  primitive can be extended.
- Don't change Visual DNA, tokens, or component contracts without a focused
  design-system review.
