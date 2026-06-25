# Knowledge-driven development (the KDD lens)

eunomai is best understood as a **knowledge-activation workspace**: it captures a project's knowledge and
moves it along a spectrum from *passive* (docs a human reads) to *active* (skills an agent executes, hooks a
runtime enforces). "Knowledge-Driven Development" (KDD) is the **lens and vocabulary** for that idea — adopted
deliberately as a *framing*, **not** as a heavyweight methodology. The decision and the rejected alternatives
are recorded in [decisions/0002-adopt-kdd-as-lens](../decisions/0002-adopt-kdd-as-lens/).

## Two things are called "KDD"

- **KDD as a methodology** — Manoj Kumar Lal's framework (IISc/Cambridge): structure and integrate knowledge
  across **industry → enterprise → project** via a *Product-Process Matrix*, atomic *Statements of Relevance*,
  and a traceability *knowledge graph* that becomes the single source of truth. Powerful, but heavy.
- **KDD in the agent era** — documentation/knowledge as **first-class fuel for AI agents**: the distinction
  between *knowledge an agent passively reads* and *knowledge an agent can act on*, and the practice of turning
  institutional knowledge into **executable primitives** ("knowledge activation") to beat the context-reset
  problem.

(A third, unrelated term — *Knowledge Discovery in Databases* — is data mining, not this.)

eunomai borrows the **vocabulary** of the first and **lives** the second.

## eunomai as a knowledge-activation spectrum

Living docs is only **one slice** of this picture — the passive, human-facing end. The same knowledge-driven
idea runs through **every pillar**, each encoding a different *kind* of knowledge at a different *activation
state*:

| Kind of knowledge | Where it lives in eunomai | Activation state |
|-------------------|---------------------------|------------------|
| Explanatory / reference (project) | [living-docs](../reference/living-docs.md) (Diátaxis) | 🟢 **passive** — a human reads it |
| Normative / conventions | `AGENTS.md`, `openspec/config.yaml`, permissions | 🟡 **semi-active** — injected as agent context |
| Requirements / change decisions | [OpenSpec specs](../reference/sdd.md) + ADRs (`decisions/`) | 🟡 **semi-active** — traceable specs |
| Procedural / know-how | [skills](../reference/skill-finder.md) (+ [base-skills](../reference/base-skills.md)) | 🔴 **active** — an agent executes it |
| Operational / policy | [safe-controls](../reference/safe-controls.md) hooks | 🔴 **enforced** — at runtime |
| Experiential | the agent's memory (one fact per file) | 🔵 **accumulating** |

The key reframe: **KDD is not a synonym for living-docs — it is the lens that unifies all the pillars** as
knowledge in different states of activation. A skill is documentation that an agent can *run*; a hook is policy
that the runtime *applies*; a spec is a requirement that the flow *tracks*. That progression — passive →
active — is what makes eunomai knowledge-*driven* rather than merely knowledge-*storing*.

## Parallels worth noticing

Some of KDD-the-methodology's ideas already appear in eunomai, organically and lightweight:

- **Atomic knowledge units (Statements of Relevance)** ↔ the memory rule of **one fact per file**, and each
  OpenSpec change as a unit of change-knowledge.
- **Industry → enterprise → project hierarchy** ↔ the gradient from **base skills** (universal,
  standards-anchored) → **skill-finder + project rules** (project-specific).
- **Single source of truth** ↔ the authored `AGENTS.md` projected to generated tool files.

## What eunomai deliberately does *not* adopt

KDD-the-methodology's distinctive machinery — the Product-Process Matrix, formal Statements of Relevance, and
an exhaustively maintained **knowledge graph with end-to-end traceability** — is **out of scope**. Building and
hand-maintaining that fabric is exactly the **continuous-conformance "governance tower" eunomai abandoned**
(see [vision](vision.md)); it collides with *low maintenance over reach* and *don't reinvent*.

The one genuinely missing piece relative to KDD — **cross-cutting traceability** (requirement → spec → code →
test → doc) — is acknowledged but only pursued **incrementally and link-first** (e.g. explicit cross-refs
between a spec, its doc, and the skill that enacts it), never as a graph engine. See the ADR for the rejected
"build traceability now" option.

## Why this matters

Naming the lens changes how new capabilities are judged. The question for any addition becomes: *what kind of
knowledge is this, and at what activation state should it live?* — which keeps each pillar in its lane (docs
explain, skills act, hooks enforce, specs track) and keeps the whole low-maintenance.
