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
4. **Skills** — ✅ done. **Our own only**: `eunomai-skill-finder` (trust gate = security veto + judgment;
   adopt/improve/create via skill-creator; on-demand audit) + per-skill `PROVENANCE.md` enforced by
   `provenance-check` (in the gate). Spec: `openspec/specs/skill-finder/`. Dogfooded. skill-creator reused;
   safe-controls is the runtime backstop. Third-party skills come from the user/org, secured via project rules.
- **Connector / bootstrap** — ⏳ next, as `eunomai-onboard`: one-shot analysis of a new/existing project →
  audit/restructure (or create) docs to the living-docs standard + audit skills via skill-finder + seed
  conventions, then steps aside (dispensable; zero lock-in). Orchestrates the pillars; **not** a continuous
  cross-project sync engine.

## Architecture / layout

- `.claude-plugin/plugin.json` + `skills/` + `hooks/` — the plugin (deliverable; pillars land here).
- `hooks/` — `guard.mjs` (runner) + `decide.mjs` (pure logic) + `decide.test.mjs`; wired in `hooks.json`.
- `.claude/settings.json` — wires the safe-controls hooks for this repo (dogfooding).
- `projection/` — Node/TS tooling: `compile` (+ `--check`), `docs-check`, **`provenance-check`**; gate **22/22**.
- `skills/` — `eunomai-living-docs` + `eunomai-skill-finder`; each with `SKILL.md` + `PROVENANCE.md`.
- `openspec/` — SDD engine home (changes · specs · archive · `config.yaml` = eunomai layer).
- `docs/VISION.md` (charter) · `docs/safe-controls.md` · `docs/living-docs.md` · `docs/skill-finder.md` · `docs/decisions/` (ADRs) · `docs/development/status/` (this).
- `AGENTS.md` authored → projected to `CLAUDE.md` + `.github/copilot-instructions.md` (committed).

## Key decisions

- **Connector-first / don't reinvent / low maintenance / Claude-first.** (VISION principles.)
- **Governance control-plane abandoned** — irreducible cross-tool gaps + high maintenance.
- **SDD = OpenSpec (Option D)** — `docs/decisions/0001-adopt-openspec/`.
- **Projection = rulesync** (`convertFromTool` from `agentsmd`); generated files committed (zero lock-in).
- **Reused tools:** Claude Code native (plugin/skills/hooks) · rulesync (Copilot projection) · OpenSpec (SDD).

## Status & next steps

- Repo: clean history through `46e7652`. Highlights: `b6a54f4` (safe-controls) → `02f4810` (living-docs)
  → `32bfa68` (skill-finder) → `46e7652` (archive + sync spec).
- OpenSpec CLI installed globally (`@fission-ai/openspec`); `/opsx:*` flow works. **All 4 pillars done.**
- **Safe controls**: shipped + verified live; spec `openspec/specs/safe-controls/`; dogfooded via `.claude/settings.json`.
- **Living docs**: shipped; `eunomai-living-docs` + `docs-check`; spec `openspec/specs/living-docs/`.
- **Skills**: shipped; `eunomai-skill-finder` + `provenance-check`; spec `openspec/specs/skill-finder/`.
- Repo passes all three checks (hooks, `docs-check`, `provenance-check`) — full dogfooding.
- **Next:** the **connector/bootstrap** axis as `eunomai-onboard` (`/opsx:propose onboard`) — analyze a
  new/existing project, apply eunomai's standards (docs/skills/conventions), then step aside. Keep OpenSpec
  current with `openspec update`; reproject + `docs-check` + `provenance-check` are the gate.

## How to continue (new session in this repo)

1. `cd` into this repo and run `claude` here (so `/opsx:*` slash commands load; restart if not visible).
2. Context loads from `CLAUDE.md` → `AGENTS.md`; deep history in project memory (`eunomai-pivot`).
3. Reference clones for study live in `../_vendor/` (rulesync, openspec, spec-kit); scratch in `../_scratch/`.
