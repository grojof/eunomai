---
type: reference
title: "Safe controls"
description: "The PreToolUse hooks and the recommended permissions baseline."
tags: [safe-controls, hooks, security]
updated: 2026-07-01
---

# Safe controls

eunomai turns its written safety conventions into **enforced** Claude Code guardrails. It reuses Claude
Code's native primitives and adds only the content-aware glue that static config cannot express.

## How it works

The plugin contributes `PreToolUse` hooks (`hooks/hooks.json` → `hooks/guard.mjs`, a zero-dependency Node
script). The matcher is `Bash|PowerShell`, so on Windows hosts the native PowerShell tool is gated too —
shell commands are checked regardless of which shell tool runs them. On each matching call the hook decides:

| Control | Tool | Decision | What it catches |
|---------|------|----------|-----------------|
| **Commit-trailer guard** | `Bash` / `PowerShell` | **deny** | `git commit` messages with AI-attribution trailers (`Co-Authored-By:` Claude/Anthropic, "Generated with Claude Code") — including commits behind git global options (`git -C <path> commit`, `git -c k=v commit`). The only hard block. |
| **Safety gate** | `Bash` / `PowerShell` | **ask** | Irreversible / sensitive commands: force-push (`--force`, `--force-with-lease`, `-f`, `+refspec`), recursive force deletes (`rm -rf` incl. split/long flags, `git clean` with an f-flag, PowerShell `Remove-Item`/`ri`/`del -Recurse -Force`), version bumps, and access to secrets / auth / `.env` / ssh keys (`id_rsa`, `id_ed25519`). `process.env` and git's `credential.helper` key are recognized as false positives and allowed. |

The gates are deliberately **non-exhaustive**: close respellings of these categories, not a growing
denylist (low-maintenance over reach).

**Posture:** ask-by-default (the human stays in control); `deny` only for the unambiguous trailer rule. The
hook **fails open** — if it errors or gets unparseable input, the operation is allowed, so a malfunction
never blocks your work. It is a floor-raiser, **not a security boundary** (a determined agent can bypass a
hook); pair it with the permissions baseline below.

**Claude-only:** this pillar relies on Claude Code's `PreToolUse` hook API, so it is Claude-only by nature.

## Coexistence with other governance

The guard only ever emits `deny` or `ask`; on `allow` it stays silent. Under Claude Code's
most-restrictive-wins merge of hook decisions and permissions, this means eunomai can only **tighten** —
it can never loosen a decision made by another plugin's hooks or by managed `permissions`. Organizations
extend the floor with their own hooks/permissions, or through two environment variables read by the runner:

| Variable | Values | Default | Effect |
|----------|--------|---------|--------|
| `EUNOMAI_TRAILER_RULE` | `deny` · `ask` · `off` | `deny` | Action taken by the commit-trailer rule. |
| `EUNOMAI_EXTRA_GATES` | path to a JSON file | unset | File of `[{"pattern": "...", "reason": "..."}]` entries appended to the ask-gates. An unreadable file, invalid JSON, or an invalid regex is silently ignored (fail-open). |

Two honest limits of the fail-open posture. First, if `node` is missing from `PATH` the hook command
itself fails and the floor is **silently disabled** — treat the guard as a convenience layer, not a control
you can attest to. Second, the gates match raw command text without parsing shell quoting, so a trigger
string quoted *as data* (e.g. a commit message that merely mentions a recursive delete) can still raise a
false `ask`. Both are residual and accepted: fixing the latter would mean parsing shell quoting, against
the low-maintenance principle.

## Recommended permissions baseline

The hooks handle content-aware checks; for **static path rules** use Claude Code's native `permissions`
instead — it is the right tool and needs no eunomai code. Copy this starting point into your settings
(`.claude/settings.json` for the project, or user settings) and adapt the paths to your repo:

```json
{
  "permissions": {
    "deny": [
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Read(**/*.pem)",
      "Read(**/id_rsa)",
      "Read(**/id_ed25519)"
    ],
    "ask": [
      "Read(**/secrets/**)",
      "Read(**/credentials/**)",
      "Edit(**/.env)",
      "Edit(**/.env.*)"
    ]
  }
}
```

`deny` blocks outright; `ask` escalates to you. Treat this as a baseline to extend, not an exhaustive list.

## Testing

The decision logic is a pure function (`hooks/decide.mjs`) with unit tests:

```bash
node --test "hooks/*.test.mjs"
```
