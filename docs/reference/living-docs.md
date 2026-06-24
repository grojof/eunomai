# Living docs

Keeping eunomai's **project-facing** documentation fresh and structurally honest. Project-docs only —
ADRs under `docs/decisions/` are dev-facing and out of the index.

## The structure standard

The root `README.md` is a **lean front door** — a short project summary plus an *index of links* into
deeper docs; it never inlines long-form content. The depth lives under `docs/`, organized by the
[**Diátaxis**](https://diataxis.fr/) framework so each page has one clear purpose (mixing kinds is the
main cause of confusing docs):

| Folder | Diátaxis type | Holds | Answers |
|--------|---------------|-------|---------|
| `guides/` | how-to (+ tutorials) | getting-started, task recipes | "how do I…?" |
| `reference/` | reference | one page per capability — the facts | "what exactly is…?" |
| `explanation/` | explanation | the why, concepts, charter | "why / what's the idea?" |
| `decisions/` | (ADRs) | architecture decision records | "why did we decide…?" (dev-facing) |

**Every in-scope page** (under `guides/`, `reference/`, `explanation/`) **is linked from the README index.**
When a README section outgrows a couple of paragraphs, it becomes a page in the matching folder and the
README keeps a link. `decisions/` is excluded from the index.

## Diagrams (Mermaid + C4)

Use [Mermaid](https://mermaid.js.org/) (GitHub-native) and **match the diagram type to the story**, one idea
per diagram: **flowchart** for a process/decision, **sequence** for interactions over time, **C4** for
architecture (Context → Container → Component), **class/erDiagram** for code/data structure, **stateDiagram**
for lifecycles. Add a diagram only when it's clearer than prose — not as decoration.

## Keeping it fresh

Two pieces, mirroring the rest of eunomai (human-in-control + a read-only check):

- **`eunomai-living-docs` skill** — invoke it to refresh project docs toward the standard: update the README
  summary, sync the index with what exists under `docs/`, and split overgrown sections into topic pages. It
  keeps you in control; it never silently rewrites docs.
- **`docs-check`** — a read-only integrity check (no writes, non-zero exit on divergence):

  ```bash
  node projection/dist/cli.cjs docs-check
  ```

  It verifies every README→`docs/` link resolves and every in-scope `docs/` page is reachable from the README
  index. It enforces *structure*, not prose accuracy — that is the skill's job. It runs as part of the gate.
