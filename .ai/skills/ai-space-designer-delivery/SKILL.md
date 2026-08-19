---
name: ai-space-designer-delivery
description: Execute Dai Hai Phat AI Space Designer work through strict geometry truth, staged gates, UMS role ownership, deterministic validation, evidence-based continuation, and repository quality checks.
argument-hint: "<stage-or-outcome>"
user-invocable: true
---

# AI Space Designer Delivery

Use this project skill for any DHP task involving floor plans, room geometry, interior layout, geometry-preserving render, material/BOQ grounding, or the Space Designer delivery pipeline.

This skill does not create a new orchestration system. It binds the existing DHP repository rules to the existing Universal Master Skills OS.

## Authority

Read before editing:

1. `AGENTS.md`
2. `README.md`
3. `docs/ARCHITECTURE_BLUEPRINT.md`
4. `docs/ECOSYSTEM_ARCHITECTURE.md`
5. `docs/ECOSYSTEM_API_CONTRACTS.md`
6. `docs/AI_SPACE_DESIGNER_EXECUTION_CONTRACT.md`
7. `DESIGN.md`, `COMPONENTS.md`, and `.ai/UI_PROMPT.md` for UI work
8. the target implementation, adjacent capability, and relevant tests

Authority order:

```text
Repository source of truth / tests
  > DHP project contracts
  > this project skill
  > Universal Master Skills OS
  > provider/model/tool guidance
  > external references
```

Never allow UMS, a model, an image provider, a CAD/render tool, or a reference product to override DHP data ownership, geometry truth, customer validation, pricing truth, security, or Definition of Done.

## Required execution model

Use the smallest UMS team required for the active stage. Do not start a multi-agent swarm by default.

Canonical composition:

```text
Final integrator / artifact owner
  PM-01 project-planning

Requirements / architecture
  PR-02 requirements-specification
  SA-03 system-design

Spatial geometry
  CB-01 cad-bim-brief
  CB-02 geometry-modeling

AI boundary
  AI-01 model-routing
  AI-02 prompt-system-design
  AI-05 agent-evaluation
  AI-06 agent-safety-guardrails

Implementation
  SE-03 implementation

Verification
  QA-05 quality-gate
  K-05 evidence-completion-gate
```

Inject only when the stage requires them:

- `CB-04 visualization-rendering` for render/presentation;
- `CB-05 quantity-extraction` and `CE-04 quantity-takeoff` for measured quantities;
- `CE-03 material-specification`, `CE-05 cost-estimation`, and `CE-06 constructability-review` for material/cost/buildability;
- `FW-02 responsive-implementation`, `FW-03 web-accessibility`, UX skills for customer UI;
- relevant Security/Data/DevOps skills when their trust boundary is actually touched.

Mandatory UMS kernel gates can never be pruned:

- `K-01 source-of-truth-resolver`;
- `K-02 scope-lock`;
- `K-03 anti-bloat-guardian`;
- `K-04 permission-risk-gate` when side effects/risk require it;
- `K-05 evidence-completion-gate`;
- `K-06 evidence-decision-chain`;
- `K-07 tool-capability-registry` when execution depends on environment/tool capability.

## Stage router

Route work to exactly one current delivery stage unless independent non-overlapping work has been explicitly delegated.

```text
G0 authority + scope lock
 -> G1 Space Model + deterministic validation
 -> G2 input acquisition
 -> G3 AI extraction to candidate Space Model
 -> G4 geometry confirmation / lock
 -> G5 layout + deterministic constraints
 -> G6 render adapter
 -> G7 material + BOQ + price grounding
 -> G8 proposal + survey + CRM handoff
 -> G9 production verification
```

The detailed acceptance conditions are normative in `docs/AI_SPACE_DESIGNER_EXECUTION_CONTRACT.md`.

## Non-negotiable spatial rules

1. A generated image is never geometry truth.
2. The canonical Space Model revision must be explicit before a dependent proposal is accepted.
3. HARD geometry cannot be changed by AI output.
4. CONTROLLED geometry requires explicit approval before the change is accepted.
5. FREE placement remains subject to room boundary, collision, clearance, dimension, constructability, and product constraints.
6. AI output is a candidate until deterministic validation succeeds.
7. Unknown or AI-inferred dimensions must not be promoted to verified dimensions without evidence.
8. Render/provider output may fail or be replaced without corrupting the Space Model.
9. Materials/prices/supplier facts must come from verified DHP sources; the model may explain them but not invent them.
10. Existing `AI Concept Studio` rendering capability must be reused where appropriate instead of duplicated.

## TDD / verification loop

For every new testable invariant:

```text
RED
  reproduce required failure or add the contract test
GREEN
  implement the smallest behavior that satisfies it
REFACTOR
  simplify only while the focused test remains green
GATE
  run the complete repository quality gate before completion
```

Never weaken, skip, or delete a valid test to advance a stage.

Required evidence before a stage passes:

- acceptance criteria mapped to objective checks;
- relevant focused tests green;
- no unexplained scope creep or duplicate source of truth;
- no secret or unverified customer/business truth introduced;
- final code batch passes `npm run quality` before merge.

## Continuous execution

When the current gate passes and the next stage has all mandatory inputs, continue automatically. Do not request repeated confirmation merely because a new file, commit, or ordinary stage boundary was reached.

Stop and surface the blocker only when one of these is true:

- a real code/test/quality failure cannot be resolved safely inside scope;
- required repository/tool/provider access is missing;
- mandatory project data is missing and cannot be derived safely;
- the next action is destructive or deletes business data;
- authentication/authorization must be redesigned;
- framework/runtime architecture must be replaced materially;
- paid/metered provider activation is required but not already authorized;
- proceeding would cross the active scope/permission boundary.

Do not convert quota, deployment, or provider infrastructure failures into fake code success or speculative fixes.

## Delegation contract

Parallel work is allowed only when write ownership is disjoint.

Every delegated task must state:

- objective;
- current stage/gate;
- exact writable files or artifact boundary;
- read-only inputs;
- invariants that cannot change;
- tests/evidence required;
- Definition of Done;
- handoff target to the final integrator.

The final integrator owns shared contracts, integration, conflict resolution, review, and final verification. One writable artifact has one final owner.

## Anti-bloat contract

Before creating a file, component, provider, abstraction, service, package, database, queue, or agent:

1. search the repository for the adjacent capability;
2. prefer extension/reuse;
3. state the demonstrated missing responsibility;
4. keep the new boundary narrow;
5. verify the net result is simpler than parallel duplication.

Do not create a second Space Designer app, second AI router, second render studio, or duplicated DHP product/pricing source of truth.

## Output / handoff contract

Every meaningful batch reports:

1. gate reached and gate evidence;
2. files/artifacts changed and owner;
3. tests/checks run and their actual result;
4. unresolved blocker or residual risk;
5. next smallest stage/action;
6. whether execution can continue automatically under the project authorization.

A passed narrow gate is not permission to claim the entire Space Designer is complete.