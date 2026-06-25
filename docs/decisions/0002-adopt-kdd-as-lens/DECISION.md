# Decision 0002 — Adopt KDD as a lens, not a methodology

**Date:** 2026-06-25 · **Status:** accepted · **Pillar:** Living docs (cross-cutting)

## Decision

Adopt **Knowledge-Driven Development (KDD)** as a **lens and vocabulary** for eunomai — the
*knowledge-activation* framing that unifies the existing pillars as knowledge in different states (passive docs
→ active skills/hooks) — **Option C**. We explicitly **reject** adopting KDD as a *methodology* (the
Product-Process Matrix, formal Statements of Relevance, and a hand-maintained traceability knowledge graph),
because that machinery is the continuous-conformance "governance tower" eunomai already abandoned. We add **no
new pillar and no new check** — only an explanation page and this record.

See [explore.md](explore.md) and [options.md](options.md) for the full analysis (grounded in primary sources
on both senses of "KDD").

## Why (in one line)

eunomai is **already** a knowledge-driven system — its knowledge is spread across the pillars at different
activation states — so KDD is best taken as the *lens that names what we already do*, not a framework to
build; the heavyweight version would reintroduce the exact maintenance burden the project exists to avoid.

## Context

There are two distinct ideas called "KDD": the **methodology** (Lal/Cambridge — structure knowledge across
industry → enterprise → project) and the **agent-era practice** (knowledge as first-class fuel for AI agents;
"knowledge activation" — turning institutional knowledge into executable primitives). eunomai borrows the
*vocabulary* of the first and *lives* the second. The user's intuition — "isn't this what living-docs already
does?" — is correct but partial: living-docs is only the **passive** slice; skills, hooks, and specs are the
**active** slices.

## What changed in the repo

- New explanation page **[docs/explanation/knowledge-driven-development.md](../../explanation/knowledge-driven-development.md)**
  — the KDD lens, the activation-spectrum table, the parallels, and the explicit out-of-scope line. Indexed
  from the README.
- A pointer added from **[vision.md](../../explanation/vision.md)** to the new page.
- No code, no new pillar, no new check. Generated files unchanged.

## The trade we accepted

We gain a unifying vocabulary (and a sharper test for new capabilities: *what kind of knowledge is this, and at
what activation state should it live?*) at the cost of **not** getting KDD-the-methodology's headline feature —
exhaustive end-to-end traceability. That is accepted on purpose: the one genuinely useful missing piece
(cross-refs requirement → spec → code → test → doc) is pursued **incrementally and link-first**, never as a
graph engine.

## How to use it

- Read the [explanation page](../../explanation/knowledge-driven-development.md) to place any artifact on the
  passive→active spectrum.
- When proposing a new capability, ask which **kind** of knowledge it is and which **activation state** it
  belongs in — keep docs explaining, skills acting, hooks enforcing, specs tracking.
