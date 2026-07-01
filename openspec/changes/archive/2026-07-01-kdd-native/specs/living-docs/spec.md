# living-docs Specification (delta)

## ADDED Requirements

### Requirement: The coherence audit surfaces domain-coverage facts

The coherence-auditor's report SHALL include a facts-only **domain-coverage** statement: which of the six
KDD knowledge domains have no documentation coverage found (e.g. "no operational docs, no ADR directory").
It SHALL remain evidence for the living-docs coverage lens — never a score, never a gate rule, and the
judgement about what to do stays with the skill and the author.

#### Scenario: Missing domains are named as facts
- **WHEN** a coherence audit finds no docs touching the operational and historical domains
- **THEN** the report states those domains had no coverage found, with no score and no prescribed action
