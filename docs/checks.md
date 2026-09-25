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
node <clone>/tools/dist/cli.cjs docs-check          # links, reachability, frontmatter; health files as warnings
node <clone>/tools/dist/cli.cjs provenance-check    # every skill covered by the audit registry
```

| Check | Passes when | Fails on |
|-------|-------------|----------|
| **`docs-check`** | every README link into `docs/`, every link between reachable pages, and every relative link in `AGENTS.md`/`CLAUDE.md` resolves; every in-scope page is reachable from the README (directly or through other pages) with valid frontmatter | broken links · unreachable pages · invalid/missing frontmatter · missing health files only with `--require-health` (a warning otherwise) |
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
    ref: v0.6.1                             # pin a released tag (or a commit SHA)
    path: .eunomai
- run: |
    node .eunomai/tools/dist/cli.cjs docs-check --require-health   # drop the flag for a private repo
    node .eunomai/tools/dist/cli.cjs provenance-check
```

This is the same gate eunomai runs on itself (from its own root: `node tools/dist/cli.cjs docs-check
--require-health`).

## Fixing failures

- **`docs-check`** →
  - an unreachable page: link it from the README or from a page the README reaches, such as a folder index;
  - a broken link in the README, in a page or in `AGENTS.md` / `CLAUDE.md`: fix or remove it (examples belong
    in code spans or fences, which the check ignores);
  - a frontmatter issue: fix the page's frontmatter;
  - a missing community-health file: add it, or drop `--require-health` for a private repository.

  See [refresh-living-docs](refresh-living-docs.md).
- **`provenance-check`** → record the skill in `eunomai-skills-audit.md` with its real SHA; see
  [manage-skills](manage-skills.md).

## Why a CLI and not a hook

These are *gate* checks — deliberate, read-only verifications. The runtime, ask-by-default guardrails are a
separate pillar: the `PreToolUse` hooks (see [safe-controls](safe-controls.md)). The package's own dev loop
lives in [`CONTRIBUTING.md`](../CONTRIBUTING.md).
