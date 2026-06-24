# skill-finder Specification

## Purpose
TBD - created by archiving change skill-finder. Update Purpose after archive.
## Requirements
### Requirement: Trust gate — security/provenance veto

The finder SHALL reject (not adopt) any candidate skill that fails the security/provenance veto: its
`SKILL.md` or bundled scripts exhibit dangerous behavior (remote code execution, data exfiltration, secret
access, obfuscation), or it has no pinnable origin (no version/SHA and it cannot be validated). The veto is
the single hard bar; everything else is judgment.

#### Scenario: A candidate runs untrusted remote code
- **WHEN** a candidate's bundled script fetches and executes remote code (e.g. `curl … | bash`) or reads
  credentials
- **THEN** the finder rejects it without adopting and explains the red flag

#### Scenario: A candidate cannot be pinned
- **WHEN** a candidate has no version/SHA and does not pass validation
- **THEN** the finder rejects it as unpinnable

#### Scenario: A candidate passes the veto
- **WHEN** a candidate has a pinnable origin and no dangerous behavior
- **THEN** it proceeds to the weighed judgment

### Requirement: Trust gate — weighed judgment and verdict

For candidates that pass the veto, the finder SHALL weigh authorship, usage, and quality (quality MAY be
measured with skill-creator's eval/benchmark) and produce exactly one verdict: **adopt**,
**adopt-and-improve**, or **create**.

#### Scenario: Strong, trustworthy fit
- **WHEN** a candidate passes the veto and is a strong, well-authored fit
- **THEN** the verdict is adopt

#### Scenario: Weak or ill-fitting candidate
- **WHEN** a candidate passes the veto but is poor, thin, or a weak fit
- **THEN** the verdict is adopt-and-improve or create

#### Scenario: No trustworthy candidate
- **WHEN** no candidate passes the gate as a usable fit
- **THEN** the verdict is create

### Requirement: Acquire via skill-creator with a fit pass

When creating or improving a skill, the finder SHALL delegate authoring to Anthropic's **skill-creator**,
supplying the project's conventions and the criteria provided by the user/org, and SHALL NOT reimplement skill
authoring. On every adopt or create, it SHALL run a fit pass that adapts the skill (at least its
description/triggers and scope) to the project.

#### Scenario: Creating a new skill
- **WHEN** the verdict is create
- **THEN** the finder invokes skill-creator with the project context and criteria and produces a tailored skill

#### Scenario: Fit pass on adoption
- **WHEN** a skill is adopted
- **THEN** the finder runs a fit pass adapting it to the project's conventions before it is considered done

### Requirement: On-demand audit of existing skills

The finder SHALL, when asked, audit existing or named candidate skills against the gate, scoped to what is
requested, and generate or update their provenance record. It SHALL NOT run as a background or continuous
process.

#### Scenario: Auditing a skill with no provenance
- **WHEN** the finder is asked to audit a skill that lacks a provenance record
- **THEN** it evaluates the skill against the gate and generates a provenance record

#### Scenario: Audit stays scoped
- **WHEN** the finder is asked to audit a specific skill
- **THEN** it limits its work to that request and does not start a project-wide background sweep

### Requirement: Per-skill provenance record

Every skill under `skills/` SHALL have a provenance record (a sidecar in the skill directory) capturing at
least: origin, version/SHA (or `authored`), date, verdict, and rubric notes. eunomai's own authored skills
SHALL use origin `authored`.

#### Scenario: Record written on adoption or creation
- **WHEN** a skill is adopted or created
- **THEN** a provenance record with the required fields is written alongside it

#### Scenario: Authored skills are uniform
- **WHEN** the skill is one of eunomai's own authored skills
- **THEN** its provenance record uses origin `authored`

### Requirement: provenance-check (read-only)

The plugin SHALL provide a read-only `provenance-check` that verifies every skill under `skills/` has a
provenance record with the required fields. It SHALL exit non-zero on any missing or invalid record, make no
changes, and run as part of the gate.

#### Scenario: A skill is missing provenance
- **WHEN** a skill under `skills/` has no provenance record
- **THEN** the check reports it and exits non-zero

#### Scenario: A record is incomplete
- **WHEN** a provenance record is missing a required field
- **THEN** the check reports it and exits non-zero

#### Scenario: All skills covered
- **WHEN** every skill under `skills/` has a valid provenance record
- **THEN** the check exits zero and writes nothing

### Requirement: eunomai dogfoods provenance

eunomai's own skills SHALL carry provenance records, and `provenance-check` SHALL pass on this repository as
part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** `provenance-check` runs against this repository
- **THEN** it exits zero

