# distribution Specification

## Purpose
TBD - created by archiving change usage-and-packaging. Update Purpose after archive.
## Requirements
### Requirement: Installable as a Claude Code plugin

eunomai SHALL provide a `.claude-plugin/marketplace.json` listing the eunomai plugin (source = the repo root),
so it can be added as a marketplace and installed via Claude Code's plugin commands. The installed plugin
SHALL provide eunomai's skills and the safe-controls hooks (hooks resolving via `${CLAUDE_PLUGIN_ROOT}`).

#### Scenario: Add the marketplace locally
- **WHEN** a user runs `/plugin marketplace add <path-to-eunomai>`
- **THEN** eunomai appears as an installable plugin in that marketplace

#### Scenario: Install and activate
- **WHEN** the user installs the plugin (`/plugin install eunomai@eunomai`) and runs `/reload-plugins`
- **THEN** eunomai's skills and safe-controls hooks are available in that project

### Requirement: Coherent end-to-end usage guide

eunomai SHALL provide a `docs/usage.md` that documents, in one place: prerequisites, how to install, how to
apply eunomai to a new or existing project via `eunomai-onboard`, and the day-to-day workflow (the SDD loop,
the hooks, the skills, the checks). It SHALL be linked from the README and SHALL state honestly what ships
with the plugin.

#### Scenario: Follow it end to end
- **WHEN** a new user opens `docs/usage.md`
- **THEN** they can go from install to applying eunomai to a project without piecing together the per-pillar docs

#### Scenario: The CLI ships with the plugin
- **WHEN** `usage.md` describes the checks (`docs-check` / `provenance-check`) and `compile`
- **THEN** it states they ship with the plugin as a self-contained CLI (no build-from-source step required)

### Requirement: README leads with getting started

The README SHALL present a **Getting started** entry point (install → apply → workflow) prominently, in
addition to the reference index, linking to `docs/usage.md`.

#### Scenario: Front door points to usage
- **WHEN** a reader opens the README
- **THEN** a Getting started section points to `docs/usage.md` ahead of the deep reference links

### Requirement: Docs integrity preserved

The new `docs/usage.md` SHALL be indexed in the README so that `docs-check` continues to pass.

#### Scenario: docs-check stays green
- **WHEN** `docs-check` runs after adding `usage.md`
- **THEN** it exits zero (the page is indexed)

### Requirement: Self-contained CLI ships with the plugin

The projection CLI SHALL be built as a single self-contained bundle (`projection/dist/cli.cjs`, all runtime
dependencies inlined) that runs every command (`compile`, `docs-check`, `provenance-check`) with plain `node`
and no `node_modules`. The bundle SHALL be committed so it travels with the plugin, and skills SHALL invoke it
via `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs` so it resolves from the installed plugin cache.

#### Scenario: Runs without node_modules
- **WHEN** the bundled CLI is run from a directory that has no `node_modules`
- **THEN** `compile`, `docs-check`, and `provenance-check` all execute successfully

#### Scenario: Skills reference the bundled CLI
- **WHEN** a skill needs to run the CLI
- **THEN** it invokes `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs`, which resolves from the installed plugin cache

