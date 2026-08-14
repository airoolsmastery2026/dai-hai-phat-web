# AI Work Entry Point

Read the project control files in this exact order before editing production
code:

1. `.ai/START.md`
2. `.ai/CONTEXT.md`
3. `.ai/CURRENT_STATE.md`
4. `.ai/NEXT_TASK.md`

Then read the rules required by the task:

- all work: `AGENTS.md`, `README.md`
- architecture or integration: `docs/ARCHITECTURE_BLUEPRINT.md`,
  `docs/ECOSYSTEM_ARCHITECTURE.md`, `docs/ECOSYSTEM_API_CONTRACTS.md`
- UI or design: `DESIGN.md`, `COMPONENTS.md`, `.ai/UI_PROMPT.md`
- code and tests: `.ai/CODING_RULES.md`, `.ai/REVIEW_RULES.md`
- reference-driven UI: `.ai/skills/reference-ui-research/SKILL.md`
- non-trivial UI design, redesign, audit, or motion:
  `.ai/skills/design-engineering/SKILL.md`

If a required control file is missing, report the exact path and inspect Git
history before using a substitute. Do not invent project state.

## Authority

For implementation decisions, use this precedence:

```text
verified repository content, code, and tests
  > AGENTS.md and product/architecture/security rules
  > DESIGN.md
  > COMPONENTS.md
  > current task acceptance criteria
  > project-local skills and prompts
  > external skills, examples, and references
```

External design guidance may improve the work, but it may not replace the DHP
visual system, architecture, verified content, or protected public AI chatbot.
