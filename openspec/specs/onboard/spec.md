# onboard Specification

## Purpose
Define eunomai's connector/bootstrap axis: the one-shot `eunomai-onboard` orchestrator that applies eunomai to
a new or existing project — survey the workspace and confirm scope, analyze and interview per confirmed project
root, establish living-docs, seed conventions, audit skills via skill-finder, drive the checks green, then hand
off. It anchors per project root (never the workspace root by default), gathers input through a structured
interview, and orchestrates the pillars without reimplementing them (establish, don't maintain).
## Requirements
### Requirement: Analyze project and gather author input

The onboard skill SHALL, **for each confirmed project root**, survey that project (stack, existing docs,
skills, conventions) and gather the author's input (purpose, domain, audience) before making any changes to it.

#### Scenario: Survey before changing
- **WHEN** onboard begins work on a confirmed project root
- **THEN** it surveys that project's existing docs/skills/conventions and gathers the author's intent before changing anything

### Requirement: Establish docs to the living-docs standard

The onboard skill SHALL establish project docs to the living-docs standard — restructure existing docs into a
lean README index + `docs/` topic pages, or create them from scratch with the author's input when none exist.
After onboarding, `docs-check` SHALL pass on the project.

#### Scenario: Restructure existing docs
- **WHEN** the project has scattered or long-form docs
- **THEN** onboard restructures them into a lean README index plus `docs/` topic pages

#### Scenario: Create docs from scratch
- **WHEN** the project has no docs
- **THEN** onboard creates a lean README and `docs/` pages from the analysis and the author's input

#### Scenario: Docs check passes after onboarding
- **WHEN** onboarding completes
- **THEN** `docs-check` passes on the project

### Requirement: Seed eunomai conventions

The onboard skill SHALL seed the project's conventions by **adapting** templates — a lean `CLAUDE.md`, an
`openspec/config.yaml` layer, the permissions baseline, and the hooks wiring (`.claude/settings.json`) — to
the project, not dropping them verbatim.

#### Scenario: Seed authoring + SDD config
- **WHEN** onboard seeds scaffolding
- **THEN** it writes a lean `CLAUDE.md` and an `openspec/config.yaml` adapted to the project

#### Scenario: Seed safe controls
- **WHEN** onboard seeds safe-controls
- **THEN** it adds the permissions baseline and wires the hooks via `.claude/settings.json`

### Requirement: Audit existing skills via skill-finder

The onboard skill SHALL invoke `eunomai-skill-finder` in audit mode over the project's existing skills rather
than auditing them itself. After onboarding, `provenance-check` SHALL pass on the project.

#### Scenario: Delegate the skill audit
- **WHEN** the project has existing skills
- **THEN** onboard invokes skill-finder to audit them and record provenance

#### Scenario: Provenance check passes after onboarding
- **WHEN** onboarding completes
- **THEN** `provenance-check` passes on the project

### Requirement: Orchestrate, do not reimplement

The onboard skill SHALL delegate to the existing pillars (living-docs, skill-finder, the safe-controls
hooks/permissions, OpenSpec) and SHALL NOT reimplement their behavior.

#### Scenario: Delegation over duplication
- **WHEN** onboard needs a doc refresh or a skill audit
- **THEN** it delegates to the living-docs / skill-finder skills rather than duplicating their logic

### Requirement: One-shot, dispensable hand-off

The onboard skill SHALL be a one-shot bootstrap: after seeding and driving the existing checks green, it hands
off to the steady-state pillars and SHALL NOT run as a continuous or cross-project process. Removing eunomai
SHALL leave a working project — everything it seeds lives in the generated output (zero lock-in).

#### Scenario: Hand off, no background process
- **WHEN** onboarding completes
- **THEN** onboard hands off to the steady-state skills and does not start a continuous/background process

#### Scenario: Dispensable
- **WHEN** eunomai is later removed from the project
- **THEN** the seeded files remain and the project still works

### Requirement: onboard carries provenance

The `eunomai-onboard` skill SHALL carry a `PROVENANCE.md` (`origin: authored`) so `provenance-check` passes on
this repository.

#### Scenario: Provenance present on this repo
- **WHEN** `provenance-check` runs on this repository
- **THEN** it exits zero with `eunomai-onboard` included

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

The onboard skill SHALL seed the eunomai layer (a lean `CLAUDE.md`, `openspec/`, `docs/`, the permissions
baseline, and the hooks wiring) at each confirmed **project root**, and SHALL NOT seed it at the workspace
root by default. A repository classified as environment SHALL receive at most a minimal delegating
`CLAUDE.md`, and only with the user's consent.

#### Scenario: Seed at the project subfolder
- **WHEN** the user confirms a nested subfolder as the project root
- **THEN** onboard anchors `openspec/`, `docs/`, and `CLAUDE.md` there, not at the workspace root

#### Scenario: Environment root is not seeded as a project
- **WHEN** the workspace root is classified as environment
- **THEN** onboard does not seed the eunomai layer there, offering at most a minimal delegating `CLAUDE.md` with consent

### Requirement: Declare boundaries via hierarchical CLAUDE.md

Each onboarded project's `CLAUDE.md` SHALL declare its own boundary and key paths (the `openspec/` and `docs/`
locations and what is tracked) so that config and agents operate within that project. Any workspace-root
`CLAUDE.md` SHALL only delegate — pointing at the project directories and marking the root as environment —
and SHALL carry no per-project conventions. No new manifest file SHALL be introduced; scope SHALL be expressed
through Claude Code's native hierarchical `CLAUDE.md` discovery.

