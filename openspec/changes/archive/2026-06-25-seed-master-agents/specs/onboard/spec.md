## ADDED Requirements

### Requirement: Delegate codebase comprehension and coherence auditing to read-only agents

The onboard skill SHALL be able to delegate the heavy, read-only reading of an unfamiliar project to subagents
rather than doing it inline: a **codebase-cartographer** for comprehension (architecture, entry points, data
flow, stack + versions, a proposed diagram) feeding the analyze step and the "at a glance" README, and, when
normalizing an **existing** project, a **coherence-auditor** for a one-shot report of doc↔code drift and stale
versions. The delegated agents SHALL be **read-only** (they report facts and proposals, never edit or decide),
and the coherence audit SHALL be a **disposable one-shot diagnostic**, never a continuous conformance engine.

#### Scenario: Comprehension is delegated to the cartographer
- **WHEN** onboard analyzes an unfamiliar project root
- **THEN** it may delegate to the read-only codebase-cartographer, which returns an architecture/entry-point/data-flow map and a proposed diagram without editing anything

#### Scenario: Coherence audit on an existing project
- **WHEN** onboard normalizes a project that already has docs
- **THEN** it may delegate a one-shot coherence audit that reports doc↔code drift and stale versions for the human to act on, and SHALL NOT stand up a continuous conformance process

#### Scenario: Delegated agents do not decide
- **WHEN** either agent returns its findings
- **THEN** onboard treats them as facts/proposals the human confirms, and the agents themselves change nothing
