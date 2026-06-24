## MODIFIED Requirements

### Requirement: Project-docs structure standard

The root `README.md` SHALL be a lean front door — a short project summary plus an index of links into deeper
documentation. Detailed project documentation SHALL live under `docs/`, **organized by Diátaxis type**:
`guides/` (how-to, including getting-started), `reference/` (technical facts — one page per capability),
`explanation/` (the why / concepts), and `decisions/` (ADRs). Every in-scope page SHALL be reachable from the
README index, and the README SHALL NOT inline long-form content that belongs in a `docs/` page.

#### Scenario: A reader opens the README
- **WHEN** a reader opens `README.md`
- **THEN** they get a concise summary of the project and a navigable index of links to the `docs/` pages

#### Scenario: A new page is placed by type
- **WHEN** new long-form documentation is authored
- **THEN** it goes under the matching Diátaxis folder (`guides/`, `reference/`, or `explanation/`) and is linked from the README index, not inlined

### Requirement: Dev-docs excluded from scope

The standard and the integrity check SHALL treat dev-docs as out of scope: pages under `docs/decisions/`
(ADRs) SHALL NOT be required to appear in the README index.

#### Scenario: A dev-doc is not indexed
- **WHEN** an ADR exists under `docs/decisions/` and is not linked from the README
- **THEN** the integrity check does not flag it