#### Scenario: Project declares its own boundary
- **WHEN** onboard seeds a project root
- **THEN** that project's `CLAUDE.md` states its boundary and the `openspec/`/`docs/` paths it owns

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

### Requirement: Gather input and resolve scope via a structured interview

The onboard skill SHALL gather the author's input and resolve ambiguous scope through a **structured
interview**: it SHALL ask **one question at a time**, **recommend a default** answer for each question, and
**explore the codebase first** when a question is answerable from code rather than asking it. The interview
SHALL remain human-in-control and skippable, and SHALL NOT interrogate field-by-field when a single
confirmation suffices.

#### Scenario: One question at a time
- **WHEN** onboard needs several pieces of input from the author
- **THEN** it asks them one at a time, not as a single batch

#### Scenario: Recommend a default
- **WHEN** onboard asks the author a question
- **THEN** it offers a recommended default answer so the author can confirm rather than author from scratch

#### Scenario: Explore before asking
- **WHEN** a question's answer is detectable from the codebase (stack, structure, conventions)
- **THEN** onboard explores the codebase to answer it instead of asking the author

### Requirement: Creating docs from scratch produces decision and glossary artifacts

When the onboard skill creates docs from scratch, the interview SHALL produce byproduct artifacts consistent
with the living-docs standard: **decisions/ADRs** for the choices made and a **glossary** as an explanation
page for the domain language.

#### Scenario: A decision becomes an ADR
- **WHEN** the interview settles a non-trivial choice while creating docs from scratch
- **THEN** onboard records it as an ADR under `docs/decisions/`

#### Scenario: Domain language becomes a glossary page
- **WHEN** the interview surfaces the project's domain vocabulary
- **THEN** onboard captures it as a glossary explanation page indexed in the README

### Requirement: Seed a self-sufficient activator block in CLAUDE.md

When seeding a project root, the onboard skill SHALL write into the project's `CLAUDE.md` a natural-language
**activator block** that states eunomai's base disciplines at the level of **principle** (spec-first change,
honest docs, vetting third-party skills/tools before adoption, secure-by-default, deliberate dependency
changes, pausing on irreversible/sensitive actions). The block SHALL name the relevant skills only as
**accelerators** (parenthetically), never as prerequisites, and SHALL honour three invariants: it SHALL remain
meaningful if the skills are absent (**self-sufficient**), SHALL reference capabilities rather than the eunomai
brand/framework (**capabilities, not brand**), and SHALL state the principle rather than the procedure
(**activate, don't duplicate**). onboard SHALL adapt the canonical block to the project rather than copying it
verbatim, and SHALL add no new check.

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

### Requirement: Delegate codebase comprehension and coherence auditing to read-only agents

The onboard skill SHALL be able to delegate the heavy, read-only reading of an unfamiliar project to subagents
rather than doing it inline: a **codebase-cartographer** for comprehension (architecture, entry points, data
flow, stack + versions, a proposed diagram) feeding the analyze step and the "at a glance" README, and, when
normalizing an **existing** project, a **coherence-auditor** for a one-shot report of doc↔code drift and stale
versions. The delegated agents SHALL be **read-only** (they report facts and proposals, never edit or decide),
and the coherence audit SHALL be a **disposable one-shot diagnostic**, never a continuous conformance engine.

#### Scenario: Comprehension is delegated to the cartographer
- **WHEN** onboard analyzes an unfamiliar project root
- **THEN** it may delegate to the read-only codebase-cartographer, which returns an architecture/entry-point/data-flow map and a proposed diagram without editing anything

#### Scenario: Coherence audit on an existing project
- **WHEN** onboard normalizes a project that already has docs
- **THEN** it may delegate a one-shot coherence audit that reports doc↔code drift and stale versions for the human to act on, and SHALL NOT stand up a continuous conformance process

#### Scenario: Delegated agents do not decide
- **WHEN** either agent returns its findings
- **THEN** onboard treats them as facts/proposals the human confirms, and the agents themselves change nothing

### Requirement: Propose the docs structure when establishing docs

When the onboard skill establishes a project's docs, it SHALL propose the folder structure the same way
`eunomai-living-docs` does — **2–3 options** with trade-offs and a **recommended default** by the project's
size/shape — and proceed only on the user's choice (infer-then-confirm, skippable). It SHALL NOT assume a
layout, and SHALL NOT organize folders by Diátaxis type (the mode lives in `type`).

#### Scenario: Establishing docs proposes a structure
- **WHEN** onboard establishes docs for a confirmed project root
- **THEN** it proposes 2–3 structure options with a recommended default and seeds the layout the user chooses

#### Scenario: Onboard does not impose content-type folders
- **WHEN** onboard creates the docs layout
- **THEN** it does not create `guides/`/`reference/`/`explanation/` by Diátaxis type; the mode is carried by each page's `type` field

