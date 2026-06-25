## 1. The workspace-survey subagent

- [x] 1.1 Add a read-only `workspace-survey` subagent under `agents/` — fans out over the workspace, discovers
  git repos (root + nested) and their remotes, detects code manifests and existing `CLAUDE.md`/`AGENTS.md`,
  and returns a **structured workspace map** with a proposed environment/project classification. Facts only;
  it changes nothing and decides nothing (req: *Survey the workspace and confirm scope before onboarding*).

## 2. onboard — the scoping phase

- [x] 2.1 Update `skills/eunomai-onboard/SKILL.md`: add the frontal **survey → classify → confirm → anchor**
  phase (invoke the survey subagent, present the map, infer-then-confirm classification, ask on ambiguous),
  before the per-project analysis (req: *Survey the workspace and confirm scope before onboarding*,
  *Analyze project and gather author input* [modified]).
- [x] 2.2 Update the skill so seeding **anchors at each confirmed project root** (never the workspace root by
  default); the environment root gets at most a minimal delegating `CLAUDE.md` with consent (req: *Anchor the
  eunomai layer at each project root*).
- [x] 2.3 Update the skill so each project's seeded `AGENTS.md` **declares its boundary + paths**, and any
  root `CLAUDE.md` only delegates — no manifest, no per-project conventions at the root (req: *Declare
  boundaries via hierarchical CLAUDE.md/AGENTS.md*).
- [x] 2.4 Update the skill to handle **multirepo independently** — loop per project root, each with its own
  seed + checks, no shared layer (req: *Onboard multiple project repos independently*).

## 3. living-docs — workspace-aware audit

- [x] 3.1 Update `skills/eunomai-living-docs/SKILL.md`: operate on a **project root** (reuse the survey to
  find roots), run `docs-check` from that root, report per-repo doc state, and keep single-repo behavior
  unchanged (req: *Workspace-aware doc audit*).

## 4. Docs

- [x] 4.1 Update `docs/reference/onboard.md` — the workspace survey + scoping phase, project root vs workspace,
  per-project anchoring, multirepo (keeps `docs-check` green).
- [x] 4.2 Update `docs/reference/living-docs.md` — workspace-aware audit (operate on a project root, per-repo
  report).
- [x] 4.3 If the onboard/living-docs sections of `AGENTS.md` change, update them and **re-project**
  (`node projection/dist/cli.cjs compile`); verify idempotency with `compile --check`.

## 5. Validation gate

- [x] 5.1 `node projection/dist/cli.cjs docs-check` exits 0 (updated pages still indexed).
- [x] 5.2 `node projection/dist/cli.cjs provenance-check` exits 0 (new subagent does not break provenance; add
  its provenance entry if it ships as a skill-like asset).
- [x] 5.3 `compile` then `compile --check` — zero drift.
- [x] 5.4 Validate the change: `openspec validate workspace-scoping --strict`.
- [x] 5.5 No projection/checker code changed; if any did, run `cd projection && npm run typecheck && npm run lint && npm test`.
