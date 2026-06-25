## ADDED Requirements

### Requirement: Claude-only distribution with a single authored source

eunomai SHALL target **Claude Code only**. It SHALL NOT project to or generate instruction files for other
tools (no `rulesync` cross-tool projection, no `.github/copilot-instructions.md`, no `eunomai.yaml`). The
authored agent-instruction source SHALL be a single open-standard `AGENTS.md`; any `CLAUDE.md` SHALL be a
trivial replica of it (or absent), never a separately authored file. **OpenSpec** SHALL be the sole external
runtime dependency (the SDD engine and the historical record of decisions and development).

#### Scenario: No cross-tool projection artifacts
- **WHEN** the repository is built or inspected
- **THEN** there is no `eunomai.yaml`, no `rulesync` projection step, and no generated `copilot-instructions.md`

#### Scenario: Single authored instruction source
- **WHEN** agent instructions need editing
- **THEN** `AGENTS.md` is the one authored file, and any `CLAUDE.md` mirrors it rather than diverging

#### Scenario: OpenSpec is the only external dependency
- **WHEN** the dependencies of the distribution are listed
- **THEN** OpenSpec is the sole external one; nothing else (e.g. `rulesync`) is required

## MODIFIED Requirements

### Requirement: Self-contained CLI ships with the plugin

eunomai SHALL ship a single self-contained CLI bundle (all runtime dependencies inlined) that runs the
read-only checks `docs-check` and `provenance-check` with plain `node` and no `node_modules`. The bundle SHALL
NOT carry a cross-tool projection command (`compile` is removed), SHALL live under a path that does not call
itself "projection", and SHALL be committed so it travels with the plugin. Skills SHALL invoke it via its
`${CLAUDE_PLUGIN_ROOT}`-resolved path.

#### Scenario: Runs without node_modules
- **WHEN** the bundled CLI is run from a directory that has no `node_modules`
- **THEN** `docs-check` and `provenance-check` both execute successfully

#### Scenario: No projection command
- **WHEN** the CLI's commands are listed
- **THEN** it exposes the read-only checks only, with no `compile` / cross-tool projection command

#### Scenario: Skills reference the bundled CLI
- **WHEN** a skill needs to run the CLI
- **THEN** it invokes the bundle via its `${CLAUDE_PLUGIN_ROOT}`-resolved path, which resolves from the installed plugin cache

### Requirement: Coherent end-to-end usage guide

eunomai SHALL provide a `docs/guides/getting-started.md` that documents, in one place: prerequisites (Claude
Code + OpenSpec), how to install, how to apply eunomai to a new or existing project via `eunomai-onboard`, and
the day-to-day workflow (the SDD loop, the hooks, the skills, the checks). It SHALL be linked from the README,
SHALL state honestly what ships with the plugin, and SHALL NOT reference Copilot or a cross-tool projection.

#### Scenario: Follow it end to end
- **WHEN** a new user opens `docs/guides/getting-started.md`
- **THEN** they can go from install to applying eunomai to a project without piecing together the per-pillar docs

#### Scenario: The CLI ships with the plugin
- **WHEN** the guide describes the checks (`docs-check` / `provenance-check`)
- **THEN** it states they ship with the plugin as a self-contained CLI (no build-from-source step, no `compile`)
