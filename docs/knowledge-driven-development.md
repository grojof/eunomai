---
type: explanation
title: "Knowledge-driven development (the KDD lens)"
description: "eunomai as a knowledge-activation spectrum, crossed with the six KDD knowledge domains — from passive docs to active skills and hooks."
tags: [kdd, knowledge]
updated: 2026-06-26
---

# Knowledge-driven development (the KDD lens)

eunomai is best understood as a **knowledge-activation workspace**: it captures a project's knowledge and
moves it along a spectrum from *passive* (docs a human reads) to *active* (skills an agent executes, hooks a
runtime enforces). "Knowledge-Driven Development" (KDD) is the **lens and vocabulary** for that idea — adopted
deliberately as a *framing*, **not** as a heavyweight methodology. The decision and the rejected alternatives
are recorded in [decisions/0002-adopt-kdd-as-lens](decisions/0002-adopt-kdd-as-lens/).

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
| Explanatory / reference (project) | [living-docs](living-docs.md) (Diátaxis) | 🟢 **passive** — a human reads it |
| Normative / conventions | `CLAUDE.md`, `openspec/config.yaml`, permissions | 🟡 **semi-active** — injected as agent context |
| Requirements / change decisions | [OpenSpec specs](sdd.md) + ADRs (`decisions/`) | 🟡 **semi-active** — traceable specs |
| Procedural / know-how | [skills](skill-finder.md) (+ [base-skills](base-skills.md)) | 🔴 **active** — an agent executes it |
| Operational / policy | [safe-controls](safe-controls.md) hooks | 🔴 **enforced** — at runtime |
| Experiential | the agent's memory (one fact per file) | 🔵 **accumulating** |

The key reframe: **KDD is not a synonym for living-docs — it is the lens that unifies all the pillars** as
knowledge in different states of activation. A skill is documentation that an agent can *run*; a hook is policy
that the runtime *applies*; a spec is a requirement that the flow *tracks*. That progression — passive →
active — is what makes eunomai knowledge-*driven* rather than merely knowledge-*storing*.

## A second axis: the knowledge *domain*

Activation state answers *how executable* a piece of knowledge is. It says nothing about *what the knowledge is
about*. The AWS Builder article ["¿Qué es Knowledge-Driven Development y por qué la IA lo
necesita?"](https://builder.aws.com/content/3Euh1e1W8NQquMJZM2LTCtsbABQ/que-es-knowledge-driven-development-y-por-que-la-ia-lo-necesita)
names that second axis — six **knowledge domains** — and frames KDD as *"converting project knowledge into
living, versioned, actionable context"* held as **minimal sufficient information, not heavy documentation**
(exactly eunomai's "earns its place" posture). The domains:

| Domain | What it captures | Often lives in |
|--------|------------------|----------------|
| **business** | needs, objectives, rules, constraints, processes, priorities | `explanation` docs, glossary |
| **product** | what's being built, scope, roadmap, acceptance criteria | `explanation`/`reference` docs, OpenSpec specs |
| **technical** | architecture, integrations, patterns, conventions, ADRs, contracts | `reference` docs, `CLAUDE.md`, ADRs |
| **operational** | deploy, monitoring, observability, security, ownership, support | `how-to`/`reference` docs, safe-controls |
| **historical** | past decisions, trade-offs, lessons learned (the most overlooked) | ADRs, agent memory |
| **AI-ready** | context curated and kept fresh specifically for agents | the routable substrate as a whole |

**Domain is orthogonal to both mode and activation.** Diátaxis (the `type` field) says a page's *shape*;
activation says how *executable* it is; domain says what it is *about*. The same fact can be re-expressed across
modes and activated to different states — the domain is invariant. (Note the partial overlap of **AI-ready**
with the *semi-active* state: AI-ready is best read as a *domain goal* — "is this curated for an agent to use?"
— rather than a distinct activation state. We keep it as a sixth domain, faithful to the article, and flag the
overlap here rather than collapsing the two axes.)

The article's **seven principles** — knowledge lives near the code · capture is selective (minimal sufficient) ·
decisions matter as much as code · dual utility for humans *and* agents · knowledge needs an **owner** ·
knowledge **evolves** with the system · AI needs context, not guesses — are the operating frame the
`eunomai-living-docs` skill applies. The domain axis is its **coverage lens**: *which domains has this project
left under-captured?* — a judgement, never a gate rule and never a new frontmatter field.

## Parallels worth noticing

Some of KDD-the-methodology's ideas already appear in eunomai, organically and lightweight:

- **Atomic knowledge units (Statements of Relevance)** ↔ the memory rule of **one fact per file**, and each
  OpenSpec change as a unit of change-knowledge.
- **Industry → enterprise → project hierarchy** ↔ the gradient from **base skills** (universal,
  standards-anchored) → **skill-finder + project rules** (project-specific).
- **Single source of truth** ↔ the single authored `CLAUDE.md` (Claude-only; no generated copies).

## What eunomai deliberately does *not* adopt

KDD-the-methodology's distinctive machinery — the Product-Process Matrix, formal Statements of Relevance, and
an exhaustively maintained **knowledge graph with end-to-end traceability** — is **out of scope**. Building and
hand-maintaining that fabric is exactly the **continuous-conformance "governance tower" eunomai abandoned**
(see [vision](vision.md)); it collides with *low maintenance over reach* and *don't reinvent*.

The one genuinely missing piece relative to KDD — **cross-cutting traceability** (requirement → spec → code →
test → doc) — is acknowledged but only pursued **incrementally and link-first** (e.g. explicit cross-refs
between a spec, its doc, and the skill that enacts it), never as a graph engine. See the ADR for the rejected
"build traceability now" option.

We take the article's **vocabulary and its domain lens**, not its tooling. Specifically out of scope:

- **A KDD toolkit** (the article's *Kaddo*, or anything like it). We already have `docs-check` (deterministic
  shape gate) and the read-only `coherence-auditor` — *don't reinvent*, *low maintenance over reach*.
- **A scope cascade** (universal → language → framework → environment → company → project), as in the earlier
  `ai-workspace-generator`. That layering was bound to **multi-tool projection** (`AGENTS.md` →
  Copilot/Codex/OpenCode) and a config-driven generator — precisely what [ADR-0004](decisions/0004-claude-only/)
  (Claude-only) and the abandoned governance tower rejected. We keep the *insight that layering adds robustness*
  and apply it on the **domain** axis as a lens, not by resurrecting the **scope** axis as an engine.

## Why this matters

Naming the lens changes how new capabilities are judged. The question for any addition becomes: *what kind of
knowledge is this, and at what activation state should it live?* — which keeps each pillar in its lane (docs
explain, skills act, hooks enforce, specs track) and keeps the whole low-maintenance.
