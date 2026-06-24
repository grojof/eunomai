## Why

eunomai's pillars all operate on a project that is *already* an eunomai project. Getting a new or existing
foreign project **to** that state is unowned: analyzing what's there, establishing the lean-README → `docs/`
structure (or creating docs from scratch with the author's input), seeding the conventions (AGENTS.md,
OpenSpec config, permissions baseline, hooks), and auditing whatever skills it already has. That is the
**connector / bootstrap axis** — the one-shot, dispensable starting point that applies eunomai's quality to a
project and then steps aside (everything lives in the generated output → zero lock-in).

## What Changes

- Add an **`eunomai-onboard`** skill: the **cold-start orchestrator** (vs the steady-state per-pillar skills).
  On a new or existing project it:
  - **Analyze** — survey the stack, existing docs, skills, and conventions, and gather the author's input
    (purpose, domain, audience).
  - **Docs** — establish the living-docs structure: restructure existing docs into a lean README index →
    `docs/` topic pages, or **create them from scratch** with the author's input. (Cold-start; the
    `eunomai-living-docs` skill maintains them afterward.)
  - **Seed scaffolding** — adapt and drop in the conventions: a lean `AGENTS.md`, `openspec/config.yaml`, the
    permissions baseline, and the hooks wiring (`.claude/settings.json`).
  - **Skills** — invoke `eunomai-skill-finder` in **audit** mode over the project's existing skills.
  - **Hand off** — drive the existing checks (`docs-check`, `provenance-check`) to green, then step aside.
- **Orchestrates, does not reimplement** — delegates to living-docs, skill-finder, and the safe-controls
  hooks/permissions rather than duplicating them.
- **Skill-only deliverable, no new check** — "onboarded" is defined as the *existing* checks passing; this
  deliberately avoids a new conformance matrix (the abandoned-tower trap).
- Add `eunomai-onboard`'s own `PROVENANCE.md` (`origin: authored`) so `provenance-check` stays green.
- **Reuse vs net-new (connector-first):** *reuse* every pillar — living-docs (the doc standard + `docs-check`),
  skill-finder (audit + `provenance-check`), safe-controls (hooks + permissions baseline), OpenSpec (config),
  and the Claude Code plugin install. eunomai's *net-new* glue is only the **cold-start orchestration playbook**
  and the **seed templates** it adapts.

## Capabilities

### New Capabilities
- `onboard`: the cold-start connector/bootstrap — analyze a new/existing project, establish docs to the
  living-docs standard, seed eunomai's conventions, audit existing skills via skill-finder, drive the existing
  checks green, then step aside.

### Modified Capabilities
<!-- None — onboard orchestrates the existing pillars; their specs are unchanged. -->

## Impact

- **New:** `skills/eunomai-onboard/SKILL.md` + `PROVENANCE.md`; `docs/onboard.md` + a README index link; the
  seed templates the skill adapts (lean `AGENTS.md` / `openspec/config.yaml` / permissions / settings).
- **`AGENTS.md`:** document the connector/bootstrap axis (re-projected, idempotent).
- **Gate:** `docs-check` + `provenance-check` stay green (new page indexed, new skill carries provenance). No
  new code → the `projection/` gate is unchanged.
- **No new runtime dependencies, no new check, no registry.**

## Non-goals

- **Not a continuous cross-project sync / conformance engine** (the abandoned governance tower) — one-shot and
  dispensable; eunomai seeds and steps aside.
- **Not a new check or conformance matrix** — onboarded means the *existing* checks pass.
- **Not reimplementing the pillars** — it orchestrates and delegates to living-docs, skill-finder, and the hooks.
- **Not fully automatic** — doc creation is interactive, driven by the author's input.
- **Not a code scaffolder/generator** — it applies eunomai's conventions and docs, not application code.
