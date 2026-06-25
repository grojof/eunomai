# Explore 0002 — Does "knowledge-driven development" fit eunomai?

> Investigation prompted by the question: *KDD looks like what living-docs already does — can we adopt it, and
> how does it fit?* Findings grounded in primary sources on the term (see Sources), not assumptions.

## Problem

The living-docs pillar keeps project knowledge fresh and structured (Diátaxis). "KDD" sounds like the same
idea formalized. Before adopting a term, we need to know **what KDD actually is**, whether it is a synonym for
living-docs, and what — if anything — it adds that we lack.

## Findings (from source)

### "KDD" is overloaded — three meanings
1. **Knowledge Discovery in Databases** — data mining. Unrelated; discard.
2. **KDD the methodology** (Manoj Kumar Lal, IISc Press / Cambridge). A knowledge-management framework that
   structures and integrates knowledge across **industry → enterprise → project**. Building blocks: a
   **Product-Process Matrix**, atomic **Statements of Relevance (SoR)**, hierarchical integration into a
   **knowledge graph** giving "exhaustive traceability", as a single source of truth. Complements Waterfall
   and Agile rather than replacing them. Motivating pain: knowledge workers "spend 2.5 h/day extracting the
   right information" from fragmented artifacts.
3. **KDD in the agent era** — documentation/knowledge as **first-class fuel for AI agents**. Core distinction
   (paper *Knowledge Activation*): *knowledge an agent passively reads* vs *knowledge an agent can act on*;
   prescription: convert institutional knowledge into **executable primitives** (skills) to beat "context
   rot"/context-reset. Reinforced by the "documentation as infrastructure / compounding returns" argument.

### Mapping to eunomai
- Living-docs ≈ the **codification / passive** slice of KDD only.
- The **active** slice already exists in eunomai as **skills** (executable knowledge), **hooks** (enforced
  policy), and **OpenSpec specs** (tracked requirements). The *Knowledge Activation* thesis literally
  describes eunomai's skills pillar: "skills = institutional knowledge primitive".

## The realization

**eunomai is already a knowledge-driven system** — but the knowledge is distributed across all pillars at
different **activation states** (passive docs → semi-active conventions/specs → active skills/hooks →
accumulating memory). KDD is therefore most useful as the **lens that unifies the pillars**, not as a new pillar
or a framework to build.

### Organic parallels (already present, lightweight)
- **SoR (atomic units)** ↔ the memory rule "one fact per file"; each OpenSpec change as a change-knowledge unit.
- **Industry → enterprise → project hierarchy** ↔ base skills (universal/standards-anchored) → skill-finder +
  project rules (project-specific).
- **Single source of truth** ↔ authored `AGENTS.md` → generated tool files.

### The genuine gap
KDD-the-methodology's headline feature — **cross-cutting traceability** (requirement → spec → code → test →
doc) — is the one thing eunomai lacks. It has isolated indices (README index, provenance registry, spec links)
but no traceability fabric.

## The tension

A maintained knowledge graph / traceability fabric is **exactly the continuous-conformance "governance tower"
eunomai abandoned (2026-06-24)**. Adopting KDD-the-methodology wholesale would violate *low maintenance over
reach* and *don't reinvent*. So the gap is real but pursuing it heavily is off-limits.

## Options

| Option | What | Verdict |
|---|---|---|
| **A — adopt KDD-the-methodology** | Product-Process Matrix, formal SoR, knowledge graph, exhaustive traceability | ❌ reintroduces the governance tower; high maintenance |
| **B — adopt the lens + build light traceability now** | the framing, plus a first traceability mechanism (cross-ref scheme / check) | 🟡 useful but premature; risks a creeping conformance engine |
| **C — adopt KDD as lens/vocabulary only** | name the knowledge-activation spectrum; defer traceability to incremental, link-first steps | ✅ zero machinery, max philosophical fit |

## Lean recommendation (confirmed in DECISION)

**Option C.** Adopt KDD as a lens and vocabulary; document the activation spectrum; keep traceability as a
future, link-first, incremental nicety — never a graph engine.

## Open questions (resolved in DECISION/options)
1. Land it as an explanation page + ADR, or amend `vision.md`? → explanation page (indexed) + this ADR + a
   pointer from `vision.md`.
2. Any new check? → no; KDD is a lens, not a conformance surface.
3. Traceability now or later? → later, incrementally, link-first.

## Sources
- *Knowledge Driven Development* — Cambridge University Press (Lal).
- "Introduction to Knowledge-Driven Development (KDD)" — M. K. Lal, Medium.
- *Knowledge Activation: AI Skills as the Institutional Knowledge Primitive for Agentic Software Development* —
  arXiv.
- "Knowledge Management in the AI Era: Why Documentation is More Critical Than Ever" — Dosu.
