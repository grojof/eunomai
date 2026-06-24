# Living docs

Keeping eunomai's **project-facing** documentation fresh and structurally honest. Project-docs only —
dev-docs (`docs/decisions/`, `docs/development/`) stay with the SDD / handoff flow and are out of scope.

## The structure standard

- **`README.md` is a lean front door** — a short project summary plus an *index of links* into deeper docs.
  It does not inline long-form content.
- **`docs/` holds the depth** — one topic per page (e.g. this file, `VISION.md`, `safe-controls.md`).
- **Every in-scope `docs/` page is linked from the README index.** When a README section outgrows a couple
  of paragraphs, it becomes a `docs/` page and the README keeps a link.

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
