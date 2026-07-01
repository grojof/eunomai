# skill-finder Specification (delta)

## ADDED Requirements

### Requirement: Org-trusted sources are an input to the gate

The finder SHALL consult the project's rules (per the coexistence contract's definition) for **org-trusted
sources** before gating a candidate. A candidate from an org-trusted source still passes through the gate,
but the org's trust is weighed as provenance context (e.g. an internal marketplace or repository identifier
is an acceptable `origin`), and the registry entry SHALL record that the org trust was relied on. Org trust
SHALL NOT silently pre-clear a candidate past the security veto.

#### Scenario: Candidate from an org-trusted source
- **WHEN** a candidate comes from a source the project's rules declare trusted
- **THEN** the finder records the org trust in the entry's rubric and still checks for dangerous behavior

#### Scenario: Org trust does not bypass the veto
- **WHEN** an org-trusted candidate exhibits dangerous behavior
- **THEN** the finder rejects it and reports the conflict to the author

### Requirement: Audit verdicts for already-installed skills

When auditing skills that are **already installed**, the finder SHALL use an audit verdict vocabulary —
**keep**, **keep-with-gaps** (recorded in `gaps`), or **flag-for-removal** — instead of the acquisition
verdicts. Removal SHALL be the human's decision; the finder only flags and explains.

#### Scenario: Installed skill fails the gate
- **WHEN** an audit finds an installed skill with a veto-level problem
- **THEN** the verdict is flag-for-removal with the reason, and the finder does not delete it

#### Scenario: Installed skill passes with gaps
- **WHEN** an installed skill passes the veto but has an unpinned ref or thin provenance
- **THEN** the verdict is keep-with-gaps and the gaps are listed honestly in the registry

### Requirement: Human confirmation before vendoring

The finder SHALL present its verdict and rubric and obtain the author's confirmation **before** vendoring
third-party skill content into the project. Adoption without a human yes SHALL NOT happen.

#### Scenario: Adoption is confirmed
- **WHEN** the gate yields an adopt / adopt-and-improve verdict
- **THEN** the finder shows the verdict + rubric and vendors the skill only after the author confirms

### Requirement: Plugin-delivered skills are a stated coverage boundary

Audit reports and the registry narrative SHALL state honestly that skills delivered by **installed plugins**
are outside the registry's scope — they are trusted at the plugin/marketplace level, not scanned by
`provenance-check`. The finder SHALL NOT claim audit coverage over them.

#### Scenario: Audit report names the boundary
- **WHEN** the finder completes an audit in a project that has plugin-delivered skills
- **THEN** the report notes those skills are covered by plugin/marketplace trust, not by the registry
