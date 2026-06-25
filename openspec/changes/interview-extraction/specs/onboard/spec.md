## ADDED Requirements

### Requirement: Gather input and resolve scope via a structured interview

The onboard skill SHALL gather the author's input and resolve ambiguous scope through a **structured
interview**: it SHALL ask **one question at a time**, **recommend a default** answer for each question, and
**explore the codebase first** when a question is answerable from code rather than asking it. The interview
SHALL remain human-in-control and skippable, and SHALL NOT interrogate field-by-field when a single
confirmation suffices.

#### Scenario: One question at a time
- **WHEN** onboard needs several pieces of input from the author
- **THEN** it asks them one at a time, not as a single batch

#### Scenario: Recommend a default
- **WHEN** onboard asks the author a question
- **THEN** it offers a recommended default answer so the author can confirm rather than author from scratch

#### Scenario: Explore before asking
- **WHEN** a question's answer is detectable from the codebase (stack, structure, conventions)
- **THEN** onboard explores the codebase to answer it instead of asking the author

### Requirement: Creating docs from scratch produces decision and glossary artifacts

When the onboard skill creates docs from scratch, the interview SHALL produce byproduct artifacts consistent
with the living-docs standard: **decisions/ADRs** for the choices made and a **glossary** as an explanation
page for the domain language.

#### Scenario: A decision becomes an ADR
- **WHEN** the interview settles a non-trivial choice while creating docs from scratch
- **THEN** onboard records it as an ADR under `docs/decisions/`

#### Scenario: Domain language becomes a glossary page
- **WHEN** the interview surfaces the project's domain vocabulary
- **THEN** onboard captures it as a glossary explanation page indexed in the README
