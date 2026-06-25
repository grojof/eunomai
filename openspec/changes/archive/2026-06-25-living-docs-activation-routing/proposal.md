## Why

Through the KDD lens (ADR-0002), `eunomai-living-docs` is the **passive** end of the knowledge-activation
spectrum — yet it treats *all* doc content as prose to organize. Some of that content is knowledge sitting at
the **wrong activation state**: a recurring convention buried in a README is really `AGENTS.md` material; an
enforceable rule is really a hook; a repeatable procedure is really a skill; a tracked requirement is really a
spec. Today living-docs silently leaves it passive. Teaching it to **notice and flag** mis-placed knowledge —
without leaving its lane — turns the passive end of the spectrum into a router toward activation, which is the
core KDD practice ("knowledge activation") made concrete and low-maintenance.

## What Changes

- Add an **activation-routing review lens** to `eunomai-living-docs`: while refreshing docs, detect content
  that belongs at a higher activation state and **surface it** (suggest + point at the owning pillar), then
  delegate the actual move. It is a lens, **not** a new check and **not** an automated move.
- The routing map (suggest, never move):
  - recurring **convention** → `AGENTS.md` (🟡 semi-active)
  - enforceable **policy** → a hook via safe-controls (🔴 enforced)
  - repeatable **procedure** → a skill via `eunomai-skill-finder` (🔴 active)
  - trackable **requirement** → an OpenSpec spec (🟡 traceable)
- Stay strictly in-lane and human-in-control: living-docs **suggests and delegates**; it does not write
  `AGENTS.md`, author hooks/skills, or create specs itself, and it never auto-applies.
- Document the lens in `docs/reference/living-docs.md`, anchored to the KDD activation table.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `living-docs`: add a requirement that, during a docs refresh, the skill identifies content whose activation
  state is higher than passive prose and surfaces it with the owning pillar as a suggestion — delegating the
  move, never performing it, and adding no new check.

## Impact

- `skills/eunomai-living-docs/SKILL.md` — new "Activation routing" section + a boundary note.
- `openspec/specs/living-docs/spec.md` — one new requirement (via the change's delta spec, synced on apply).
- `docs/reference/living-docs.md` — document the routing lens; cross-ref the KDD explanation page.
- No code, no new check, no new CLI surface. `docs-check` / `provenance-check` behavior unchanged.
- Reuse: leans entirely on existing pillars (AGENTS.md, safe-controls hooks, skill-finder, OpenSpec) as the
  routing targets — eunomai adds only the recognition-and-handoff lens in living-docs.
