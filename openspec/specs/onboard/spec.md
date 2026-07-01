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

### Requirement: From-scratch interviews are scaffolded by the six knowledge domains

When creating docs from scratch, the onboard skill SHALL scaffold the structured interview by the six KDD
knowledge domains — business, product, technical, operational, historical, AI-ready — so coverage is a
property of creation, not later repair. The scaffold is for the interviewer: domains answerable from the
codebase SHALL be explored, not asked (explore-first), the interview remains one-question-at-a-time and
skippable, and no domain questionnaire form SHALL be introduced.

#### Scenario: Domain coverage by construction
- **WHEN** onboard creates docs from scratch via the interview
- **THEN** the interview walks the six domains, skipping those the codebase already answers, and the
  resulting docs cover the domains the author confirmed as relevant

#### Scenario: Still an interview, not a form
- **WHEN** the domain scaffold is applied
- **THEN** questions remain one at a time with recommended defaults, and the author can skip any domain

### Requirement: The cartographer reports domain signals

The codebase-cartographer's comprehension map SHALL include a **domain signals** section — artifacts already
encountered during the walk, listed per KDD domain (e.g. CI/CD configs, IaC, Dockerfiles → operational;
ADR directories, CHANGELOG → historical; README claims, glossary → business/product), each tagged with the
map's confidence taxonomy. Signals are **observed, not assessed**: the agent SHALL NOT judge coverage or
recommend action — the calling skill's lens does.

#### Scenario: Operational evidence is surfaced
- **WHEN** the cartographer encounters CI configuration or Dockerfiles during its walk
- **THEN** the map lists them as operational-domain signals with a confidence tag, without any assessment

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

