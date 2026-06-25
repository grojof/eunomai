## ADDED Requirements

### Requirement: Recover thin or missing docs via the structured interview

The `eunomai-living-docs` skill SHALL, when a project root's docs are thin or missing, use the **structured
interview** technique — one question at a time, recommend a default, explore the codebase first — to recover
the project's knowledge into the docs standard. It SHALL remain human-in-control and SHALL NOT ask what is
already discoverable in the codebase.

#### Scenario: Thin docs are filled by interview
- **WHEN** living-docs is invoked on a project whose docs are missing or skeletal
- **THEN** it recovers the missing knowledge through the structured interview and writes it into the docs standard

#### Scenario: Explore before asking
- **WHEN** a gap can be filled from the codebase (stack, structure, existing conventions)
- **THEN** living-docs explores the codebase to fill it instead of asking the user
