# Safe controls

eunomai turns its written safety conventions into **enforced** Claude Code guardrails. It reuses Claude
Code's native primitives and adds only the content-aware glue that static config cannot express.

## How it works

The plugin contributes `PreToolUse` hooks (`hooks/hooks.json` → `hooks/guard.mjs`, a zero-dependency Node
script). On each matching tool call the hook decides:

| Control | Tool | Decision | What it catches |
|---------|------|----------|-----------------|
| **Commit-trailer guard** | `Bash` | **deny** | `git commit` messages with AI-attribution trailers (`Co-Authored-By:` Claude/Anthropic, "Generated with Claude Code"). The only hard block. |
| **Safety gate** | `Bash` | **ask** | Irreversible / sensitive commands: force-push, `rm -rf`, version bumps, and access to secrets / auth / `.env`. |
| **Authored-source guard** | `Edit` / `Write` | **ask** | Direct edits to generated artifacts (`CLAUDE.md`, `.github/copilot-instructions.md`) — pointing you back to the authored `AGENTS.md`. |

**Posture:** ask-by-default (the human stays in control); `deny` only for the unambiguous trailer rule. The
hook **fails open** — if it errors or gets unparseable input, the operation is allowed, so a malfunction
never blocks your work. It is a floor-raiser, **not a security boundary** (a determined agent can bypass a
hook); pair it with the permissions baseline below.

**Claude-only:** Copilot has no equivalent pre-tool hook API, so this pillar is Claude-first by necessity.

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
