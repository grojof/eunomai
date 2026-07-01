---
name: eunomai-onboard
description: Cold-start orchestrator that applies eunomai to a new or existing project. Use when bringing a foreign project up to eunomai's standards — analyze it, assess what already exists (coexistence-first), establish/restructure docs (or create them), seed conventions (CLAUDE.md, OpenSpec config, permissions, hooks — each skippable), audit existing skills, then hand off. One-shot and dispensable; orchestrates the pillars, does not reimplement them.
---

# eunomai-onboard

The **cold-start** that turns a new or existing project into an eunomai project, then **steps aside**.
It establishes; the steady-state pillars (`eunomai-living-docs`, `eunomai-skill-finder`, the hooks, OpenSpec)
maintain. It **orchestrates and delegates** — it never reimplements a pillar. One-shot and dispensable:
everything it seeds lives in the project's own files (zero lock-in).

## When to use

- Adopting eunomai in a project for the first time (new or existing).
- A project has scattered, stale, or missing docs and you want eunomai's structure + quality.

## Project root vs workspace (read this first)

Do **not** assume "the project = the current directory". A workspace may have an **environment repo** at the
root (dotfiles, tooling config) with one or more **nested** project repos, and it may be **multirepo**. The
eunomai layer anchors at each **project root**, never the workspace root by default. So onboarding starts by
surveying the workspace and letting the user confirm scope — *detect, don't assume*.

## Flow

0. **Survey the workspace + confirm scope.** Delegate a read-only survey to the **`workspace-survey`**
   subagent: it discovers all git repos (root + nested) and remotes, detects code manifests, existing
   `CLAUDE.md`/`AGENTS.md`, and **existing governance** (hooks/permissions in `.claude/settings.json`,
   skills under `.claude/skills/`, a provenance registry, other plugin markers), and returns a map with a
   proposed *environment vs project* classification. Present
   the map; **infer-then-confirm** — propose a classification, ask a single confirmation, and **ask** about
   genuinely ambiguous repos (e.g. code but no remote) via the **structured interview** (below). The user
   chooses which repos are **in scope** and where the eunomai layer anchors. Change nothing in this step.
1. **Analyze + gather input — per confirmed project root.** For each chosen project root, survey its stack,
   existing docs, skills, and conventions, and gather that project's purpose, domain, and audience via the
   **structured interview** (below). Delegate the heavy, read-only reading: the **`codebase-cartographer`**
   subagent returns a comprehension map (architecture · entry points · data flow · stack + versions) and a
   proposed "at a glance" diagram; for an **existing** project with docs, also run a one-shot
   **`coherence-auditor`** pass to surface doc↔code drift and stale versions. Both are read-only — they report,
   you confirm. Change nothing yet.
2. **Coexistence assessment** (the contract: *additive, never replacing; on conflict the incumbent wins
   unless the author decides otherwise* — see `docs/org-adoption.md` in this plugin). For each of the six
   surfaces — `CLAUDE.md` · docs standard · SDD process · permissions · hooks · skills — classify what the
   survey found as **absent** (seed normally), **present-compatible** (leave in place, reference it), or
   **present-conflicting** (run the structured interview on it, recommending **"adapt to what exists"** as
   the default). Two named cases:
   - *The project already runs another SDD/change process* → do **not** seed `openspec/`; record the
     incumbent process in `CLAUDE.md` and offer OpenSpec only as an opt-in. OpenSpec is the **default where
     nothing exists**, never an imposition.
   - *Docs are governed by another standard/toolchain* (site generator, org template) → propose adapting the
     living-docs layer to it (frontmatter coexistence, see `eunomai-living-docs`) or standing down; never
     restructure over it silently.
   Record each decision; declined seeds are skipped in the steps below.
3. **Establish docs** (at the project root) → the living-docs standard:
   - **Propose the structure, don't assume it** — present **2–3 folder-structure options** with a recommended
     default by the project's size/shape (flat `docs/*.md` while small · by-surface `docs/<surface>/` once a
     surface has ~3+ pages · hybrid) and seed the one the author chooses. **Never** organize folders by Diátaxis
     type — the mode lives in each page's `type` frontmatter.
   - Existing docs → restructure into a routable `README.md` map + `docs/` pages (each with frontmatter).
   - No docs → create the README map + `docs/` pages from the analysis and the structured interview, capturing
     non-trivial choices as **ADRs** (`docs/decisions/`) and the domain vocabulary as a **glossary** page.
   - (After this, the `eunomai-living-docs` skill maintains them.)
4. **Seed conventions** (at the project root) — derive each from eunomai's own live conventions and adapt to
   the target (do not drop verbatim). **Each seed is individually skippable** per the coexistence assessment:
   - a lean `CLAUDE.md` (the single authored source) with two halves: the **structural** half that
     **declares this project's boundary + paths** (the `openspec/` and `docs/` locations and what is tracked),
     and the **activator block** — a principle-level statement of the base disciplines that points to the
     skills as *accelerators* (see below). **If a `CLAUDE.md` already exists, merge into it** — append the
     adapted activator block under its own heading and preserve everything already there; never replace or
     rewrite existing rules without the author's explicit choice,
   - an `openspec/config.yaml` layer (run `openspec update`) — only where no SDD process exists (step 2),
   - the **permissions baseline** (`docs/safe-controls.md`) — offered, not imposed, where permissions are
     already managed,
   - **hooks wiring** — if the project installs the eunomai *plugin*, hooks come from it; if it uses eunomai
     from source, copy `hooks/guard.mjs` + `hooks/decide.mjs` into the project and wire
     `.claude/settings.json` (`$CLAUDE_PROJECT_DIR/hooks/guard.mjs`) so nothing dangles when the clone moves.
     Detect which; where org hooks already exist, eunomai's compose alongside (most-restrictive-wins).
