# eunomai — Project State

> Living snapshot for fast context (cold-start handoff). Updated 2026-06-24. This file is a manual seed of
> the future `eunomai-dev-docs` living-docs pillar.

## What eunomai is

A focused, **Claude-first AI workspace**, packaged as a **Claude Code plugin**, built on existing tools —
not reinventing them. Copilot is best-effort via `AGENTS.md` projection. See `docs/VISION.md` for the
charter. (History/why in project memory: `eunomai-pivot`.)

## Four pillars (built incrementally as plugin skills)

1. **SDD/SPDD** — ✅ adopted **OpenSpec** (engine) + eunomai layer in `openspec/config.yaml`. Use
   `/opsx:explore → /opsx:propose <name> → /opsx:apply → /opsx:archive`.
2. **Living docs** — planned; split into `eunomai-dev-docs` (this file's domain) + `eunomai-project-docs`.
3. **Safe controls** — planned (Claude hooks: `PreToolUse` deny/ask + permissions; commit guardrails).
4. **Skills** — planned: `eunomai-skill-finder` (trust gate) fused with skill-creator.

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

- Repo: clean history; commits `e3b38ed` (init) → `f69ce9e` (adopt OpenSpec).
- **Next:** build the next pillar via OpenSpec — candidates: **safe controls** (fast, high value, validates
  hooks) or **living docs**. Start with `/opsx:propose <pillar>`.
- Keep OpenSpec current: `openspec update`. Keep rulesync projection in sync: `node projection/dist/cli.js compile`.

## How to continue (new session in this repo)

1. `cd` into this repo and run `claude` here (so `/opsx:*` slash commands load; restart if not visible).
2. Context loads from `CLAUDE.md` → `AGENTS.md`; deep history in project memory (`eunomai-pivot`).
3. Reference clones for study live in `../_vendor/` (rulesync, openspec, spec-kit); scratch in `../_scratch/`.
