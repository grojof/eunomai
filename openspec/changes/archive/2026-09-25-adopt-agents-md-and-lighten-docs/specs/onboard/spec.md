# Spec Delta

## ADDED Requirements

### Requirement: AGENTS.md is the instruction file, and existing CLAUDE.md files are migrated

The instruction file onboard seeds and the living-docs standard refers to SHALL be `AGENTS.md`, which Claude
Code reads natively (from 2.1.277), hierarchically as it reads `CLAUDE.md`, and which other agents read too.
When a project root has a `CLAUDE.md` and no `AGENTS.md`, onboard SHALL offer to migrate it: rename it to
`AGENTS.md` with its content unchanged. When both exist, onboard SHALL warn that Claude Code reads only
`CLAUDE.md` in that directory, and SHALL propose merging them into `AGENTS.md` — unless that `CLAUDE.md` is
only the `@AGENTS.md` bridge, which is the intended setup. A `CLAUDE.local.md` SHALL stay
as it is, because it has no `AGENTS.md` equivalent. For users on an older Claude Code, onboard SHALL offer a
one-line `CLAUDE.md` holding `@AGENTS.md` as a bridge, never a second copy of the instructions. Nothing SHALL be
renamed, merged or written without the author's confirmation.

#### Scenario: A project with only CLAUDE.md
- **WHEN** onboard reaches a project root whose instructions live in `CLAUDE.md`
- **THEN** it proposes renaming the file to `AGENTS.md`, content unchanged, and renames it only on confirmation

#### Scenario: Both files exist
- **WHEN** a project root has both `CLAUDE.md` and `AGENTS.md`, and the `CLAUDE.md` is more than the `@AGENTS.md` bridge
- **THEN** onboard explains that Claude Code reads only `CLAUDE.md` there and proposes merging the two into `AGENTS.md`

#### Scenario: An older Claude Code
- **WHEN** the author uses a Claude Code older than 2.1.277
- **THEN** onboard offers a `CLAUDE.md` whose only content is `@AGENTS.md`, so the instructions exist once

## RENAMED Requirements

- FROM: `### Requirement: Declare boundaries via hierarchical CLAUDE.md`
- TO: `### Requirement: Declare boundaries via hierarchical AGENTS.md`
- FROM: `### Requirement: Seed a self-sufficient activator block in CLAUDE.md`
- TO: `### Requirement: Seed a self-sufficient activator block in AGENTS.md`

## MODIFIED Requirements

### Requirement: Seed eunomai conventions

The onboard skill SHALL seed the project's conventions by **adapting** templates — a lean `AGENTS.md`, an
`openspec/config.yaml` layer, the permissions baseline, and the guard's project settings with the project's
AI-attribution policy (through the `eunomai-safe-controls` skill) — to the project, not dropping them
verbatim. The guard's hooks SHALL come from the installed plugin; onboard SHALL NOT copy hook scripts into the
project, and when eunomai is used from a source clone it SHALL install the plugin from that clone as a local
marketplace. Each seed SHALL be **individually skippable** based on the
coexistence assessment: OpenSpec is seeded as the default SDD engine **only where no SDD process exists**;
the permissions baseline and the guard settings are offered, not imposed, where governance already exists.
An existing `AGENTS.md` SHALL be **merged into** — the activator block appended under its own heading, existing
content preserved — never replaced.

#### Scenario: Seed authoring + SDD config
- **WHEN** onboard seeds scaffolding on a project with no SDD process
- **THEN** it writes a lean `AGENTS.md` and an `openspec/config.yaml` adapted to the project

#### Scenario: Seed safe controls
- **WHEN** onboard seeds safe-controls on a project with no existing hooks/permissions governance
- **THEN** it adds the permissions baseline, relies on the installed plugin for the hooks (copying no hook
  script), and proposes the guard settings and attribution policy through `eunomai-safe-controls`

