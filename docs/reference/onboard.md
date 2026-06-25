# Onboard (connector / bootstrap)

The one-shot starting point that applies eunomai to a new or existing project, then steps aside. It is the
**cold-start**; the pillars are the **steady-state**. `eunomai-onboard` establishes; living-docs,
skill-finder, the hooks, and OpenSpec maintain.

## Project root vs workspace

onboard does **not** assume "the project = the current directory". A workspace can have an **environment repo**
at the root (dotfiles, tooling config) with one or more **nested** project repos, and may be **multirepo**. The
eunomai layer anchors at each **project root**, never the workspace root by default — so onboard begins with a
read-only **workspace survey** and lets the user confirm scope (*detect, don't assume*) — see the flow below.

## What it does

```
  workspace (may be an env repo + nested project repos, or multirepo)
    0. survey → workspace-survey subagent maps repos (root + nested), remotes, manifests;
               proposes env vs project; USER confirms scope + where the layer anchors
    1. analyze (stack, docs, skills) + gather input via a structured interview — per confirmed project root
    2. docs   → living-docs standard: content tree (Diátaxis) + project surface
               (the mandatory community-health files), restructured or created from scratch;
               from-scratch interviews crystallize into ADRs + a glossary explanation page
    3. seed   → lean CLAUDE.md (declares the project's boundary + paths) · openspec/config.yaml ·
               permissions baseline · hooks wiring
    4. skills → invoke eunomai-skill-finder (audit)
    5. drive docs-check + provenance-check to green  — run from the project root
    6. hand off to the steady-state pillars → step aside
       (multirepo: steps 1–6 run independently per project; env root gets at most a
        minimal delegating CLAUDE.md, with consent)
```

## The structured interview

onboard gathers author input — and recovers knowledge when creating docs from scratch — through a **structured
interview**, not a form dump: **one question at a time**, **recommend a default** per question, and **explore
the codebase first** when a question is answerable from code (don't ask what you can detect). It stays
human-in-control and skippable. When creating docs from scratch, the answers crystallize into the living-docs
standard — non-trivial choices become **ADRs** (`docs/decisions/`) and the domain vocabulary becomes a
**glossary** explanation page. (`eunomai-living-docs` uses the same technique to recover thin or missing docs.)

## Principles it honours

- **Establish, don't maintain** — ongoing work belongs to the per-pillar skills; onboard delegates.
- **One-shot, dispensable** — everything it seeds lives in the project's own files; remove eunomai and the
  project still works (zero lock-in).
- **Orchestrate, don't reimplement** — it reuses the pillars rather than duplicating them.
- **No conformance engine** — "onboarded" means the existing checks (`docs-check`, `provenance-check`) pass;
  there is no new check and no continuous cross-project audit (that was the abandoned governance tower).

## The seed

The conventions onboard drops in are **derived from eunomai's own live, dogfooded files** (its `CLAUDE.md`,
`openspec/config.yaml`, `docs/reference/safe-controls.md`) and adapted to the target — not copies that could drift.
