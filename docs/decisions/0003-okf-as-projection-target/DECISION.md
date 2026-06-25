# Decision 0003 — Align with the open-knowledge substrate (OKF) as a projection target, not a dependency

**Date:** 2026-06-25 · **Status:** accepted · **Pillar:** Living docs (cross-cutting / substrate)

## Decision

Treat Google's **Open Knowledge Format (OKF)** as evidence of a **convergent open substrate** that eunomai
**already inhabits** — and align with it as a **lens and a future projection target**, **not** as a dependency
or a platform — **Option C**. Concretely: keep the substrate (Markdown + YAML frontmatter, path-as-identity,
markdown-link graph) and adopt a cheap guideline to **not diverge gratuitously from the OKF frontmatter
vocabulary** (`type`, `title`, `description`, `tags`, `timestamp`). We **reject** adopting OKF as a
platform/dependency now (Option A) — it is v0.1, would reinvent an emit/ingest layer, and would court lock-in to
an evolving external format — and we **reject** ignoring it (Option B), which forfeits near-free future-proofing.
We add **no dependency, no new check, no new machinery** — only this record and a substrate-vocabulary guideline.

See [explore.md](explore.md) and [options.md](options.md) for the full analysis (grounded in the OKF primary
source).

## Why (in one line)

eunomai already lives on the open substrate OKF formalizes — so the right move is to **bet on the architecture,
not the brand**: stay substrate-compatible and keep OKF emit as a future, connector-first projection, never a
dependency that would reintroduce the lock-in and maintenance the project exists to avoid.

## Context

OKF is a **vendor-neutral open spec** — "format, not platform" — for representing knowledge as Markdown +
frontmatter in a directory hierarchy linked into a graph. It targets the **data/subject** layer (table schemas,
metrics, runbooks). eunomai targets the **project/process** layer (conventions, specs, docs, skills). They are
**complementary layers on the same substrate**, not competitors. Because eunomai chose plain MD + frontmatter +
a link-graph from day one (instead of a bespoke format), it is **OKF-shaped by construction** — the same bet,
made at a different layer. This mirrors [ADR-0002](../0002-adopt-kdd-as-lens/DECISION.md): adopt the framing,
not the heavyweight machinery.

## What changed in the repo

- This ADR (`docs/decisions/0003-okf-as-projection-target/`) — the decision, options, and exploration.
- A guideline to honour the OKF frontmatter vocabulary where eunomai already uses frontmatter (skills, registry,
  memory, future emit). To be wired into the KDD explanation page and the living-docs conventions as a
  follow-up — the **substrate is the medium of the activation spectrum**.
- **No code, no new dependency, no new check.** Generated files unchanged.

## The trade we accepted

We get strategic alignment and near-free future-proofing **without** OKF interop today. That is the correct
trade: there is no demonstrated demand for data-layer interop, and building it now means depending on a moving
v0.1 spec. If real demand appears, OKF emit is built **through the existing projection architecture** (one
authored source → many targets, as with `AGENTS.md → CLAUDE.md/Copilot`), connector-first — never a graph
engine, never a hand-maintained traceability fabric (the abandoned governance tower).

## Related decisions (explicitly NOT decided here)

Raised in the same conversation, each deserving its **own** ADR — folding them in would be the incoherence
eunomai guards against:

- **Sharpen to Claude-only, with OpenSpec as the sole external dependency** (its historical record of decisions
  and development) — reversing today's "Claude-first, Copilot best-effort" and reshaping the `projection/`
  tool's remit. A significant architectural decision; capture separately.
- **Token efficiency / model routing** — using specific models for specific tasks. A future capability
  direction, not yet a decision.

## How to use it

- Read [explore.md](explore.md) to place OKF relative to eunomai (complementary layers, shared substrate).
- When adding or shaping frontmatter anywhere in eunomai, prefer the OKF vocabulary (`type`, `title`,
  `description`, `tags`, `timestamp`) over inventing field names — keep a future OKF projection cheap.
- Treat OKF emit/ingest as a **future projection**, scoped only when real demand appears, and built on the
  existing projection — not as a dependency to track now.
