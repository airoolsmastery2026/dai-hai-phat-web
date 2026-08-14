# Foundation — Anthropic Frontend Design adapter

Read this phase only for a new UI surface or a meaningful composition change.
The conceptual source is Anthropic's
[`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
skill; this file adapts its design-intent workflow to DHP authority.

## Required output

Produce a compact design intent before coding:

1. **Customer and job** — name the DHP customer and the one job this surface
   must complete.
2. **Hierarchy** — identify the single primary action, supporting proof, and
   what may be progressively disclosed.
3. **Composition** — compare at most two layouts in short prose or an ASCII
   wireframe, then select one with a concrete reason.
4. **DHP signature** — ground the composition in residential materials,
   verified project imagery, or the engineering consultation flow.
5. **Constraints** — map the selection to existing DHP tokens, components,
   content, mobile behavior, and performance limits.

Do not generate a new palette, font system, or visual identity. Anthropic's
generic recommendation to seek a distinctive typeface is subordinate here:
`DESIGN.md` intentionally locks Inter and the DHP token system.
