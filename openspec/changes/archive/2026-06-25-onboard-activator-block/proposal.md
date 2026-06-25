## Why

onboard already seeds a lean `CLAUDE.md` that declares a project's *boundary and paths* — the **structural**
half. It does not seed the **behavioural** half: a plain-language statement of the disciplines (spec-first
change, honest docs, vetting third-party skills, secure-by-default, deliberate dependencies, pausing on
irreversible actions) that makes any agent follow eunomai's base. Through the KDD lens (ADR-0002), `CLAUDE.md`
is the semi-active layer that should **activate** the base by pointing at the skills. Seeding a self-sufficient
**activator block** closes that gap — and, because most collaborators have only OpenSpec or nothing (the
audience gradient), the block must work as prose even when the skills are absent.

## What Changes

- onboard's seed gains an **activator block** written into the project's `CLAUDE.md`: principle-level
  disciplines, with the skills named as **accelerators** (parenthetical), not requirements.
- Three design invariants the block SHALL honour:
  - **Self-sufficient** — each principle survives the skills being removed (dispensability / zero lock-in).
  - **Capabilities, not brand** — the block never names "eunomai"; it references capabilities/skills.
  - **Activate, don't duplicate** — it states the *principle*, never the *procedure* (which lives in the
    skill), so it stays lean.
- The **canonical block** is documented in `docs/reference/onboard.md`; onboard adapts it per project
  (derived from eunomai's live conventions, not a verbatim copy).
- No new check, no machinery, one-shot seed-and-step-aside.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `onboard`: add a requirement that the seeded `CLAUDE.md` includes a self-sufficient, principle-level
  activator block that points to the skills as accelerators (honouring the three invariants), extending the
  existing "Seed eunomai conventions" behaviour.

## Impact

- `openspec/specs/onboard/spec.md` — one new requirement (synced from the change delta).
- `skills/eunomai-onboard/SKILL.md` — the seed step describes writing the activator block + its invariants.
- `docs/reference/onboard.md` — document the canonical block.
- No code, no new check, no new dependency. `docs-check` / `provenance-check` unaffected.
- Reuse vs net-new: leans entirely on the existing pillars (OpenSpec, living-docs, skill-finder, secure-coding,
  dependency-upgrade, safe-controls) as the accelerators the block points to; eunomai adds only the seeded
  prose that activates them.
