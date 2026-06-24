## 1. Hooks layer scaffolding & wiring

- [ ] 1.1 Create `hooks/` and `hooks/hooks.json` registering `PreToolUse` matchers — `Bash` and `Edit|Write`
  — each invoking `node "${CLAUDE_PLUGIN_ROOT}/hooks/guard.mjs"` via stdin (req: *Cross-platform,
  zero-dependency hooks*).
- [ ] 1.2 Reference the hooks layer from `.claude-plugin/plugin.json` only if the plugin does not
  auto-discover `hooks/`; verify the hooks fire in a Claude Code session (req: *Cross-platform,
  zero-dependency hooks*).

## 2. Core decision logic (pure, testable)

- [ ] 2.1 Add `hooks/decide.mjs` exporting a pure `decide(toolName, toolInput) → { decision, reason }`
  function; `guard.mjs` is the thin stdin/stdout runner that calls it (req: *Cross-platform, zero-dependency
  hooks*).
- [ ] 2.2 Implement the commit-trailer `deny` rule: detect AI-attribution trailers in `git commit` messages
  (`Co-Authored-By:` Claude/Anthropic, "Generated with Claude Code") and deny with a naming reason (req:
  *Commit-trailer guard*).
- [ ] 2.3 Implement the safety-gate `ask` rule with a small centralized pattern table: force-push, `rm -rf`,
  version bump, secret/auth/`.env` access; ordinary commands pass through (req: *Safety-gate escalation for
  irreversible or sensitive operations*).
- [ ] 2.4 Implement the authored-source `ask` rule: `Edit`/`Write` to `CLAUDE.md` or
  `.github/copilot-instructions.md` returns ask with a reason pointing to `AGENTS.md` + projection; other
  paths pass through (req: *Authored-source guard*).
- [ ] 2.5 Wrap the runner so any throw, timeout, or unparseable input resolves to `allow` (req: *Fail-open
  default*).

## 3. Tests

- [ ] 3.1 Add `hooks/decide.test.mjs` (`node:test`) covering each spec scenario: trailer deny + clean allow,
  each safety-gate ask + ordinary allow, authored-source ask + authored-source allow, and the fail-open path
  (req: all of the above).

## 4. Permissions baseline & docs

- [ ] 4.1 Add a copy-pasteable native `permissions` baseline (deny/ask globs for secrets/auth) to the docs
  with adoption instructions (req: *Recommended native-permissions baseline*).
- [ ] 4.2 Document the safe-controls pillar in `AGENTS.md` — the three hooks, the ask-by-default/fail-open
  posture, the permissions baseline, and the Claude-only Copilot gap (non-goal: Copilot enforcement).

## 5. Validation gate

- [ ] 5.1 Run the hook tests: `node --test hooks/`.
- [ ] 5.2 Re-project authored docs and verify idempotency: `node projection/dist/cli.js compile` then
  `node projection/dist/cli.js compile --check` (zero drift).
- [ ] 5.3 Validate the change: `openspec validate safe-controls --strict`.
- [ ] 5.4 Run the gate (code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
