# DHP AI Space Designer — Execution Contract

## Status

This document is the project-level execution contract for the DHP AI Space Designer capability inside `dai-hai-phat-web`.

It is subordinate to `README.md`, `AGENTS.md`, `docs/ARCHITECTURE_BLUEPRINT.md`, `docs/ECOSYSTEM_ARCHITECTURE.md`, `docs/ECOSYSTEM_API_CONTRACTS.md`, `DESIGN.md`, and `COMPONENTS.md`. Repository code and tests remain the implementation source of truth.

The purpose of this contract is to make the Space Designer **small, deterministic where possible, provider-replaceable, staged, and continuously executable without uncontrolled scope growth**.

## Product outcome

The target customer flow is:

```text
floor plan / room image / scan / description
        |
        v
space understanding
        |
        v
DHP Space Model (canonical geometry contract)
        |
        +--> deterministic geometry + constraint validation
        |
        v
layout/design proposal
        |
        v
render adapter
        |
        v
verified DHP material/product/pricing evidence
        |
        v
preliminary BOQ / budget / proposal
        |
        v
survey -> engineering validation -> quotation -> CRM handoff
```

The product does **not** treat a generated image as construction truth. A render is a presentation artifact. Canonical geometry, verified data, engineering review, and quotation rules remain authoritative.

## Architecture lock — one logical brain, deterministic tools

Do not create a swarm of independent production agents for v1.

```text
                         USER INPUT
                             |
                             v
                    DHP AI LOGICAL BRAIN
                  (existing cloud AI router)
                             |
        +--------------------+--------------------+
        |                    |                    |
        v                    v                    v
  SPACE MODEL          DHP VERIFIED DATA      RENDER TOOL
  + GEOMETRY           + PRICING RULES       provider adapter
  + CONSTRAINTS        + MATERIALS
        |                    |                    |
        +--------------------+--------------------+
                             |
                             v
                     DHP SALES WORKFLOW
              design -> estimate -> proposal -> CRM
```

Rules:

1. `DHP Space Model` is the geometry source of truth for this capability.
2. Geometry/constraint checks are deterministic TypeScript rules where practical; the AI may propose but must not bypass them.
3. The existing cloud AI routing boundary is the logical AI brain. Do not hardcode business logic to one text-model provider.
4. Specialized image/render providers remain adapters. Their output cannot overwrite canonical geometry silently.
5. Materials, products, suppliers, prices, and quotation facts come from verified DHP sources; AI-generated values are not canonical facts.
6. No new database, queue, microservice, framework, local LLM, or package is introduced without a measured need and architecture decision.

## Geometry lock model

Every structural or spatial element is governed by one of three lock classes:

### HARD

AI-generated proposals cannot move, resize, remove, or reinterpret these elements.

Examples:

- structural walls
- columns
- floor boundary
- shafts
- verified fixed openings
- verified critical dimensions

A hard-lock edit is a blocking validation error.

### CONTROLLED

A proposal may suggest a change, but it remains blocked until explicit approval is recorded at the domain boundary.

Examples:

- non-structural partitions
- doors where relocation is technically possible
- kitchen anchors
- plumbing-dependent fixtures
- ceiling zones

An unapproved controlled edit is a blocking validation error.

### FREE

Elements intended to be optimized by the design workflow may move inside validated room boundaries and other constraints.

Examples:

- loose furniture
- decor
- style/material presentation selections that do not alter verified geometry

Free does not mean unconstrained. Boundary, collision, clearance, constructability, product dimension, and budget rules still apply.

## Stage-gated delivery

No stage may be marked complete only because code was written. Each stage must satisfy its gate before the next dependent stage is integrated.

```text
G0 AUTHORITY / SCOPE LOCK
        |
        v
G1 SPACE MODEL + DETERMINISTIC VALIDATOR
        |
        v
G2 INPUT ACQUISITION
(image / PDF / scan / description)
        |
        v
G3 AI EXTRACTION -> CANDIDATE SPACE MODEL
        |
        v
G4 GEOMETRY CONFIRMATION / LOCK
        |
        v
G5 LAYOUT + CONSTRAINT SOLVING
        |
        v
G6 RENDER ADAPTER
        |
        v
G7 MATERIAL / BOQ / PRICE GROUNDING
        |
        v
G8 PROPOSAL / SURVEY / CRM HANDOFF
        |
        v
G9 PRODUCTION VERIFICATION
```

### G0 — Authority / scope lock

Required:

- current repository state inspected;
- relevant source-of-truth documents read;
- existing adjacent capability searched before adding files;
- non-goals recorded;
- no duplicate app/service introduced.

Gate evidence:

- spec/PR scope;
- anti-bloat review;
- explicit acceptance criteria.

### G1 — Space Model + deterministic validator

Required:

- versioned Space Model contract;
- room polygon validation;
- unique stable IDs;
- hard/controlled lock enforcement;
- placement boundary/collision checks;
- regression tests for invalid geometry and lock bypasses.

Gate evidence:

- focused tests pass;
- TypeScript/lint/build pass through `npm run quality` before merge.

### G2 — Input acquisition

Allowed inputs, added only when implemented and tested:

- image upload;
- PDF floor plan;
- room scan / exported geometry;
- structured manual dimensions;
- text description as supplemental evidence, never a substitute for verified dimensions.

