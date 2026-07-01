# onboard Specification (delta)

## ADDED Requirements

### Requirement: Coexistence assessment before seeding

After the analyze step and before establishing docs or seeding conventions, the onboard skill SHALL run a
**coexistence assessment** per confirmed project root: classify each surface — `CLAUDE.md` · docs standard ·
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
  `CLAUDE.md`, and offers OpenSpec only as an opt-in

#### Scenario: Nothing exists
- **WHEN** all six surfaces are absent
- **THEN** onboard proceeds with the full default seed (OpenSpec as the default SDD engine)

## MODIFIED Requirements

### Requirement: Seed eunomai conventions

The onboard skill SHALL seed the project's conventions by **adapting** templates — a lean `CLAUDE.md`, an
`openspec/config.yaml` layer, the permissions baseline, and the hooks wiring (`.claude/settings.json`) — to
the project, not dropping them verbatim. Each seed SHALL be **individually skippable** based on the
coexistence assessment: OpenSpec is seeded as the default SDD engine **only where no SDD process exists**;
the permissions baseline and hooks wiring are offered, not imposed, where governance already exists. An
existing `CLAUDE.md` SHALL be **merged into** — the activator block appended under its own heading, existing
content preserved — never replaced.

#### Scenario: Seed authoring + SDD config
- **WHEN** onboard seeds scaffolding on a project with no SDD process
- **THEN** it writes a lean `CLAUDE.md` and an `openspec/config.yaml` adapted to the project

#### Scenario: Seed safe controls
- **WHEN** onboard seeds safe-controls on a project with no existing hooks/permissions governance
- **THEN** it adds the permissions baseline and wires the hooks via `.claude/settings.json`

#### Scenario: Existing CLAUDE.md is merged, not replaced
- **WHEN** the project already has a `CLAUDE.md` with its own rules
- **THEN** onboard appends the adapted activator block under its own heading and changes no existing content
  without the author's explicit choice

#### Scenario: A seed is declined
- **WHEN** the author declines one seed (e.g. keeps the org's own permissions)
- **THEN** onboard skips that seed, seeds the rest, and records the decision

### Requirement: Survey the workspace and confirm scope before onboarding

The onboard skill SHALL, before analyzing or changing any project, perform a read-only **workspace survey**
(delegated to a subagent) that discovers all git repositories (the root and any nested) and their remotes and
detects code manifests and existing `CLAUDE.md`/`AGENTS.md`. The survey SHALL also **enumerate existing
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

### Requirement: Seed a self-sufficient activator block in CLAUDE.md

When seeding a project root, the onboard skill SHALL write into the project's `CLAUDE.md` a natural-language
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
- **WHEN** onboard seeds a confirmed project root
- **THEN** the project's `CLAUDE.md` contains the activator block stating the base disciplines as principles

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

## REMOVED Requirements

### Requirement: onboard carries provenance
**Reason**: Superseded by the consolidated skills-audit registry (skill-finder: "Consolidated skills-audit
registry" and "eunomai dogfoods provenance") — per-skill `PROVENANCE.md` sidecars were explicitly dropped;
this requirement predates that decision and contradicts it.
**Migration**: None needed — `skills/eunomai-skills-audit.md` already covers `eunomai-onboard` and
`provenance-check` passes on this repository.
