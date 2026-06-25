# Decision 0006 — Docs single-source-of-truth (one fact, one home)

**Date:** 2026-06-25 · **Status:** accepted · **Pillar:** Living docs

## Decision

Adopt **single source of truth** as the governing principle of the living-docs standard — **Option C**, a
refinement of [ADR-0005](../0005-living-docs-v2/DECISION.md):

> **One fact, one home — everything else links.**

Concretely:
- **The layer model** (each fact has exactly one home): `README` = the front door/map (links, never restates);
  `CLAUDE.md` = the authored conventions; **ADRs** = the decisions; `docs/*.md` = only user-facing content that
  doesn't fit the README **and** isn't a convention or a decision; the **community-health files** = the GitHub
  surface (exactly **one** `CONTRIBUTING.md`).
- **The "earns its place" test** (added to the `eunomai-living-docs` skill): *is this fact already canonical in
  `CLAUDE.md`, an ADR, or the code?* → **link, don't restate**. If not → it is a doc page.
- **An anti-duplication lens** (added to the skill, like activation-routing): during a refresh, flag pages/
  sections that **duplicate** another home and propose **merge or link** — human-in-control.
- **Keep Diátaxis as a `type` lens.** It is not the problem; research and its own authors call it a flexible
  lens, not a blueprint. We do **not** abandon it.
- The deterministic gate is **unchanged** (shape-only; duplication is judgement, not a gate rule).

## Why (in one line)

The docs felt redundant not because of Diátaxis but because nothing forbade a fact from living in two places —
worsened by eunomai being a meta-tool whose `CLAUDE.md`/ADRs already describe it; *single source of truth* is
the one principle that GitHub best-practice, KDD, OKF, and Diátaxis all already imply.

## What changes in the repo (executed in the follow-up change)

- `docs/living-docs.md` + the `eunomai-living-docs` skill — add the principle, the "earns its place" test, and
  the anti-duplication lens.
- eunomai's own docs cleaned: merge `docs/contributing.md` into the single root `CONTRIBUTING.md`; slim the
  reference pages that restate `CLAUDE.md`/ADRs (`sdd`, `skill-finder`, `base-skills`, `checks`) to a short lead
  + a link to the canonical home; keep the pages that are a genuine single home (`living-docs`, `safe-controls`,
  `onboard`, `vision`, `knowledge-driven-development`, `getting-started`). Update the README map.
- `openspec/specs/living-docs/spec.md` — a no-duplication requirement (synced).

## The trade we accepted

Ongoing judgement ("does this duplicate an existing home?") instead of free-form authoring. Accepted — it is
the skill's job (human-in-control), and it is what keeps the docs lean and non-rotting. No machinery, no gate
change.

## How to use it

- Before writing a doc page, apply the test: if the fact is already canonical elsewhere, **link**.
- Keep `CLAUDE.md` (conventions) and ADRs (decisions) as homes; let `docs/` hold only what they don't.
- One `CONTRIBUTING.md`. The README maps; it does not restate.
