# Design intelligence — UI UX Pro Max adapter

Read this phase after the composition is fixed. The conceptual source is
[`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill);
use it as an advisor, not as a generator of a replacement design system.

## Check the selected direction

- Map every surface, action, status, radius, spacing, and type role to an
  existing semantic token or component contract.
- Verify the route has one `h1`, clear landmarks, stable heading order, visible
  focus, keyboard access, and WCAG AA contrast.
- Specify mobile behavior first at 320–390px, then 768px, compact desktop, and
  1440px only where the layout changes.
- Keep touch targets at least 48px, reserve media dimensions, and avoid
  horizontal overflow or covered primary actions.
- Prefer Server Components, `next/image`, accurate `sizes`, and the least
  client JavaScript needed for the interaction.
- Define loading, empty, error, disabled, and success states only when the
  surface genuinely owns those states.

Reject recommendations that require a foreign palette, font pairing, package,
component library, animation framework, or fabricated sample content.
