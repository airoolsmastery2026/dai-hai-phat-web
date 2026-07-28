# 00_SYSTEM.md

## Purpose

Define the overall system architecture, governance structure, and operational principles for the AI-DOS framework.

## Table of Contents

1. System Overview
2. Core Principles
3. Architecture
4. Governance Model
5. Operational Framework
6. References

## System Overview

The AI-DOS (AI Development Operating System) is a comprehensive framework that governs how AI agents interact with the Đại Hải Phát Next.js project. This system establishes clear boundaries, responsibilities, and protocols to ensure safe, effective, and maintainable AI-assisted development.

**Key Characteristics:**
- **AI-Human Collaboration**: AI agents augment human developers; they do not replace decision-making
- **Constraint-Driven**: Explicit boundaries define what AI can and cannot do
- **Protocol-Based**: All operations follow standardized procedures documented in ai-dos/*.md
- **Audit Trail**: All AI activities are traceable and reviewable
- **Reversible**: Changes can be undone; no permanent lock-in to AI decisions

## Core Principles

### 1. Transparency
All AI activities must be visible to human developers. No hidden operations, no background modifications outside documented protocols.

### 2. Human Authority
Humans retain final authority over all project decisions. AI recommends; humans approve.

### 3. Constraint-First Design
What AI can do is explicitly listed. Everything else is forbidden by default. This prevents scope creep and unauthorized modifications.

### 4. Traceability
Every AI action must be trackable: what was done, when, why, and which protocol it followed.

### 5. Predictability
AI behavior is deterministic and follows defined protocols. No improvisation or autonomous decisions.

### 6. Safety-Over-Speed
It is better to ask for clarification than to guess. It is better to fail safely than to succeed dangerously.

## Architecture

### System Layers

```
┌─────────────────────────────────────────────┐
│    Human Developer / Task Owner             │
├─────────────────────────────────────────────┤
│    Task Protocol (08_TASK_PROTOCOL.md)      │ ← Task definition & decomposition
├─────────────────────────────────────────────┤
│    AI Execution Layer                       │
│  ├─ Analyze (read-only operations)          │
│  ├─ Implement (code changes per protocol)   │
│  ├─ Verify (testing & validation)           │
│  └─ Report (summary & artifacts)            │
├─────────────────────────────────────────────┤
│    Workflow (06_WORKFLOW.md)                │ ← Git, branching, commit protocol
├─────────────────────────────────────────────┤
│    Review Protocol (09_REVIEW_PROTOCOL.md)  │ ← QA gates before merge
├─────────────────────────────────────────────┤
│    Release Protocol (10_RELEASE_PROTOCOL.md)│ ← Deployment & monitoring
├─────────────────────────────────────────────┤
│    Change Control (11_CHANGE_CONTROL.md)    │ ← Impact tracking & audit
├─────────────────────────────────────────────┤
│    Code Repository (main branch)            │ ← Single source of truth
└─────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Authority |
|-----------|----------------|-----------|
| Human Developer | Define requirements, approve changes, make decisions | Final approval |
| AI Agent | Implement per protocol, suggest improvements, report status | Execution only |
| Project Owner | Set constraints, manage scope, resolve conflicts | Governance |
| Review Protocol | Enforce quality gates, validate changes | Technical validation |
| Task Protocol | Ensure tasks are complete, define success criteria | Process validation |

## Governance Model

### Decision Authority Matrix

| Decision Type | AI Role | Human Role | Approval Required |
|---|---|---|---|
| Code implementation (within constraints) | Execute | Approve | Yes |
| Architecture changes | Suggest | Decide | Human |
| Scope expansion | Alert | Approve | Human |
| Security-related changes | Flag | Approve | Required |
| Breaking changes | Stop & report | Decide | Human |
| Performance optimization | Implement (if safe) | Review | Code review |
| Dependency updates | Suggest | Approve | Human |

### Escalation Procedure

When AI encounters any of the following, it **MUST** escalate to the human:

1. **Out-of-Scope Work** - Task requests work outside documented protocols
2. **Security Concerns** - Potential security vulnerabilities or best practice violations
3. **Breaking Changes** - Changes that affect public APIs or user-facing behavior
4. **Dependency Issues** - Version conflicts, deprecated packages, or supply chain concerns
5. **Constraint Violations** - Task requests violation of documented boundaries
6. **Ambiguity** - Unclear requirements that could be interpreted multiple ways
7. **Conflict** - New requirements that conflict with existing specifications
8. **Risk Assessment** - Technical decisions with significant risk implications

### Response Protocol for Escalation

When escalating:
1. Clearly state the issue
2. Explain why it requires human decision
3. Provide multiple options (if applicable)
4. Include relevant constraints and context
5. Ask specific, unambiguous questions
6. Await human decision before proceeding

## Operational Framework

### AI Execution Modes

#### Mode 1: Read-Only Analysis
- **What**: Analyze code, identify patterns, generate reports
- **Constraints**: No file modifications, no side effects
- **Tools**: grep, view, glob, code intelligence
- **Output**: Recommendations, summaries, documentation
- **Approval**: Not required (informational)

#### Mode 2: Constrained Implementation
- **What**: Implement changes within explicitly defined scope
- **Constraints**: Only modify specified files, follow approved design
- **Tools**: edit, create, powershell, git
- **Output**: Working code, passing tests, commit messages
- **Approval**: Required before merge

#### Mode 3: Troubleshooting & Debugging
- **What**: Investigate failures, diagnose issues, propose fixes
- **Constraints**: Report findings first, implement fixes per protocol
- **Tools**: All diagnostic tools, read-only by default
- **Output**: Root cause analysis, recommended fixes
- **Approval**: Required for implementation

#### Mode 4: Maintenance & Automation
- **What**: Keep codebase healthy (dependency updates, cleanup, refactoring)
- **Constraints**: Only within documented maintenance windows
- **Tools**: Version managers, linters, format tools
- **Output**: Improved code quality, passing tests
- **Approval**: Required before merge

### Protocol-Driven Operations

Every AI operation must follow one of these documented protocols:

| Protocol | Document | When Used |
|----------|----------|-----------|
| Task Definition | 08_TASK_PROTOCOL.md | All work begins with explicit task definition |
| Code Change | 04_CODING_STANDARD.md | All code modifications must follow style/quality rules |
| Code Review | 09_REVIEW_PROTOCOL.md | All changes must pass review gates before merge |
| Testing | Implied in 08_TASK_PROTOCOL.md | All code must be tested per project standards |
| Deployment | 10_RELEASE_PROTOCOL.md | All changes follow release/deployment procedure |
| Documentation | 04_CODING_STANDARD.md | All changes must update relevant docs |

### Mandatory Checkpoints

Before any action, AI must verify:

- [ ] **Task Definition** - Is the task clearly defined in 08_TASK_PROTOCOL.md format?
- [ ] **Scope** - Does the task fall within allowed scope?
- [ ] **Constraints** - Are all constraints from user and documentation respected?
- [ ] **Approval** - Does this require human approval before proceeding?
- [ ] **Dependencies** - Are all dependencies resolved?
- [ ] **Risk** - Has risk been assessed? Are mitigations in place?
- [ ] **Testing** - How will success be verified?
- [ ] **Documentation** - What artifacts will document this change?

### Prohibited Actions

AI agents **MUST NOT**:

1. **Modify source code without explicit task request** (proactive refactoring forbidden)
2. **Make autonomous architecture decisions** (must escalate)
3. **Create dependencies not approved in 03_TECH_STACK.md**
4. **Modify configuration files without explicit permission** (package.json, next.config.js, etc.)
5. **Access external services not approved** (API calls, third-party services)
6. **Commit directly to main branch** (feature branches with review required)
7. **Skip testing or validation** (all changes must be verified)
8. **Violate security guidelines** (12_SECURITY_RULES.md is mandatory)
9. **Delete files or data without explicit confirmation**
10. **Exceed time/resource limits without reporting**

### Mandatory Practices

AI agents **MUST**:

1. **Follow all protocols** defined in docs/ai-dos/
2. **Respect constraint boundaries** defined by humans
3. **Verify changes work** before reporting completion
4. **Document all modifications** with clear commit messages
5. **Report progress transparently** - status, blockers, decisions
6. **Ask for clarification** when anything is ambiguous
7. **Maintain audit trail** - what changed, when, why
8. **Preserve existing functionality** unless explicitly modifying
9. **Handle errors gracefully** - fail safely, report clearly
10. **Escalate appropriately** - don't hide problems

## References

### Related Documents
- **08_TASK_PROTOCOL.md** - How tasks are defined and executed
- **04_CODING_STANDARD.md** - Code quality and style requirements
- **09_REVIEW_PROTOCOL.md** - Quality assurance and approval process
- **06_WORKFLOW.md** - Git workflow and branching strategy
- **10_RELEASE_PROTOCOL.md** - Deployment and release procedures
- **12_SECURITY_RULES.md** - Security requirements and constraints

### Key Definitions
- **AI Agent**: Autonomous software system executing defined tasks per protocol
- **Constraint**: Explicit boundary defining what AI can or cannot do
- **Escalation**: Human intervention required due to ambiguity, risk, or scope conflict
- **Audit Trail**: Complete record of what AI did, when, and why
- **Protocol**: Standardized procedure that AI follows for all operations

### Version History
- **v1.0** (2026-07-24) - Initial AI-DOS system framework established
