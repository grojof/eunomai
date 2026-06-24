## Why

eunomai is fully built (4 pillars + the connector axis), but you can't yet *use* it on a real project. Two
gaps block testing: there is **no `marketplace.json`**, so the plugin can't be installed into another project,
and there is **no coherent usage guide** — the docs are reference-per-pillar and dispersed, with no end-to-end
thread for "how do I set this up and apply it to a new or existing project?". Closing both is what lets you
start testing eunomai for real.

## What Changes

- Add **`.claude-plugin/marketplace.json`** so eunomai is installable as a Claude Code plugin — locally from a
  path now (`/plugin marketplace add <path>` → `/plugin install eunomai@eunomai`), from git later. The skills
  (`eunomai-onboard`, `eunomai-living-docs`, `eunomai-skill-finder`) and the safe-controls hooks ship with the
  plugin (hooks resolve via `${CLAUDE_PLUGIN_ROOT}`).
- Add a coherent **`docs/usage.md`** — the end-to-end usage spine: prerequisites, install, **apply to a new or
  existing project via `eunomai-onboard`**, and the day-to-day workflow (the SDD loop, the hooks, the skills,
  the checks).
- **Reorient the `README.md`** to lead with a clear **Getting started** path, not only a reference index.
- Document install/usage briefly in `AGENTS.md`; re-project.
- **Honest scope on the CLI checks:** skills + hooks ship and work via the plugin; the `projection/` CLI checks
  (`docs-check`, `provenance-check`) remain build-from-source dev-gate tools for now — shipping them with the
  plugin is a noted follow-up, not this change.
- **Reuse vs net-new (connector-first):** *reuse* Claude Code's native plugin/marketplace mechanism (install,
  scopes, `/reload-plugins`) and OpenSpec (installed separately for SDD). eunomai's *net-new* is only the
  `marketplace.json` manifest, the coherent usage guide, and the README reorientation.

## Capabilities

### New Capabilities
- `distribution`: eunomai is installable as a Claude Code plugin (a `marketplace.json` manifest) and has a
  coherent, end-to-end usage guide that leads from install → applying it to a new/existing project → the daily
  workflow.

### Modified Capabilities
<!-- None — the pillars are unchanged; this packages and documents them. -->

## Impact

- **New:** `.claude-plugin/marketplace.json`; `docs/usage.md` (indexed in the README); a README "Getting
  started" section.
- **`AGENTS.md`:** a short install/usage pointer (re-projected, idempotent).
- **Gate:** `docs-check` (usage.md indexed) + `provenance-check` stay green; no code → `projection/` gate
  unchanged.
- **No new runtime dependencies.**

## Non-goals

- **Not publishing to a public marketplace or to npm** — local/git install only for now.
- **Not shipping the `projection/` CLI inside the plugin** (its `dist/` is gitignored) — a separate follow-up
  (commit `dist`, or publish the package) decides that.
- **Not bundling OpenSpec** — it is installed separately (the SDD pillar reuses it).
- **Not a per-pillar tutorial** — the `docs/` pages remain the reference; `usage.md` is the spine that links
  them.
