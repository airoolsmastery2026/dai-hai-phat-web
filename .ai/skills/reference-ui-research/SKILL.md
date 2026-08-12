---
name: reference-ui-research
description: Analyze an external website or screenshot as UX/UI research, then adapt useful patterns into Dai Hai Phat using the existing design system and component library. Never use this skill to make a pixel-perfect clone or copy another brand's protected content/assets.
argument-hint: "<url-or-reference> <target-route-or-task>"
user-invocable: true
---

# Reference UI Research

Use this skill when a task asks to study, reverse-engineer, learn from, compare with, or adapt an external website, screenshot, design, or interaction pattern for the Dai Hai Phat website.

The goal is **pattern extraction and DHP-native adaptation**, not cloning.

## Authority

Before any implementation, read:

1. `AGENTS.md`
2. `README.md`
3. `DESIGN.md`
4. `COMPONENTS.md`
5. `.ai/UI_PROMPT.md`
6. the current target route, components, content source, and relevant tests

Authority order for UI work:

```text
Repository truth and verified business content
  > DESIGN.md
  > COMPONENTS.md
  > current task acceptance criteria
  > external reference website/design
```

An external reference may suggest a pattern. It never overrides DHP product scope, tokens, accessibility rules, content truth, architecture, or component contracts.

## Non-negotiable guardrails

Do not:

- create a pixel-perfect clone of another branded website;
- copy another site's logo, trademark treatment, marketing copy, testimonials, project claims, prices, illustrations, photography, videos, icons, or proprietary assets;
- scrape or vendor another site's source code, CSS bundle, JavaScript bundle, fonts, or downloadable assets into this repository;
- reproduce a distinctive branded composition when the same customer problem can be solved with a DHP-native layout;
- replace DHP design tokens with values extracted from a reference;
- introduce Tailwind, shadcn, animation, browser-automation, screenshot, or scraping dependencies merely because the reference workflow uses them;
- change Next.js, TypeScript, Tailwind CSS v3, routing, global architecture, or data ownership to imitate a reference;
- invent mock projects, prices, statistics, testimonials, CRM results, AI results, or customer data to make a screen look complete;
- create permanent research folders, screenshot archives, or downloaded asset trees by default.

If reusable source code from an open-source project is genuinely required, treat that as a separate dependency/licensing decision. Verify the license first and record the reason and obligations in the pull request. Do not silently copy it through this skill.

## What may be extracted

Study the reference as evidence for reusable product-design patterns such as:

- information hierarchy;
- section ordering and progressive disclosure;
- CTA placement and conversion flow;
- content density and scanability;
- relative spacing rhythm and alignment logic;
- grid and container behavior;
- mobile/tablet/desktop layout transitions;
- navigation behavior;
- interaction model: click, scroll, hover, time, or combinations;
- loading, empty, error, disabled, active, and success-state ideas;
- animation purpose, trigger, duration class, and reduced-motion implications;
- component decomposition and reuse strategy;
- readability, focus management, keyboard behavior, and accessibility affordances;
- performance-sensitive media and rendering patterns.

Computed CSS values or screenshots may be used as **measurement evidence only**. Implementation must map the finding to existing DHP tokens and primitives rather than copy the foreign value directly.

## Workflow

### 1. Define the customer problem

State the target route/component and the problem the reference might help solve.

Examples:

- service choices are hard to scan on mobile;
- hero hierarchy is too tall;
- project gallery does not expose the next useful action;
- navigation becomes crowded at compact desktop widths.

Do not begin from "make DHP look like site X." Begin from the product problem.

### 2. Inventory the DHP baseline

Inspect the current implementation before studying the reference:

- route structure;
- existing primitives/compositions;
- current content/data source;
- responsive behavior;
- existing tests;
- known constraints from `DESIGN.md` and `COMPONENTS.md`.

Record which existing component should own the change. Creating a new component is the exception, not the default.

### 3. Run a reference sweep

When a safe browser/visual tool is available, inspect at approximately:

- mobile: 390px;
- tablet: 768px;
- desktop: 1440px.

For each viewport, observe:

- hierarchy and section order;
- container/grid behavior;
- navigation changes;
- content visibility and progressive disclosure;
- touch target sizing and one-hand usability;
- image/video treatment;
- CTA prominence;
- layout changes that prevent compression or overflow.

