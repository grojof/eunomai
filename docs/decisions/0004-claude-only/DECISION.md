# Decision 0004 — Go Claude-only; OpenSpec as the sole external dependency

**Date:** 2026-06-25 · **Status:** accepted · **Pillar:** cross-cutting (architecture)

## Decision

eunomai commits **fully to Claude Code** and drops the "Copilot best-effort" half entirely — **Option B**.
Concretely:

- **Remove Copilot** from the principles, README, and docs; no `copilot-instructions.md`, no "if Copilot…"
  caveats.
- **Retire the cross-tool projection** (`rulesync`) and **`eunomai.yaml`** — they existed for Copilot parity.
  `compile` / `compile --check` (drift of generated tool files) go with them.
- **OpenSpec is the sole external dependency** — the SDD engine and the historical record of decisions and
  development.
- **Keep the read-only checks** (`docs-check`, `provenance-check`) — Claude-agnostic and valuable — rehomed as a
  small self-contained CLI under a non-"projection" name.
- **Consolidate to a single open-standard authored instruction file** (`AGENTS.md`); `CLAUDE.md` becomes a
  trivial replica or unnecessary (exact mechanism settled in the rebase).

This supersedes the "Claude-first, Copilot best-effort" principle.

See [explore.md](explore.md) and [options.md](options.md) for the full analysis.

## Why (in one line)

The Copilot half never carried the real power (skills, hooks, subagents are Claude-native) yet cost a
dependency, a config file, a generated artifact, and "strange variations" — so dropping it makes the tool
**simpler and more robust** while losing nothing the target audience uses.

## Context

eunomai is **100% developer-oriented on Claude Code**. **Claude-only ≠ vendor lock-in**:
[ADR-0003](../0003-okf-as-projection-target/DECISION.md) keeps the knowledge **substrate** open and portable
(plain Markdown + frontmatter), so choosing one agent **host** is orthogonal to the seeded artifacts staying
dispensable and copyable. Anyone can still take the seeded base and adapt it for another host — the standard is
open even though the tool targets Claude.

## What changes in the repo (direction; executed in the rebase)

- Principles / README / getting-started: drop Copilot; state Claude-only + OpenSpec-only-dependency.
- `projection/`: remove the Copilot/rulesync role and `eunomai.yaml`; keep `docs-check` + `provenance-check` as
  a self-contained CLI renamed away from "projection".
- Instruction files: `AGENTS.md` as the single authored, open-standard source; `CLAUDE.md` trivial or dropped
  (resolves the `AGENTS.md ↔ CLAUDE.md` replica question behind the base-block idea).
- Migrations are **not** a concern — this lands as a clean, coherent rebase, not an incremental shim.

## The trade we accepted

We forfeit best-effort Copilot reach. Accepted — it was never load-bearing, and the removal is a net
simplification consistent with *keep it simple*, *don't reinvent*, *low maintenance over reach*, and zero
lock-in.

## Related decisions (NOT decided here)

- **Token efficiency / model routing** (specific models for specific tasks) — a future capability direction; its
  own ADR.
- The **base activator block** and **single-file replica mechanism** (T1) — an implementation thread this ADR
  unblocks, captured when proposed.

## How to use it

- Treat Claude Code as the only host; do not add multi-tool projection back.
- Keep new knowledge in open Markdown + frontmatter (ADR-0003) so the standard stays portable despite the
  single host.
- When the rebase lands, `AGENTS.md` is the authored source; the checks live as a small standalone CLI.
