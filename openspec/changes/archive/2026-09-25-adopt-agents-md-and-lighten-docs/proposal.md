# Proposal: adopt AGENTS.md and lighten the docs standard

## Why

- **The instruction file.** `AGENTS.md` became the open standard for agent instructions, and Claude Code
  reads it natively from 2.1.277. It reads it hierarchically, as it reads `CLAUDE.md`: parent directories at
  start, a subdirectory's on demand. ADR-0004 chose a single authored `CLAUDE.md` when that was not so. One
  authored file stays the principle; its name should be the one every agent reads.
- **The gate is heavier than the standard.**
  - `docs-check` requires every page to be linked from the root README, although the standard says
    "reachable from the map". A nested index (`docs/<area>/README.md`), the natural shape of a growing
    project, fails it.
  - It fails a private repository for lacking a `LICENSE`.
  - It never looks at the instruction file, the one agents read most.
- **The skill is heavier than a refresh needs.** `eunomai-living-docs` runs four lenses, seven KDD
  principles, profiles and structure options on every refresh, in 218 lines. Users want a light touch that
  keeps the standard's core.
- **Onboard copies the hook scripts into a project from a source clone**, which leaves forks that never
  update.

## What changes

- **`AGENTS.md` is the instruction file** (ADR-0007 supersedes that part of ADR-0004).
  - eunomai's own `CLAUDE.md` becomes `AGENTS.md`.
  - Onboard seeds `AGENTS.md` and offers to migrate an existing `CLAUDE.md`: a rename, content unchanged.
  - When both exist, onboard warns that Claude Code reads only `CLAUDE.md` in that directory.
  - Older Claude Code versions get a one-line `@AGENTS.md` bridge.
  - `CLAUDE.local.md` stays, because it has no `AGENTS.md` equivalent.
- **`docs-check`:**
  - reachability follows links through `docs/` pages, so nested indexes work;
  - links between pages and in `AGENTS.md` / `CLAUDE.md` are checked;
  - missing community-health files are warnings, and a failure only with `--require-health`, which
    eunomai's own CI keeps.
- **`eunomai-living-docs`** keeps a short core flow. The lenses, the KDD principles, the profile catalog and
  the structure options move to a reference the skill reads only when a refresh needs them.
- **The living-docs page:**
  - leads with the core (five rules);
  - notes that folders by area are fine, and that the mode lives in `type`;
  - adds Mermaid colour guidance;
  - states what the OKF alignment actually is;
  - anchors `CHANGELOG.md` to Keep a Changelog rather than to GitHub.
- **Onboard** no longer copies hook scripts. The hooks come from the installed plugin, and from a source
  clone the plugin is installed from that clone as a local marketplace. Onboard also offers the guard and
  attribution setup through `eunomai-safe-controls`.

## Reuse vs net-new

- **Reused:** Claude Code's native `AGENTS.md` reading and its import syntax, the existing checks CLI and
  skills.
- **Net-new, and small:** the link walk in `docs-check`, one ADR, and one skill reference file carved out of
  the existing skill. No new check, no new dependency.

## Non-goals

- Supporting both instruction files as authored sources, or generating one from the other.
- Editing past ADRs: 0004 stays as written, and 0007 supersedes the one point.
- Enforcing the Mermaid guidance or prose in the gate. The gate stays shape-only.

## Impact

- `tools/src/docs.ts`, `tools/src/run.ts` and their tests; CI.
- `AGENTS.md` (renamed from `CLAUDE.md`).
- Onboard and living-docs skills.
- Docs: living-docs, onboard, getting-started, vision, org-adoption, KDD, checks; README; CHANGELOG.
- ADR-0007.
- **Breaking, for projects:**
  - a project that relied on `docs-check` failing without a `LICENSE` must pass `--require-health`;
  - a stale link inside a page or in `AGENTS.md` / `CLAUDE.md` now fails the check;
  - the check's messages changed wording;
  - a project that keeps `CLAUDE.md` keeps working, and onboard only offers the rename.
