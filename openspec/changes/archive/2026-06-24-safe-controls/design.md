## Context

eunomai's safety conventions currently live as prose in `openspec/config.yaml` (no AI-attribution commit
trailers; "stop and ask before version bumps, migrations, irreversible/outward-facing actions, or touching
auth/secrets/permissions"). They are injected into SDD artifact prompts but are not *enforced* at tool-call
time — an agent can ignore them. Claude Code exposes a hooks API that can intercept tool calls before they
run and return a decision (`allow` / `ask` / `deny`). The plugin already ships `skills/`; it has no `hooks/`
layer yet, and `plugin.json` registers no hooks. The primary user runs Windows, and the plugin targets
mixed-OS users, so any hook code must be cross-platform. This design covers HOW to turn the two conventions
into enforced, low-maintenance guardrails.

## Goals / Non-Goals

**Goals:**
- Enforce the AI-trailer and "stop-and-ask" conventions at tool-call time via Claude Code hooks the plugin
  contributes automatically on install.
- Reuse native primitives (hooks API, `permissions`, `${CLAUDE_PLUGIN_ROOT}`); add only the content-aware
  glue that static config cannot express.
- Stay cross-platform and dependency-free; keep the rule surface small and the default posture safe (ask,
  fail-open).

**Non-Goals:**
- Not a sandbox or a security boundary — a determined agent can bypass a hook (commit via API, message via
  file). This raises the floor, it does not seal the box.
- Not a replacement for Claude Code `permissions`; not an exhaustive denylist of dangerous commands.
- No Copilot enforcement (no equivalent hook API), no telemetry/audit infrastructure.

## Decisions

### Decision 1 — Reuse Claude Code native hooks + permissions; build only content-aware checks (reuse-first)

We adopt the **native Claude Code hooks API** for the three content-aware guardrails (commit-trailer deny,
safety-gate ask, authored-source ask) and the **native `permissions`** system (shipped as a documented
copy-paste baseline) for the static path rules (secrets/auth globs). eunomai's net-new code is *only* the
logic that permissions cannot express: inspecting a commit message body, matching command patterns, and
mapping a generated file back to its authored source.

- *Why over alternatives:* Doing path matching in hook code would reimplement `permissions` — more code,
  more maintenance, and a worse UX than the native allow/ask/deny lists. Conversely, permissions alone
  cannot read a `git commit` message body or a command's shape, so the content-aware checks must be hooks.
  Splitting along "static path → permissions, content-aware → hook" keeps each rule where it is cheapest.

### Decision 2 — Plugin-contributed `hooks/hooks.json` wired with `${CLAUDE_PLUGIN_ROOT}`

The plugin ships `hooks/hooks.json` registering `PreToolUse` matchers (`Bash` for the commit/safety checks,
`Edit|Write` for the authored-source guard), each invoking a bundled script via `node
"${CLAUDE_PLUGIN_ROOT}/hooks/<script>.mjs"`. Installing the plugin contributes the hooks with no settings
edits.

- *Why over alternatives:* Asking users to hand-edit `settings.json` is high-friction and not idempotent;
  plugin-contributed hooks are zero-setup and version with the plugin.

### Decision 3 — Single zero-dependency Node (`.mjs`) hook, pure-function core

Hook logic is one Node ESM script with no runtime dependencies: it reads the tool-call JSON from stdin and
writes a decision JSON to stdout. The decision logic is a pure function (`(toolName, toolInput) → decision`)
in a sibling module so it can be unit-tested with `node:test` without spawning a process. Invoking `node`
directly (not a shell) sidesteps Windows/POSIX shell differences.

- *Why over alternatives:* A POSIX shell script is not cross-platform (user is on Windows). Compiling the
  hook through the `projection/` TypeScript build couples a tiny runtime script to a build step and slows
  every tool call; a plain `.mjs` with a pure core stays testable without that overhead. Low-maintenance
  check: one `hooks.json` + one `.mjs` + one test file + one docs snippet, zero deps, no registry.

### Decision 4 — Ask-by-default, deny only for AI trailers; fail-open on error

Only the commit-trailer rule (unambiguous, eunomai-specific) returns `deny`. Everything else returns `ask`
to keep the human in control, and any hook error/timeout/parse failure returns `allow` (fail-open).

- *Why over alternatives:* Hard-blocking on heuristic command patterns produces false-positive lockouts and
  support burden; a guardrail that crashes the session is worse than no guardrail. Ask + fail-open optimizes
  for low maintenance and trust.

### Decision 5 — Small, centralized, principled rule set

The escalation patterns (force-push, `rm -rf`, version bump, secret/auth access) live in one small table in
the core module, easy to read and extend, explicitly *not* an exhaustive denylist.

- *Why over alternatives:* An ever-growing curated denylist is exactly the high-maintenance trap the project
  avoids elsewhere (cf. trust-gated skills are a criteria gate, not a registry).

## Risks / Trade-offs

- **False positives interrupt legitimate work** → default to `ask` (not `deny`), keep the pattern set small,
  fail open. The human can always proceed.
- **Bypassable guardrail (commit via API, message via file, base64-obfuscated command)** → accepted; this is
  a floor-raiser, not a security boundary (see Non-Goals). Documented as such.
- **Claude Code hook API drift** → depend only on the documented stable hook JSON contract (`PreToolUse`
  input + decision output); keep the surface tiny so an API change touches one script.
- **Windows shell quoting in `hooks.json`** → invoke `node` with an explicit script path and pass data via
  stdin, avoiding shell-specific quoting entirely.
- **Copilot has no hook API** → Claude-only by necessity; record the gap in `AGENTS.md` and re-project.
- **Trailer-detection false negatives** (novel attribution wording) → match a documented set of known
  trailers; treat the rule as best-effort enforcement of a convention, not airtight prevention.
