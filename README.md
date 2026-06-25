# eunomai

> A focused, **Claude-first AI workspace**, tailored to how we work — built on existing tools, not
> reinventing them. Packaged as a **Claude Code plugin**, with best-effort GitHub Copilot parity.

The name comes from **Eunomia** (Εὐνομία), the Greek personification of *good order* (*eu* + *nomos*), with
the `·ai` suffix.

## What it is

A curated Claude Code plugin (skills · commands · hooks · subagents) empowering four pillars, plus a thin
`AGENTS.md` → Copilot projection for best-effort parity. It **does not** reinvent: it stands on Claude
Code's native extensibility and on [`rulesync`](https://github.com/dyoshikawa/rulesync) for projection. It
works as a **one-shot connector / bootstrap** — it seeds a project with these conventions and steps aside;
**dispensable**, because everything lives in the generated output (zero lock-in).

## Getting started

New here? **→ [docs/guides/getting-started.md](docs/guides/getting-started.md)** walks you from install to applying eunomai to a project. In short:

```text
npm i -g @fission-ai/openspec        # the SDD engine (reused, installed separately)
/plugin marketplace add grojof/eunomai
/plugin install eunomai@eunomai
/reload-plugins
/eunomai:eunomai-onboard             # apply eunomai to a new or existing project
```

## The four pillars

1. **SDD/SPDD** — the spec-driven flow (explore → propose → apply → archive), on **OpenSpec**.
2. **Living docs** — always-fresh **project docs**: a lean README (index + summary + links) extending into
   `docs/` by topic, only when needed.
3. **Safe controls** — hooks (`PreToolUse` deny/ask) + permissions; commit-policy guardrails.
4. **Skills** — our own skills only (today `eunomai-skill-finder`, a trust gate by criteria); third-party
   skills are brought by the user/org and secured via project rules.

Shipped alongside the pillars: a tiny, standards-anchored **base skills** set (`eunomai-secure-coding`,
`eunomai-dependency-upgrade`), and the **connector / bootstrap** axis (`eunomai-onboard`) — the one-shot
cold-start that applies eunomai to a new or existing project, then steps aside.

## Layout

```
eunomai/
  .claude-plugin/plugin.json   ← the Claude Code plugin manifest
  .claude-plugin/marketplace.json ← makes eunomai installable as a plugin
  skills/                      ← the pillars, as Agent Skills (built incrementally)
  hooks/                       ← safe-controls: PreToolUse guard (deny/ask) + tests
  agents/                      ← (added as pillars land)
  projection/                  ← Copilot best-effort: AGENTS.md → tools via rulesync (+ drift check)
  openspec/                    ← SDD engine (OpenSpec): changes · specs · archive · config.yaml (eunomai layer)
  AGENTS.md                    ← the workspace's own authored source of truth
  docs/                        ← project docs, organized by Diátaxis:
    guides/                    ←   how-to (getting-started, manage-skills, refresh-living-docs, run-the-checks, contributing)
    reference/                 ←   per-pillar facts (sdd, living-docs, safe-controls, skill-finder, base-skills, onboard, projection)
    explanation/               ←   the why (vision)
    decisions/                 ←   ADRs (e.g. why we adopted OpenSpec for SDD)
```

## Start here

- **Guides** (how-to):
  - **[docs/guides/getting-started.md](docs/guides/getting-started.md)** — install + apply eunomai to a project + the daily workflow.
  - **[docs/guides/manage-skills.md](docs/guides/manage-skills.md)** — add or audit a skill behind the trust gate.
  - **[docs/guides/refresh-living-docs.md](docs/guides/refresh-living-docs.md)** — keep the docs fresh and structurally honest.
  - **[docs/guides/run-the-checks.md](docs/guides/run-the-checks.md)** — the read-only gate (`docs-check`, `provenance-check`, `compile --check`).
  - **[docs/guides/contributing.md](docs/guides/contributing.md)** — the dev loop for working **on** eunomai.
- **Explanation** → **[docs/explanation/vision.md](docs/explanation/vision.md)** — the charter: what eunomai is, principles, pillars, architecture.
- **Reference** — one page per pillar / component:
  - **[docs/reference/sdd.md](docs/reference/sdd.md)** — the spec-driven flow (explore → propose → apply → archive) on OpenSpec.
  - **[docs/reference/living-docs.md](docs/reference/living-docs.md)** — the project-docs structure standard + `docs-check`.
  - **[docs/reference/safe-controls.md](docs/reference/safe-controls.md)** — the `PreToolUse` hooks + the recommended permissions baseline.
  - **[docs/reference/skill-finder.md](docs/reference/skill-finder.md)** — the skill trust gate, provenance + `provenance-check`.
  - **[docs/reference/base-skills.md](docs/reference/base-skills.md)** — the standards-anchored base set + the admission filter.
  - **[docs/reference/onboard.md](docs/reference/onboard.md)** — the connector/bootstrap that applies eunomai to a project.
  - **[docs/reference/projection.md](docs/reference/projection.md)** — the Copilot parity tool + the read-only checks.
- **Decisions** → **[docs/decisions/0001-adopt-openspec/](docs/decisions/0001-adopt-openspec/)** — ADRs (e.g. why SDD runs on OpenSpec).

## One principle above all

**Don't reinvent — stand on the best existing tools and build only the tailored glue.**
