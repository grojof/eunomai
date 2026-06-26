---
type: reference
title: "Living docs"
description: "The v2 project-docs standard: Diátaxis as a lens via type, a knowledge-domain coverage lens, an OKF-routable substrate, a product-shaped map, and a deterministic frontmatter gate."
tags: [living-docs, docs, okf, diataxis, kdd]
updated: 2026-06-26
---

# Living docs

Keeping a project's **user-facing** documentation fresh, **dev-loved**, and **routable for AI**. The v2
standard (see [decisions/0005-living-docs-v2](decisions/0005-living-docs-v2/)) rests on four ideas, each
drawn from a real source:

| Idea | From | What it means |
|------|------|---------------|
| **Diátaxis as a lens** | [Diátaxis](https://diataxis.fr/how-to-use-diataxis/) (its own guidance: a compass, not a blueprint) | the content *mode* is a page-level lens, carried in a `type` field — **not** a mandated folder tree |
| **Routable substrate** | [OKF](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) | frontmatter + path-as-identity + a link-graph → legible to humans **and** agents |
| **Product-shaped map** | Stripe docs | the README is a map organized by **surface/journey**, with a quickstart and real examples |
| **Deterministic gate** | eunomai's own posture | `docs-check` enforces frontmatter **shape**, never prose; AI judgment stays out of the gate |

…governed by one principle above all (see [decisions/0006-docs-single-source-of-truth](decisions/0006-docs-single-source-of-truth/)):

## Single source of truth (one fact, one home)

**One fact lives in exactly one home — everything else links.** It is the convergence of GitHub README
best-practice (link out, don't duplicate), KDD (single source of truth), OKF (`path = identity`), and Diátaxis
(structure emerges). The homes:

- **README** — the front door / map: links, never restates.
- **`CLAUDE.md`** — the authored conventions (Claude-only source of truth).
- **ADRs** (`docs/decisions/`) — the decisions (the *why*).
- **`docs/*.md`** — only user-facing content that doesn't fit the README **and** isn't a convention or a
  decision.
- **community-health files** — the GitHub surface; exactly **one** `CONTRIBUTING.md`.

**The "earns its place" test:** before writing a page, ask *is this fact already canonical in `CLAUDE.md`, an
ADR, or the code?* → **link, don't restate**. A page earns its place only when it is the single home for its
content. The `eunomai-living-docs` skill applies this as an **anti-duplication lens** — it surfaces pages or
sections that duplicate another home and proposes a **merge or link** (human-in-control). This is judgement,
not a gate rule: `docs-check` stays shape-only and never judges duplication.

## The frontmatter (the routable substrate)

Every page under `docs/` carries YAML frontmatter. **Path = identity** (`docs/safe-controls.md` *is* the
"safe-controls" concept); pages link to each other to form a navigable graph; the README is the graph's root
map.

```yaml
---
type: reference            # REQUIRED — the Diátaxis mode (the lens): tutorial | how-to | reference | explanation | decision
title: Safe controls       # REQUIRED
description: …             # REQUIRED — one line, for human recall and AI routing
tags: [safe-controls, hooks]   # recommended — grouping / graph
audience: maintainer       # optional — newcomer | maintainer (Stripe-style layering)
related: [skill-finder]    # optional — explicit graph edges (body links also count)
updated: 2026-06-25        # optional — freshness
---
```

`type` is **required** and machine-checked; `tags` is recommended; `audience`/`related`/`updated` are optional.

## Diátaxis as a lens (the `type` field)

The four Diátaxis modes are a **lens to keep each page pure** — one page, one mode (mixing modes is the #1
cause of confusing docs). In v2 the mode lives in `type`, not in a folder:

- **tutorial** — learning-oriented, a guided first run.
- **how-to** — task-oriented recipes (getting-things-done).
- **reference** — information-oriented facts, one capability per page.
- **explanation** — understanding-oriented; the why, concepts, charter.
- **decision** — ADRs (dev-facing; a series under `docs/decisions/`, out of the indexed map).

Diátaxis's own authors say it is *"a guide, a map to check you're in the right place,"* and *not* a mandate to
create empty folders. So **folders are a convenience**: stay flat while small; a surface is promoted to its own
folder only when it grows (~3+ pages) — the structure *emerges*.

## Knowledge domains (a second, orthogonal lens)

Diátaxis classifies a page's **mode** (*how* it is written). It says nothing about **domain** (*what it is
about*). The [KDD lens](knowledge-driven-development.md) adds that second axis — the six knowledge domains from
the AWS Builder article: **business · product · technical · operational · historical · AI-ready**. The
`eunomai-living-docs` skill uses them as a **coverage lens**: *which domains has this project left
under-captured?* The classic failure is rich **technical** how-to with **operational** (deploy/observability),
**historical** (why we chose this), and **AI-ready** knowledge missing — the very context an agent needs.

This lens is **judgement, not structure**: it adds **no required frontmatter field**, mandates **no
page-or-folder-per-domain**, and is **never a `docs-check` rule**. A page still declares exactly one Diátaxis
`type`; domain is a completeness check the skill surfaces as suggestions, governed by the *minimal sufficient
information* rule — the **"earns its place" test** under [Single source of truth](#single-source-of-truth-one-fact-one-home)
— so it never pushes toward heavy documentation.

Two KDD principles ride alongside the domains:

- **Ownership.** System-critical knowledge needs a named owner or it degrades. During a refresh the skill
  **surfaces unowned critical areas** as a suggestion to assign — recorded lightly (free-form in the page), not
  a registry. It never invents or assigns owners, and ownership is never gated.
- **Evolve / detect drift.** Knowledge must move with the system. Drift detection is **not** net-new: it is the
  existing one-shot, read-only [`coherence-auditor`](#the-two-layer-guarantee-deterministic-gate--ai-diagnostic)
  delegation — *"has the code changed without the knowledge updating?"* — surfaced for the human, never a
  continuous engine.

## The README as a map (product-shaped)

The root `README.md` is the **map**, not a flat link list. Organized by **surface/journey** (Stripe-style),
it gives — in order — what a developer needs to get oriented fast:

1. **At a glance** — what it is · who it's for · why, in 2–3 sentences.
2. **An architecture diagram** — a Mermaid/C4 "at a glance" picture (see Diagrams).
3. **Quickstart** — install → first useful result, fast.
4. **The surface** — a routed index: *new here* → *the pillars* → *go deeper*.

The README never inlines long-form content that belongs in a page.

## The dev-quality bar (Stripe-drawn)

A page earns its place when it: leads with the answer; shows **real, runnable examples** where applicable; is
**layered** (a newcomer path and a maintainer depth, via `audience`); and keeps reference **scannable** (tables,
one mode per page). *Documentation is a product.*

## Diagrams (Mermaid + C4)

Use [Mermaid](https://mermaid.js.org/) (GitHub-native), **one idea per diagram**: **C4** for architecture
(Context → Container), **flowchart** for a process, **sequence** for interactions over time, **class/erDiagram**
for structure, **stateDiagram** for lifecycles. For an unfamiliar project, delegate the read-only derivation to
the **`codebase-cartographer`** agent and adapt its proposal — you place and confirm it.

## The two-layer guarantee (deterministic gate + AI diagnostic)

The reliability of the docs comes from **two layers that must stay separate**:

| Guarantee | Mechanism | Blocks? |
|-----------|-----------|---------|
| Pages are **routable** (frontmatter shape) + links/index resolve | `docs-check` (**deterministic**) | ✅ gate |
| Docs **tell the truth** about the code (coherence, stale versions) | the `coherence-auditor` agent (**AI, one-shot**) | ❌ human resolves |
| The `type`/mode is *apt* (not just present) | the `eunomai-living-docs` skill (lens, suggests) | ❌ judgment |

**AI judgment never enters the gate** — that would be non-deterministic (a flaky gate guarantees nothing) and
the abandoned governance tower. The deterministic part *gates*; the AI part *diagnoses*.

## `docs-check` (the deterministic floor)

```bash
node tools/dist/cli.cjs docs-check
```

Read-only; non-zero on divergence. It verifies: every README→`docs/` link resolves; every in-scope page is
reachable from the map; **every in-scope page has valid frontmatter shape** (`type` in the allowed set,
non-empty `title`/`description`); and the mandatory community-health files are present. It checks **shape, not
prose** — `docs/decisions/` (ADRs) are out of scope. Part of the gate.

## The project surface (community-health files)

Alongside the content, the standard requires the files GitHub recognizes (anchored to GitHub Community
Standards), enforced by `docs-check`: **mandatory** `README.md` · `LICENSE` · `SECURITY.md` · `CONTRIBUTING.md`
(at a GitHub-detectable path — root / `.github/` / `docs/`) · `CHANGELOG.md`; the rest (`CODE_OF_CONDUCT.md`,
issue/PR templates, `CODEOWNERS`, …) optional.

## Keeping it fresh

The **`eunomai-living-docs`** skill refreshes docs toward this standard (human-in-control, never auto-rewrites):
updates the README map, keeps frontmatter and the index honest, applies the `type` lens, and surfaces knowledge
that belongs at a higher activation state. In a workspace with nested/multiple repos it surveys first, operates
per **project root**, and reports per repo. Thin/missing docs are recovered via the **structured interview**.
