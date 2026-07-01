# Skills

eunomai's own **Agent Skills** live here — each a `<name>/SKILL.md` folder, loaded by the plugin and
namespaced as `/eunomai:<name>`. Provenance is **one** registry at this root —
[`eunomai-skills-audit.md`](eunomai-skills-audit.md) (`origin: authored`) — never per-skill sidecars; skill
folders stay clean.

| Skill | Purpose |
|---|---|
| `eunomai-onboard` | Cold-start: apply eunomai to a new or existing project (connector / bootstrap). |
| `eunomai-living-docs` | Refresh project docs toward the living-docs v2 standard — Diátaxis as a `type` lens, a product-shaped README map (living-docs pillar). |
| `eunomai-skill-finder` | Trust-gated discover / adopt / create / audit of skills (skills pillar). |
| `eunomai-secure-coding` | Base skill: proactive, writing-time secure-coding directives (OWASP Top 10 + CWE). |
| `eunomai-dependency-upgrade` | Base skill: hygiene for adding/upgrading dependencies — lockfile · SCA/CVE · changelog · licenses. |

> **Safe controls** ships as `PreToolUse` hooks (`../hooks/`), and **SDD** runs on OpenSpec — neither is a
> skill. Skills are small, single-purpose, loaded by trigger, and built via the SDD flow in `../openspec/`.
