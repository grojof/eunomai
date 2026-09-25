---
name: eunomai-living-docs
description: Refresh a project's user-facing docs (root README + docs/) — keep the README a map that reaches every page, every page's frontmatter valid (type/title/description), each fact in one home, and every link working, then run docs-check. Use when docs have drifted, after shipping a change the docs should reflect, or when docs-check reports a broken link or an unreachable page. Deeper lenses (doc-set profiles, structure options, the structured interview, knowledge-domain coverage, activation routing) are applied on request or when docs are being established. Project-docs only; may create ADRs from interview answers, never edits existing ones.
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

## README quality and prose register (always)

Two bars apply to everything this skill authors or refreshes, whatever the profile or structure:

- **The root README is always user-friendly.** It describes the repository for a first-time reader — what it
  is, who it is for, why it exists — with a diagram when a picture carries the story better than prose, and
  **references onward** instead of inlining depth. The `docs/` pages may be as technical and structured as the
  destination demands; the README never is.
- **Self-contained, timeless register** for all authored prose (README + `docs/`): no conversational or
  session references ("as you said", "as discussed", allusions to a chat or review), no meta-commentary about
  how the document was produced, no filler — logical, direct, every sentence earns its place. Dated records
  (CHANGELOG, ADRs) stay dated by design. During a refresh, **surface violations** and propose self-contained
  wording; this is authoring judgement, never a `docs-check` rule.

## Diagrams (Mermaid + C4)

Use [**Mermaid**](https://mermaid.js.org/) for diagrams (GitHub renders it natively). **Match the diagram type
to the story**, and keep each one simple (one idea per diagram):

- **flowchart** — a process or decision logic.
- **sequence** — interactions between components over time (API calls, message flow).
- **C4** — software **architecture**, at the right zoom: Context → Container → Component (don't go to Code),
  drawn as a flowchart with subgraphs; Mermaid's own C4 syntax is still experimental.
- **class / erDiagram** — code or data structure.
- **stateDiagram** — status changes / lifecycles.

Reach for a diagram when prose would be harder to follow than a picture — not as decoration. For an
architecture diagram of an unfamiliar project, delegate the read-only derivation to the
**`codebase-cartographer`** subagent and adapt its proposed Mermaid/C4 — you place and confirm it, the agent
only proposes.

**Colour, when it carries meaning.** Use a small set of semantic classes the whole project shares — for
example *action*, *decision*, *safeguard*, *stop*, *data* — each with a fill, a stroke and an explicit text
colour that reads in both light and dark themes (`classDef step fill:#dbeafe,stroke:#2563eb,color:#1e3a8a`).
Keep labels meaningful on their own: colour never carries meaning alone. Prefer a single row or a short
column, and `<br/>` for line breaks inside labels (a literal `\n` is printed as is).

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

## Single source of truth (anti-duplication lens)

**One fact, one home — everything else links** (see `docs/living-docs.md` and ADR-0006). Before authoring or
keeping a page, apply the **"earns its place" test**: *is this fact already canonical in `AGENTS.md`, an ADR,
or the code?* → propose to **link, not restate**. During a refresh, **surface duplicates** — a page that
restates `AGENTS.md`/an ADR, or two pages stating the same fact (e.g. a `reference` and a `how-to` page that
both list the same commands) — and propose a **merge or link**. The author decides; you never auto-merge. The
deterministic gate is unaffected (duplication is judgement, not a gate rule).

## Flow

1. **Survey.** (Workspace first if relevant — see above.) For the chosen project root, read its `README.md`
   and list the pages under `docs/` (excluding `docs/decisions/`). Note what changed recently (git log /
   current work).
2. **Run the check — from the project root** (`cd` into it; the check resolves relative to `cwd`):
   `node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" docs-check` to see broken links (README, pages, `AGENTS.md`) and pages
   not reachable from the README. Missing community-health files are warnings unless `--require-health`.
3. **Refresh, in order:**
   - **Map** — keep the README's at-a-glance summary, diagram, quickstart, and surface-organized index in line
     with reality; ensure every in-scope `docs/` page is reachable and remove links to pages that no longer exist.
     **Same-pass sync:** any page you add, remove, or rename gets its README-map update in the *same* set of
     proposed edits — the page set and the map are never left divergent for a later pass.
   - **Frontmatter** — every `docs/` page carries valid frontmatter (required `type`/`title`/`description`);
     set `type` by the page's Diátaxis mode (the lens — one page, one mode). **Coexist with foreign
     frontmatter**: keys owned by another toolchain (`sidebar_position`, `layout`, …) are preserved
     untouched; if `type` is already taken with different semantics, surface the collision (adapt, rename,
     or exclude those pages from scope) — never overwrite it silently.
   - **Split** — if a README section is long-form, move it into a `docs/` page (flat while small) and leave a
     link; let folders emerge only when a surface grows.
   - **Core lenses** (judgement, suggestion-only) — **single source of truth** (duplicates to merge or link)
     and **prose register** (README friendliness, session prose made self-contained). The deeper lenses —
     domain coverage, activation routing, doc-set profiles, structure options, the interview — only on
     request or when establishing docs (see *Deeper lenses*).
4. **Confirm before applying.** Show the proposed edits; apply them with the user's agreement.
5. **Verify.** Re-run `docs-check` until it exits 0.

## Deeper lenses

Read `references/lenses.md` in this skill when the author asks for one of these, or when docs are being
established (a new project, onboard, thin docs):
- **Doc-set profiles** — the starter README skeleton and page set by repo destination
  (`references/doc-profiles.md`).
- **Structure options** — 2–3 folder layouts with a recommended default; folders by area are fine, the mode
  lives in `type`, never folders per Diátaxis type.
- **The structured interview** — for thin or missing docs: one question at a time, a recommended default,
  explore first.
- **Knowledge-domain coverage** — the six KDD domains, and unowned system-critical knowledge.
- **Activation routing** — knowledge that belongs in `AGENTS.md`, a hook, a skill or a spec rather than prose.

## Boundaries

- **Structure, not invention.** Keep docs authored; do not generate API docs from code.
- **Project-docs only.** ADRs: this skill may **create** one when a structured-interview answer crystallizes
  a non-trivial decision; it never **edits** existing ADRs (immutable records — superseding is a new ADR
  via the SDD / handoff flow).
- **Suggest and delegate, don't activate.** When routing knowledge to a higher activation state, you only
  surface the suggestion and name the owning pillar — you never write `AGENTS.md`, author a hook or a skill, or
  create a spec yourself, and you never auto-apply the move. The author decides; the pillar enacts.
- **No auto-rewrite hook.** This is invoked deliberately, consistent with eunomai's ask-by-default posture.
