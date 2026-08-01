---
version: alpha
name: DAI HAI PHAT Light Luxury Engineering
description: A bright, refined digital engineering office for residential interior and mechanical consulting.
colors:
  primary: "#145D60"
  primary-hover: "#0E484B"
  primary-soft: "#DCEEED"
  primary-on: "#FFFFFF"
  focus: "#176B87"
  metal: "#9A7440"
  metal-soft: "#F1E8D7"
  wood: "#744833"
  wood-soft: "#EEE1D8"
  channel-zalo: "#0068FF"
  channel-whatsapp: "#0B6B61"
  background: "#F3F7F6"
  surface: "#FFFEFA"
  surface-muted: "#EAF2F1"
  surface-strong: "#D9E7E5"
  ink: "#183436"
  ink-muted: "#466164"
  ink-subtle: "#647A7C"
  border: "#C8DAD7"
  dark: "#123F41"
  dark-surface: "#1A4C4E"
  dark-muted: "#DCEAE8"
  dark-subtle: "#B8CECB"
  success: "#047857"
  success-soft: "#D1FAE5"
  warning: "#B45309"
  warning-soft: "#FEF3C7"
  danger: "#B91C1C"
  danger-soft: "#FEE2E2"
typography:
  display:
    fontFamily: Inter
    fontSize: 3.65rem
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 2.75rem
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Inter
    fontSize: 2.2rem
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
  lg: 14px
  xl: 18px
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
  section-mobile: 56px
  section-desktop: 80px
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
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
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
    height: 72px
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
landing page. It should feel like a bright residential design studio supported
by precise engineering: refined, calm, compact, premium, and trustworthy.

The interface combines Apple-like restraint, Linear-like information density,
Stripe-like clarity, and Vercel-like engineering discipline. It must never look
like a neon AI demo, a template marketplace theme, or an unverified project
showcase.

Brand decisions are made in this file. Runtime CSS variables in
`src/app/globals.css` implement these tokens. `COMPONENTS.md` defines the
component contract. `.ai/UI_PROMPT.md` defines how coding agents consume both.

## Colors

- **Primary (`#145D60`)** is a deep mineral teal used for the most important
  action, progress, and verified active state.
- **Primary soft (`#DCEEED`)** and pale mineral surfaces create the bright,
  calm base. They never replace readable body text.
- **Metal (`#9A7440`)** is a restrained champagne accent for short labels,
  dividers, and verified highlights — never a large CTA background.
- **Wood (`#744833`)** brings walnut warmth to selected editorial headings and
  material storytelling; it is not a generic status color.
- **Ink (`#183436`)** communicates engineering precision without pure black.
- **Dark (`#123F41`)** is reserved for the footer, high-confidence CTA surfaces,
  and rare technical depth. Navigation, page heroes, and AI chat are light.
- **Background and surfaces** use ivory and mist-blue/green neutrals.
- Zalo and WhatsApp colors are reserved for their verified external channel
  actions and are never used as general interface accents.
- Success, warning, and danger colors are semantic. They may not be used as
  decoration.

Only token values in the front matter and matching CSS variables are allowed in
application components. Project photography is exempt from palette matching,
but overlays and captions are not.

The public site has one intentional light appearance. Operating-system dark
mode must not unexpectedly turn the consultation funnel into a heavy dark UI.

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

- Content maximum width: 1216px.
- Mobile gutters: 16px; tablet: 24px; desktop: 32px.
- Section padding: 56px mobile and 80px desktop.
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

The shape language is compact engineered softness:

- 6px for compact details.
- 10px for buttons and fields.
- 14px for normal cards.
- 18px only for major feature panels and hero media.
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
