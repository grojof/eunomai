# living-docs Specification

## Purpose
TBD - created by archiving change living-docs. Update Purpose after archive.
## Requirements
### Requirement: Project-docs structure standard

The root `README.md` SHALL be a lean front door — a short project summary plus an index of links into deeper
documentation. Detailed project documentation SHALL live under `docs/`, **organized by Diátaxis type**:
`guides/` (how-to, including getting-started), `reference/` (technical facts — one page per capability),
`explanation/` (the why / concepts), and `decisions/` (ADRs). Every in-scope page SHALL be reachable from the
README index, and the README SHALL NOT inline long-form content that belongs in a `docs/` page.

#### Scenario: A reader opens the README
- **WHEN** a reader opens `README.md`
- **THEN** they get a concise summary of the project and a navigable index of links to the `docs/` pages

#### Scenario: A new page is placed by type
- **WHEN** new long-form documentation is authored
- **THEN** it goes under the matching Diátaxis folder (`guides/`, `reference/`, or `explanation/`) and is linked from the README index, not inlined

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
(ADRs) SHALL NOT be required to appear in the README index.

#### Scenario: A dev-doc is not indexed
- **WHEN** an ADR exists under `docs/decisions/` and is not linked from the README
- **THEN** the integrity check does not flag it

### Requirement: eunomai dogfoods the standard

eunomai's own `README.md` and `docs/` SHALL conform to the standard, and the integrity check SHALL pass on
this repository as part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** the integrity check runs against this repository
- **THEN** it exits zero

### Requirement: Diagram enrichment (Mermaid + C4)

The living-docs standard and the `eunomai-living-docs` skill SHALL guide diagrams using **Mermaid**, matching
the diagram type to its purpose (flowchart for process/decisions, sequence for interactions over time, ER or
class for data/structure, state for status changes, and the **C4 model** for architecture), and SHALL keep
each diagram simple (one idea per diagram).

#### Scenario: Architecture needs a diagram
- **WHEN** a doc needs to show software architecture
- **THEN** the skill recommends Mermaid with the **C4** model (Context → Container → Component)

#### Scenario: A process or interaction needs a diagram
- **WHEN** a doc needs to show a process/decision or an interaction over time
- **THEN** the skill recommends the matching Mermaid type (flowchart or sequence) and keeps it simple

### Requirement: Workspace-aware doc audit

The `eunomai-living-docs` skill SHALL operate on a **project root**, which may not be the current directory in
a workspace that contains nested or multiple repos. When invoked in such a workspace it SHALL first run the
read-only workspace survey to identify project roots, audit and refresh docs against a chosen project root
(running `docs-check` from that root), and report doc state per repository — never assuming the workspace root
is the project. It SHALL remain human-in-control and SHALL change nothing during the survey.

#### Scenario: Nested project, not the workspace root
- **WHEN** living-docs is invoked in a workspace whose root is environment and the project is a nested repo
- **THEN** it audits and runs `docs-check` against the nested project root, not the workspace root

#### Scenario: Per-repo report across a multirepo workspace
- **WHEN** the workspace holds multiple project repos
- **THEN** living-docs reports each repo's doc state separately and refreshes only the project root(s) the user chooses

#### Scenario: Single-repo behavior is unchanged
- **WHEN** living-docs is invoked in a plain single repo (cwd = project root = workspace)
- **THEN** it behaves exactly as before, with no extra survey ceremony required

