## ADDED Requirements

### Requirement: Survey the workspace and confirm scope before onboarding

The onboard skill SHALL, before analyzing or changing any project, perform a read-only **workspace survey**
(delegated to a subagent) that discovers all git repositories (the root and any nested) and their remotes and
detects code manifests and existing `CLAUDE.md`/`AGENTS.md`. It SHALL classify each repository as *environment*
or *project* by heuristic, present the workspace map with the proposed classification, and require the user to
confirm which repositories are in scope and where the eunomai layer anchors. It SHALL NOT decide scope
silently, and the survey SHALL change nothing.

#### Scenario: Nested project under an environment root
- **WHEN** onboard runs in a workspace whose root repo holds work-environment config and a nested subfolder is a project repo with a GitHub remote
- **THEN** it detects both, proposes classifying the nested repo as the project and the root as environment, and seeds nothing until the user confirms

#### Scenario: Ambiguous repository is asked about
- **WHEN** a discovered repo has no clear signal (e.g. code but no remote)
- **THEN** onboard asks the user how to classify it rather than guessing

#### Scenario: Detect, don't assume
- **WHEN** the survey completes
- **THEN** onboard presents the detected map plus proposed classification and proceeds only on the user's confirmation

### Requirement: Anchor the eunomai layer at each project root

The onboard skill SHALL seed the eunomai layer (a lean `AGENTS.md`, `openspec/`, `docs/`, the permissions
baseline, and the hooks wiring) at each confirmed **project root**, and SHALL NOT seed it at the workspace
root by default. A repository classified as environment SHALL receive at most a minimal delegating
`CLAUDE.md`, and only with the user's consent.

#### Scenario: Seed at the project subfolder
- **WHEN** the user confirms a nested subfolder as the project root
- **THEN** onboard anchors `openspec/`, `docs/`, and `AGENTS.md` there, not at the workspace root

#### Scenario: Environment root is not seeded as a project
- **WHEN** the workspace root is classified as environment
- **THEN** onboard does not seed the eunomai layer there, offering at most a minimal delegating `CLAUDE.md` with consent

### Requirement: Declare boundaries via hierarchical CLAUDE.md/AGENTS.md

Each onboarded project's `AGENTS.md` SHALL declare its own boundary and key paths (the `openspec/` and `docs/`
locations and what is tracked) so that config and agents operate within that project. Any workspace-root
`CLAUDE.md` SHALL only delegate — pointing at the project directories and marking the root as environment —
and SHALL carry no per-project conventions. No new manifest file SHALL be introduced; scope SHALL be expressed
through Claude Code's native hierarchical `CLAUDE.md`/`AGENTS.md` discovery.

#### Scenario: Project declares its own boundary
- **WHEN** onboard seeds a project root
- **THEN** that project's `AGENTS.md` states its boundary and the `openspec/`/`docs/` paths it owns

#### Scenario: Workspace root only delegates
- **WHEN** onboard writes a workspace-root `CLAUDE.md`
- **THEN** it only points to the project directories and marks the root as environment, with no per-project conventions

### Requirement: Onboard multiple project repos independently

When the workspace contains more than one in-scope project repo, the onboard skill SHALL onboard each
independently — its own seed and its own `docs-check`/`provenance-check` — with no shared conformance layer
across projects.

#### Scenario: Multirepo workspace
- **WHEN** the user selects two project repos in one workspace
- **THEN** onboard seeds and drives the checks green for each project separately, with no cross-project engine

## MODIFIED Requirements

### Requirement: Analyze project and gather author input

The onboard skill SHALL, **for each confirmed project root**, survey that project (stack, existing docs,
skills, conventions) and gather the author's input (purpose, domain, audience) before making any changes to it.

#### Scenario: Survey before changing
- **WHEN** onboard begins work on a confirmed project root
- **THEN** it surveys that project's existing docs/skills/conventions and gathers the author's intent before changing anything
