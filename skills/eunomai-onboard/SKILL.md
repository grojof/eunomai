---
name: eunomai-onboard
description: Cold-start orchestrator that applies eunomai to a new or existing project. Use when bringing a foreign project up to eunomai's standards — analyze it, establish/restructure docs (or create them), seed conventions (AGENTS.md, OpenSpec config, permissions, hooks), audit existing skills, then hand off. One-shot and dispensable; orchestrates the pillars, does not reimplement them.
---

# eunomai-onboard

The **cold-start** that turns a new or existing project into an eunomai project, then **steps aside**.
It establishes; the steady-state pillars (`eunomai-living-docs`, `eunomai-skill-finder`, the hooks, OpenSpec)
maintain. It **orchestrates and delegates** — it never reimplements a pillar. One-shot and dispensable:
everything it seeds lives in the project's own files (zero lock-in).

## When to use

- Adopting eunomai in a project for the first time (new or existing).
- A project has scattered, stale, or missing docs and you want eunomai's structure + quality.

## Project root vs workspace (read this first)

Do **not** assume "the project = the current directory". A workspace may have an **environment repo** at the
root (dotfiles, tooling config) with one or more **nested** project repos, and it may be **multirepo**. The
eunomai layer anchors at each **project root**, never the workspace root by default. So onboarding starts by
surveying the workspace and letting the user confirm scope — *detect, don't assume*.

## Flow

0. **Survey the workspace + confirm scope.** Delegate a read-only survey to the **`workspace-survey`**
   subagent: it discovers all git repos (root + nested) and remotes, detects code manifests and existing
   `CLAUDE.md`/`AGENTS.md`, and returns a map with a proposed *environment vs project* classification. Present
   the map; **infer-then-confirm** — propose a classification, ask a single confirmation, and **ask** about
   genuinely ambiguous repos (e.g. code but no remote). The user chooses which repos are **in scope** and
   where the eunomai layer anchors. Change nothing in this step.
1. **Analyze + gather input — per confirmed project root.** For each chosen project root, survey its stack,
   existing docs, skills, and conventions, and ask the author for that project's purpose, domain, and
   audience. Change nothing yet.
2. **Establish docs** (at the project root) → the living-docs standard:
   - Existing docs → restructure into a lean `README.md` index + `docs/` topic pages.
   - No docs → create a lean README + `docs/` pages from the analysis and the author's input.
   - (After this, the `eunomai-living-docs` skill maintains them.)
3. **Seed conventions** (at the project root) — derive each from eunomai's own live conventions and adapt to
   the target (do not drop verbatim):
   - a lean `AGENTS.md` (authored source → projected) that **declares this project's boundary + paths** (the
     `openspec/` and `docs/` locations and what is tracked), so config and agents operate within it,
   - an `openspec/config.yaml` layer (run `openspec update`),
   - the **permissions baseline** (`docs/reference/safe-controls.md`),
   - **hooks wiring** — if the project installs the eunomai *plugin*, hooks come from it; if it uses eunomai
     from source, wire `.claude/settings.json` (`$CLAUDE_PROJECT_DIR/hooks/guard.mjs`). Detect which.
4. **Audit skills.** Invoke **`eunomai-skill-finder`** in audit mode over the project's existing skills; do
   not audit them yourself.
5. **Drive the checks green — from the project root** (`cd` into it; the checks resolve relative to `cwd`):
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" docs-check
   node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" provenance-check
   ```
   Fix until both exit 0.
6. **Hand off.** Point the author at the steady-state pillars and stop. No background or cross-project process.

**Multirepo:** when several project repos are in scope, run steps 1–6 **independently per project** — each
gets its own seed and its own green checks. There is **no shared conformance layer** across projects.

**Environment root:** a repo classified as environment is **not** seeded as a project. With the user's
consent, it may receive at most a **minimal delegating `CLAUDE.md`** — pointing at the project directories and
marking the root as environment, with **no per-project conventions** (Claude Code always loads the parent
`CLAUDE.md` when working in a child, so keep it tiny). No workspace manifest file is introduced; scope rides on
hierarchical `CLAUDE.md`/`AGENTS.md`.

## Boundaries

- **Detect, don't assume.** Survey the workspace and have the user confirm scope before seeding; never decide
  silently which repo is "the project" or where the layer anchors.
- **Anchor per project root.** Seed at each confirmed project root, never the workspace root by default; the
  environment repo gets at most a minimal delegating `CLAUDE.md`, with consent.
- **Boundaries are authored, not invented.** Scope is expressed via hierarchical `CLAUDE.md`/`AGENTS.md` — no
  workspace manifest, no registry.
- **Establish, don't maintain.** Ongoing doc refresh is `eunomai-living-docs`; ongoing skill work is
  `eunomai-skill-finder`. Delegate.
- **One-shot, dispensable.** Seed and step aside; removing eunomai leaves a working project.
- **No conformance engine.** "Onboarded" means the existing checks pass — not a new matrix or a continuous
  cross-project audit (that is the abandoned governance tower).
- **Interactive.** Doc creation and seeding are driven by the author's input, not auto-applied.