#### Scenario: Existing CLAUDE.md is merged, not replaced
- **WHEN** the project keeps its rules in `CLAUDE.md` and the author declines the migration to `AGENTS.md`
- **THEN** onboard appends the adapted activator block to that `CLAUDE.md` under its own heading and changes no
  existing content without the author's explicit choice

#### Scenario: Existing AGENTS.md is merged, not replaced
- **WHEN** the project already has an `AGENTS.md` with its own rules
- **THEN** onboard appends the adapted activator block under its own heading and changes no existing content
  without the author's explicit choice

#### Scenario: A seed is declined
- **WHEN** the author declines one seed (e.g. keeps the org's own permissions)
- **THEN** onboard skips that seed, seeds the rest, and records the decision

### Requirement: Survey the workspace and confirm scope before onboarding

The onboard skill SHALL, before analyzing or changing any project, perform a read-only **workspace survey**
(delegated to a subagent) that discovers all git repositories (the root and any nested) and their remotes and
detects code manifests and existing `AGENTS.md`/`CLAUDE.md`. The survey SHALL also **enumerate existing
governance** per repository — hooks and `permissions` blocks in `.claude/settings.json`, skills under
`.claude/skills/`, an existing `eunomai-skills-audit.md` registry, and other installed plugins' visible
markers — as facts (presence + location), without assessing them. It SHALL classify each repository as
*environment* or *project* by heuristic, present the workspace map with the proposed classification, and
require the user to confirm which repositories are in scope and where the eunomai layer anchors. It SHALL NOT
decide scope silently, and the survey SHALL change nothing.

#### Scenario: Nested project under an environment root
- **WHEN** onboard runs in a workspace whose root repo holds work-environment config and a nested subfolder is a project repo with a GitHub remote
- **THEN** it detects both, proposes classifying the nested repo as the project and the root as environment, and seeds nothing until the user confirms

#### Scenario: Ambiguous repository is asked about
- **WHEN** a discovered repo has no clear signal (e.g. code but no remote)
- **THEN** onboard asks the user how to classify it rather than guessing

#### Scenario: Detect, don't assume
- **WHEN** the survey completes
- **THEN** onboard presents the detected map plus proposed classification and proceeds only on the user's confirmation

#### Scenario: Existing governance is enumerated
- **WHEN** a surveyed repository carries hooks, a permissions block, skills, or a provenance registry
- **THEN** the survey lists each with its location, so the coexistence assessment starts from facts

### Requirement: Anchor the eunomai layer at each project root

The onboard skill SHALL seed the eunomai layer (a lean `AGENTS.md`, `openspec/`, `docs/`, the permissions
baseline, and the guard settings) at each confirmed **project root**, and SHALL NOT seed it at the workspace
root by default. A repository classified as environment SHALL receive at most a minimal delegating
`AGENTS.md`, and only with the user's consent.

#### Scenario: Seed at the project subfolder
- **WHEN** the user confirms a nested subfolder as the project root
- **THEN** onboard anchors `openspec/`, `docs/`, and `AGENTS.md` there, not at the workspace root

#### Scenario: Environment root is not seeded as a project
- **WHEN** the workspace root is classified as environment
- **THEN** onboard does not seed the eunomai layer there, offering at most a minimal delegating `AGENTS.md` with consent

### Requirement: Declare boundaries via hierarchical AGENTS.md

Each onboarded project's `AGENTS.md` SHALL declare its own boundary and key paths (the `openspec/` and `docs/`
locations and what is tracked) so that config and agents operate within that project. Any workspace-root
`AGENTS.md` SHALL only delegate — pointing at the project directories and marking the root as environment —
and SHALL carry no per-project conventions. No new manifest file SHALL be introduced; scope SHALL be expressed
through Claude Code's native hierarchical `AGENTS.md` discovery.

#### Scenario: Project declares its own boundary
- **WHEN** onboard seeds a project root
- **THEN** that project's `AGENTS.md` states its boundary and the `openspec/`/`docs/` paths it owns

