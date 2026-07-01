# base-skills Specification

## Purpose
Define the tiny, standards-anchored set of skills eunomai ships in its base — today `eunomai-secure-coding`
(OWASP Top 10 + CWE) and `eunomai-dependency-upgrade` (OWASP A03:2025 + SLSA) — and the admission filter that
keeps it small: a skill is base-eligible only if universal, non-prescriptive, standards-anchored, and
low-maintenance. These base skills are authored in-repo and audited like any other.
## Requirements
### Requirement: Base-skill admission filter

A skill SHALL ship in eunomai's base only if it is **universal** (no professional disputes it),
**non-prescriptive** (it does not impose a code style, framework, or team/company policy), **anchored to a
recognized standard**, and **low-maintenance**. Skills that fail the filter SHALL NOT ship in the base — they
are brought per-project via `skill-finder` and the project's rules.

#### Scenario: An opinionated or domain-specific candidate is excluded
- **WHEN** a candidate base skill encodes an opinionated practice (style, testing *how*, framework) or a
  domain-only concern (e.g. accessibility, i18n)
- **THEN** it is excluded from the base and routed to `skill-finder` + project rules

#### Scenario: A universal, standards-anchored candidate qualifies
- **WHEN** a candidate is universal, non-prescriptive, and cites a recognized standard
- **THEN** it may ship in the base

### Requirement: Secure-coding base skill

The plugin SHALL provide an **`eunomai-secure-coding`** skill: actionable directives spanning the **OWASP Top
10** (and CWE Top 25), each citing its standard, covering at least injection, broken access control,
cryptographic failures, secrets, **insecure design / threat modeling**, security misconfiguration, vulnerable
components, authentication failures, software & data integrity, and security logging. It SHALL be **proactive
writing-time guidance** that defers diff-level audit to Claude Code's native `/security-review` and complements
`safe-controls` (the runtime plane), not duplicating either.

#### Scenario: Untrusted input handling
- **WHEN** code assembles a query, command, or markup from untrusted input
- **THEN** the skill directs to parameterized / context-escaped APIs and cites the standard (OWASP A03 / CWE-89·78·79)

#### Scenario: Defers the audit, does not reinvent it
- **WHEN** a diff-level security audit is wanted
- **THEN** the skill points to Claude Code's `/security-review` rather than reimplementing a reviewer

### Requirement: Dependency-upgrade base skill

The plugin SHALL provide an **`eunomai-dependency-upgrade`** skill encoding add/upgrade hygiene: pin via a
lockfile, **scan for known CVEs (SCA) before merging**, read the changelog, take breaking changes one major at
a time, run the full test suite, watch transitive dependencies, and **track dependency licenses**. It SHALL
cite its standards (OWASP A03:2025 Software-Supply-Chain · SLSA).

#### Scenario: Adding or upgrading a dependency
- **WHEN** a dependency is added or upgraded
- **THEN** the skill directs to scan for known CVEs and read the changelog before merging, and to run the tests

#### Scenario: License is tracked
- **WHEN** a dependency carries a license
- **THEN** the skill directs to record and respect it

### Requirement: Base skills are authored and audited

The base skills SHALL be eunomai-authored and recorded in the skills audit registry (`origin: authored`).

#### Scenario: Covered by the registry
- **WHEN** `provenance-check` runs on this repository
- **THEN** each base skill appears in the audit registry with `origin: authored`

### Requirement: Base skills capture the decisions they force

Each base skill SHALL end with a lightweight **capture step** for the non-obvious decisions its own flow
produces: `eunomai-secure-coding` suggests recording a non-obvious trust-boundary decision; and
`eunomai-dependency-upgrade` records a decision to ship with a known CVE as a waiver (CVE id, rationale,
revisit date). Capture SHALL point at the homes the project already has (an ADR or the location the
project's rules designate) — no new file format, no enforcement, suggestion-level only (universal ·
non-prescriptive · low-maintenance, per the admission filter).

#### Scenario: A CVE waiver is recorded
- **WHEN** the author decides to ship despite a known CVE after the exploitability check
- **THEN** the skill directs recording the waiver (id, rationale, revisit date) where the project keeps
  decisions

#### Scenario: A non-obvious trust boundary is suggested for capture
- **WHEN** the threat-model step settles a non-obvious trust-boundary decision
- **THEN** the skill suggests capturing it as an ADR or docs note, and does not block if declined

