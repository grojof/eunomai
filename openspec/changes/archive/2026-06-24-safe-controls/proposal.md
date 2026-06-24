## Why

eunomai already *states* its safety conventions in `openspec/config.yaml` — never add AI-attribution
commit trailers, and "stop and ask before version bumps, migrations, irreversible/outward-facing actions,
or touching auth/secrets/permissions." But prose in a config file is advisory: an agent may follow it or
may not. The **safe controls** pillar turns those conventions into *enforced* Claude Code hooks, so the
guardrails hold regardless of which model or session is running — closing the gap between what eunomai
promises and what it actually prevents.

## What Changes

- Add a Claude Code **hooks layer** to the plugin (`hooks/hooks.json` + cross-platform hook scripts) that
  the plugin contributes automatically when installed.
- **Commit-trailer guard** — a `PreToolUse(Bash)` hook that **denies** any `git commit` whose message
  carries an AI-attribution trailer (`Co-Authored-By:` Claude/Anthropic, "Generated with Claude Code", and
  the like), with a clear reason. This is the one hard block, because the rule is unambiguous.
- **Safety gate** — a `PreToolUse(Bash)` hook that returns **ask** (escalate to the human) for irreversible
  / outward-facing / sensitive operations: `git push --force`, recursive deletes, version bumps, and
  commands that read or write secrets / auth / `.env`. Mirrors the config's "stop and ask" gate. Prefer
  *ask* over hard *deny* so the human stays in control.
- **Authored-source guard** — a `PreToolUse(Edit|Write)` hook that returns **ask** when a generated artifact
  (`CLAUDE.md`, `.github/copilot-instructions.md`) is edited directly instead of the authored `AGENTS.md`,
  protecting the "authored, never generated / idempotency is sacred" invariant.
- **Reuse vs net-new (connector-first):** we *reuse* Claude Code's native hooks API, `${CLAUDE_PLUGIN_ROOT}`,
  and native `permissions` (static deny/ask path globs for secrets/auth) — and ship a recommended
  permissions snippet rather than reimplementing path matching. eunomai's *net-new* glue is only the
  **content-aware** checks that static permissions cannot express: commit-message inspection, command-pattern
  escalation, and the generated-vs-authored file guard.
- **Claude-first, documented gap:** Copilot has no equivalent pre-tool hook API, so this pillar is
  Claude-only by necessity; `AGENTS.md` records the gap.

## Capabilities

### New Capabilities
- `safe-controls`: enforced pre-tool guardrails contributed by the eunomai plugin — a commit-trailer deny
  rule, an ask-gate for irreversible/sensitive operations, and an authored-source guard — plus a
  recommended native-permissions baseline.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/; this is the first capability. -->

## Impact

- **New files:** `hooks/hooks.json` and one or more cross-platform (Node, zero-dependency) hook scripts.
- **`.claude-plugin/plugin.json`:** wire up the hooks layer if the plugin does not auto-discover `hooks/`.
- **`AGENTS.md`:** document the controls, the Claude-only scope, and the Copilot gap (re-projected to
  `CLAUDE.md` / `.github/copilot-instructions.md` via the projection tool — keep idempotent).
- **Docs:** a recommended `permissions` baseline snippet (deny/ask globs for secrets/auth) for users to opt
  into; no enforcement of Copilot behavior.
- **Cross-platform:** hook scripts must run on Windows and POSIX alike (Node-based), since plugin users vary.
- **No new runtime dependencies, no telemetry/audit infrastructure** (out of scope; YAGNI).

## Non-goals

- Not a sandbox and not a replacement for Claude Code's permission system — eunomai layers on top of it.
- Not a hand-curated denylist of every dangerous command; keep a small, principled, low-maintenance set.
- No Copilot enforcement (no equivalent hook API) — Claude-only, gap documented.
- No audit log, metrics, or telemetry infrastructure.
- Default posture is **ask/escalate**, not hard-block — only the AI-trailer rule is an outright deny.
