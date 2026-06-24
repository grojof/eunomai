## Context

eunomai's project-facing docs already aim for a shape — a lean `README.md` as index + summary + links over
deeper `docs/` topic pages — but nothing keeps it true. Today the README is hand-maintained; this session
already touched it three times, and `docs/` mixes project-docs (`VISION.md`, `safe-controls.md`) with dev-docs
(`decisions/`, `development/`). The repo already has a Node/TS tooling home (`projection/`, with tsup + eslint
+ vitest and a `compile --check` read-only verify) and a proven pattern: ask-by-default, fail-open guardrails
(safe-controls). Living docs is pillar 2, scoped to **project-docs only** (dev-docs stay with the SDD/handoff
flow).

## Goals / Non-Goals

**Goals:**
- A documented project-docs structure standard (lean README index → `docs/` topic pages).
- A human-invoked refresh skill that keeps the README summary + index aligned with `docs/`.
- A read-only integrity check (README↔`docs/` links + index coverage) that joins the gate, dogfooded here.

**Non-Goals:**
- Dev-docs (PROJECT-STATE, ADRs), auto-rewriting docs, drift-nudge hooks, doc generation from code, or any
  check of prose *accuracy* (only structural integrity is enforceable).

## Decisions

### Decision 1 — Reuse skills + Markdown + the projection `--check` pattern; build only the standard, skill, and check (reuse-first)

We *adopt* Claude Code skills (the refresh mechanism), plain Markdown (no custom doc format), and the existing
read-only **`--check`** pattern (verify + non-zero exit, no writes). The *net-new* glue is just: the
project-docs structure standard, the `eunomai-living-docs` skill, and the README↔`docs/` link/index check.

- *Why over alternatives:* a bespoke docs engine or a static-site generator would reinvent tooling and add
  maintenance for no gain — the value is the thin convention + a check that keeps it honest, exactly like
  projection's drift check keeps generated files honest.

### Decision 2 — Ship the check inside the existing `projection/` package

The integrity check is implemented in `projection/` (the repo's Node/TS tooling home) as a distinct command
(e.g. `docs-check`), reusing its tsup build, eslint, and vitest gate.

- *Why over alternatives:* a second npm package or a standalone `.mjs` (like the hooks) would duplicate the
  toolchain and the gate. One package, two clearly-named commands, is lower maintenance. Trade-off: it widens
  `projection/` beyond "Copilot projection" — acceptable, since it is really the project's Node tooling home;
  keep the commands separate so each stays focused.

### Decision 3 — Define "in-scope project-docs" by a small dev-docs denylist

The check considers `README.md` and project-doc pages under `docs/`, **excluding** `docs/decisions/` and
`docs/development/` (dev-docs). Scope is a denylist of dev-doc directories, not an allowlist of pages.

- *Why over alternatives:* a denylist needs no update when a new project-doc page is added (it is in scope by
  default and must be indexed); an allowlist would need editing on every new page — more maintenance and an
  easy way to silently drop coverage.

### Decision 4 — Integrity only enforces structure; the skill owns prose freshness

The check parses standard Markdown links: a README→`docs/` relative link must resolve to a file, and every
in-scope `docs/` page must be a link target somewhere in the README. It does **not** judge whether the prose
is up to date — that is the skill's job, with the human in the loop.

- *Why over alternatives:* prose-accuracy checking is unreliable and high-maintenance; structural integrity is
  cheap, deterministic, and catches the common rot (moved/renamed/orphaned pages). Honest scope beats a fragile
  "is this paragraph stale?" heuristic.

## Risks / Trade-offs

- **"Freshness" is partly unenforceable** (a summary can be wrong while all links resolve) → the check owns
  structure only; the skill owns prose. Documented so expectations are honest.
- **Scope creep into dev-docs** → explicit denylist + non-goal; dev-docs stay with the SDD/handoff flow.
- **Coupling to a README index format** → parse only standard Markdown links, no custom syntax, so authors are
  unconstrained.
- **Widening `projection/`** → keep `docs-check` a separate command from `compile`; revisit a split only if the
  package grows unwieldy.
- **Low-maintenance check:** one standard doc + one skill + one check command on the existing gate, plus a
  two-directory denylist. No new deps, no registry, no generation.
