# Proposal: tune safe controls

## Why

The guard asks too often and relaxes too little.
- **Asks on routine work.** Measured over about ten days of real use, around 160 prompts fired. Most were a
  recursive delete of a scratch, temp or build directory, or the word "credential" inside a commit message,
  test name or string. In auto mode every hook `ask` forces a prompt, so each false positive interrupts a
  session that was otherwise hands-off.
- **Trailer denies the harness's own default.** Claude Code's default attribution adds a co-author line, the
  deny refuses it, and every commit costs a retry. The rule also scans the whole command, so a `grep`, a test
  fixture or a message that mentions the rule is denied too.
- **Tuning today:**
  - only two environment variables, and they can only add gates or change the trailer action;
  - no gate can be switched off or narrowed for one repo;
  - a bad config is ignored silently;
  - nothing guides a user to set it up.

Attribution norms also differ between projects: some want no AI trailer at all, some require
`Assisted-by:`, some accept a co-author line. A single hard rule cannot fit them all. The common ground is
**never an AI co-author, and a minimal disclosure (the tool, not the model) where it is asked for**.

## What changes

- **Tiers and gate ids.** Three levels: `critical`, `standard` (default) and `strict`. Every gate has an id
  and an action per level. Any gate can be set to `off`, `ask` or `deny`. The `standard` level asks only on
  what cannot be undone or leaks: force-push without lease, recursive delete of a risky target, `git clean`
  with force, `git reset --hard`, and reading a real secret file. Version bumps and word-level secret
  matching move to `strict`.
- **Commands are read, not grepped.** The guard splits a command into segments and drops quoted data and
  heredoc bodies before matching. It keeps them where they are code (`sh -c`, `bash -c`, `eval`).
  Recursive deletes look at their targets: a relative path inside the project and temp directories pass;
  `/`, `~`, `..`, a bare glob and absolute paths outside the project ask.
- **Attribution policy replaces the trailer rule.**
  - An AI co-author line (`Co-authored-by:` an AI vendor address, or "Generated with …" lines) is denied at
    every level; this is the one hard deny that stays.
  - A disclosure names the tool only (`Assisted-by: Claude`), never the model.
  - Commits carry it only when the project requires it.
  - Pull requests carry it by default.
  - The policy is set per project: `commit: none | assisted-by`, `pr: assisted-by | none`, `tool: <name>`.
  - The guard checks only the real commit message and PR body.
  - The root fix is Claude Code's native `attribution` setting, which the guided setup writes. It is honoured
    in every settings scope, so a project commits its policy in its own `.claude/settings.json`.
- **Layered config, tighten-only in the repo.**

  | Layer | Where | Can relax? |
  |---|---|---|
  | Defaults | — | — |
  | User | `/config` through the plugin's `userConfig` | yes |
  | Project | a committed `.claude/eunomai.json` | no: it can only tighten, add gates or protect paths |
  | Local | a gitignored `.claude/eunomai.local.json` | yes: it can relax anything for the user's clone |
  | Legacy | the two `EUNOMAI_*` variables | kept working |

  A cloned repo can therefore never switch a user's protections off.
- **Visible config.** `node <plugin>/hooks/guard.mjs --check` prints the effective settings, where each came
  from, and any config error, and exits non-zero on an error. The hook itself stays fail-open.
- **Report mode.** `mode: report` decides nothing and records what would have fired. Every fired gate, in
  either mode, is appended to a small local log (gate id and time, never the command's data).
- **Messages that help.** Every prompt or denial names the gate id, why it fired, the safer alternative (for
  example `--force-with-lease`) and how to relax it.
- **Guided setup: a new skill, `eunomai-safe-controls`.** It shows the effective config and recent hits,
  reads the project's contribution rules for its attribution policy, proposes a config and the native
  `attribution` setting, and writes them only on confirmation.

## Reuse vs net-new

Reused:
- Claude Code's PreToolUse contract (deny/ask, most-restrictive-wins);
- plugin `userConfig` and `/config`;
- the native `attribution` setting, honoured in every settings scope, so a project can commit its policy;
- native `permissions` for static path rules.

The per-repo files follow Claude Code's own `settings.json` / `settings.local.json` split. That is eunomai's
convention, not an official plugin pattern.

Net-new, and small: the segmenter, gate ids and levels, the config merge, `--check` and the hit log, and one
skill.

## Non-goals

- A security boundary. The guard stays a fail-open floor-raiser; sandboxing and native permissions are the
  hard layers.
- An exhaustive denylist, or new gate categories beyond `git reset --hard`.
- Enforcing attribution text beyond presence and minimality; the words are the project's.
- Changing `docs-check`, onboard or living-docs. They come in a later change.

## Impact

- `hooks/decide.mjs`, `hooks/guard.mjs` and their tests: a false-positive corpus becomes a test.
- `hooks/hooks.json`.
- `.claude-plugin/plugin.json` (`userConfig`).
- New skill `skills/eunomai-safe-controls/`, and its registry entry.
- `docs/safe-controls.md`, `README.md`, `CHANGELOG.md`, `SECURITY.md`.
- **Behaviour change:** fewer prompts at the default level. `EUNOMAI_TRAILER_RULE` maps onto the co-author
  gate.
