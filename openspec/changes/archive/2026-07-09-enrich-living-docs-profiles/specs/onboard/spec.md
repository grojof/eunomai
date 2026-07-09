# onboard — delta

## ADDED Requirements

### Requirement: Establishing docs offers a doc-set profile

When the onboard skill establishes a project's docs, it SHALL offer the **doc-set profile** choice the same
way `eunomai-living-docs` does — recommending a default inferred from the analyze step's signals (manifests,
cartographer output), showing the previews, and always including the **custom** option — by **delegating to
the living-docs profile catalog**; onboard SHALL NOT carry its own copy of the catalog. The choice SHALL be
skippable and subject to the coexistence assessment (an incumbent docs standard stands the profiles down). A
non-trivial profile decision MAY crystallize into an ADR via the existing interview-byproduct mechanism.

#### Scenario: Onboard recommends a profile from analysis
- **WHEN** onboard establishes docs for a confirmed project root whose analysis identifies its destination
- **THEN** it recommends the matching profile from the living-docs catalog as the default and proceeds only on
  the author's choice

#### Scenario: Onboard delegates the catalog
- **WHEN** onboard needs the profile previews
- **THEN** it reads them from the living-docs skill's canonical catalog rather than a duplicated copy

#### Scenario: The profile decision becomes an ADR
- **WHEN** the author settles a non-obvious profile choice (e.g. custom over a near-fit named profile)
- **THEN** onboard records the decision as an ADR under `docs/decisions/` like other non-trivial interview
  outcomes
