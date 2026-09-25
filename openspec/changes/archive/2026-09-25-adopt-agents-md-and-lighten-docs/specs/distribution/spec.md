# Spec Delta

## MODIFIED Requirements

### Requirement: Claude-only distribution with a single authored source

eunomai SHALL target **Claude Code only**. It SHALL NOT project to or generate instruction files for other
tools (no `rulesync` cross-tool projection, no `.github/copilot-instructions.md`, no `eunomai.yaml`). The
authored agent-instruction source SHALL be a single `AGENTS.md`, the open standard Claude Code reads natively;
a `CLAUDE.md` MAY exist only as a one-line `@AGENTS.md` bridge for older Claude Code versions, and there SHALL
be no generated instruction files. **OpenSpec** SHALL be the sole external runtime dependency (the SDD engine and the
historical record of decisions and development).

#### Scenario: No cross-tool projection artifacts
- **WHEN** the repository is built or inspected
- **THEN** there is no `eunomai.yaml`, no `rulesync` projection step, and no generated `copilot-instructions.md`

#### Scenario: Single authored instruction source
- **WHEN** agent instructions need editing
- **THEN** `AGENTS.md` is the one authored file; there is no second copy and no generated file to sync

#### Scenario: OpenSpec is the only external dependency
- **WHEN** the dependencies of the distribution are listed
- **THEN** OpenSpec is the sole external one; nothing else (e.g. `rulesync`) is required
