## ADDED Requirements

### Requirement: Commit-trailer guard

The plugin SHALL deny any `Bash` tool call that runs `git commit` when the commit message contains an
AI-attribution trailer (a `Co-Authored-By:` line referencing Claude or Anthropic, or a "Generated with
Claude Code" / "Co-authored-by: Claude" style attribution). The denial SHALL include a reason that names
the offending trailer. This is the only hard `deny` in the pillar.

#### Scenario: Commit carrying a Co-Authored-By Claude trailer is denied
- **WHEN** a `Bash` `git commit` call's message contains `Co-Authored-By: Claude <noreply@anthropic.com>`
- **THEN** the hook returns a `deny` decision whose reason identifies the AI-attribution trailer

#### Scenario: Commit carrying a "Generated with Claude Code" line is denied
- **WHEN** a `Bash` `git commit` call's message contains `🤖 Generated with Claude Code`
- **THEN** the hook returns a `deny` decision and the commit does not run

#### Scenario: Clean commit message is allowed
- **WHEN** a `Bash` `git commit` call's message is a Conventional Commit with no AI-attribution trailer
- **THEN** the hook allows the call without prompting

### Requirement: Safety-gate escalation for irreversible or sensitive operations

The plugin SHALL return an `ask` decision (escalate to the human) before a `Bash` command that is
irreversible, outward-facing, or touches secrets / auth: at minimum force-pushes, recursive force deletes,
version bumps, and commands that read or write secret / credential / `.env` paths. Ordinary commands SHALL
proceed without a prompt.

#### Scenario: Force push is escalated
- **WHEN** a `Bash` call runs `git push --force` (or `--force-with-lease`) to a remote
- **THEN** the hook returns an `ask` decision so the human must confirm

#### Scenario: Recursive force delete is escalated
- **WHEN** a `Bash` call runs a recursive force delete such as `rm -rf <path>`
- **THEN** the hook returns an `ask` decision

#### Scenario: Version bump is escalated
- **WHEN** a `Bash` call runs a version bump such as `npm version <level>`
- **THEN** the hook returns an `ask` decision

#### Scenario: Command touching secrets or auth is escalated
- **WHEN** a `Bash` call reads or writes a secret / credential / `.env` path (e.g. `cat .env`, editing
  `**/secrets/**`)
- **THEN** the hook returns an `ask` decision

#### Scenario: Ordinary command is not escalated
- **WHEN** a `Bash` call runs a safe, reversible command such as `git status` or `npm test`
- **THEN** the hook allows the call without prompting

### Requirement: Authored-source guard

The plugin SHALL return an `ask` decision when an `Edit` or `Write` tool call targets a generated artifact
(`CLAUDE.md`, `.github/copilot-instructions.md`) directly, with a reason pointing the editor to the authored
`AGENTS.md` and the projection step. Edits to `AGENTS.md` or any non-generated file SHALL proceed without a
prompt.

#### Scenario: Editing a generated artifact is escalated
- **WHEN** an `Edit` or `Write` call targets `CLAUDE.md` or `.github/copilot-instructions.md`
- **THEN** the hook returns an `ask` decision whose reason points to `AGENTS.md` and projection

#### Scenario: Editing the authored source is allowed
- **WHEN** an `Edit` or `Write` call targets `AGENTS.md` or an unrelated source file
- **THEN** the hook allows the call without prompting

### Requirement: Recommended native-permissions baseline

The plugin SHALL document a recommended Claude Code native `permissions` baseline (deny/ask path globs for
secrets / auth) that users opt into, rather than reimplementing static path matching in hook code. The
baseline SHALL be copy-pasteable into a user's settings.

#### Scenario: User adopts the documented baseline
- **WHEN** a user copies the documented `permissions` baseline into their Claude Code settings
- **THEN** native permissions deny or ask for access to the listed secret / auth paths, with no eunomai hook
  involved

### Requirement: Cross-platform, zero-dependency hooks

Hook scripts SHALL run on Windows and POSIX systems with no runtime dependencies beyond Node, and SHALL be
wired via `hooks/hooks.json` using `${CLAUDE_PLUGIN_ROOT}` so the plugin contributes them on install without
the user hand-editing settings.

#### Scenario: Hook runs on Windows without a POSIX shell
- **WHEN** a hook fires on Windows where no POSIX shell is available
- **THEN** it executes via `node` and returns a valid decision JSON

### Requirement: Fail-open default

The hooks SHALL fail open: if a hook script errors, times out, or cannot parse its input, the operation
SHALL be allowed rather than blocked, and the session SHALL not crash. A guardrail malfunction MUST NOT
prevent the user from working.

#### Scenario: Hook script error does not block the user
- **WHEN** a hook script throws or receives unparseable input
- **THEN** the operation is allowed (fail open) and no error is surfaced that halts the session
