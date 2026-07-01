---
name: eunomai-living-docs
description: Refresh a project's user-facing docs (root README + docs/) toward eunomai's v2 standard — Diátaxis as a lens via a `type` frontmatter field, a knowledge-domain coverage lens (the six KDD domains), an OKF-routable substrate (frontmatter + path-as-identity + a product-shaped README map), and a deterministic frontmatter gate. Use when docs have drifted, after shipping a feature, or when docs-check reports drift. Project-docs only (may create ADRs from interview answers; never edits existing ones).
---

# eunomai-living-docs

Keep **project-facing** documentation fresh and structurally honest. Scope is project-docs only: the root
`README.md` and pages under `docs/`. ADRs under `docs/decisions/` are dev-facing and out of scope. You
assist; the human stays in control — never silently rewrite docs.

## The v2 standard (see `docs/living-docs.md`)

Docs are a **routable substrate**, dev-loved and AI-legible. Four ideas:

- **Frontmatter on every page** (OKF-style): required `type` + `title` + `description`; recommended `tags`;
  optional `audience`/`related`/`updated`. **Path = identity**; pages link to form a graph; the README is the
  root map. `docs-check` enforces frontmatter **shape** deterministically.
- **Diátaxis as a lens via `type`** (`tutorial | how-to | reference | explanation | decision`) — one page, one
  mode. Diátaxis is a *compass, not a folder mandate*: **folders are convenience** (stay flat while small;
  promote a surface to its own folder only when it grows). The `type` field, not the path, states the mode.
- **README = a product-shaped map** (Stripe-style): at-a-glance summary · an architecture diagram · a
  quickstart · a surface/journey-organized index. Not a flat link list.
- **Dev-quality bar:** lead with the answer · real examples · layered (`audience`) · scannable reference.

ADRs under `docs/decisions/` are dev-facing (`type: decision`), a series excluded from the indexed map.

## Choosing the structure (propose, never assume)

Don't assume the folder layout — **propose 2–3 options** with trade-offs and a **recommended default** by the
project's size/shape, then let the author choose (infer-then-confirm, skippable):

- **Flat** `docs/*.md` — recommended while small (~< 15 pages); navigation is the README map + the `type` field.
- **By surface** `docs/<surface>/` — once a surface reaches ~3+ pages; nest by **semantics/product** (Stripe/OKF
  style), letting the folder *emerge*.
- **Hybrid** — a flat core plus a folder for a surface that has grown.

**Hard rule:** folders are **never** organized by Diátaxis *type* — the mode lives in `type`. If you find
content-type folders (`guides/`/`reference/`/`explanation/`), **flag them as an anti-pattern** and propose
migrating (flatten, or re-nest by surface). The deterministic `docs-check` gate never judges structure — this
is a guided choice, not enforcement.

## Diagrams (Mermaid + C4)

