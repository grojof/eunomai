---
type: how-to
title: "Refresh living docs"
description: "Keep project docs fresh and structurally honest."
tags: [living-docs, docs]
updated: 2026-06-25
---

# Refresh the living docs

How to keep a project's docs fresh and structurally honest. The standard (Diátaxis layout, the lean README
index) is in the [living-docs](living-docs.md) reference; this is the recipe.

## Refresh the content (the skill)

Invoke the skill — it never silently rewrites; it proposes and keeps you in control:

```text
/eunomai:eunomai-living-docs
```

It will:

1. Update the **README** summary to match reality.
2. **Sync the index** with what actually exists under `docs/` (add missing links, drop dead ones).
3. **Split overgrown sections** — when a README section outgrows a couple of paragraphs, move it to a page in
   the matching Diátaxis folder (`guides/` · `reference/` · `explanation/`) and leave a link.

## Where a new page goes

Match the page to **one** Diátaxis purpose (mixing kinds is the main cause of confusing docs):

| The page answers… | Folder |
|-------------------|--------|
| "how do I…?" (task recipe) | `guides/` |
| "what exactly is…?" (the facts) | `reference/` |
| "why / what's the idea?" | `explanation/` |
| "why did we decide…?" (ADR, dev-facing) | `decisions/` — **not** indexed |

Every in-scope page (under `guides/`, `reference/`, `explanation/`) **must be linked from the README index**,
or `docs-check` will flag it as orphaned.

## Verify the structure (the check)

```bash
node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" docs-check
```

Read-only; non-zero exit on drift. It checks **structure** — every README→`docs/` link resolves and every
in-scope page is indexed — not prose accuracy (that's the skill's job). See
[run-the-checks](run-the-checks.md).

## Diagrams

Use [Mermaid](https://mermaid.js.org/) (GitHub-native), one idea per diagram, and only when it's clearer than
prose: flowchart (process), sequence (interactions), C4 (architecture), class/erDiagram (structure),
stateDiagram (lifecycle).
