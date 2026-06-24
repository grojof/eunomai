## ADDED Requirements

### Requirement: Analyze project and gather author input

The onboard skill SHALL begin by surveying the project (stack, existing docs, skills, conventions) and
gathering the author's input (purpose, domain, audience) before making any changes.

#### Scenario: Survey before changing
- **WHEN** onboard is invoked on a project
- **THEN** it surveys existing docs/skills/conventions and gathers the author's intent before changing anything

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

The onboard skill SHALL seed the project's conventions by **adapting** templates — a lean `AGENTS.md`, an
`openspec/config.yaml` layer, the permissions baseline, and the hooks wiring (`.claude/settings.json`) — to
the project, not dropping them verbatim.

#### Scenario: Seed authoring + SDD config
- **WHEN** onboard seeds scaffolding
- **THEN** it writes a lean `AGENTS.md` and an `openspec/config.yaml` adapted to the project

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
