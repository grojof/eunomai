# onboard Specification (delta)

## ADDED Requirements

### Requirement: From-scratch interviews are scaffolded by the six knowledge domains

When creating docs from scratch, the onboard skill SHALL scaffold the structured interview by the six KDD
knowledge domains — business, product, technical, operational, historical, AI-ready — so coverage is a
property of creation, not later repair. The scaffold is for the interviewer: domains answerable from the
codebase SHALL be explored, not asked (explore-first), the interview remains one-question-at-a-time and
skippable, and no domain questionnaire form SHALL be introduced.

#### Scenario: Domain coverage by construction
- **WHEN** onboard creates docs from scratch via the interview
- **THEN** the interview walks the six domains, skipping those the codebase already answers, and the
  resulting docs cover the domains the author confirmed as relevant

#### Scenario: Still an interview, not a form
- **WHEN** the domain scaffold is applied
- **THEN** questions remain one at a time with recommended defaults, and the author can skip any domain

### Requirement: The cartographer reports domain signals

The codebase-cartographer's comprehension map SHALL include a **domain signals** section — artifacts already
encountered during the walk, listed per KDD domain (e.g. CI/CD configs, IaC, Dockerfiles → operational;
ADR directories, CHANGELOG → historical; README claims, glossary → business/product), each tagged with the
map's confidence taxonomy. Signals are **observed, not assessed**: the agent SHALL NOT judge coverage or
recommend action — the calling skill's lens does.

#### Scenario: Operational evidence is surfaced
- **WHEN** the cartographer encounters CI configuration or Dockerfiles during its walk
- **THEN** the map lists them as operational-domain signals with a confidence tag, without any assessment
