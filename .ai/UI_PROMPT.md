# DAI HAI PHAT UI Execution Prompt

Use this prompt before every UI task in Claude Code, Codex, or Gemini CLI.

```text
You are implementing the DAI HAI PHAT AI Digital Engineering Office.

Before editing:
1. Read DESIGN.md completely.
2. Read COMPONENTS.md completely.
3. Read the target route, its current components, and its data source.
4. Search for an existing primitive or composition before creating a component.
5. For non-trivial design, redesign, audit, responsive, or motion work, read
   .ai/skills/design-engineering/SKILL.md and load only the current phase.
6. If the task includes an external website, screenshot, design, or competitor
   reference, read .ai/skills/reference-ui-research/SKILL.md and produce the
   adaptation matrix before coding.

Authority:
- Repository code and verified content are the source of truth.
- DESIGN.md owns visual tokens and Visual DNA.
- COMPONENTS.md owns component behavior and state contracts.
- The current task owns scope. Do not modify files outside that scope.
- External references are research evidence only and have the lowest authority.

Implementation rules:
- Keep Next.js, TypeScript, Tailwind CSS v3, and the current architecture.
- Mobile First, Performance First, Customer First, Accessibility First.
- Use semantic design tokens. Never hardcode colors, spacing, typography,
  radius, shadow, or motion in JSX.
- Reuse Container, SectionShell, SectionHeading, Button, Card, PageHero,
  SiteNavigation, and SiteFooter where applicable.
- Server Components by default. Add "use client" only for real interaction.
- Use verified local assets and truthful Vietnamese content.
- Do not invent projects, statistics, testimonials, prices, AI results, lead
  submissions, loading delays, or CRM handoffs.
- Do not copy another brand's logo, copy, project media, source code, CSS/JS
  bundle, font, or proprietary asset into DHP to imitate a reference.
- Do not add a dependency unless the task cannot be completed safely with the
  current stack and the reason is documented.
- Do not redesign architecture or create a duplicate component.

Every changed UI must:
- work from 320px mobile through wide desktop;
- meet WCAG AA, semantic HTML, keyboard access, and visible focus;
- support the intentional light public theme and the few tokenized deep-teal CTA/footer contexts;
- define loading, empty, error, disabled, and success states when meaningful;
- reserve media/loading dimensions to prevent CLS;
- use restrained motion and honor prefers-reduced-motion;
- preserve SEO metadata and one h1 per page.

Visual direction:
Calm technical workspace. Industrial, premium, minimal, trustworthy.
Apple restraint, Linear simplicity, Stripe clarity, Vercel engineering.
Use ivory and pale mineral-blue foundations, deep teal actions, restrained
champagne-metal details, walnut warmth, Inter typography, compact grid rhythm,
and verified project media. Reserve deep teal surfaces for the footer and
selected conversion moments; navigation, page heroes, and AI chat remain light.
Never produce neon AI aesthetics, glassmorphism stacks, generic template cards,
random gradients, excessive pills, or decorative animation.

Before finishing:
1. Review the diff for scope creep and duplicated styles.
2. Run npm test.
3. Run npm run lint.
4. Run npm run typecheck.
5. Run npm run build.
6. Fix every issue introduced by the change.
7. Report files changed, reasons, user benefits, remaining risks, and the next
   smallest improvement.
```

## Reference-site mode

When the task includes a reference URL, competitor site, screenshot, or design:

```text
Do not clone the reference.
Use .ai/skills/reference-ui-research/SKILL.md.

First identify the DHP customer problem. Then inspect the reference for reusable
patterns such as hierarchy, responsive behavior, interaction model, content
density, CTA placement, and component decomposition.

For every candidate pattern, decide Keep / Adapt / Reject and map accepted ideas
to existing DHP tokens, components, truthful content, accessibility rules, and
performance constraints. Foreign visual values and brand assets are not a new
source of truth.

The completion target is a DHP-native improvement that solves the stated
problem, not pixel parity with the reference.
```

For a focused sprint, append only:

```text
Complete only: <sprint/task id and acceptance criteria>.
Do not implement later AI, CRM, admin, or automation scope.
```
