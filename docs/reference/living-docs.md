# Living docs

Keeping eunomai's **project-facing** documentation fresh and structurally honest. Project-docs only —
ADRs under `docs/decisions/` are dev-facing and out of the index.

A well-formed project has **two layers**, and the standard covers both:

| Layer | Answers | Anchored to | Lives in |
|-------|---------|-------------|----------|
| **Content** | "how is the documentation organized?" | [Diátaxis](https://diataxis.fr/) | `docs/` (+ the README index) |
| **Project surface** | "what makes this a well-formed GitHub project?" | [GitHub Community Standards](https://docs.github.com/communities) | repo root / `.github/` |

Diátaxis organizes the *content*; it says nothing about the *community-health files* GitHub itself recognizes.
Both are part of the standard — don't reinvent either; anchor to the source.

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

## The project surface (community-health files)

The files GitHub recognizes and surfaces in a repo's *Community Standards* profile. The standard defines a
**mandatory** set (enforced by `docs-check`) and an **optional** set (recommended, not enforced). A file
counts as present in any location GitHub recognizes — repo root, `.github/`, or `docs/`.

| File | Status | Purpose / anchor |
|------|--------|------------------|
| `README.md` | mandatory | the lean index (see above) — already covered by the link/index check |
| `LICENSE` | **mandatory** | the terms of use; without it the project is "all rights reserved" by default |
| `SECURITY.md` | **mandatory** | how to report a vulnerability — pairs with [safe-controls](safe-controls.md) / [base-skills](base-skills.md) |
| `CONTRIBUTING.md` | **mandatory** | how to contribute; place it where GitHub auto-links it (root / `.github/` / `docs/`), **not** buried under `docs/guides/` |
| `CHANGELOG.md` | **mandatory** | notable changes — [Keep a Changelog](https://keepachangelog.com/) + [SemVer](https://semver.org/) |
| `CODE_OF_CONDUCT.md` | optional | community expectations (e.g. Contributor Covenant) |
| issue / PR templates (`.github/`) | optional | `ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md` |
| `CODEOWNERS`, `SUPPORT.md`, `FUNDING.yml` | optional | review routing, support channels, sponsorship |

> **Placement matters.** GitHub auto-detects `CONTRIBUTING.md` in the root, `.github/`, or `docs/` — but
> **not** in `docs/guides/`. Keep the GitHub-discoverable file at a recognized path; depth (a full dev guide)
> can still live under `docs/guides/` and be linked from it.

## Diagrams (Mermaid + C4)

Use [Mermaid](https://mermaid.js.org/) (GitHub-native) and **match the diagram type to the story**, one idea
per diagram: **flowchart** for a process/decision, **sequence** for interactions over time, **C4** for
architecture (Context → Container → Component), **class/erDiagram** for code/data structure, **stateDiagram**
for lifecycles. Add a diagram only when it's clearer than prose — not as decoration.

## Keeping it fresh

Two pieces, mirroring the rest of eunomai (human-in-control + a read-only check):

- **`eunomai-living-docs` skill** — invoke it to refresh project docs toward the standard: update the README
  summary, sync the index with what exists under `docs/`, and split overgrown sections into topic pages. It
  keeps you in control; it never silently rewrites docs. In a **workspace** with nested or multiple repos it
  first runs a read-only **workspace survey**, operates on a chosen **project root** (running `docs-check`
  from that root), and reports doc state per repo — it never assumes the workspace root is the project. A
  plain single repo adds no extra ceremony. When a project's docs are **thin or missing**, it recovers the
  knowledge with a **structured interview** (one question at a time, recommend a default, explore the codebase
  first — the same technique `eunomai-onboard` uses), human-in-control.
- **`docs-check`** — a read-only integrity check (no writes, non-zero exit on divergence):

  ```bash
  node projection/dist/cli.cjs docs-check
  ```

  It verifies every README→`docs/` link resolves, every in-scope `docs/` page is reachable from the README
  index, and the **mandatory community-health files are present** (in any recognized location). It enforces
  *structure*, not prose accuracy — that is the skill's job. It runs as part of the gate.
