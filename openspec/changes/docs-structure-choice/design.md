## Context

ADR-0005 made the Diátaxis mode a `type` field and folders a convenience, but the skills did not *guide* the
structure choice — so eunomai's own docs were left in content-type folders until manually flattened. This
change makes the structure an explicit, infer-then-confirm decision in both skills, closing the root cause.

## Goals / Non-Goals

**Goals:**
- living-docs and onboard propose 2–3 structure options with a recommended default by size/shape, and confirm.
- Flag content-type folders (`guides/`/`reference/`/`explanation/`) as an anti-pattern to migrate.

**Non-Goals:**
- No change to the deterministic gate — `docs-check` stays shape-only and does **not** judge structure.
- No new machinery, no registry, no auto-restructure (the user chooses; the skill proposes).

## Decisions

- **Propose, don't enforce.** Structure is a *judgment* (size, surfaces, growth), so it belongs to the
  skill's infer-then-confirm flow, not the deterministic gate. Putting structure rules in `docs-check` would be
  prescriptive and brittle (a folder named `guides` could be legitimate) — rejected.
- **Default by size/shape.** The recommendation is mechanical enough to default well: flat while small
  (~<15 pages), by-surface once a surface reaches ~3+ pages, hybrid in between. The user can always override.
- **Content-type folders are the one hard "no".** Nesting by Diátaxis type is the anti-pattern v2 exists to
  remove (the mode is the `type` field); the skill flags and proposes migrating it. Nesting by
  surface/semantics (Stripe/OKF) is encouraged when a surface grows.

## Risks / Trade-offs

- [Option fatigue — too many choices each refresh] → Only when structure is actually in question; for a stable
  small project the default (flat) is confirmed in one step, skippable.
- [Skill proposes but project drifts anyway] → Same posture as the rest of eunomai (floor-raiser,
  human-in-control); the deterministic gate still guarantees frontmatter shape regardless of structure.

**Low-maintenance check:** prose in two skills + two spec requirements. No code, no check, no dependency.
