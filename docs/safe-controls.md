---
type: reference
title: "Safe controls"
description: "The PreToolUse guard: its gates and levels, the AI-attribution policy, how to configure it, and the permissions baseline."
tags: [safe-controls, hooks, security, attribution]
updated: 2026-09-25
---

# Safe controls

eunomai adds one `PreToolUse` hook for the `Bash` and `PowerShell` tools. It is quiet on routine work and
firm on what cannot be undone. It is a fail-open **floor-raiser, not a security boundary**: if it errors,
the command runs. Static path rules belong to Claude Code's native `permissions`
([baseline below](#recommended-permissions-baseline)).

## How it reads a command

The guard reads a command as commands, not as text. It splits `;`, `&&`, `||` and `|`, sets keywords
(`if`, `for`, `{`, `!`…) and wrappers (`sudo`, `timeout`…) aside, follows `cd`, expands assignments and loop
lists made earlier in the same command, keeps redirections apart from arguments, and gives each heredoc
body to the command that opened it. Quoted data and heredoc bodies are ignored, so
`grep -rn 'git push --force' docs/` or a fixture that contains a co-author line trigger nothing. Code the
shell runs is read as commands again, in its own dialect: `$( … )`, backticks, `sh -c`, `bash -c`, `eval`,
`pwsh -Command`, `cmd /c`. The reader is best-effort (`hooks/segments.mjs`).

## Gates and levels

Each gate has an id and an action per level. The level is `standard` unless you choose another. Any
gate can also be set on its own to `off`, `ask` or `deny`.

| Gate | Fires on | critical | standard | strict |
|---|---|---|---|---|
| `ai-coauthor` | an AI co-author line (`Co-authored-by:` with an AI vendor's noreply address) or a "Generated with …" line, in a commit message or a pull-request description | deny | deny | deny |
| `disclosure-detail` | an `Assisted-by:` line naming a model or version, not just the tool | off | ask | ask |
| `commit-disclosure` | a commit message without `Assisted-by:`, when the project requires it | off | ask | ask |
| `pr-disclosure` | a pull-request description without `Assisted-by:`, when the project requires it (default) | off | ask | ask |
| `force-push` | `git push --force`, `-f`, `+refspec` | ask | ask | ask |
| `force-push-lease` | `git push --force-with-lease` | off | off | ask |
| `recursive-delete` | a recursive delete (`rm -r`, `Remove-Item -Recurse`, `rmdir /s`) of a scope whose loss cannot be a clean-up (below) | ask | ask | ask |
| `recursive-delete-any` | any recursive delete | off | off | ask |
| `git-clean` | `git clean` with force and without `-n` / `--dry-run` | off | ask | ask |
| `reset-hard` | `git reset --hard` | off | ask | ask |
| `secret-read` | reading a secret file (`cat`, `source`, `grep … file`, `cp` from it, `< file`, `Get-Content`…): `.env` and `.env.*` (not `.example`, `.sample`, `.template`, `.dist`), a private key (`id_rsa`, `id_ed25519`…, not `.pub`), `*.key`, `.netrc`, `.pgpass`, `.git-credentials`, `~/.aws/credentials` | off | ask | ask |
| `secret-mention` | the words `credential`, `secrets/`, `.env`, `.pem` anywhere in the command | off | off | ask |
| `version-bump` | `npm`/`pnpm`/`yarn version` with a level or a version | off | off | ask |
| `guard-config-write` | a shell command that writes `.claude/eunomai.json` or `.claude/eunomai.local.json`: the guard's settings are a person's to change | ask | ask | ask |
| `unreadable` | a command the guard could not read at all, so it cannot tell what it does | ask | ask | ask |

A recursive delete asks when its target is:
- the filesystem or a drive root;
- a top-level or system directory, or anything in one (`/etc`, `/usr`, `/var/lib`, `C:\Windows`,
  `C:\Program Files`…), except `/var/tmp`;
- any user's home directory, or anything directly in one (`~/Documents`, `/home/other`), except caches
  such as `~/.cache`;
- a credentials directory (`~/.ssh`, `~/.gnupg`, `~/.aws`, `~/.kube`, `~/.docker`, `~/.azure`);
- a repository's `.git`;
- the whole project, or above it;
- a path you protected;
- a path that starts with a variable the guard cannot resolve.

`node_modules`, `dist`, `/tmp/…`, a test directory deep under your home and the like pass. A last part
that is only a glob or a variable (`*`, `$d`) stands for its whole directory, so `rm -rf /tmp/*` asks; a
partial one (`odwg-*`, `build_$v`) narrows it, so `rm -rf /tmp/odwg-*` passes. Windows paths are
recognised from WSL too (`C:\Users\me` is `/mnt/c/Users/me`).

## AI attribution

An AI **co-author** line is always refused. Disclosure is minimal: the tool, never the model —
`Assisted-by: Claude`. Where it goes is the project's rule:
- `attribution.commit`: `none` (default) or `assisted-by`, for projects that want the trailer in commits;
- `attribution.pr`: `assisted-by` (default) or `none`;
- `attribution.tool`: `Claude` by default.

The lasting fix is Claude Code's own `attribution` setting, which decides the line Claude writes. It is
honoured in every settings scope, so a project commits its policy in `.claude/settings.json`, for example
`{"attribution": {"commit": "", "pr": "Assisted-by: Claude"}}`. The `eunomai-safe-controls` skill reads a
project's contribution rules and proposes both.

## Configuration

Settings merge in layers. Later layers win, except that the committed project file may only tighten.

| Layer | Where | May relax? |
|---|---|---|
| defaults | the table above, level `standard` | — |
| user | `/config` → eunomai's options `level` and `mode` | yes |
| legacy | `EUNOMAI_TRAILER_RULE` (sets `ai-coauthor`), `EUNOMAI_EXTRA_GATES` (a JSON file of extra gates) | yes |
| project | `.claude/eunomai.json`, committed | **no**: a looser value is ignored and reported |
| local | `.claude/eunomai.local.json`, gitignored | yes |

A cloned repository therefore cannot switch your protections off. If git tracks the local file, it is
read as a committed one (tighten-only), and `--check` says so. Attribution is the project's policy, not a
protection, so the project file sets it outright. An extra gate whose pattern nests quantifiers (`(a+)+`)
is refused, because it could take forever on a near-miss.

Keys:
- `level`: `critical`, `standard` or `strict`;
- `mode`: `enforce` or `report`;
- `gates`: `{gate id: off | ask | deny}`;
- `protectedPaths`: a list of paths;
- `extraGates`: `[{id, pattern, reason, action}]`, where `pattern` is a regex over the whole command;
- `attribution`: `{commit, pr, tool}`.

Stop asking about one gate in your clone (`.claude/eunomai.local.json`):

```json
{ "gates": { "reset-hard": "off" } }
```

Tighten for everyone and require the trailer (`.claude/eunomai.json`):

```json
{
  "level": "strict",
  "protectedPaths": ["data/"],
  "attribution": { "commit": "assisted-by" }
}
```

## Seeing what it does

```bash
node "${CLAUDE_PLUGIN_ROOT}/hooks/guard.mjs" --check     # effective settings, their layer, any problem
node "${CLAUDE_PLUGIN_ROOT}/hooks/guard.mjs" --hits 50   # the gates that fired recently
```

From a source clone, run `node <clone>/hooks/guard.mjs`. `--check` exits 1 when a file has an error or a
committed value was ignored. While that is so, every prompt says so too.

`"mode": "report"` makes the guard decide nothing and only record what would have fired. Every fired
gate, in either mode, goes to `guard-hits.jsonl` in the plugin's data directory. An entry holds the time,
gate, action, mode and project, never the command, and the log keeps the last 500 entries.

## Why did it stop me?

Every prompt names its gate, why it fired, a safer form where there is one, and how to stop it asking:

```
eunomai [force-push]: A force-push rewrites the remote's history. Safer: git push --force-with-lease.
To stop asking: "gates": {"force-push": "off"} in .claude/eunomai.local.json.
```

A denial is written for the model: it names the line to remove and the `attribution` setting.

## Coexistence and limits

- **It only tightens.** The guard emits `ask` or `deny`, never `allow`. Claude Code applies the most
  restrictive answer of all hooks and permission rules, so eunomai cannot loosen another layer.
- **An ask always prompts**, also in auto mode. That is why the default level asks so little.
- **It fails open.** A crash, bad input, or `node` missing from `PATH` lets the command run. Treat the
  guard as a convenience, not an attestable control.
- **It runs for every shell call**, about 40 ms each, with a 10-second timeout. A narrower hook filter was
  measured and rejected: it cannot see through `sudo`, nor run your extra gates.
- **Its settings are a person's.** A shell command that writes `.claude/eunomai*.json` asks. Claude Code
  already prompts before its own file tools edit `.claude/`.
- **Environment variables are not layered.** A project's committed `.claude/settings.json` can set
  `EUNOMAI_*` or `CLAUDE_PLUGIN_OPTION_*` for everyone who trusts the workspace, and the guard cannot tell
  them from yours. `--check` shows the values in effect.
- **It is best-effort.** A command built at run time (`$(…)`, a variable holding a command name) is not
  followed.

## Recommended permissions baseline

For static path rules use Claude Code's native `permissions`; it needs no eunomai code. Copy this into
`.claude/settings.json` or your user settings and adapt the paths:

```json
{
  "permissions": {
    "deny": ["Read(**/.env)", "Read(**/.env.*)", "Read(**/*.pem)", "Read(**/id_rsa)", "Read(**/id_ed25519)"],
    "ask": ["Read(**/secrets/**)", "Read(**/credentials/**)", "Edit(**/.env)", "Edit(**/.env.*)"]
  }
}
```

## Testing

```bash
node --test "hooks/*.test.mjs"
```

`hooks/corpus.test.mjs` holds everyday commands that must pass silently and real hits that must fire.
A new false positive belongs there first.
