# Design: tune safe controls

## Decision: reuse first

| Need | Adopted | Why not build it |
|---|---|---|
| Per-user settings with a UI | plugin `userConfig` → `/config`, read as `CLAUDE_PLUGIN_OPTION_*` | native, discoverable |
| Attribution text | the `attribution` setting (`commit`, `pr`), any settings scope | the harness writes the line; the guard only backstops |
| Static secret paths | native `permissions` baseline (unchanged) | path rules are the permission system's job |
| State (hit log) | `${CLAUDE_PLUGIN_DATA}` | persists across plugin updates |

What eunomai adds: a segmenter, gate ids and levels, the config merge, `--check`, and one skill.

## Gates

| Id | What fires | critical | standard | strict |
|---|---|---|---|---|
| `ai-coauthor` | the commit message or PR body carries an AI co-author line (`Co-authored-by:` with an AI vendor address) or a "Generated with …" line | deny | deny | deny |
| `disclosure-detail` | an `Assisted-by:` line names a model or version, not just the tool | off | ask | ask |
| `commit-disclosure` | policy `commit: assisted-by` and a commit message without `Assisted-by:` | off | ask | ask |
| `pr-disclosure` | policy `pr: assisted-by` and `gh pr create` without `Assisted-by:` in its body | off | ask | ask |
| `force-push` | `--force`, `-f` or `+refspec` | ask | ask | ask |
| `force-push-lease` | `--force-with-lease` | off | off | ask |
| `recursive-delete` | a scope whose loss cannot be a clean-up: a root, a top-level or system directory or anything in one (not `/var/tmp`), a home or anything directly in it, a credentials directory, the whole project, a protected path, or a path that starts with an unresolved variable | ask | ask | ask |
| `recursive-delete-any` | any recursive delete | off | off | ask |
| `git-clean` | `git clean` with force and without `-n` / `--dry-run` | off | ask | ask |
| `reset-hard` | `git reset --hard` | off | ask | ask |
| `secret-read` | reading a secret file (`cat`, `less`, `head`, `tail`, `source`, `.`, a search's file operand, `cp`/`mv` from it, `<`, `Get-Content`…): `.env`, `.env.*` except `example`/`sample`/`template`/`dist`, a private key without `.pub`, `.netrc`, `.pgpass`, `.aws/credentials` | off | ask | ask |
| `secret-mention` | today's word-level match (`credential`, `secrets/`, `.pem`) | off | off | ask |
| `version-bump` | `npm`/`pnpm`/`yarn version` with a level or version argument | off | off | ask |
| `guard-config-write` | a shell command writing `.claude/eunomai*.json` | ask | ask | ask |
| `unreadable` | a command the reader could not read | ask | ask | ask |
| extra gates | the config's own patterns, each with a stated action | as set | as set | as set |

`ai-coauthor` stays the only hard deny, and it is kept deliberately narrow. It matches vendor addresses
(`noreply@anthropic.com` and other AI vendors' noreply forms) and "Generated with" lines, never a bare name,
so a human co-author called Claude passes. `Assisted-by:` never triggers it.

## Reading a command

`segments(command)` splits on `;`, `&&`, `||`, `|` and newlines outside quotes. It removes heredoc bodies
and replaces quoted strings with a placeholder, except in three places:
- the argument of `sh -c`, `bash -c` or `eval`, which is segmented recursively as code;
- the message values of `git commit` (`-m`, `--message`, `--trailer`, a heredoc body fed to `-F -`);
- the body of `gh pr create`/`edit` (`--body`, `--body-file` read from disk, fail-open).

The attribution gates read those last two, and nothing else.

The segmenter is about 80 lines, and is tested with the corpus from the review: every everyday command
that fired falsely becomes a test that must pass silently.

Recursive deletes resolve each target against the working directory, following `cd` within the command.
`CLAUDE_PROJECT_DIR`, or the working directory when unset, is the project.

**Measured on real use.** The rule was tuned by replaying every shell command from six real sessions
(5,087 calls) through the 0.5.0 guard and the new one:
- the 0.5.0 guard: 216 prompts or denials, of which 170 were recursive deletes and 36 secret-word matches;
- the new one: 25. Every remaining one was checked by hand, and each is a system or home-level delete, a
  repository's `.git`, a real secret read, a force-push, `reset --hard`, an AI co-author line, or a
  missing disclosure.

An independent review then found holes the corpus had not covered, each now a corpus case:
- a heredoc body given to the last command of its line;
- commands inside `if`/`for`/`{ }`;
- `--trailer "Co-authored-by=…"`;
- nested shells judged in the outer dialect;
- `${HOME:?}` and `~` in assignments;
- Windows system trees and other users' homes;
- `$( … )` not read as code;
- `gh -R`;
- a search pattern taken for a file.

It also found three ways around the guard itself, now closed:
- a regex that backtracks for ever: refused, with the hook timeout as the backstop;
- a committed `.local.json`: read tighten-only;
- the agent writing the guard's settings: the `guard-config-write` gate.

One limit stays and is documented. A project's committed `.claude/settings.json` can set environment
variables, and the guard cannot tell those from the user's.

A first cut asked for any path outside the project, and still flagged 58 routine clean-ups: test data
under the home directory, and the Windows temp directory seen from WSL. The scope list above replaced it.

## Config

Keys in every layer:
- `level`;
- `mode` (`enforce` | `report`);
- `gates: {<id>: off|ask|deny}`;
- `protectedPaths: []`;
- `extraGates: [{id, pattern, reason, action}]`;
- `attribution: {commit, pr, tool}`.

The merge runs in three steps:
1. Defaults, then **user** (`userConfig`: `level`, `mode`), then the legacy env (`EUNOMAI_TRAILER_RULE` sets
   `ai-coauthor`; `EUNOMAI_EXTRA_GATES` adds gates). Together these give the base.
2. **Project** `.claude/eunomai.json` is applied **tighten-only**. Each gate takes the stricter action, the
   level can only rise, and the lists only grow. A looser value is ignored and reported by `--check`.
3. **Local** `.claude/eunomai.local.json` is applied last, and may set anything.

Attribution is policy, not protection, so the project sets it outright. Its natural home is Claude Code's
own `attribution` setting in the committed `.claude/settings.json`. `attribution.tool` defaults to
`Claude`.

Errors never change a decision (fail-open), but they are never silent. `--check` lists them and exits 1. A
decision made while the config had an error adds "(config error: run guard --check)" to its reason.

## Output

`ask` reasons are read by the human, `deny` reasons by the model, so each is written for its reader:
- **ask** — `[<gate-id>] <why>. Safer: <alternative>. To relax: set gates.<id> in .claude/eunomai.local.json.`
- **deny `ai-coauthor`** — tells the model to drop the line, keep `Assisted-by: <tool>` if the policy asks
  for it, and names the `attribution` setting as the lasting fix.

The hit log is `${CLAUDE_PLUGIN_DATA}/guard-hits.jsonl`, falling back to a temp file. Each line holds the
time, gate id, action, mode and project path, **never the command text**, so no secret lands in it. It
keeps the last 500 lines.

## Hooks wiring: one handler, no `if` filter

The hook `if` filter was considered and set aside. It checks each subcommand (Claude Code's hooks guide),
but it cannot see through `sudo`, it cannot cover a redirection to a secret file, which may follow any
command (`jq . > .env`), and it cannot know the user's extra gates or the strict level. Starting the guard
costs about 40 ms per shell call, measured on the reference host. That is small next to a model turn, and
it keeps every gate complete, so `hooks.json` keeps one handler per shell tool.

## Trade-offs

- **The segmenter is new code**, where the old design deliberately refused to parse quoting. The measured
  cost of not parsing (most prompts false) outweighs about 80 tested lines. It stays best-effort: an
  unparseable command falls back to raw matching, which errs toward asking.
- **No `if` filter**: about 40 ms per shell call, in exchange for complete gates (see above).
- **A tighten-only project file** means a team cannot relax a gate for everyone by committing. That is on
  purpose: a cloned repo must not switch protections off. Relaxing is per user.

## Low-maintenance check

- The only new gate is `reset-hard`.
- Extra gates stay a list in a file.
- The false-positive corpus is data in a test.
- No new dependency; hooks stay zero-dependency `.mjs`.
- The skill is instructions over `guard.mjs --check` and `--hits`; it does no parsing of its own.
