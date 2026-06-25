## ADDED Requirements

### Requirement: Delegate diagrams and stale-doc detection to read-only agents

The living-docs skill SHALL be able to delegate read-only work to subagents: the **codebase-cartographer** to
derive an architecture diagram (Mermaid/C4) for the "at a glance" view, and the **coherence-auditor** to
surface docs that have drifted from the code or cite stale versions. Both delegations SHALL be **read-only**
and **suggestion-only** — living-docs remains human-in-control and the agents never edit docs or decide; the
coherence audit SHALL be a one-shot diagnostic, not a continuous check.

#### Scenario: Cartographer proposes an architecture diagram
- **WHEN** living-docs needs an architecture diagram for a project's README/docs
- **THEN** it may delegate to the read-only cartographer for a proposed Mermaid/C4 diagram, which the author accepts or declines

#### Scenario: Auditor surfaces stale docs
- **WHEN** living-docs refreshes a project's docs
- **THEN** it may delegate a one-shot coherence audit that flags doc↔code drift for the author to resolve, without editing anything itself
