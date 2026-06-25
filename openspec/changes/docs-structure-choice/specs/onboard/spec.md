## ADDED Requirements

### Requirement: Propose the docs structure when establishing docs

When the onboard skill establishes a project's docs, it SHALL propose the folder structure the same way
`eunomai-living-docs` does — **2–3 options** with trade-offs and a **recommended default** by the project's
size/shape — and proceed only on the user's choice (infer-then-confirm, skippable). It SHALL NOT assume a
layout, and SHALL NOT organize folders by Diátaxis type (the mode lives in `type`).

#### Scenario: Establishing docs proposes a structure
- **WHEN** onboard establishes docs for a confirmed project root
- **THEN** it proposes 2–3 structure options with a recommended default and seeds the layout the user chooses

#### Scenario: Onboard does not impose content-type folders
- **WHEN** onboard creates the docs layout
- **THEN** it does not create `guides/`/`reference/`/`explanation/` by Diátaxis type; the mode is carried by each page's `type` field
