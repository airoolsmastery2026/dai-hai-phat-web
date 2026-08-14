# Project Context

Dai Hai Phat Web is the public Next.js and TypeScript experience for a
residential AI Digital Engineering Office. It helps customers choose a
residential/interior service, provide project context, receive a preliminary
AI-assisted proposal, and hand the verified context to a human engineer.

The repository is the implementation source of truth. Use the linked canonical
documents instead of duplicating their full content here:

- product scope and protected AI entry: `README.md`
- contributor constitution and quality gate: `AGENTS.md`
- architecture and service boundaries: `docs/ARCHITECTURE_BLUEPRINT.md`
- visual system: `DESIGN.md` and `src/app/globals.css`
- reusable UI contracts: `COMPONENTS.md`
- verified company/service content: `src/content/`, `knowledge/`, and current
  typed domain modules

## Fixed constraints

- Keep Next.js, React, TypeScript, Tailwind CSS v3, and the current architecture.
- Prefer Server Components and existing primitives; add no package or
  abstraction without demonstrated need.
- Mobile First, Performance First, Customer Experience, AI First, SEO,
  Security, then Maintainability.
- Use truthful Vietnamese copy and verified local assets. Do not invent prices,
  projects, metrics, testimonials, AI results, or CRM delivery.
- The public AI consultation at `#ai-office` and its service presets are core
  product capabilities. They must remain visible, reachable, functional, and
  protected by regression tests.
