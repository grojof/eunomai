# skill-finder Specification (delta)

## ADDED Requirements

### Requirement: Rejected candidates leave a durable trace

The registry's run narrative SHALL record, for candidates that were evaluated and not adopted, the
**rejection rationale** and any **ideas harvested** from them (historical-domain knowledge). When a
candidate proves to be *knowledge* rather than *procedure* — good ideas, not a runnable skill — the finder
SHALL route it toward the docs substrate (a docs note or ADR suggestion) instead of forcing a skill.

#### Scenario: A rejection is recorded with its why
- **WHEN** a candidate is evaluated and rejected or passed over
- **THEN** the registry narrative records what was evaluated, why it was not adopted, and any harvested ideas

#### Scenario: Knowledge routes to docs, not to a forced skill
- **WHEN** a candidate's value is conceptual (ideas worth keeping) rather than procedural
- **THEN** the finder suggests capturing the ideas in the docs substrate and does not author a skill for them
