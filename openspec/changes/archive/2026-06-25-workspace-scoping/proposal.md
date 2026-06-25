## Why

eunomai-onboard and eunomai-living-docs both assume **one project = the current directory**. onboard's
"survey the stack" never defines *which* repo is the project when repos are nested; it seeds
`AGENTS.md`/`openspec/`/`docs/` implicitly at `cwd`. living-docs and `docs-check` run against a single root.
There is **no workspace model**: no `.git` boundary detection, no environment-vs-project distinction, no
multirepo support, no "ask what to track". In a real workspace — an environment repo at the root (configs,
dotfiles) with one or more **nested** GitHub project repos — the pillars attack the wrong root, pollute the
workspace, or miss projects entirely, and the seeded config points agents at the wrong scope (chaos for the
next user).

The root cause: the single-repo case let eunomai conflate three distinct things — **cwd**, **project root**,
and **workspace**. They coincide in one repo; they diverge in a workspace. The fix is to make **project root**
a first-class, *discovered-and-confirmed* concept.

## What Changes

- Add a read-only **workspace survey** (a subagent) that discovers all git repos (root and nested) and their
  remotes, detects code manifests + existing `CLAUDE.md`/`AGENTS.md`, and produces a structured **workspace
  map**. It reports facts only; it never decides scope.
- **onboard** gains a frontal *survey → classify → confirm → anchor* phase: present the map with a proposed
  environment/project classification, have the user confirm what's in scope and where the eunomai layer
  anchors, then seed **at each confirmed project root** — never the workspace root by default.
- **Boundaries are authored, not invented:** each project's `AGENTS.md` declares its own boundary + paths
  (`openspec/`, `docs/`, what's tracked); an optional workspace-root `CLAUDE.md` only *delegates* (points at
  project dirs, marks the root as environment). Scope rides on Claude Code's native hierarchical
  `CLAUDE.md`/`AGENTS.md` discovery — **no new manifest file**.
- **living-docs** becomes workspace-aware for audit/refresh: it operates on a chosen project root (cwd
  convention) and reports doc state per repo, instead of assuming the workspace root is the project.
- **Multirepo** is handled by onboarding each project **independently** (its own seed + checks); no shared
  conformance layer.
- **Reuse vs net-new (connector-first):** *reuse* git for repo/remote detection, Claude Code's hierarchical
  `CLAUDE.md` for scope, and the existing `docs-check`/`provenance-check` unchanged (they already operate on
  `cwd` → run them from the project root). eunomai's *net-new* is only the **workspace-survey subagent** and
  the **scoping phase** added to the two skills' playbooks.

## Capabilities

### New Capabilities
- `workspace-survey` (internal, read-only): discover git repos (root + nested) and remotes, detect
  manifests + existing config, classify environment vs project, and return a structured workspace map for the
  skills to act on. Shared by onboard and living-docs.

### Modified Capabilities
- `onboard`: gains the workspace survey + scoping phase; analysis and seeding now operate per confirmed
  project root; multirepo handled independently.
- `living-docs`: audit/refresh becomes workspace-aware (operates on a project root, reports per repo).

## Impact

- **New:** a `workspace-survey` subagent under `agents/` (read-only); the scoping phase in
  `skills/eunomai-onboard/SKILL.md` and the workspace-aware audit in `skills/eunomai-living-docs/SKILL.md`.
- **Docs:** update `docs/reference/onboard.md` and `docs/reference/living-docs.md` (workspace survey, project
  root vs workspace, per-project anchoring); re-project `AGENTS.md` if its onboard/living-docs sections change.
- **Gate:** `docs-check` + `provenance-check` stay green. **No projection/checker code change** — the checks
  already resolve relative to `cwd`; the skills run them from the project root. (A `--root` flag for checking
  many projects at once is explicitly deferred — see Non-goals.)
- **No new manifest, no new check, no registry, no new runtime dependency.**

## Non-goals

- **No workspace manifest / registry file** — scope is expressed only through hierarchical
  `CLAUDE.md`/`AGENTS.md`.
- **No continuous / cross-project conformance engine** — multirepo means *independent* per-project onboarding;
  no shared sync layer (the abandoned governance tower).
- **No checker rewrite** — `docs-check`/`provenance-check` are unchanged; the per-project `--root <path>`
  multi-target ergonomics is deferred to a later change if a real need appears (convention: `cd <project>` and
  run).
- **No silent scoping** — the classification is always presented and confirmed; ambiguous repos are asked
  about, never guessed.
- **No touching the environment repo without consent** — at most a minimal delegating `CLAUDE.md`, opt-in.
- **Not reimplementing the pillars** — onboard and living-docs still delegate; the survey is a read-only tool.
