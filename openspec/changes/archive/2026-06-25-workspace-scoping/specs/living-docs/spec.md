## ADDED Requirements

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
