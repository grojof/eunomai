## ADDED Requirements

### Requirement: Propose the docs structure, never assume it

When the `eunomai-living-docs` skill establishes or refreshes a project's docs, it SHALL NOT silently assume a
folder layout. It SHALL **propose 2–3 structure options** with trade-offs and a **recommended default** chosen
by the project's size/shape (e.g. flat `docs/*.md` while small; by-surface `docs/<surface>/` once a surface has
~3+ pages; or a hybrid), and SHALL proceed only on the user's choice — human-in-control and skippable. Folders
SHALL **never** be organized by Diátaxis type (the mode lives in the `type` frontmatter field); if the skill
detects content-type folders (`guides/`/`reference/`/`explanation/`), it SHALL flag them as an anti-pattern and
propose migrating. The deterministic `docs-check` gate SHALL remain shape-only and SHALL NOT judge structure.

#### Scenario: Structure is proposed, not assumed
- **WHEN** living-docs (re)structures a project's docs
- **THEN** it presents 2–3 folder-structure options with a recommended default and proceeds only on the user's choice

#### Scenario: Content-type folders are flagged as an anti-pattern
- **WHEN** the docs are organized into `guides/`/`reference/`/`explanation/` (by Diátaxis type)
- **THEN** living-docs flags this as an anti-pattern and proposes migrating (flatten, or re-nest by surface), since the mode belongs in the `type` field

#### Scenario: The gate does not judge structure
- **WHEN** `docs-check` runs
- **THEN** it validates frontmatter shape and links only, and never fails a project for its folder structure
