# Spec Delta

## MODIFIED Requirements

### Requirement: Commit-trailer guard

The guard SHALL deny, at every level, a shell call whose **commit message** (the `-m`, `--message` or
`--trailer` values, or a heredoc body fed to `git commit -F -`) or whose **pull-request body**
(`gh pr create` / `gh pr edit`, `--body` or `--body-file`) carries an AI co-author line. That is a
`Co-authored-by:` line with an AI vendor's noreply address, or a "Generated with …" attribution line. Text
elsewhere in the command, such as a `grep` pattern or a fixture, SHALL NOT trigger it, and a human co-author
SHALL pass whatever their name.

The deny reason SHALL name the line found, tell the model to drop it, and name Claude Code's `attribution`
setting as the lasting fix. The action is configurable as gate `ai-coauthor`, and `EUNOMAI_TRAILER_RULE`
keeps setting it.

The guard SHALL also apply the project's disclosure policy `attribution: {commit, pr, tool}` (defaults:
`commit: none`, `pr: assisted-by`, `tool: Claude`):
- **`commit-disclosure`** asks when `commit: assisted-by` and the message has no `Assisted-by:` line;
- **`pr-disclosure`** asks when `pr: assisted-by` and the PR body has no `Assisted-by:` line;
- **`disclosure-detail`** asks when an `Assisted-by:` line names a model or version rather than the tool
  only.

#### Scenario: Commit carrying a Co-Authored-By Claude trailer is denied
- **WHEN** a `git commit` message contains a `Co-Authored-By:` line with `<noreply@anthropic.com>`
- **THEN** the hook returns `deny`, and its reason names the line and the `attribution` setting

#### Scenario: Commit carrying a "Generated with Claude Code" line is denied
- **WHEN** a `git commit` message contains a "Generated with Claude Code" line
- **THEN** the hook returns `deny` and the commit does not run

#### Scenario: Global git options do not bypass the rule
- **WHEN** the commit runs as `git -C <path> commit` or `git -c <cfg> commit` with such a line in the message
- **THEN** the hook still returns `deny`

#### Scenario: PowerShell commits are covered
- **WHEN** a `PowerShell` tool call commits with such a line in the message
- **THEN** the hook returns the same decision as for `Bash`

#### Scenario: Clean commit message is allowed
- **WHEN** a shell `git commit` call's message is a Conventional Commit with no AI co-author line, under the
  default policy
- **THEN** the hook allows the call without prompting

#### Scenario: A command that only mentions the line is allowed
- **WHEN** a shell call greps for a co-author line and then commits with a clean message
- **THEN** the hook allows it

#### Scenario: A human co-author is allowed
- **WHEN** a commit message contains `Co-authored-by: Claude Monet <claude@example.org>`
- **THEN** the hook allows it

#### Scenario: A minimal disclosure is allowed
- **WHEN** a commit message ends with `Assisted-by: Claude`
- **THEN** the hook allows it at every level

#### Scenario: A detailed disclosure asks for the minimal form
- **WHEN** a commit message contains `Assisted-by: Claude Opus 5.5` at the standard level
- **THEN** the hook returns `ask` naming gate `disclosure-detail`

#### Scenario: A project that requires the trailer
- **WHEN** the project sets `attribution.commit: assisted-by` and a commit message has no `Assisted-by:` line
- **THEN** the hook returns `ask` naming gate `commit-disclosure`

#### Scenario: A pull request without disclosure
- **WHEN** `gh pr create --body "Fixes the parser."` runs under the default policy
- **THEN** the hook returns `ask` naming gate `pr-disclosure`

### Requirement: Safety-gate escalation for irreversible or sensitive operations

