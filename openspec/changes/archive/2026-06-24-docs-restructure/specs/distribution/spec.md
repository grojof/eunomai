## MODIFIED Requirements

### Requirement: Coherent end-to-end usage guide

eunomai SHALL provide a `docs/guides/getting-started.md` that documents, in one place: prerequisites, how to
install, how to apply eunomai to a new or existing project via `eunomai-onboard`, and the day-to-day workflow
(the SDD loop, the hooks, the skills, the checks). It SHALL be linked from the README and SHALL state honestly
what ships with the plugin.

#### Scenario: Follow it end to end
- **WHEN** a new user opens `docs/guides/getting-started.md`
- **THEN** they can go from install to applying eunomai to a project without piecing together the per-pillar docs

#### Scenario: The CLI ships with the plugin
- **WHEN** the guide describes the checks (`docs-check` / `provenance-check`) and `compile`
- **THEN** it states they ship with the plugin as a self-contained CLI (no build-from-source step required)

### Requirement: README leads with getting started

The README SHALL present a **Getting started** entry point (install → apply → workflow) prominently, in
addition to the reference index, linking to `docs/guides/getting-started.md`.

#### Scenario: Front door points to the guide
- **WHEN** a reader opens the README
- **THEN** a Getting started section points to `docs/guides/getting-started.md` ahead of the deep reference links

### Requirement: Docs integrity preserved

The `docs/guides/getting-started.md` page SHALL be indexed in the README so that `docs-check` continues to pass.

#### Scenario: docs-check stays green
- **WHEN** `docs-check` runs
- **THEN** it exits zero (the guide is indexed)
