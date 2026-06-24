# Skills

The eunomai pillars ship as **Agent Skills** in this directory (each a `<name>/SKILL.md` folder, loaded by
the plugin and namespaced as `/eunomai:<name>`). Built incrementally via the SDD flow in `../docs/specs/`.

## Planned (the four pillars)

| Skill(s) | Pillar | Status |
|---|---|---|
| `eunomai-sdd-*` | SDD/SPDD spec-driven flow | planned |
| `eunomai-dev-docs` | Living docs — development (SDD, status, architecture) | planned |
| `eunomai-project-docs` | Living docs — project/product (README, usage, domain) | planned |
| `eunomai-safe-controls` | Safe controls (hooks + permissions guardrails) | planned |
| `eunomai-skill-finder` | Trust-gated skill discovery, fused with skill-creator | planned |

> Each pillar gets its own SDD change before implementation. Keep skills small, single-purpose, and loaded
> by trigger.