The guard SHALL decide per **gate id** and **level** (`critical`, `standard` default, `strict`), using the
action table in the design. At the standard level it SHALL ask only before:
- a force-push without lease;
- a recursive delete of a scope whose loss cannot be a clean-up: a filesystem or drive root, a
  top-level or system directory or anything in one (Windows' included; not `/var/tmp`), any user's home
  directory or anything directly in one (home caches such as `~/.cache` excepted), a credentials
  directory (`~/.ssh`, `~/.gnupg`, `~/.aws`…), a repository's `.git`, the whole project, a configured
  protected path, or a path that starts with a variable the guard cannot resolve. A whole-directory glob
  or variable as the last part stands for that directory; a partial one, or one further up, narrows it;
- `git clean` with force and without dry-run;
- `git reset --hard`;
- reading a secret file (a read or copy of it, a `<` redirection; a search pattern is not a file).

`--force-with-lease`, any recursive delete, word-level secret mentions and version bumps SHALL ask only at
the strict level. At every level the guard SHALL ask before a shell command writes its own settings files
(`guard-config-write`), and before a command it could not read at all (`unreadable`).

Before matching, the guard SHALL split the command into segments, set shell keywords and wrappers aside,
read each command's own name and arguments, keep redirections apart from arguments, give each heredoc body
to the command that opened it, and ignore quoted data and heredoc bodies except where they are code
(`$( … )`, backticks, `sh -c`, `bash -c`, `eval`, `pwsh -Command`, `cmd /c`), each read in its own
dialect. Assignments and loop lists earlier in the same command are expanded. Every `ask` reason SHALL name the gate id, why it
fired, a safer alternative where one exists, and how to relax it.

#### Scenario: Force push is escalated
- **WHEN** a shell call runs `git push --force`, `git push -f`, or pushes a `+refspec`
- **THEN** the hook returns an `ask` decision so the human must confirm

#### Scenario: Recursive force delete is escalated
- **WHEN** a shell call runs a recursive force delete of a risky target, such as `rm -rf ~`,
  `rm -r -f /var/data`, `rm --recursive --force ..`, or `Remove-Item -Recurse -Force C:\`
- **THEN** the hook returns an `ask` decision

#### Scenario: Version bump is escalated
- **WHEN** a shell call runs `npm version <level>` at the strict level
- **THEN** the hook returns an `ask` decision

#### Scenario: Command touching secrets or auth is escalated
- **WHEN** a shell call reads or writes a secret file, such as `cat .env` or `cat ~/.ssh/id_ed25519`
- **THEN** the hook returns an `ask` decision

#### Scenario: Innocent lookalikes are not escalated
- **WHEN** a shell call merely references `process.env` in code or configures `git config credential.helper`
- **THEN** the hook allows the call without prompting

#### Scenario: Ordinary command is not escalated
- **WHEN** a shell call runs a safe, reversible command such as `git status` or `npm test`
- **THEN** the hook allows the call without prompting

#### Scenario: Regenerable directories are deleted without a prompt
- **WHEN** a shell call runs `rm -rf node_modules dist` inside the project, `rm -rf /tmp/work`, or
  `rm -rf ~/.local/share/app/cache/old`
- **THEN** the hook allows it at the standard level

#### Scenario: A risky delete asks
- **WHEN** a shell call runs `rm -rf ~` or `rm -rf ../other`
- **THEN** the hook returns `ask` naming gate `recursive-delete`

#### Scenario: Force-push with lease passes at standard
- **WHEN** a shell call runs `git push --force-with-lease`
- **THEN** the hook allows it at the standard level, and asks at the strict level

#### Scenario: Force-push without lease suggests the safer form
- **WHEN** a shell call runs `git push --force`
- **THEN** the hook returns `ask`, and its reason suggests `--force-with-lease`

#### Scenario: Reading a real secret asks, mentioning the word does not
- **WHEN** a shell call runs `cat .env`
- **THEN** the hook returns `ask` naming gate `secret-read`
- **WHEN** a shell call runs `cat .env.example`, `pytest tests/test_credentials.py` or a commit whose message mentions `.env`
- **THEN** the hook allows it at the standard level

#### Scenario: Quoted data does not trigger a gate
- **WHEN** a shell call runs `echo 'never run rm -rf /' >> notes.txt`
- **THEN** the hook allows it

#### Scenario: Code inside sh -c is still read
- **WHEN** a shell call runs `sh -c 'rm -rf ~'`
- **THEN** the hook returns `ask` naming gate `recursive-delete`

#### Scenario: A read-only version query passes
- **WHEN** a shell call runs `npm version --json`
- **THEN** the hook allows it at every level

### Requirement: Org override seam (fail-open, no fork)

The guard SHALL merge its settings in layers:
1. defaults;
2. then the user's plugin options (`userConfig`, shown in `/config`);
3. then the legacy `EUNOMAI_TRAILER_RULE` / `EUNOMAI_EXTRA_GATES` variables;
4. then the committed project file `.claude/eunomai.json`, **tighten-only**: a stricter action, a higher
   level, more gates or protected paths;
5. then the gitignored local file `.claude/eunomai.local.json`, which may relax anything. If git tracks
   it, it is read as a committed file (tighten-only) and reported.

A looser value in the project file SHALL be ignored and reported. An extra gate whose pattern nests
quantifiers SHALL be refused and reported, and the hook SHALL carry a timeout, so that no pattern can hang
a shell call. Attribution policy is not a protection,
so the project SHALL set it outright. Any configuration error SHALL leave decisions fail-open, and SHALL be
reported. The guard SHALL never emit `allow`.

#### Scenario: A cloned repository cannot switch protections off
- **WHEN** a committed `.claude/eunomai.json` sets `gates.force-push: off`
- **THEN** `git push --force` still asks, and `--check` reports the ignored value

#### Scenario: A user relaxes one gate for their clone
- **WHEN** `.claude/eunomai.local.json` sets `gates.reset-hard: off`
- **THEN** `git reset --hard` runs without a prompt in that clone only

#### Scenario: A project tightens
- **WHEN** a committed `.claude/eunomai.json` sets `level: strict`
- **THEN** `git push --force-with-lease` asks for everyone working in that repository

#### Scenario: Org relaxes the trailer rule
- **WHEN** managed settings set `EUNOMAI_TRAILER_RULE=ask`
- **THEN** an AI co-author line asks instead of being denied

#### Scenario: Org adds its own gates
- **WHEN** `EUNOMAI_EXTRA_GATES` points to a valid JSON list of patterns, or the project file lists extra gates
- **THEN** matching commands return the action each gate states, with the org's reason

#### Scenario: Misconfiguration never blocks
- **WHEN** a configuration file is missing or malformed
- **THEN** the guard decides with the other layers, and `guard.mjs --check` reports the problem

## ADDED Requirements

### Requirement: The effective configuration is visible

`node <plugin>/hooks/guard.mjs --check` SHALL print:
- the effective level, mode, gate actions and attribution policy;
- the layer each value came from;
- every configuration error or ignored value.

It SHALL exit 1 on any error or ignored value, and 0 otherwise. While a configuration error exists, a
decision's reason SHALL say so.

#### Scenario: A malformed local file
- **WHEN** `.claude/eunomai.local.json` is not valid JSON
- **THEN** `guard.mjs --check` names the file and the error and exits 1, and the hook still decides with the
  other layers

### Requirement: Report mode and hit log

With `mode: report` the guard SHALL emit no decision and SHALL record what would have fired. In both modes,
every fired gate SHALL be appended to a hit log under `${CLAUDE_PLUGIN_DATA}`. Each entry holds the time,
gate id, action, mode and project path, never the command text, and the log keeps a bounded number of
entries. `guard.mjs --hits` SHALL print the recent entries.

#### Scenario: Trying a configuration before enforcing it
- **WHEN** the mode is `report` and a shell call runs `git reset --hard`
- **THEN** the call proceeds without a prompt, and `guard.mjs --hits` lists `reset-hard` for it

### Requirement: Guided setup of safe controls

The plugin SHALL ship a skill, `eunomai-safe-controls`, that:
- shows the effective configuration (`--check`) and recent hits (`--hits`);
- reads the project's contribution rules (CONTRIBUTING, an AI policy, `.github/`) for what they require
  about AI attribution;
- proposes a configuration and the native `attribution` setting;
- writes the configuration only after the user confirms, relaxations to the local file and project
  policy to the committed one.

#### Scenario: A project that asks for Assisted-by
- **WHEN** the project's CONTRIBUTING requires an `Assisted-by:` trailer on AI-assisted commits
- **THEN** the skill proposes `attribution.commit: assisted-by` and the matching native `attribution.commit`
  text, and writes nothing until the user confirms