5. **Audit skills.** Invoke **`eunomai-skill-finder`** in audit mode over the project's existing skills; do
   not audit them yourself.
6. **Drive the checks green — from the project root** (`cd` into it; the checks resolve relative to `cwd`):
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" docs-check
   node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" provenance-check
   ```
   (`${CLAUDE_PLUGIN_ROOT}` resolves only inside plugin contexts; when running eunomai from a source clone,
   use `node <clone>/tools/dist/cli.cjs` instead.) Fix until both exit 0.
7. **Hand off.** Point the author at the steady-state pillars and stop. No background or cross-project process.

**Multirepo:** when several project repos are in scope, run steps 1–7 **independently per project** — each
gets its own seed and its own green checks. There is **no shared conformance layer** across projects.

**Environment root:** a repo classified as environment is **not** seeded as a project. With the user's
consent, it may receive at most a **minimal delegating `CLAUDE.md`** — pointing at the project directories and
marking the root as environment, with **no per-project conventions** (Claude Code always loads the parent
`CLAUDE.md` when working in a child, so keep it tiny). No workspace manifest file is introduced; scope rides on
hierarchical `CLAUDE.md`.

## The activator block (the behavioural seed)

The seeded `CLAUDE.md` carries an **activator block**: plain-language base disciplines, each naming its skill
as a **parenthetical accelerator**. This is the canonical block — **adapt** it to the project (stack, tone,
the seeds actually accepted); do not paste it verbatim:

```markdown
## How to work in this project

- Non-trivial changes are spec-first: capture intent and a short plan before code, and keep a record of what
  changed and why. (The OpenSpec `/opsx:*` flow automates this.)
- Keep docs honest: when behaviour changes, update the README index and the affected docs page in the same
  change. (A living-docs refresh helps.)
- Third-party skills and tools are untrusted until vetted — check provenance and scan before adopting. (A
  skill-vetting capability automates this.)
- Secure by default: validate input at boundaries, never hardcode secrets, parameterise queries. (A
  secure-coding capability covers this.)
- Add dependencies deliberately: pin, scan for known CVEs, read the changelog, run the tests. (A
  dependency-upgrade capability covers this.)
- Some actions are irreversible or sensitive — force-push, history rewrite, secret access, version bumps:
  pause and confirm first. (Safe-controls hooks enforce this when installed.)
```

Honour three invariants:

- **Self-sufficient** — each principle reads as actionable prose on its own; the skill is an accelerator, not a
  prerequisite (it must still guide a collaborator with only OpenSpec, or nothing, and survive skill removal).
- **Capabilities, not brand** — name capabilities/skills, never the "eunomai" framework.
- **Activate, don't duplicate** — state the *principle*; leave the *procedure* in the skill.

Seed it **once and disown it** — no back-sync, no new check.

## The structured interview (gathering input)

When you need input from the author — a project's purpose/domain/audience, an ambiguous repo classification, or
knowledge to create docs from scratch — run a **structured interview**, not a form dump:

- **One question at a time.** Asking several at once is bewildering; ask, wait, then ask the next.
- **Recommend a default.** Offer your best answer to each question so the author confirms rather than authors
  from scratch.
- **Explore first.** If a question is answerable from the codebase (stack, structure, conventions), explore and
  answer it yourself — don't ask what you can detect (*detect, don't assume*).

Keep it human-in-control and **skippable**; when a single confirmation suffices, don't interrogate
field-by-field.

**Docs as a byproduct.** When creating docs from scratch, let the interview's answers crystallize into the
living-docs standard: non-trivial choices become **ADRs** under `docs/decisions/`, and the project's domain
vocabulary becomes a **glossary** explanation page indexed in the README. (Harvested from the
`mattpocock/skills` *grilling* pattern via skill-finder — the idea, authored into our own skill.)

**Scaffold by the six knowledge domains.** When creating docs from scratch, walk the interview through the
six KDD domains — **business → product → technical → operational → historical → AI-ready** (see
[`docs/knowledge-driven-development.md`](../../docs/knowledge-driven-development.md)) — so coverage lands by
construction, not later repair. The scaffold is *your* checklist, not a form for the author: skip domains
the codebase (or the cartographer's domain signals) already answers, keep one-question-at-a-time, and let
the author skip any domain.

## Boundaries

- **Detect, don't assume.** Survey the workspace and have the user confirm scope before seeding; never decide
  silently which repo is "the project" or where the layer anchors.
- **Coexist, don't supplant.** eunomai's layers are additive; where a convention, standard, or control
  already exists, the incumbent wins unless the author decides otherwise. Merge into an existing
  `CLAUDE.md`, never replace it; skip any seed the author declines.
- **Interview, don't interrogate.** Gather input one question at a time with a recommended default, exploring
  the codebase first; human-in-control and skippable.
- **Anchor per project root.** Seed at each confirmed project root, never the workspace root by default; the
  environment repo gets at most a minimal delegating `CLAUDE.md`, with consent.
- **Boundaries are authored, not invented.** Scope is expressed via hierarchical `CLAUDE.md` — no
  workspace manifest, no registry.
- **Establish, don't maintain.** Ongoing doc refresh is `eunomai-living-docs`; ongoing skill work is
  `eunomai-skill-finder`. Delegate.
- **One-shot, dispensable.** Seed and step aside; removing eunomai leaves a working project.
- **No conformance engine.** "Onboarded" means the existing checks pass — not a new matrix or a continuous
  cross-project audit (that is the abandoned governance tower).
- **Interactive.** Doc creation and seeding are driven by the author's input, not auto-applied.
