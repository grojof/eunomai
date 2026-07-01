---
type: reference
title: "Checks (the read-only gate)"
description: "The docs-check and provenance-check CLI, and how to run it as a gate."
tags: [checks, gate]
updated: 2026-07-01
---

# Checks (the read-only gate)

eunomai's two **read-only** structural checks, shipped as a single self-contained bundle in
[`tools/`](../tools/) — no build step for consumers. They enforce *structure*, never prose; they **write
nothing** and belong in your gate (CI / pre-merge) so structure and provenance can't silently drift.

## The commands

Inside a Claude Code session the skills invoke the CLI via `${CLAUDE_PLUGIN_ROOT}` — that variable resolves
**only** in plugin hook/skill contexts, never in your terminal. To run the checks yourself, use a **clone of
this repo** and run from your project root:

```bash
node <clone>/tools/dist/cli.cjs docs-check          # README↔docs/ links + frontmatter + community-health files
node <clone>/tools/dist/cli.cjs provenance-check    # every skill covered by the audit registry
```

| Check | Passes when | Fails on |
|-------|-------------|----------|
| **`docs-check`** | every README→`docs/` link resolves, every in-scope page is indexed with valid frontmatter, and the mandatory community-health files are present | broken links · orphaned pages · invalid/missing frontmatter · missing health files |
| **`provenance-check`** | every skill under `skills/` (and `.claude/skills/`) has a registry entry | uncovered skills · invalid registry (warns on gaps like `unpinned`) |

Both run with plain `node` and no `node_modules` (dependencies are inlined into the committed bundle).
`docs-check` excludes `docs/decisions/` (ADRs are dev-facing, out of the index).

## Run it as a gate

In CI / pre-merge, check out a **pinned** clone of eunomai next to your project and run the CLI from the
project root (GitHub Actions shown; any CI translates directly):

```yaml
- uses: actions/checkout@v4                 # your project
- uses: actions/checkout@v4                 # a pinned clone of eunomai
  with:
    repository: grojof/eunomai
    ref: v0.2.0                             # pin a released tag (or a commit SHA)
    path: .eunomai
- run: |
    node .eunomai/tools/dist/cli.cjs docs-check
    node .eunomai/tools/dist/cli.cjs provenance-check
```

This is the same gate eunomai runs on itself (from its own root: `node tools/dist/cli.cjs docs-check`).

## Fixing failures

- **`docs-check`** → add the missing README link (or remove the dead one), or fix a page's frontmatter; see
  [refresh-living-docs](refresh-living-docs.md).
- **`provenance-check`** → record the skill in `eunomai-skills-audit.md` with its real SHA; see
  [manage-skills](manage-skills.md).

## Why a CLI and not a hook

These are *gate* checks — deliberate, read-only verifications. The runtime, ask-by-default guardrails are a
separate pillar: the `PreToolUse` hooks (see [safe-controls](safe-controls.md)). The package's own dev loop
lives in [`CONTRIBUTING.md`](../CONTRIBUTING.md).
