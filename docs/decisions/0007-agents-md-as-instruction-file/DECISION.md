# Decision 0007 — AGENTS.md is the single authored instruction file

**Date:** 2026-09-25 · **Status:** accepted · **Pillar:** cross-cutting (architecture) · **Supersedes:** the
instruction-file point of [ADR-0004](../0004-claude-only/DECISION.md)

## Decision

The single authored agent-instruction file is **`AGENTS.md`**, not `CLAUDE.md`.
- **The principle stands:** one authored file, no generated copies, no cross-tool projection. eunomai stays
  Claude-only as a host (the rest of ADR-0004 stands); only the file's name changes.
- **eunomai's own `CLAUDE.md` becomes `AGENTS.md`.**
- **Onboard seeds `AGENTS.md`** and offers to migrate a project's existing `CLAUDE.md`:
  - a rename, with the content unchanged;
  - when both files exist, a warning and a proposed merge;
  - for older Claude Code, a one-line `CLAUDE.md` holding `@AGENTS.md`.
- **`CLAUDE.local.md` stays**, because it has no `AGENTS.md` equivalent.

## Why

ADR-0004 kept `CLAUDE.md` because it was the file Claude Code loaded. That changed:
- Claude Code reads `AGENTS.md` natively from 2.1.277, hierarchically, as it reads `CLAUDE.md`: parent
  directories at start, a subdirectory's on demand;
- `AGENTS.md` is the open standard other agents read too.

Naming the one file after the standard costs nothing on the host, and leaves a project's instructions
readable by any agent without a projection step. That is the zero-lock-in principle, applied to the file
name.

## Facts this rests on (Claude Code memory documentation)

- **Both files in one directory:** Claude Code reads `CLAUDE.md` only, so a project must not keep both as
  sources.
- **Not read:** `AGENTS.local.md`, `AGENTS.override.md`, or a `.agents/` directory.
- **The bridge:** `@AGENTS.md` inside `CLAUDE.md` is the documented bridge for versions before 2.1.277, and
  does not double-read.

## The trade we accepted

Every reference to `CLAUDE.md` in eunomai's docs, skills and specs changes once. Projects that keep
`CLAUDE.md` keep working, and onboard only offers the rename.