Run an interaction sweep before assuming the interaction model:

1. scroll slowly and note scroll-driven state changes;
2. test click/tap interactions;
3. inspect hover/focus behavior where relevant;
4. identify sticky elements, disclosure, tabs, carousels, modals, or menus;
5. distinguish real interaction from decorative motion.

If browser inspection is unavailable, work from user-provided screenshots/video or publicly visible documentation. Do not add a dependency or new service solely to complete the sweep.

### 4. Produce an adaptation matrix

Before editing, reduce the research to a small matrix:

| Reference pattern | Customer value | DHP mapping | Decision |
|---|---|---|---|
| Pattern observed | Why it helps | Existing token/component/content | Keep / Adapt / Reject |

A pattern is accepted only if it improves at least one of:

- conversion;
- clarity;
- mobile usability;
- accessibility;
- performance;
- engineering trust;
- maintainability.

Reject patterns that are merely fashionable, brand-specific, content-heavy, inaccessible, slow, or inconsistent with the residential/interior customer journey.

### 5. Translate to a DHP-native spec

For every accepted pattern, specify:

- target route/component;
- behavior and responsive states;
- existing primitive/token to reuse;
- content source and truth status;
- accessibility semantics;
- performance constraints;
- acceptance criteria;
- non-goals.

Do not carry foreign color, radius, font, spacing, shadow, icon, or motion values into production. Use DHP semantic tokens and the closest existing component contract.

### 6. Implement the smallest coherent change

Implementation rules:

- keep the change within the target route/component unless a shared primitive genuinely owns the behavior;
- reuse existing components before creating new ones;
- keep Server Components by default;
- add client JavaScript only for required interaction;
- do not add dependencies for cosmetic parity;
- do not change verified business content to match a reference;
- preserve SEO, accessible headings, focus behavior, and reduced motion;
- preserve the intentional light public theme and established DHP visual DNA.

For testable behavior, follow RED -> GREEN -> REFACTOR. Visual-only adjustments should be verified at the affected breakpoints and through the repository quality gate.

### 7. Parallel work only after the foundation is fixed

Parallel builders/subagents are allowed only when tasks are independent.

Before parallelizing:

- freeze the target route and design-system mapping;
- assign non-overlapping file scopes;
- make each task small enough to review independently;
- keep shared primitives sequential if multiple tasks depend on them.

Never allow multiple agents to modify the same component or global styles concurrently.

### 8. Visual QA against the DHP spec

The completion target is not "matches the foreign site." It is:

> the accepted pattern solves the stated DHP customer problem while remaining native to DHP design, content truth, accessibility, performance, and architecture.

Verify:

- 320–390px mobile;
- 768px tablet when the layout changes there;
- compact desktop around 1024–1279px when navigation/grid density matters;
- 1440px desktop;
- keyboard and visible focus;
- reduced motion;
- no overflow or hidden primary action;
- no new CLS from media/loading states;
- no copied/protected assets or fabricated content.

Then run the canonical gate:

```bash
npm run quality
```

## Output contract

Keep research artifacts lightweight. Unless a durable design decision truly needs repository documentation, put the reference findings and adaptation matrix in the task/PR description rather than creating permanent folders.

A completed reference-driven change should report:

1. customer problem;
2. reference patterns accepted;
3. patterns explicitly rejected;
4. DHP components/tokens reused;
5. files changed;
6. verification performed;
7. remaining risk.

## Imported ideas vs. rejected clone defaults

This skill intentionally adopts only the useful workflow ideas commonly found in website reverse-engineering systems:

**Adopted:** reconnaissance, responsive sweep, interaction-model discovery, component-sized specs, foundation-first implementation, controlled parallelism, and visual verification.

**Rejected for DHP:** pixel-perfect emulation, foreign global-token replacement, automatic asset downloading, copied site content, mock data for visual parity, route mirroring, per-site component namespaces, mandatory research/screenshot archives, framework/scaffold assumptions, and dependency additions for cloning.

Conceptual research source: `JCodesMore/ai-website-cloner-template` / `clone-website` workflow. It is a reference input only; this repository does not vendor or depend on it.
