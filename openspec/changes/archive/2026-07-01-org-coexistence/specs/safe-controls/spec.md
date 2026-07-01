# safe-controls Specification (delta)

## ADDED Requirements

### Requirement: Org override seam (fail-open, no fork)

The guard SHALL accept two environment variables so an organization can tune the controls without forking:
**`EUNOMAI_TRAILER_RULE`** = `deny` | `ask` | `off` (default `deny`) sets the commit-trailer rule's action;
**`EUNOMAI_EXTRA_GATES`** = a path to a JSON file of `{pattern, reason}` pairs appended to the ask-gates.
Both SHALL be fail-open: an unreadable file, invalid JSON, or an invalid regex is ignored without blocking
work. The guard SHALL continue to never emit an `allow` decision, so the seam can loosen only eunomai's own
rules — never another layer's.

#### Scenario: Org relaxes the trailer rule
- **WHEN** managed settings set `EUNOMAI_TRAILER_RULE=ask`
- **THEN** a commit with an AI-attribution trailer prompts the human instead of being denied

#### Scenario: Org adds its own gates
- **WHEN** `EUNOMAI_EXTRA_GATES` points to a valid JSON list of patterns
- **THEN** matching commands return `ask` with the org's reason, in the same prompt flow as the built-ins

#### Scenario: Misconfiguration never blocks
- **WHEN** the extra-gates file is missing or malformed
- **THEN** the guard behaves as if the variable were unset

## MODIFIED Requirements

### Requirement: Commit-trailer guard

The plugin SHALL deny any shell tool call (`Bash` or `PowerShell`) that runs `git commit` — including forms
with git global options such as `git -C <path> commit` — when the commit message contains an AI-attribution
trailer (a `Co-Authored-By:` line referencing Claude or Anthropic, or a "Generated with Claude Code" /
"Co-authored-by: Claude" style attribution). The denial SHALL include a reason that names the offending
trailer. This is the only hard `deny` in the pillar, and its action is configurable via
`EUNOMAI_TRAILER_RULE` (default `deny`).

#### Scenario: Commit carrying a Co-Authored-By Claude trailer is denied
- **WHEN** a `Bash` `git commit` call's message contains `Co-Authored-By: Claude <noreply@anthropic.com>`
- **THEN** the hook returns a `deny` decision whose reason identifies the AI-attribution trailer

#### Scenario: Commit carrying a "Generated with Claude Code" line is denied
- **WHEN** a `Bash` `git commit` call's message contains `🤖 Generated with Claude Code`
- **THEN** the hook returns a `deny` decision and the commit does not run

#### Scenario: Global git options do not bypass the rule
- **WHEN** the commit runs as `git -C <path> commit` or `git -c <cfg> commit` with a trailer in the message
- **THEN** the hook still returns a `deny` decision

#### Scenario: PowerShell commits are covered
- **WHEN** a `PowerShell` tool call runs `git commit` with an AI-attribution trailer
- **THEN** the hook returns the same decision as for `Bash`

#### Scenario: Clean commit message is allowed
- **WHEN** a shell `git commit` call's message is a Conventional Commit with no AI-attribution trailer
- **THEN** the hook allows the call without prompting

### Requirement: Safety-gate escalation for irreversible or sensitive operations

The plugin SHALL return an `ask` decision (escalate to the human) before a shell command (`Bash` or
`PowerShell`) that is irreversible, outward-facing, or touches secrets / auth: at minimum force-pushes
(long, short `-f`, and `+refspec` forms), recursive force deletes (POSIX `rm` in combined, split, or long
flag forms; `git clean` with force; PowerShell `Remove-Item -Recurse -Force`), version bumps, and commands
that read or write secret / credential / `.env` paths (including `id_rsa` / `id_ed25519` keys). The gate
SHALL avoid known innocent-command false positives (e.g. `process.env` references, `git config
credential.helper`). Ordinary commands SHALL proceed without a prompt.

#### Scenario: Force push is escalated
- **WHEN** a shell call runs `git push --force`, `git push -f`, `git push --force-with-lease`, or pushes a
  `+refspec`
- **THEN** the hook returns an `ask` decision so the human must confirm

#### Scenario: Recursive force delete is escalated
- **WHEN** a shell call runs a recursive force delete such as `rm -rf <path>`, `rm -r -f <path>`,
  `rm --recursive --force <path>`, `git clean -fdx`, or `Remove-Item -Recurse -Force <path>`
- **THEN** the hook returns an `ask` decision

#### Scenario: Version bump is escalated
- **WHEN** a shell call runs a version bump such as `npm version <level>`
- **THEN** the hook returns an `ask` decision

#### Scenario: Command touching secrets or auth is escalated
- **WHEN** a shell call reads or writes a secret / credential / `.env` path (e.g. `cat .env`,
  `cat ~/.ssh/id_ed25519`, editing `**/secrets/**`)
- **THEN** the hook returns an `ask` decision

#### Scenario: Innocent lookalikes are not escalated
- **WHEN** a shell call merely references `process.env` in code or configures `git config credential.helper`
- **THEN** the hook allows the call without prompting

#### Scenario: Ordinary command is not escalated
- **WHEN** a shell call runs a safe, reversible command such as `git status` or `npm test`
- **THEN** the hook allows the call without prompting
