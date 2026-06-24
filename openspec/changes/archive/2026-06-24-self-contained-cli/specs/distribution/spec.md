## ADDED Requirements

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

## MODIFIED Requirements

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
