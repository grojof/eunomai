## Context

The onboard and living-docs skills were written for the single-repo case, where **cwd = project root =
workspace**. In a real workspace those three diverge: the root may be an *environment* repo (configs/dotfiles)
with one or more **nested** project repos, possibly multirepo. The skills currently seed/check at `cwd`, so
they attack the wrong root and the seeded config misdirects the next agent. The pillars themselves are sound;
what's missing is a **topology model** in front of them.

Grounding finding: `projection/src/docs.ts` and the provenance check already resolve everything relative to
`process.cwd()`. So checking project A is just `cd A && docs-check` — **no checker change is needed**. The
intelligence belongs in the skills' playbooks plus a read-only survey, not in code. This keeps the change
low-maintenance by construction.

## Goals / Non-Goals

**Goals:**
- Make **project root** a first-class, discovered-and-confirmed concept distinct from `cwd` and `workspace`.
- A read-only **workspace survey** that maps repos and proposes a classification; the user confirms scope.
- Seed/anchor per project root; declare boundaries via hierarchical `CLAUDE.md`/`AGENTS.md`; support multirepo
  independently.

**Non-Goals:**
- A workspace manifest/registry; a continuous/cross-project conformance engine; a checker rewrite (`--root`
  deferred); silent scoping; seeding the environment repo without consent; reimplementing the pillars.

## Decisions

### Decision 1 — Make "project root" first-class; detect it with git, not a new format (reuse-first)

Introduce **project root** as the unit the eunomai layer anchors to, discovered by walking the workspace for
`.git` boundaries (root + nested) and reading remotes — plain `git`, no new metadata. `cwd` is only "where the
agent was invoked"; `workspace` is the outer container.

- *Why over alternatives:* a manifest/registry would be a new maintained surface (and the tower's seed). git
  already encodes repo boundaries; reuse it.

### Decision 2 — A read-only survey subagent; facts vs decisions are cleanly split

The survey is delegated to an **Explore-style subagent**: it fans out over folders, stays out of the main
context, and returns a structured map (repos, remotes, manifests, existing `CLAUDE.md`/`AGENTS.md`). It
**reports facts only**; choosing what to track is the **user's decision**, mediated by the skill.

- *Why over alternatives:* doing the survey inline pollutes the main agent's context; letting the subagent
  *decide* scope would violate "detect, don't assume". The split keeps each side honest.

### Decision 3 — Scope via hierarchical CLAUDE.md/AGENTS.md only — no manifest (reuse Claude Code native)

Each project's `AGENTS.md` declares its boundary and paths; a workspace-root `CLAUDE.md` only *delegates*
(points at project dirs, marks the root environment), carrying no per-project conventions. This rides Claude
Code's native hierarchical `CLAUDE.md` discovery — when working in a child, the parent is always loaded, so the
root file must stay **minimal** and impose nothing.

- *Why over alternatives:* a manifest duplicates what authored files + native discovery already express, and
  becomes a registry to maintain. Authored boundaries are also zero-lock-in (they survive eunomai's removal).

### Decision 4 — No checker code change; run checks from the project root (convention over flag)

`docs-check`/`provenance-check` already operate on `cwd`. The skills `cd` into each confirmed project root and
run them there. A `--root <path>` flag (to check several projects in one pass) is **deferred** — pure
ergonomics, added only if a real need appears.

- *Why over alternatives:* changing the checker now adds code + tests for a convenience we don't yet need.
  Convention-first keeps the gate untouched and the change skill-only.

### Decision 5 — Classification is infer-then-confirm, never silent; ambiguous → ask

The survey proposes an environment/project label per repo from heuristics — **project** signals: a project
GitHub remote + a code manifest (`package.json`, `pyproject.toml`, `go.mod`, …); **environment** signals: no
remote / dotfiles-only / the outer container. The skill presents the proposal and proceeds on **one
confirmation**; genuinely ambiguous repos (code but no remote) are **asked about**, not guessed.

- *Why over alternatives:* always-ask-everything is friction; always-infer is the silent-assumption bug. Infer
  + single confirm balances low ceremony with "detect, don't assume".

### Decision 6 — Multirepo = independent per project; no shared layer

Each in-scope project is onboarded on its own (own seed, own `docs-check`/`provenance-check`). The only
cross-cutting artifact is the optional, minimal delegating root `CLAUDE.md`.

- *Why over alternatives:* a shared cross-project layer is the continuous-conformance engine the charter
  rejects. Independence keeps each project self-contained and dispensable.

## Risks / Trade-offs

- **Survey misclassifies a repo** → mitigated by infer-then-confirm + ask-on-ambiguous; never silent.
- **Root CLAUDE.md grows into a registry** → constrained to delegation-only (pointers + "this is environment"),
  no per-project conventions.
- **Deferring `--root`** → accepted; the `cd`-per-project convention covers the need today, and the flag is a
  clean later add if checking many projects at once becomes common.
- **Subagent variability** → it only produces facts; the deterministic teeth remain the existing checks run at
  each project root.
- **Low-maintenance check:** one read-only subagent + playbook edits in two skills + two doc pages. No new
  check, no manifest, no checker code, no registry, no new runtime dependency.
