# living-docs Specification

## Purpose
TBD - created by archiving change living-docs. Update Purpose after archive.
## Requirements
### Requirement: Project-docs structure standard

The root `README.md` SHALL be a lean front door — a short project summary plus an index of links into deeper
documentation. Detailed project documentation SHALL live under `docs/`, organized by topic, and SHALL be
reachable from the README index. The README SHALL NOT inline long-form content that belongs in a `docs/`
topic page.

#### Scenario: A reader opens the README
- **WHEN** a reader opens `README.md`
- **THEN** they get a concise summary of the project and a navigable index of links to `docs/` topic pages

#### Scenario: Deeper documentation is needed
- **WHEN** a topic needs long-form documentation
- **THEN** it is authored as a page under `docs/` and linked from the README index, not inlined into the README

### Requirement: On-demand docs refresh skill

The plugin SHALL provide an `eunomai-living-docs` skill that, when invoked, refreshes project docs toward the
standard: it updates the README summary and index to match the current state, keeps the index in sync with
the pages under `docs/`, and surfaces README sections that should move into topic pages. The skill SHALL be
human-invoked and SHALL keep the human in control (it does not silently rewrite docs).

#### Scenario: A docs page is missing from the index
- **WHEN** a project-doc page exists under `docs/` that is not linked from the README index, and the skill is invoked
- **THEN** the skill adds a link to that page in the README index

#### Scenario: The skill is invoked to refresh
- **WHEN** the user invokes the skill
- **THEN** it brings the README summary and index in line with the current project state, with the user in control of the changes

### Requirement: README-to-docs integrity check

The plugin SHALL provide a read-only integrity check that verifies (a) every README link into `docs/`
resolves to an existing file, and (b) every in-scope project-doc page under `docs/` is reachable from the
README index. The check SHALL exit non-zero on any divergence, report what diverged, and make no changes.

#### Scenario: A README link is broken
- **WHEN** the README links to a `docs/` file that does not exist
- **THEN** the check reports the broken link and exits non-zero

#### Scenario: A docs page is not indexed
- **WHEN** an in-scope project-doc page under `docs/` is not reachable from the README index
- **THEN** the check reports the orphaned page and exits non-zero

#### Scenario: README and docs are in sync
- **WHEN** every README→`docs/` link resolves and every in-scope page is indexed
- **THEN** the check exits zero and writes no files

### Requirement: Dev-docs excluded from scope

The standard and the integrity check SHALL treat dev-docs as out of scope: pages under `docs/decisions/`
(ADRs) and `docs/development/` (status/handoff) SHALL NOT be required to appear in the README index.

#### Scenario: A dev-doc is not indexed
- **WHEN** a page exists under `docs/decisions/` or `docs/development/` and is not linked from the README
- **THEN** the integrity check does not flag it

### Requirement: eunomai dogfoods the standard

eunomai's own `README.md` and `docs/` SHALL conform to the standard, and the integrity check SHALL pass on
this repository as part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** the integrity check runs against this repository
- **THEN** it exits zero

