## Why

eunomai's project docs are a flat pile of loose topic files under `docs/`, plus a `docs/development/`
(`PROJECT-STATE.md`) whose content duplicates the project memory, the OpenSpec specs, and `AGENTS.md` — it
reads unprofessional and carries dual-maintenance overhead (PROJECT-STATE and the memory were updated in
lockstep every change). Adopt the industry-standard **Diátaxis** structure (used by Stripe, Kubernetes,
Django, AWS) in a lean form, and drop the redundant dev-docs folder, so the docs are professional *and*
low-maintenance.

## What Changes

- Reorganize `docs/` by Diátaxis type (lean): **`guides/`** (how-to — `getting-started.md` ← `usage.md`),
  **`reference/`** (the four pillars — `safe-controls`, `living-docs`, `skill-finder`, `onboard`),
  **`explanation/`** (`vision.md` ← `VISION.md`), and **`decisions/`** (ADRs — unchanged).
- **Remove `docs/development/` (`PROJECT-STATE.md`).** Its content is already covered by the project memory
  (handoff/status), the OpenSpec specs (the living "what"), `AGENTS.md` (structure/conventions), and the ADRs
  (decisions). Verified: nothing depends on it functionally — the only references are the dev-doc denylist.
- Update the **dev-doc denylist** to just `docs/decisions/` (drop `docs/development/`).
- **Teach Diátaxis to `eunomai-living-docs`** — the SKILL.md and the `reference/living-docs.md` standard page
  describe the four types so future pages land in the right place.
- Re-link the README index and every cross-link to the new paths; `docs-check` stays green (it already walks
  subdirectories).
- Update the `docs-check` test fixture for the dev-doc-excluded case (`docs/decisions/`).
- **Reuse vs net-new (connector-first):** *reuse* the **Diátaxis** framework (we adopt a proven standard, not
  invent a structure), the existing recursive `docs-check`, and the project memory + OpenSpec specs (which
  absorb PROJECT-STATE's role). *Net-new* is only eunomai's lean mapping and the skill's Diátaxis guidance.

## Capabilities

### New Capabilities
<!-- None — this refines the existing `living-docs` capability. -->

### Modified Capabilities
- `living-docs`: the project-docs structure standard becomes **Diátaxis-organized** (guides / reference /
  explanation / decisions), and the dev-doc denylist narrows to `docs/decisions/` (the `docs/development/`
  folder is removed).

## Impact

- **Moved:** `usage.md` → `guides/getting-started.md`; `VISION.md` → `explanation/vision.md`; the four pillar
  pages → `reference/`.
- **Removed:** `docs/development/` (`PROJECT-STATE.md`).
- **Updated:** `README.md` index + Layout, `AGENTS.md` (docs structure + denylist), every doc cross-link, the
  `eunomai-living-docs` SKILL.md, and `projection/test/docs.test.ts` (dev-doc denylist fixture).
- **Re-project** `AGENTS.md` → `CLAUDE.md` / `copilot-instructions.md`.
- **Gate:** `docs-check` + `provenance-check` stay green; the projection gate runs (test fixture changed).

## Non-goals

- **Not the full four-folder Diátaxis ceremony** — `tutorials/` folds into `guides/` until there's a real
  tutorial; lean over reach.
- **Not adopting a third-party docs skill** — eunomai stays own-skills-only; we encode Diátaxis into
  `eunomai-living-docs` ourselves, informed by the research.
- **Not changing `docs-check`'s mechanism** — it already handles subdirectories.
- **Not a documentation-site generator.**
