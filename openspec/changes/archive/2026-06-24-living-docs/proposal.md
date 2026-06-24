## Why

A project's user-facing documentation rots as the project evolves: the root `README` summary goes stale, its
index links to docs that moved or were renamed, and new `docs/` pages never get linked from anywhere. eunomai
already values a specific shape — a **lean README as index + summary + links** over deeper `docs/` pages — but
nothing keeps that shape true over time. The **living docs** pillar makes project docs *stay* fresh and
structurally honest: a human-invoked refresh skill plus a read-only integrity check that fails when the
README↔`docs/` wiring drifts.

## What Changes

- Define eunomai's **project-docs structure standard**: the root `README.md` is a *lean* index + summary +
  links (the front door); deeper documentation lives under `docs/`, organized by topic; the README links to
  those pages.
- Add an on-demand **`eunomai-living-docs` skill** that refreshes project docs to that standard — updates the
  summary, keeps the README index in sync with what exists in `docs/`, and helps split overgrown sections out
  into topic pages. Human-invoked (ask-style), never auto-rewriting.
- Add a **docs integrity check** (read-only, non-zero exit on divergence) that verifies: every README→`docs/`
  link resolves, and every project-doc page under `docs/` is reachable from the README index. Mirrors the
  `projection compile --check` pattern.
- **Dogfood**: bring eunomai's own `README.md` + `docs/` into conformance and wire the check into the gate.
- **Reuse vs net-new (connector-first):** *reuse* Claude Code skills (the mechanism), plain Markdown, and the
  projection tool's read-only **`--check`** pattern (verify + exit code). eunomai's *net-new* glue is only the
  **project-docs structure standard**, the **refresh skill**, and the **README↔`docs/` link/index check**.

## Capabilities

### New Capabilities
- `living-docs`: the project-docs structure standard (lean README index + summary + links → `docs/` topic
  pages), an on-demand refresh skill, and a read-only README↔`docs/` integrity check.

### Modified Capabilities
<!-- None — `safe-controls` is the only existing spec and is unaffected. -->

## Impact

- **New:** an `eunomai-living-docs` skill; an integrity-check script + tests; possibly restructured `docs/`.
- **`README.md` + `docs/`:** brought into conformance with the standard (dogfood).
- **`AGENTS.md`:** document the pillar and how to run the check (re-projected to `CLAUDE.md` /
  `copilot-instructions.md`, kept idempotent).
- **Gate:** if the check ships as code (Node/TS), it joins `typecheck && lint && test`.
- **No new runtime dependencies; no doc generation from code; no telemetry.**

## Non-goals

- **Not dev-docs.** `PROJECT-STATE.md`, ADRs, and SDD artifacts are dev-docs / OpenSpec material, maintained
  by the SDD + handoff flow — explicitly out of this pillar (project-docs only).
- **Not auto-rewriting docs** via a hook, and **not a continuous drift-nudge** — the refresh is human-invoked,
  consistent with the ask-by-default posture; the check is read-only.
- **Not a doc generator** that extracts API docs from code; docs stay authored, the skill assists.
- **Not duplicating OpenSpec** — specs and change artifacts are not project-docs.
