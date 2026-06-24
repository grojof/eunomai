# eunomai — AI Agent Guide (AGENTS.md)

A focused, **Claude-first AI workspace**, packaged as a Claude Code plugin, built on existing tools (Claude
Code native + rulesync) — not reinventing them. Four pillars: SDD/SPDD, living docs, safe controls, and
trust-gated skills. See `docs/VISION.md` for the charter.

This file is the **single source of truth** for AI agents working *on* eunomai. The tool-specific files
(`CLAUDE.md`, `.github/copilot-instructions.md`) are **generated** from it by the `projection/` tool — edit
rules here, not there.

## Conventions
- Files are UTF-8, newlines are LF, with a final newline at EOF.
- Conventional Commits in the imperative mood. One logical change per commit. No AI-attribution trailers.
- TypeScript, ESM, Node ≥ 20 (in `projection/`). Match the surrounding code; small functions, early returns.
- Validate inputs at boundaries; handle errors explicitly. Never weaken validation to "make it work".

## Principles (do not break)
- **Don't reinvent** — stand on Claude Code native config + rulesync; build only the tailored glue.
- **Claude-first, Copilot best-effort** — where Copilot adds gaps, go Claude-only and document it.
- **Low maintenance over reach.** Trust-gated skills are a *criteria* gate, never a hand-curated registry.
- **`AGENTS.md` is authored, never generated** (zero lock-in). Projection is delegated to rulesync.
- **Idempotency is sacred** — a second projection with unchanged inputs changes 0 files. Generated files
  (`CLAUDE.md`, `.github/copilot-instructions.md`) are **committed artifacts**.

## Structure
- `.claude-plugin/plugin.json` + `skills/` (+ `agents/`, `hooks/`) — the Claude Code plugin (the deliverable).
- `projection/` — the Copilot best-effort tool (`compile` + `compile --check`), an npm/TS package.
- `docs/` — `VISION.md` (charter) + `specs/` (spec-first SDD artifacts).

## Workflow
- Spec-first for non-trivial change: `docs/specs/changes/<n>/` (proposal → spec → design → tasks → verify → archive).
- For the projection tool: `cd projection && npm run typecheck && npm run lint && npm test` before finishing.