#### Scenario: Workspace root only delegates
- **WHEN** onboard writes a workspace-root `AGENTS.md`
- **THEN** it only points to the project directories and marks the root as environment, with no per-project conventions

### Requirement: Seed a self-sufficient activator block in AGENTS.md

When seeding a project root, the onboard skill SHALL write into the project's `AGENTS.md` a natural-language
**activator block** that states eunomai's base disciplines at the level of **principle** (spec-first change,
honest docs, vetting third-party skills/tools before adoption, secure-by-default, deliberate dependency
changes, pausing on irreversible/sensitive actions). The block SHALL name the relevant skills only as
**accelerators** (parenthetically), never as prerequisites, and SHALL honour three invariants: it SHALL remain
meaningful if the skills are absent (**self-sufficient**), SHALL reference capabilities rather than the eunomai
brand/framework (**capabilities, not brand**), and SHALL state the principle rather than the procedure
(**activate, don't duplicate**). The canonical block SHALL be carried **inside the onboard skill itself** (so
it resolves in installed-plugin mode); `docs/onboard.md` links to it rather than holding a second copy.
onboard SHALL adapt the canonical block to the project rather than copying it verbatim, and SHALL add no new
check.

#### Scenario: The seeded CLAUDE.md carries the activator block
- **WHEN** onboard seeds a project root that keeps its instructions in `CLAUDE.md` (migration declined)
- **THEN** that `CLAUDE.md` contains the activator block stating the base disciplines as principles

#### Scenario: The seeded AGENTS.md carries the activator block
- **WHEN** onboard seeds a confirmed project root
- **THEN** the project's `AGENTS.md` contains the activator block stating the base disciplines as principles

#### Scenario: Self-sufficient — survives skill removal
- **WHEN** the eunomai skills are not installed in a collaborator's environment
- **THEN** each principle in the block still reads as actionable guidance on its own, with the skill mention as an optional accelerator

#### Scenario: Capabilities, not brand
- **WHEN** the block references how a discipline is automated
- **THEN** it names the capability/skill and never names the "eunomai" framework

#### Scenario: Activate, don't duplicate
- **WHEN** a discipline is also covered in depth by a skill
- **THEN** the block states the principle and defers the procedure to that skill, rather than restating it

#### Scenario: Adapted, not copied
- **WHEN** onboard writes the block for a specific project
- **THEN** it adapts the canonical block to that project's stack and conventions rather than pasting it verbatim

#### Scenario: Canonical block resolves when installed as a plugin
- **WHEN** onboard runs from the installed plugin (not a repo clone)
- **THEN** the canonical block is available from the skill's own content without needing a repo-relative path

### Requirement: Coexistence assessment before seeding

After the analyze step and before establishing docs or seeding conventions, the onboard skill SHALL run a
**coexistence assessment** per confirmed project root: classify each surface — `AGENTS.md` · docs standard ·
SDD process · permissions · hooks · skills — as **absent**, **present-compatible**, or
**present-conflicting**. Absent surfaces are seeded normally; present-compatible surfaces are left in place
and referenced; present-conflicting surfaces SHALL go through the structured interview with **"adapt to what
exists" as the recommended default**. The assessment SHALL follow the coexistence contract and SHALL NOT be
skipped when the survey reports any existing governance.

#### Scenario: Project already has a docs standard
- **WHEN** the target project's docs are governed by an existing standard or toolchain (e.g. a static-site
  source tree with its own frontmatter schema)
- **THEN** onboard classifies docs as present-conflicting, asks the author whether to adapt to the incumbent
  standard or migrate, and recommends adapting

#### Scenario: Project already runs another SDD process
- **WHEN** the target project has an established change/spec process that is not OpenSpec
- **THEN** onboard does not seed `openspec/`, records the incumbent process as the project's SDD in
  `AGENTS.md`, and offers OpenSpec only as an opt-in

#### Scenario: Nothing exists
- **WHEN** all six surfaces are absent
- **THEN** onboard proceeds with the full default seed (OpenSpec as the default SDD engine)
