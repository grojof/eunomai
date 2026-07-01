# base-skills Specification (delta)

## ADDED Requirements

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
