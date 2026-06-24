# Explore 0001 — SDD/SPDD pillar: build, adopt, or fuse?

> Deep investigation of the spec-driven-development pillar. The core question: **create our own SDD, adopt
> Spec-Kit, adopt OpenSpec, or fuse?** Findings below are verified from the **cloned source** (`_vendor/
> spec-kit`, `_vendor/openspec`), not assumptions.

## Problem

The SDD/SPDD pillar is the spine of how we build everything else. Per the project principle (*don't
reinvent — adopt the best existing*), we must decide whether to author our own SDD skills or stand on an
existing, well-maintained framework.

## Findings (from source)

### Spec-Kit — `github/spec-kit` (MIT, Python CLI `specify`)
- **Model:** greenfield, **constitution-first**. Commands: `constitution`, `specify`, `clarify`, `plan`,
  `tasks`, `analyze`, `implement`, `converge`, `checklist`, `taskstoissues`.
- **Shape:** a Python CLI (`pyproject.toml`) that scaffolds; the workflow itself is Markdown command
  prompts in `templates/commands/`. Claude integration in `src/specify_cli/integrations/claude`.
- **Fit:** opinionated and heavier; oriented to *new* projects with a principles "constitution". GitHub-
  official, well-known.

### OpenSpec — `Fission-AI/OpenSpec` (MIT, Node CLI v1.4.1, very active)
- **Model:** **delta-against-baseline** — almost exactly our flow. Workflow (default profile):
  `/opsx:explore` → `/opsx:propose <name>` → proposal/spec/design/tasks per change folder → `/opsx:apply`
  → `/opsx:archive` (to `openspec/changes/archive/<date>-<name>/`); baseline lives in `openspec/specs/`.
  Expanded profile adds `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`,
  `/opsx:onboard`.
- **Shape:** a Node CLI that does **real work we currently do by hand** — **validates** specs (`schemas/`),
  manages the archive, `doctor`, `init`, profiles, and **installs the Claude slash commands** at
  `.claude/commands/opsx/<id>.md`. It **dogfoods itself** (`openspec/{specs,changes,archive,explorations,
  initiatives}`).
- **Fit:** matches our brownfield delta model 1:1, is Claude-native, MIT, low-ceremony, and adds the
  validation + archive automation we lacked in eunomai 0001/0002 (we managed folders manually).

### Both
- MIT-licensed; both generate Claude Code slash commands.
- Spec-Kit = greenfield/constitution/Python/heavier. OpenSpec = delta/lifecycle/Node/lighter, mirrors us.

## The realization

**OpenSpec is, almost exactly, the SDD flow we have been hand-running** (explore → propose → spec/design/
tasks → apply → verify → archive, with a `specs/` baseline and a dated `archive/`). It is already built,
MIT, Claude-integrated, and adds **spec validation + archive management** we do not have. **Building our own
sdd skills would be reinventing OpenSpec** — a direct violation of the project's first principle.

## Options

| Option | What | Verdict |
|---|---|---|
| **A — build our own** `eunomai-sdd-*` skills | author the flow ourselves | ❌ reinvents OpenSpec; high maintenance |
| **B — adopt Spec-Kit** | use `specify` + its commands | 🟡 mismatch: greenfield/constitution/Python, heavier than we need |
| **C — adopt OpenSpec** | use `openspec` + `/opsx:*` | ✅ matches our model, MIT, Claude-native, validates + archives |
| **D — adopt OpenSpec + a thin eunomai layer** | C, plus our commit policy (no co-author), living-docs tie-in, optional SPDD "reasons" framing | ✅ C's benefits + 100%-tailored; the connector philosophy applied to SDD |

## Lean recommendation (to confirm in `propose`)

**Option D — adopt OpenSpec, add only the thin tailored glue.** eunomai's SDD pillar becomes: *bootstrap +
integrate OpenSpec*, not a reimplementation. The honest truth is **eunomai adds little to SDD beyond
adopting OpenSpec and wiring it to the other pillars** (commit policy, living-docs sync, safe controls) —
and that is the correct, low-maintenance answer.

## Open questions (for propose / clarify)

1. **Runtime dependency on the `openspec` CLI** (a dev tool the agent/human runs) — acceptable under
   connector-first? (Likely yes; same stance as rulesync.)
2. **Bundle vs recommend:** does the eunomai plugin *bootstrap* OpenSpec (a tiny setup skill / `openspec
   init` wrapper) or just document + recommend it?
3. **SPDD "reasons" variant:** do we want it, and does OpenSpec's `design.md` already cover it, or do we add
   a thin overlay?
4. **Constitution/principles** (Spec-Kit's idea): adopt a one-time principles doc, or is it already covered
   by `AGENTS.md` (which holds our principles)? (Likely skip the constitution.)
5. **Version coupling:** OpenSpec's command surface is evolving fast (pre-stable). Pin a version; keep the
   integration thin.

## Risks
- Coupling to OpenSpec's changing `/opsx:*` surface → pin + thin layer.
- Over-adding a "eunomai layer" that drifts from OpenSpec → keep the glue minimal.

## Next
`propose` — confirm Option D (adopt OpenSpec + thin glue), decide bundle-vs-recommend and the SPDD variant,
then `clarify`.
