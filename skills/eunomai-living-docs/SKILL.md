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

## When to use

- The README summary or index has drifted from reality.
- A new `docs/` page exists but nothing links to it (or `docs-check` reports an orphan/broken link).
- A README section has outgrown a couple of paragraphs and should become a topic page.

## Flow

1. **Survey.** Read `README.md` and list the pages under `docs/` (excluding `docs/decisions/`). Note what
   changed recently (git log / current work).
2. **Run the check.** `node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" docs-check` to see broken links and orphaned pages.
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
