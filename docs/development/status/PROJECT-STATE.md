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
- **Connector / bootstrap** — ✅ done, as `eunomai-onboard`: one-shot cold-start that analyzes a new/existing
  project → establishes docs (living-docs standard) → seeds conventions → audits skills via skill-finder →
  drives the checks green → steps aside (dispensable; zero lock-in). Orchestrates the pillars (skill-only, no
  new check); **not** a continuous cross-project sync engine. Spec: `openspec/specs/onboard/`.

## Architecture / layout

- `.claude-plugin/` (`plugin.json` + `marketplace.json`) + `skills/` + `hooks/` — the plugin (installable).
- `hooks/` — `guard.mjs` (runner) + `decide.mjs` (pure logic) + `decide.test.mjs`; wired in `hooks.json`.
- `.claude/settings.json` — wires the safe-controls hooks for this repo (dogfooding).
- `projection/` — Node/TS tooling: `compile` (+ `--check`), `docs-check`, `provenance-check`; gate **22/22**.
  Ships as a **self-contained CJS bundle** `dist/cli.cjs` (tsup `cjs` + `noExternal`, committed) — runs with no
  `node_modules`. Skills invoke it via `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs`.
- `skills/` — `eunomai-living-docs` + `eunomai-skill-finder` + `eunomai-onboard`; each with `SKILL.md` + `PROVENANCE.md`.
- `openspec/` — SDD engine home (changes · specs · archive · `config.yaml` = eunomai layer).
- `docs/usage.md` (install + use) · `docs/VISION.md` (charter) · `docs/safe-controls.md` · `docs/living-docs.md` · `docs/skill-finder.md` · `docs/onboard.md` · `docs/decisions/` (ADRs) · `docs/development/status/` (this).
- `AGENTS.md` authored → projected to `CLAUDE.md` + `.github/copilot-instructions.md` (committed).

## Key decisions

- **Connector-first / don't reinvent / low maintenance / Claude-first.** (VISION principles.)
- **Governance control-plane abandoned** — irreducible cross-tool gaps + high maintenance.
- **SDD = OpenSpec (Option D)** — `docs/decisions/0001-adopt-openspec/`.
- **Projection = rulesync** (`convertFromTool` from `agentsmd`); generated files committed (zero lock-in).
- **Reused tools:** Claude Code native (plugin/skills/hooks) · rulesync (Copilot projection) · OpenSpec (SDD).

## Status & next steps

- Repo: clean history through `473217f`. Highlights: `b239b21` (distribution: marketplace.json + usage guide)
  → `25474fd` (self-contained CLI bundle ships) → `473217f` (archive + sync spec).
- OpenSpec CLI installed globally (`@fission-ai/openspec`); `/opsx:*` flow works.
- **MODEL COMPLETE + INSTALLABLE + SELF-CONTAINED.** All 4 pillars + the connector axis shipped & dogfooded;
  eunomai is an installable Claude Code plugin (`.claude-plugin/marketplace.json`) with a coherent usage guide
  (`docs/usage.md`); **everything needed ships** — skills + hooks + the CLI (self-contained `cli.cjs`, no build
  step). Specs in `openspec/specs/` (safe-controls, living-docs, skill-finder, onboard, distribution). Repo
  passes all three checks (hooks, `docs-check`, `provenance-check`).
- **Next — test it for real:** `/plugin marketplace add <repo>` → `/plugin install eunomai@eunomai` →
  `/reload-plugins`; verify skills/hooks/CLI fire as an installed plugin; then run `/eunomai:eunomai-onboard`
  on a real foreign project (e.g. a TypeScript repo). **Remaining follow-up:** a git/remote marketplace (so
  install isn't from a local path). Gate: reproject + `docs-check` + `provenance-check` (+ projection
  typecheck/lint/test when code changes), all via `node projection/dist/cli.cjs`.

## How to continue (new session in this repo)

1. `cd` into this repo and run `claude` here (so `/opsx:*` slash commands load; restart if not visible).
2. Context loads from `CLAUDE.md` → `AGENTS.md`; deep history in project memory (`eunomai-pivot`).
3. Reference clones for study live in `../_vendor/` (rulesync, openspec, spec-kit); scratch in `../_scratch/`.