Use [**Mermaid**](https://mermaid.js.org/) for diagrams (GitHub renders it natively). **Match the diagram type
to the story**, and keep each one simple (one idea per diagram):

- **flowchart** — a process or decision logic.
- **sequence** — interactions between components over time (API calls, message flow).
- **C4** — software **architecture**, at the right zoom: Context → Container → Component (don't go to Code).
- **class / erDiagram** — code or data structure.
- **stateDiagram** — status changes / lifecycles.

Reach for a diagram when prose would be harder to follow than a picture — not as decoration. For an
architecture diagram of an unfamiliar project, delegate the read-only derivation to the
**`codebase-cartographer`** subagent and adapt its proposed Mermaid/C4 — you place and confirm it, the agent
only proposes.

## Surfacing stale docs

To find docs that have drifted from the code (or cite stale versions), delegate a one-shot read-only
**`coherence-auditor`** pass: it returns a report of doc↔code drift you resolve with the author. It is a
disposable diagnostic, suggestion-only — never a continuous check, never auto-fixing.

## When to use

- The README summary or index has drifted from reality.
- A new `docs/` page exists but nothing links to it (or `docs-check` reports an orphan/broken link).
- A README section has outgrown a couple of paragraphs and should become a topic page.

## Project root in a workspace

Operate on a **project root**, which may **not** be the current directory. If the workspace has nested or
multiple repos (an environment repo at the root with project repos under it, or a multirepo), first delegate a
read-only survey to the **`workspace-survey`** subagent to identify the project roots, then audit/refresh
against a **chosen project root** and report doc state **per repo** — never assume the workspace root is the
project. In a plain single repo (cwd = project root = workspace) this adds no ceremony: proceed directly.

## Thin or missing docs → the structured interview

When a project root's docs are **thin or missing**, recover its knowledge with a **structured interview**, not
a form dump: ask **one question at a time**, **recommend a default** per question, and **explore the codebase
first** when a question is answerable from code — don't ask what you can detect. Keep it human-in-control;
write the recovered knowledge into the docs standard (and, for non-trivial choices, an ADR). This is the same
technique `eunomai-onboard` uses to create docs from scratch.

## Knowledge-domain coverage (the KDD capture lens)

Diátaxis tells you a page's **mode**; it never asks whether the project's **knowledge domains** are covered.
Apply this second, orthogonal lens (see [`docs/knowledge-driven-development.md`](../../docs/knowledge-driven-development.md))
when establishing or refreshing docs — a **coverage checklist**, surfaced as suggestions, not a gate:

- **business** — needs, rules, constraints, processes, priorities.
- **product** — what's being built, scope, roadmap, acceptance criteria.
- **technical** — architecture, integrations, patterns, conventions, ADRs, contracts.
- **operational** — deploy, monitoring, observability, security, ownership, support.
- **historical** — past decisions, trade-offs, lessons (the most overlooked).
- **AI-ready** — context curated and kept fresh for agents.

Ask: *which domains has this project left materially under-captured for the work an agent must do?* Surface
the gaps as suggestions for the author. The lens is governed by the **seven KDD principles**:

1. **Near the code** — knowledge lives in the repo, not a far wiki.
2. **Minimal sufficient** — capture enough for good decisions, never heavy documentation (the "earns its place"
   test below is this principle).
3. **Decisions matter as much as code** — record the *why*, not only the *what* (→ ADRs).
4. **Dual utility** — written for humans *and* agents.
5. **Ownership** — system-critical knowledge needs a named owner; surface unowned critical areas as a
   suggestion to assign (recorded lightly, free-form — never a registry, never invented, never gated).
6. **Evolve / detect drift** — knowledge moves with the system; surface doc↔code drift via the one-shot
   [`coherence-auditor`](#surfacing-stale-docs) delegation, never a continuous check.
7. **Context, not guesses** — give the agent reliable context rather than letting it fill gaps.

**Boundaries of this lens (hold them):** it adds **no required frontmatter field**, mandates **no
page-or-folder-per-domain**, and is **never a `docs-check` rule** (the deterministic gate stays shape-only). A
page still declares exactly one Diátaxis `type`; domain and ownership are judgement, surfaced for the author to
accept or decline. Sufficient coverage raises **no** suggestion — don't push toward heavy docs.

## Activation routing (knowledge that belongs at a higher state)

Docs are the **passive** end of eunomai's knowledge-activation spectrum (the KDD lens — see
`docs/knowledge-driven-development.md`). Some prose found in a refresh is really knowledge sitting
at the **wrong** state: it would be better *activated* in another pillar.
While refreshing, **notice and surface** such content — naming the owning pillar — then **delegate** the move:

- a recurring **convention** ("always do X / never do Y") → `CLAUDE.md` (🟡 semi-active)
- an enforceable **policy** ("block force-push to main") → a hook via **safe-controls** (🔴 enforced)
- a repeatable **procedure** (step-by-step know-how an agent could run) → a skill via **`eunomai-skill-finder`**
  (🔴 active)
- a trackable **requirement** → an **OpenSpec** spec (🟡 traceable)
- knowledge **already owned by an org skill, plugin, or rule** → **link to the owner and defer** — never
  restate it in project prose (the coexistence contract's incumbent-wins clause, applied to knowledge; it
  also keeps the SSoT lens honest)

This is a **review lens, not a new check**, and not an automatic move. You **suggest and point**; the author
accepts or declines, and the owning pillar performs the actual move. Content that is genuinely explanatory or
reference — its correct passive state — stays where it is; don't route it.

## Single source of truth (anti-duplication lens)

**One fact, one home — everything else links** (see `docs/living-docs.md` and ADR-0006). Before authoring or
keeping a page, apply the **"earns its place" test**: *is this fact already canonical in `CLAUDE.md`, an ADR,
or the code?* → propose to **link, not restate**. During a refresh, **surface duplicates** — a page that
restates `CLAUDE.md`/an ADR, or two pages stating the same fact (e.g. a `reference` and a `how-to` page that
both list the same commands) — and propose a **merge or link**. The author decides; you never auto-merge. The
deterministic gate is unaffected (duplication is judgement, not a gate rule).

## Flow

1. **Survey.** (Workspace first if relevant — see above.) For the chosen project root, read its `README.md`
   and list the pages under `docs/` (excluding `docs/decisions/`). Note what changed recently (git log /
   current work).
2. **Run the check — from the project root** (`cd` into it; the check resolves relative to `cwd`):
   `node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" docs-check` to see broken links and orphaned pages.
3. **Refresh, in order:**
   - **Map** — keep the README's at-a-glance summary, diagram, quickstart, and surface-organized index in line
     with reality; ensure every in-scope `docs/` page is reachable and remove links to pages that no longer exist.
   - **Frontmatter** — every `docs/` page carries valid frontmatter (required `type`/`title`/`description`);
     set `type` by the page's Diátaxis mode (the lens — one page, one mode). **Coexist with foreign
     frontmatter**: keys owned by another toolchain (`sidebar_position`, `layout`, …) are preserved
     untouched; if `type` is already taken with different semantics, surface the collision (adapt, rename,
     or exclude those pages from scope) — never overwrite it silently.
   - **Split** — if a README section is long-form, move it into a `docs/` page (flat while small) and leave a
     link; let folders emerge only when a surface grows.
   - **Review lenses** (judgement, suggestion-only) — apply the three lenses and surface their findings:
     **domain coverage** (under-captured knowledge domains + unowned critical areas), **activation routing**
     (knowledge that belongs at a higher state), and **single source of truth** (duplicates to merge or link).
4. **Confirm before applying.** Show the proposed edits; apply them with the user's agreement.
5. **Verify.** Re-run `docs-check` until it exits 0.

## Boundaries

- **Structure, not invention.** Keep docs authored; do not generate API docs from code.
- **Project-docs only.** ADRs: this skill may **create** one when a structured-interview answer crystallizes
  a non-trivial decision; it never **edits** existing ADRs (immutable records — superseding is a new ADR
  via the SDD / handoff flow).
- **Suggest and delegate, don't activate.** When routing knowledge to a higher activation state, you only
  surface the suggestion and name the owning pillar — you never write `CLAUDE.md`, author a hook or a skill, or
  create a spec yourself, and you never auto-apply the move. The author decides; the pillar enacts.
- **No auto-rewrite hook.** This is invoked deliberately, consistent with eunomai's ask-by-default posture.
