## Context

Every eunomai pillar assumes a project that is *already* an eunomai project: living-docs refreshes existing
structure, skill-finder gates skills in a repo that already runs `provenance-check`, the hooks fire because
the plugin (or `.claude/settings.json`) is wired. Nothing owns the **transition** of a new or foreign project
into that state. eunomai itself was bootstrapped by hand this way; `eunomai-onboard` captures that as a
repeatable, one-shot connector — the "starting point, dispensable" identity from the charter. It is the last
piece of the model (4 pillars + this axis).

## Goals / Non-Goals

**Goals:**
- A cold-start orchestrator skill that analyzes a project, establishes docs to the living-docs standard (or
  creates them), seeds eunomai's conventions, audits existing skills via skill-finder, and drives the existing
  checks green — then steps aside.

**Non-Goals:**
- A continuous cross-project sync/conformance engine; a new check or conformance matrix; reimplementing the
  pillars; fully automatic (non-interactive) operation; application-code scaffolding.

## Decisions

### Decision 1 — Reuse every pillar + the plugin install; build only the orchestration playbook (reuse-first)

onboard *delegates*: living-docs (doc standard + `docs-check`), skill-finder (audit + `provenance-check`),
safe-controls (hooks + permissions baseline), OpenSpec (config), and the Claude Code plugin for the runtime
pieces. Its net-new is only the **cold-start playbook** and the way it derives the **seed** for a project.

- *Why over alternatives:* re-doing doc structuring or skill auditing inside onboard would duplicate the
  pillars we just shipped. Orchestration keeps onboard thin and the pillars single-sourced.

### Decision 2 — Cold-start vs steady-state split (the boundary that avoids overlap)

onboard **establishes**; the per-pillar skills **maintain**. living-docs refreshes already-structured docs;
onboard structures a cold project (analyze → propose architecture → create/restructure with author input),
then hands off. Same for skills (onboard invokes skill-finder's audit) and runtime (the installed hooks).

- *Why over alternatives:* without this split, onboard and living-docs overlap. "Establish vs maintain" is a
  clean, non-redundant seam.

### Decision 3 — Skill-only, no new check; "onboarded" = the existing checks pass

onboard ships as a skill (a playbook) with no new code and no new check. Its done-criterion is that
`docs-check` and `provenance-check` pass on the project.

- *Why over alternatives:* a bespoke "onboarding status / conformance" check is exactly the capability-matrix
  trap the project abandoned. Reusing the existing checks gives deterministic teeth for free.

### Decision 4 — Derive the seed from eunomai's own live conventions, not template copies

The seed (lean `AGENTS.md`, `openspec/config.yaml`, permissions baseline, hooks wiring) is **derived from
eunomai's own authored conventions** (its `AGENTS.md`, `openspec/config.yaml`, `docs/safe-controls.md`),
adapted to the target — rather than maintaining a separate `templates/` copy that would drift.

- *Why over alternatives:* shipped template copies rot out of sync with the real conventions. Deriving from the
  live, dogfooded files keeps the seed correct by construction and adds nothing to maintain.

### Decision 5 — Wire runtime the right way for the context

If the target installs the eunomai **plugin**, hooks/skills come from it and onboard need only enable/tailor
it. If eunomai is used from source (as in this repo), onboard wires `.claude/settings.json` (the dogfood path,
`$CLAUDE_PROJECT_DIR`). onboard detects which and does the appropriate one.

- *Why over alternatives:* assuming one path breaks the other; detection keeps onboard correct in both.

## Risks / Trade-offs

- **Overlap with living-docs** → resolved by the cold-start/steady-state split; onboard establishes and
  delegates maintenance.
- **Scope creep toward a sync/conformance engine** → one-shot, no new check, explicit non-goal; hands off and
  stops.
- **Seed templates drift** → derive from eunomai's own live conventions, no separate copies.
- **Non-deterministic skill** → the deterministic teeth are the existing `docs-check` + `provenance-check`
  that onboarding must satisfy.
- **Low-maintenance check:** one skill + its provenance + one docs page; reuses every pillar; no new code, no
  new check, no template copies, no registry.
