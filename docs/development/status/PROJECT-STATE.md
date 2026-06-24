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
2. **Living docs** — planned. **Project-docs only**: a lean root README (index + summary + links) → `docs/`
   by topic when needed. (SDD/dev-docs belong to OpenSpec/repo; not a sub-pillar.)
3. **Safe controls** — propose-ready (Claude hooks: `PreToolUse` deny/ask + permissions; commit guardrails).
4. **Skills** — planned: **our own skills only** (today `eunomai-skill-finder`, a trust gate by criteria);
   third-party skills come from the user/org, secured via project rules.
- **Connector / bootstrap** — one-shot seeding of projects with templates + skills + rules, then steps aside
  (dispensable; zero lock-in). **Not** a continuous cross-project sync engine.

## Architecture / layout

- `.claude-plugin/plugin.json` + `skills/` — the plugin (deliverable; pillars land here).
- `projection/` — Copilot best-effort tool (`compile` + `compile --check`), Node/TS, **verified 10/10**.
- `openspec/` — SDD engine home (changes · specs · archive · `config.yaml` = eunomai layer).
- `docs/VISION.md` (charter) · `docs/decisions/` (ADRs) · `docs/development/status/` (this).
- `AGENTS.md` authored → projected to `CLAUDE.md` + `.github/copilot-instructions.md` (committed).

## Key decisions

- **Connector-first / don't reinvent / low maintenance / Claude-first.** (VISION principles.)
- **Governance control-plane abandoned** — irreducible cross-tool gaps + high maintenance.
- **SDD = OpenSpec (Option D)** — `docs/decisions/0001-adopt-openspec/`.
- **Projection = rulesync** (`convertFromTool` from `agentsmd`); generated files committed (zero lock-in).
- **Reused tools:** Claude Code native (plugin/skills/hooks) · rulesync (Copilot projection) · OpenSpec (SDD).

## Status & next steps

- Repo: clean history; `e3b38ed` (init) → `f69ce9e` (adopt OpenSpec) → `248c10a` (PROJECT-STATE) →
  `161339f` (config YAML fix) → `3849f3d` (propose safe-controls).
- OpenSpec CLI installed globally (`@fission-ai/openspec`); `/opsx:*` flow works.
- **Safe controls**: proposal complete + validated (`openspec/changes/safe-controls/`), not yet applied.
- Vision refined 2026-06-24: living-docs = project-docs only; skills = own only; connector/bootstrap axis.
- **Next:** either `/opsx:apply` safe-controls, or design **living docs** as an OpenSpec change (and dogfood
  it on this repo). Keep OpenSpec current with `openspec update`; reproject with `node projection/dist/cli.js compile`.

## How to continue (new session in this repo)

1. `cd` into this repo and run `claude` here (so `/opsx:*` slash commands load; restart if not visible).
2. Context loads from `CLAUDE.md` → `AGENTS.md`; deep history in project memory (`eunomai-pivot`).
3. Reference clones for study live in `../_vendor/` (rulesync, openspec, spec-kit); scratch in `../_scratch/`.
