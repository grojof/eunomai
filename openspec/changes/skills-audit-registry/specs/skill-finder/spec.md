## ADDED Requirements

### Requirement: Consolidated skills-audit registry

The finder SHALL record provenance in a **single** `eunomai-skills-audit.md` at the skills root —
`.claude/skills/` in a consumer project, `skills/` in the eunomai plugin — NOT in per-skill sidecars. Skill
folders SHALL contain only the skill's own files. The registry SHALL list, per skill: `name`, `origin`, `ref`
(a real commit SHA / version, or `authored`), `verdict`, `rubric`, and `gaps`; plus a short run narrative.

#### Scenario: Adoption writes a registry entry, not a sidecar
- **WHEN** a skill is adopted or created
- **THEN** its entry is written/updated in `eunomai-skills-audit.md`, and **no** `PROVENANCE.md` is added to
  the skill folder

#### Scenario: Vendored skills record the real SHA, gaps are honest
- **WHEN** a skill is vendored from a repository
- **THEN** the entry records the actual commit SHA; if a SHA is genuinely unavailable, `ref` is `unpinned` and
  `gaps` includes `unpinned` — never a rationalized "veto OK"

## MODIFIED Requirements

### Requirement: On-demand audit of existing skills

The finder SHALL, when asked, audit existing or named candidate skills against the gate, scoped to what is
requested, and write or update their entries in the **`eunomai-skills-audit.md` registry**. It SHALL NOT run
as a background or continuous process.

#### Scenario: Auditing a skill with no registry entry
- **WHEN** the finder is asked to audit a skill that is not yet in the registry
- **THEN** it evaluates the skill against the gate and adds its entry (with the real ref or an honest gap)

#### Scenario: Audit stays scoped
- **WHEN** the finder is asked to audit a specific skill
- **THEN** it limits its work to that request and does not start a project-wide background sweep

### Requirement: provenance-check (read-only)

The plugin SHALL provide a read-only `provenance-check` that scans the skill roots (`.claude/skills/` **and**
`skills/`), verifies the `eunomai-skills-audit.md` registry **covers every skill** found, and validates each
entry's required fields. It SHALL exit non-zero on any uncovered or invalid skill, **report** any trust gaps
(e.g. `unpinned` / placeholder refs) it finds, make no changes, and run as part of the gate.

#### Scenario: A skill under .claude/skills is not covered
- **WHEN** a skill exists under `.claude/skills/` (or `skills/`) with no entry in the registry
- **THEN** the check reports the uncovered skill and exits non-zero

#### Scenario: An entry is invalid
- **WHEN** a registry entry is missing a required field
- **THEN** the check reports it and exits non-zero

#### Scenario: Covered, with gaps surfaced
- **WHEN** every skill is covered but some entries carry gaps (e.g. `unpinned`)
- **THEN** the check lists those gaps for action and (absent uncovered/invalid skills) exits zero, writing nothing

### Requirement: eunomai dogfoods provenance

eunomai's own skills SHALL be covered by a single `skills/eunomai-skills-audit.md` registry (origin
`authored`), and `provenance-check` SHALL pass on this repository as part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** `provenance-check` runs against this repository
- **THEN** it exits zero with every `skills/` entry covered by the registry

## REMOVED Requirements

### Requirement: Per-skill provenance record

**Reason**: Per-skill `PROVENANCE.md` sidecars clutter every skill folder (and pollute third-party skills),
and the prior check missed `.claude/skills/` entirely. Replaced by the consolidated audit registry.

**Migration**: Move each sidecar's fields into the `eunomai-skills-audit.md` registry at the skills root, then
delete the `PROVENANCE.md` sidecars.
