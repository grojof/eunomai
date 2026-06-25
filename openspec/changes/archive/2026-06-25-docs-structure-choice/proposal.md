## Why

When v2 (ADR-0005) made folders a convenience, eunomai's own docs were left in the old Diátaxis content-type
folders (`guides/`, `reference/`, `explanation/`) — the very anti-pattern v2 replaces with the `type`
frontmatter field. The root cause: the living-docs and onboard skills **assumed** a folder structure instead of
guiding the decision. The fix is to make structure an explicit, **infer-then-confirm** choice: the skill
proposes 2–3 options with trade-offs and a recommended default, and the user decides.

## What Changes

- **`eunomai-living-docs`** (refresh) and **`eunomai-onboard`** (establish docs) SHALL, before settling the
  folder layout, **propose 2–3 structure options** with trade-offs and a **recommended default** chosen by the
  project's size/shape, and proceed only on the user's choice (human-in-control, skippable):
  - **Flat** `docs/*.md` — recommended while small (~<15 pages); navigation is the README map + `type`.
  - **By surface** `docs/<surface>/` — when a surface reaches ~3+ pages (Stripe/OKF-style: nest by
    **semantics/product**, never by content-type).
  - **Hybrid** — flat core plus a folder for a surface that has grown.
- **Hard rule:** folders are **never** organized by Diátaxis type (the mode lives in `type`). If the skill
  detects content-type folders (`guides/`/`reference/`/`explanation/`), it **flags them as an anti-pattern** and
  proposes migrating (flatten or re-nest by surface).
- The **gate is untouched**: `docs-check` stays deterministic shape-only and does **not** judge structure —
  structure is a skill-guided decision, not enforcement.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `living-docs`: add a requirement that the refresh proposes 2–3 structure options (default by size), never
  assumes, and flags content-type folders as an anti-pattern — folders never by Diátaxis type.
- `onboard`: add a requirement that establishing docs proposes the structure the same way (infer-then-confirm),
  rather than assuming a layout.

## Impact

- `skills/eunomai-living-docs/SKILL.md` — a "choosing the structure" step (propose options, recommend, confirm).
- `skills/eunomai-onboard/SKILL.md` — the establish-docs step proposes structure the same way.
- `openspec/specs/living-docs/spec.md`, `openspec/specs/onboard/spec.md` — the new requirements (synced).
- No code, no new check, no machinery. Reuse: the existing infer-then-confirm / structured-interview posture;
  eunomai adds only the structure-proposal step. The deterministic gate is unchanged.
