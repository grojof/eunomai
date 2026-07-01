---
type: how-to
title: "Refresh living docs"
description: "Keep project docs fresh and structurally honest."
tags: [living-docs, docs]
updated: 2026-07-01
---

# Refresh the living docs

How to keep a project's docs fresh and structurally honest. The v2 standard (frontmatter with a Diátaxis
`type` lens, a product-shaped README map, single source of truth) is in the [living-docs](living-docs.md)
reference; this is the recipe.

## Refresh the content (the skill)

Invoke the skill — it never silently rewrites; it proposes and keeps you in control:

```text
/eunomai:eunomai-living-docs
```

It will:

1. **Survey the scope** — pick the project root (in a nested/multirepo workspace it surveys first and asks;
   never assumes the workspace root), then read the README and the pages under `docs/` (ADRs in
   `docs/decisions/` are out of scope).
2. **Run a coherence pass** — `docs-check` for structure, plus the review lenses (type aptness, domain
   coverage, duplication, knowledge that belongs at a higher activation state).
3. **Propose the edits** — README map, frontmatter, splits, and lens findings, as suggestions.
4. **You confirm** — nothing is applied without your agreement.
5. **Apply, then verify** — re-run `docs-check` until it exits 0.

## Where a new page goes

A page declares its Diátaxis mode in the **`type` frontmatter field**
(`tutorial | how-to | reference | explanation | decision`) — never in a content-type folder tree
(`guides/`/`reference/`/`explanation/` folders are a v2 anti-pattern). Stay **flat** while small; promote a
*surface* to its own folder only when it grows. Every in-scope page must be linked from the README map, or
`docs-check` flags it as orphaned.

## Verify the structure (the check)

`${CLAUDE_PLUGIN_ROOT}` resolves only inside plugin hook/skill contexts — within a Claude Code session the
skill runs the check via the plugin root automatically. To run it yourself, use a clone of this repo, from
your project root:

```bash
node <clone>/tools/dist/cli.cjs docs-check
```

Read-only; non-zero exit on drift. It checks **structure and frontmatter shape** — every README→`docs/` link
resolves, every in-scope page is indexed — never prose accuracy (that's the skill's job). See
[checks](checks.md).
