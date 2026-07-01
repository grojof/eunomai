## Why

eunomai's zero-lock-in story covers *removing* eunomai, but nothing covers *arriving* where a layer already
exists: onboard detects an existing `CLAUDE.md`, docs standard, permissions, hooks, and skills — and then
seeds unconditionally over them. For the dual personal/organization goal (a removable complement that adapts
to any environment, alongside whatever plugins/skills/rules the org already runs), the missing piece is a
single **coexistence contract** applied by every pillar, plus the adoption mechanics an org evaluator needs.

## What Changes

- **Coexistence contract** (new, canonical, stated once): eunomai layers are *additive, never replacing*;
  on conflict the *incumbent wins* unless the author decides otherwise; *detect the existing layer before
  seeding*; *the project's rules are an input to every gate*. Define "the project's rules" mechanically
  (the project's `CLAUDE.md` + `.claude/settings.json` permissions). Lives in a new docs page +
  one principle line in `CLAUDE.md`; every skill references it, never restates it.
- **New docs page `docs/org-adoption.md`** (how-to, indexed in the README map): coexistence facts
  (namespaced skills — no collisions; PreToolUse merge is most-restrictive-wins; the guard never emits
  `allow`), org-wide rollout via managed settings / marketplaces, version pinning + update flow, and the
  sanctioned extension seams (own hooks/permissions, safety-gate env overrides, org marketplaces).
- **onboard**: a **coexistence assessment** step (classify `CLAUDE.md` / docs standard / SDD process /
  permissions / hooks / skills as *absent · present-compatible · present-conflicting*; conflicts go through
  the structured interview with "adapt to what exists" as the recommended default); **per-seed opt-out**
  (OpenSpec is the default SDD engine *only where none exists*; an existing `CLAUDE.md` is merged into —
  activator block appended under its own heading — never replaced); the canonical activator block is
  **inlined in the SKILL** (its bare `docs/onboard.md` reference does not resolve in installed-plugin mode);
  check invocations get a stated from-source fallback.
- **workspace-survey**: `existingConfig` detection deepens to **governance enumeration** — hooks and
  permissions blocks in `.claude/settings.json`, `.claude/skills/*`, other installed plugins' markers, an
  existing provenance registry — so onboard adapts instead of seeding blind.
- **skill-finder**: an **org-trust input** to the gate (org-trusted sources declared in the project's rules
  are honored as provenance context, recorded — never silently pre-cleared); **AUDIT verdicts** for
  already-installed skills (`keep · keep-with-gaps · flag-for-removal`, human decides removal); **human
  confirmation before vendoring** third-party skill content; the plugin-delivered-skills **coverage boundary
  stated honestly** in audit reports.
- **living-docs**: a fifth activation route — *already owned by an org skill/plugin → link, don't restate*;
  a **frontmatter coexistence rule** (foreign keys preserved; a colliding `type` key is surfaced, not
  overwritten); clarify ADRs (*create* from interview crystallization is in scope, *editing* existing ADRs
  is not).
- **safe-controls**: an org **override seam** without forking — `EUNOMAI_TRAILER_RULE` (deny|ask|off,
  default deny) and `EUNOMAI_EXTRA_GATES` (path to a JSON list of extra ask-gates), both fail-open; guard
  coverage extends to the PowerShell tool. (Being implemented alongside this change; recorded here so the
  spec stays the source of truth.)

## Capabilities

### New Capabilities
- `coexistence`: the canonical contract for operating alongside an existing personal/org layer (additive ·
  incumbent wins · detect before seeding · rules as gate input) and the org adoption mechanics page.

### Modified Capabilities
- `onboard`: coexistence assessment step, per-seed opt-out with adapt-first defaults, merge-not-replace
  `CLAUDE.md`, governance enumeration in the workspace survey, self-contained activator block.
- `skill-finder`: org-trust gate input, AUDIT verdict vocabulary, human confirmation before vendoring,
  stated plugin-skill coverage boundary.
- `living-docs`: org-owned activation route, frontmatter coexistence rule, ADR create-vs-edit boundary.
- `safe-controls`: fail-open org override seam (trailer rule + extra gates) and PowerShell tool coverage.

## Impact

- **Reuse vs net-new**: rides entirely on Claude Code native primitives (hook merge semantics, managed
  settings, marketplaces, hierarchical `CLAUDE.md`) — eunomai adds only the contract text, skill/agent flow
  changes, and two env-var reads in `decide.mjs`. No new tool, no registry, no conformance engine.
- Files: `CLAUDE.md`, new `docs/org-adoption.md`, `README.md` (map row), `docs/onboard.md`,
  `docs/skill-finder.md`, `docs/living-docs.md`, `docs/safe-controls.md`, `skills/eunomai-onboard/SKILL.md`,
  `skills/eunomai-skill-finder/SKILL.md`, `skills/eunomai-living-docs/SKILL.md`, `agents/workspace-survey.md`,
  `hooks/decide.mjs` + `hooks/guard.mjs` + tests.
- No breaking change for existing consumers: all defaults keep today's behavior (trailer deny stays the
  default; seeds still offered — just no longer imposed).

## Non-goals / out of scope

- No conformance engine, no central org registry, no continuous sync (the abandoned governance tower).
- No cross-tool projection (ADR-0004 stands); no per-org configuration file format beyond the two env vars.
- KDD deepening across pillars (domain-scaffolded interview, agent domain signals, base-skill capture) is a
  separate change.
- Gating or scanning plugin-delivered skills (outside the registry's scope by design — the boundary is
  *stated*, not closed).
