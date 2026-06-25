---
name: eunomai-living-docs
description: Refresh a project's user-facing docs (root README + docs/) toward eunomai's lean-index, Diátaxis-organized standard — update the summary, sync the README index with docs/ pages, and place/split content into the right Diátaxis folder. Use when project docs have drifted, after shipping a feature, or when docs-check reports drift. Project-docs only (ADRs are out of scope).
---

# eunomai-living-docs

Keep **project-facing** documentation fresh and structurally honest. Scope is project-docs only: the root
`README.md` and pages under `docs/`. ADRs under `docs/decisions/` are dev-facing and out of scope. You
assist; the human stays in control — never silently rewrite docs.

## Structure (Diátaxis)

The README is a lean index → links into `docs/`, organized by [Diátaxis](https://diataxis.fr/) so each page
has one purpose. Place every page in the folder that matches its kind:

- `guides/` — **how-to** (and tutorials): getting-started, task recipes.
- `reference/` — **reference**: one page per capability, just the facts.
- `explanation/` — **explanation**: the why, concepts, charter.
- `decisions/` — ADRs (dev-facing, excluded from the README index).

## Diagrams (Mermaid + C4)

Use [**Mermaid**](https://mermaid.js.org/) for diagrams (GitHub renders it natively). **Match the diagram type
to the story**, and keep each one simple (one idea per diagram):

- **flowchart** — a process or decision logic.
- **sequence** — interactions between components over time (API calls, message flow).
- **C4** — software **architecture**, at the right zoom: Context → Container → Component (don't go to Code).
- **class / erDiagram** — code or data structure.
- **stateDiagram** — status changes / lifecycles.

Reach for a diagram when prose would be harder to follow than a picture — not as decoration.

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

## Flow

1. **Survey.** (Workspace first if relevant — see above.) For the chosen project root, read its `README.md`
   and list the pages under `docs/` (excluding `docs/decisions/`). Note what changed recently (git log /
   current work).
2. **Run the check — from the project root** (`cd` into it; the check resolves relative to `cwd`):
   `node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" docs-check` to see broken links and orphaned pages.
3. **Refresh, in order:**
   - **Summary** — update the README's one-paragraph summary so it matches what the project now is.
   - **Index** — ensure every in-scope `docs/` page is linked from the README; remove links to pages that no
     longer exist.
   - **Split** — if a README section is long-form, move it into the matching Diátaxis folder
     (`guides/` · `reference/` · `explanation/`) and leave a link.
4. **Confirm before applying.** Show the proposed edits; apply them with the user's agreement.
5. **Verify.** Re-run `docs-check` until it exits 0. If docs changes touched `AGENTS.md`, re-project
   (`node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" compile`).

## Boundaries

- **Structure, not invention.** Keep docs authored; do not generate API docs from code.
- **Project-docs only.** Do not edit ADRs here — those follow the SDD / handoff flow.
- **No auto-rewrite hook.** This is invoked deliberately, consistent with eunomai's ask-by-default posture.