Required controls:

- file type and size validation;
- server-side trust-boundary validation when uploaded;
- no persistent storage without an approved retention policy;
- no claim that a dimension is verified merely because AI extracted it.

### G3 — AI extraction

AI output is a **candidate** Space Model.

Required:

- structured output schema;
- confidence/evidence metadata where practical;
- model/provider failures mapped to stable errors;
- deterministic parser rejects malformed output;
- no silent coercion of unknown dimensions into verified values;
- prompt/provider cannot bypass G1 rules.

### G4 — Geometry confirmation

Required before design/estimate claims rely on geometry:

- deterministic model validation is green;
- critical dimensions are verified or explicitly marked assumed;
- hard locks frozen;
- controlled changes require explicit approval;
- revision identity is preserved so stale proposals fail closed.

### G5 — Layout + constraints

Required:

- proposals reference the exact base geometry revision;
- room boundaries enforced;
- structural collision checks enforced;
- clearance/overlap rules are deterministic where known;
- AI proposals failing constraints are rejected or regenerated, never presented as valid silently.

### G6 — Render adapter

Required:

- geometry/camera intent passed as constraints;
- provider is replaceable behind a narrow adapter;
- render failures do not corrupt the Space Model;
- generated images are labelled as concept/presentation where engineering validation is incomplete;
- existing `AI Concept Studio` capability is reused where it fits rather than duplicated.

### G7 — Material / BOQ / price grounding

Required:

- quantities trace to frozen geometry/design inputs;
- unit rates trace to verified DHP data and source date;
- assumptions/waste/allowances are explicit;
- `review_required` or unverified prices cannot become official quotation facts;
- AI never invents supplier availability or price truth.

### G8 — Proposal / survey / CRM

Required:

- proposal distinguishes concept, preliminary estimate, and engineer-verified facts;
- customer data follows existing validation and CRM handoff invariants;
- successful UI state requires durable server receipt where existing CRM rules require it;
- customer is moved toward survey/quotation, not left in an open-ended image-generation loop.

### G9 — Production verification

Required:

- canonical `npm run quality` passes;
- affected customer path receives appropriate smoke/e2e/manual verification;
- no secret/generated junk/unrelated diff;
- production deployment commit matches merged `main` according to repository deployment invariant;
- rollback is documented for any external provider/config change.

## Continuous execution contract

The project authorizes continuous execution **inside the active approved scope**.

When a gate passes and the next stage has all mandatory inputs, the coordinator continues without requesting repeated confirmation.

Execution stops only for a real blocker:

1. failing code/test/quality gate that cannot be resolved within scope;
2. missing repository/tool/provider access required for the next action;
3. mandatory missing project data that cannot be derived safely;
4. destructive migration or data deletion;
5. authentication/authorization redesign;
6. framework/runtime replacement or major architecture change;
7. paid/metred provider activation not already explicitly authorized;
8. any action outside the approved scope or permission boundary.

A quota/deployment infrastructure incident is reported distinctly from a code defect. Agents must not weaken tests, bypass validators, invent evidence, or silently widen scope merely to keep moving.

## UMS team composition and ownership

The project-local skill `.ai/skills/ai-space-designer-delivery/SKILL.md` binds this workflow to UMS.

Recommended roles are composed from existing UMS skills rather than creating duplicate universal skills:

```text
Integrator / final owner
  PM-01 project-planning

Requirements + contract
  PR-02 requirements-specification
  SA-03 system-design

Geometry / CAD
  CB-01 cad-bim-brief
  CB-02 geometry-modeling
  CB-04 visualization-rendering (render phase only)

Construction grounding
  CE-01 site-project-brief
  CE-03 material-specification
  CE-04 quantity-takeoff
  CE-05 cost-estimation
  CE-06 constructability-review

AI
  AI-01 model-routing
  AI-02 prompt-system-design
  AI-05 agent-evaluation
  AI-06 agent-safety-guardrails

Implementation
  SE-03 implementation
  FW-02 responsive-implementation
  FW-03 web-accessibility

Verification
  QA-05 quality-gate
  K-05 evidence-completion-gate
```

Mandatory kernel injection remains active: source of truth, scope lock, anti-bloat, permission/risk, evidence, and tool capability gates.

### One-owner rule

Parallel UMS work is allowed only for independent write scopes. Every writable artifact has one final owner. Shared contracts, Space Model types, global UI primitives, and integration boundaries are sequentially owned by the coordinator unless an explicit non-overlapping delegation exists.

## Non-goals for the foundation batch

The foundation batch does **not**:

- claim automatic floor-plan recognition is production-ready;
- add a second AI orchestration framework;
- add a new persistent database;
- add a 3D engine dependency;
- publish invented materials/prices;
- replace the existing public AI chatbot;
- replace the existing AI Concept Studio;
- create microservices;
- activate paid AI usage automatically.

## Definition of Done

The Space Designer is complete only when the requested product slice satisfies its stage acceptance criteria, the deterministic constraints cannot be bypassed by AI output, relevant customer truth is grounded, `npm run quality` passes, the diff is reviewed, and production verification succeeds for a release stage.

Passing one gate never authorizes claiming later stages are complete.