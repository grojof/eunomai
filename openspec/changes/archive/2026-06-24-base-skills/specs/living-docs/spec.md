## ADDED Requirements

### Requirement: Diagram enrichment (Mermaid + C4)

The living-docs standard and the `eunomai-living-docs` skill SHALL guide diagrams using **Mermaid**, matching
the diagram type to its purpose (flowchart for process/decisions, sequence for interactions over time, ER or
class for data/structure, state for status changes, and the **C4 model** for architecture), and SHALL keep
each diagram simple (one idea per diagram).

#### Scenario: Architecture needs a diagram
- **WHEN** a doc needs to show software architecture
- **THEN** the skill recommends Mermaid with the **C4** model (Context → Container → Component)

#### Scenario: A process or interaction needs a diagram
- **WHEN** a doc needs to show a process/decision or an interaction over time
- **THEN** the skill recommends the matching Mermaid type (flowchart or sequence) and keeps it simple
