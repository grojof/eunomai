---
type: tutorial
title: "Using eunomai"
description: "Install eunomai and apply it to a new or existing project, end to end."
tags: [getting-started, install, onboard]
updated: 2026-06-25
---

# Using eunomai

How to install eunomai and apply it to a new or existing project, end to end. This is the spine; the
per-pillar pages under [`../reference/`](../reference/) are the reference.

## Prerequisites

- **Node ≥ 20** (for the `projection/` tooling and the hooks).
- **Claude Code** (the plugin host).
- **OpenSpec CLI** for the SDD pillar — installed separately (eunomai reuses it, doesn't bundle it):
  ```bash
  npm i -g @fission-ai/openspec
  ```

## Install eunomai as a plugin

eunomai is a Claude Code plugin published through a marketplace. Install it from the **git repository**
(you need access to the private repo):

```text
/plugin marketplace add grojof/eunomai        # the marketplace (contains .claude-plugin/marketplace.json)
/plugin install eunomai@eunomai               # plugin@marketplace
/reload-plugins                               # activate without restarting
```

Or, for local development, from a **clone** — point at the directory instead:

```text
/plugin marketplace add /path/to/eunomai
```

This makes available, in the target project:

- the **skills** — `eunomai-onboard`, `eunomai-living-docs`, `eunomai-skill-finder` (namespaced by the plugin);
- the **safe-controls hooks** — `PreToolUse` guardrails (they resolve via `${CLAUDE_PLUGIN_ROOT}`).

> **Everything ships with the plugin.** The skills, the safe-controls hooks, **and** the read-only checks CLI
> (`docs-check`, `provenance-check`) all install with eunomai — the CLI as a single self-contained bundle
> (`tools/dist/cli.cjs`), so there is no build step. Run it via
> `node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" <command>`.

## Apply eunomai to a project (new or existing)

Run the cold-start orchestrator — it analyzes the project, establishes docs, seeds conventions, audits skills,
and then steps aside:

```text
/eunomai:eunomai-onboard
```

It will, with you in control:

1. **Analyze** the stack, existing docs, and skills, and ask about the project's purpose/domain/audience.
2. **Docs** → establish the living-docs structure: a lean `README.md` index + `docs/` topic pages (or create
   them from scratch when none exist).
3. **Seed** conventions adapted to the project: a lean `CLAUDE.md`, an `openspec/config.yaml` layer, the
   permissions baseline, and the hooks wiring.
4. **Skills** → audit any existing skills via `eunomai-skill-finder` and record provenance.
5. **Hand off** to the steady-state pillars. eunomai is dispensable from here — everything it seeded lives in
   your project's own files (zero lock-in).

## Day-to-day workflow

- **Spec-driven change (SDD):** `/opsx:explore` → `/opsx:propose <name>` → `/opsx:apply` → `/opsx:archive`
  (artifacts in `openspec/`). See [the ADR](../decisions/0001-adopt-openspec/).
- **Safe controls:** the hooks fire automatically — commit-trailer **deny**, and **ask** before
  force-push / `rm -rf` / version bumps / secret access. See [safe-controls.md](../reference/safe-controls.md).
- **Living docs:** invoke `eunomai-living-docs` to refresh project docs; keep the README index honest. See
  [living-docs.md](../reference/living-docs.md).
- **Skills:** use `eunomai-skill-finder` to adopt/create/audit skills behind the trust gate. See
  [skill-finder.md](../reference/skill-finder.md).
- **Checks:** `node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" docs-check` and `… provenance-check` are
  read-only and belong in your gate.

## Authoring note

`CLAUDE.md` is the single authored source of truth. Claude-only (see ADR-0004): there are no generated
instruction files and no cross-tool projection — edit `CLAUDE.md` directly.
