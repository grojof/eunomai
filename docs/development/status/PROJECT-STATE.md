# eunomai — Project State

> Living snapshot for fast context (cold-start handoff). Updated 2026-06-24. This is dev-docs — repo /
> OpenSpec material, **not** part of the living-docs pillar (which is project-docs only; see refined model).

## What eunomai is

A focused, **Claude-first AI workspace**, packaged as a **Claude Code plugin**, built on existing tools —
not reinventing them. Copilot is best-effort via `AGENTS.md` projection. See `docs/VISION.md` for the
charter. (History/why in project memory: `eunomai-pivot`.)

## Pillars + the connector axis (built incrementally)

1. **SDD/SPDD** — ✅ adopted **OpenSpec** (engine) + eunomai layer in `openspec/config.yaml`. Use
   `/opsx:explore → /opsx:propose <name> → /opsx:apply → /opsx:archive`.
2. **Living docs** — ✅ done. **Project-docs only**: lean README (index + summary + links) → `docs/` topics;
   `eunomai-living-docs` skill (on-demand refresh) + `docs-check` (read-only README↔docs/ integrity, in the
   gate). Spec: `openspec/specs/living-docs/`. Dogfooded. (Dev-docs not a sub-pillar.)
3. **Safe controls** — ✅ done + verified live. `PreToolUse` hooks in `hooks/` (commit-trailer **deny**,
   safety-gate **ask**, authored-source **ask**; ask-by-default, fail-open). Spec:
   `openspec/specs/safe-controls/`. Repo dogfoods them via `.claude/settings.json`.
4. **Skills** — planned: **our own skills only** (today `eunomai-skill-finder`, a trust gate by criteria);
   third-party skills come from the user/org, secured via project rules.
- **Connector / bootstrap** — one-shot seeding of projects with templates + skills + rules, then steps aside
  (dispensable; zero lock-in). **Not** a continuous cross-project sync engine.

## Architecture / layout

- `.claude-plugin/plugin.json` + `skills/` + `hooks/` — the plugin (deliverable; pillars land here).
- `hooks/` — `guard.mjs` (runner) + `decide.mjs` (pure logic) + `decide.test.mjs`; wired in `hooks.json`.
- `.claude/settings.json` — wires the safe-controls hooks for this repo (dogfooding).
- `projection/` — Node/TS tooling: `compile` (+ `--check`) projection **and** `docs-check` (living-docs); gate **16/16**.
- `skills/eunomai-living-docs/` — on-demand project-docs refresh skill.
- `openspec/` — SDD engine home (changes · specs · archive · `config.yaml` = eunomai layer).
- `docs/VISION.md` (charter) · `docs/safe-controls.md` · `docs/living-docs.md` · `docs/decisions/` (ADRs) · `docs/development/status/` (this).
- `AGENTS.md` authored → projected to `CLAUDE.md` + `.github/copilot-instructions.md` (committed).

## Key decisions

- **Connector-first / don't reinvent / low maintenance / Claude-first.** (VISION principles.)
- **Governance control-plane abandoned** — irreducible cross-tool gaps + high maintenance.
- **SDD = OpenSpec (Option D)** — `docs/decisions/0001-adopt-openspec/`.
- **Projection = rulesync** (`convertFromTool` from `agentsmd`); generated files committed (zero lock-in).
- **Reused tools:** Claude Code native (plugin/skills/hooks) · rulesync (Copilot projection) · OpenSpec (SDD).

## Status & next steps

- Repo: clean history through `b071251`. Highlights: `b6a54f4` (safe-controls) → `3be8b4f` (dogfood hooks)
  → `02f4810` (living-docs) → `b071251` (archive + sync spec).
- OpenSpec CLI installed globally (`@fission-ai/openspec`); `/opsx:*` flow works. **3 of 4 pillars done.**
- **Safe controls**: shipped + verified live; spec `openspec/specs/safe-controls/`; repo dogfoods via `.claude/settings.json`.
- **Living docs**: shipped; `eunomai-living-docs` skill + `docs-check` (in the gate); spec
  `openspec/specs/living-docs/`; repo passes its own check.
- Vision refined 2026-06-24: living-docs = project-docs only; skills = own only; connector/bootstrap axis.
- **Next:** pillar 4 **Skills** (`eunomai-skill-finder`, trust gate by criteria) or the **connector/bootstrap**
  axis — `/opsx:propose <name>`. Keep OpenSpec current with `openspec update`; reproject + `docs-check` in the gate.

## How to continue (new session in this repo)

1. `cd` into this repo and run `claude` here (so `/opsx:*` slash commands load; restart if not visible).
2. Context loads from `CLAUDE.md` → `AGENTS.md`; deep history in project memory (`eunomai-pivot`).
3. Reference clones for study live in `../_vendor/` (rulesync, openspec, spec-kit); scratch in `../_scratch/`.
