## Context

eunomai's `docs/` is a flat set of topic files (`usage`, `VISION`, four pillar pages) plus `decisions/`
(ADRs) and `development/status/PROJECT-STATE.md`. The flatness reads as "loose files", and PROJECT-STATE
duplicates the project memory + OpenSpec specs + AGENTS.md (verified: its only repo references are the dev-doc
denylist; nothing depends on it functionally). Web research settled the structure question: **Diátaxis**
(tutorials / how-to / reference / explanation) is the lightweight industry standard (Stripe, Kubernetes,
Django, AWS). `docs-check` already walks `docs/` recursively with a dev-doc denylist, so subfolders need no
mechanism change.

## Goals / Non-Goals

**Goals:**
- A professional, Diátaxis-organized `docs/` (lean: guides / reference / explanation / decisions).
- Remove the redundant `docs/development/` and its dual-maintenance overhead.
- Teach the structure to `eunomai-living-docs` so it stays true over time.

**Non-Goals:**
- Full four-folder ceremony; adopting a third-party docs skill; changing `docs-check`'s mechanism; a docs
  site generator.

## Decisions

### Decision 1 — Adopt Diátaxis (lean) — reuse a proven standard, don't invent one (reuse-first)

`docs/` is organized into `guides/` (how-to), `reference/` (per-capability facts), `explanation/` (the why),
and `decisions/` (ADRs). `tutorials/` folds into `guides/` until a real tutorial exists.

- *Why over alternatives:* a bespoke layout would be one more thing to defend; Diátaxis is recognized, light,
  and imposes no tooling. The lean subset fits a ~6-page project without ceremony.

### Decision 2 — Remove `docs/development/` (PROJECT-STATE); rely on memory + specs + AGENTS + ADRs

PROJECT-STATE's content maps cleanly onto existing sources: the **project memory** (status/next/handoff — the
auto-loaded, per-developer mechanism), **OpenSpec specs** (the living "what"), **AGENTS.md** (structure), and
**ADRs** (decisions). Deleting it removes the dual-maintenance that updated it and the memory in lockstep.

- *Why over alternatives:* keeping it (even moved) preserves the overhead; the in-repo cold-start handoff it
  provided is better served by memory (for the author) and by README + specs (for a fresh reader). Git keeps
  its history.

### Decision 3 — `docs-check` mechanism unchanged; only the denylist narrows to `docs/decisions/`

The recursive walk already covers `guides/`, `reference/`, `explanation/`. The dev-doc denylist in
`projection/src/docs.ts` drops `docs/development` (gone) and keeps `docs/decisions` (ADRs). The fixture test
is updated to match.

- *Why over alternatives:* no new check is needed; the existing one already enforces links + index coverage
  across subfolders.

### Decision 4 — Encode Diátaxis in our own skill, not a foreign one

`eunomai-living-docs` (SKILL.md + `reference/living-docs.md`) teaches the four types, keeping eunomai
own-skills-only and the knowledge in-house.

## Risks / Trade-offs

- **Cross-link breakage after moves** → `docs-check` catches README→`docs/` breaks; doc→doc links are updated
  by hand (a known `docs-check` limitation — it checks README→docs, not doc→doc). Grep verifies none are left.
- **Losing the in-repo handoff** → covered by memory (author) and README + OpenSpec specs (readers).
- **Denylist drift** → only `docs/decisions/` remains; the fixture test pins it.
- **Low-maintenance check:** moves + relinks + a one-line denylist change + skill text; no new code or check.
