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

## Flow

1. **Analyze + gather input.** Survey the stack, existing docs, skills, and conventions. Ask the author for
   the project's purpose, domain, and audience. Change nothing yet.
2. **Establish docs** → the living-docs standard:
   - Existing docs → restructure into a lean `README.md` index + `docs/` topic pages.
   - No docs → create a lean README + `docs/` pages from the analysis and the author's input.
   - (After this, the `eunomai-living-docs` skill maintains them.)
3. **Seed conventions** — derive each from eunomai's own live conventions and adapt to the target (do not
   drop verbatim):
   - a lean `AGENTS.md` (authored source → projected),
   - an `openspec/config.yaml` layer (run `openspec update`),
   - the **permissions baseline** (`docs/reference/safe-controls.md`),
   - **hooks wiring** — if the project installs the eunomai *plugin*, hooks come from it; if it uses eunomai
     from source, wire `.claude/settings.json` (`$CLAUDE_PROJECT_DIR/hooks/guard.mjs`). Detect which.
4. **Audit skills.** Invoke **`eunomai-skill-finder`** in audit mode over the project's existing skills; do
   not audit them yourself.
5. **Drive the checks green.**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" docs-check
   node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" provenance-check
   ```
   Fix until both exit 0.
6. **Hand off.** Point the author at the steady-state pillars and stop. No background or cross-project process.

## Boundaries

- **Establish, don't maintain.** Ongoing doc refresh is `eunomai-living-docs`; ongoing skill work is
  `eunomai-skill-finder`. Delegate.
- **One-shot, dispensable.** Seed and step aside; removing eunomai leaves a working project.
- **No conformance engine.** "Onboarded" means the existing checks pass — not a new matrix or a continuous
  cross-project audit (that is the abandoned governance tower).
- **Interactive.** Doc creation and seeding are driven by the author's input, not auto-applied.
