# Skills

eunomai's own **Agent Skills** live here — each a `<name>/SKILL.md` folder (plus a `PROVENANCE.md` sidecar,
`origin: authored`), loaded by the plugin and namespaced as `/eunomai:<name>`.

| Skill | Purpose |
|---|---|
| `eunomai-living-docs` | Refresh project docs toward the Diátaxis standard (living-docs pillar). |
| `eunomai-skill-finder` | Trust-gated discover / adopt / create / audit of skills (skills pillar). |
| `eunomai-onboard` | Cold-start: apply eunomai to a new or existing project (connector / bootstrap). |

> **Safe controls** ships as `PreToolUse` hooks (`../hooks/`), and **SDD** runs on OpenSpec — neither is a
> skill. Skills are small, single-purpose, loaded by trigger, and built via the SDD flow in `../openspec/`.
