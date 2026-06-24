# SDD/SPDD pillar — deep options analysis

> Companion to `explore.md`. Each option separated: what it is, how it really works, uses, advantages,
> disadvantages, real-world implications, recommendation. Grounded in the cloned source (`_vendor/spec-kit`,
> `_vendor/openspec`).

## Shared facts (true for any option)

- **Artifacts are plain Markdown in your repo** → near-zero lock-in regardless of choice. If a tool dies,
  the proposals/specs/tasks remain readable and usable.
- **Both frameworks are MIT.** Both install into AI tools as slash commands and/or skills.
- eunomai's stack is **Node/TS**; the project values *don't-reinvent*, *low maintenance*, *Claude-first*,
  *100% tailored*.

---

## Option A — Build our own `eunomai-sdd-*` skills

**What it is.** Author the whole flow ourselves as Claude Code skills/commands shipped in the eunomai
plugin (`/eunomai:sdd-explore` … `archive`), with our own folder conventions and (eventually) our own
validation.

**How it works.** Pure Markdown skills + maybe a small validator. We already hand-ran this exact flow in
eunomai 0001/0002, so it's proven — but it was *manual* (no validation, no archive automation).

**Uses / when it fits.** When no adequate tool exists, or when total control of namespace/behaviour is
worth the cost.

**Advantages.** Full control; `/eunomai:*` namespace (on-brand); zero external runtime dependency; no
coupling to anyone's release cadence; 100% tailored by definition.

**Disadvantages.** **Reinvents OpenSpec** — directly violates the project's first principle. We'd re-solve
spec validation, delta-merge into a baseline, and archive management (all of which OpenSpec already does).
Ongoing maintenance is ours forever.

**Real-world implications.** Highest long-term cost; slowest to value; the thing the eunomai pivot was
explicitly fleeing ("framework of everything"). Only justifiable if both frameworks proved unusable — they
did not.

**Recommendation.** ❌ Avoid, unless we hit a hard blocker in C/D.

---

## Option B — Adopt Spec-Kit (`github/spec-kit`)

**What it is.** Use GitHub's Spec-Kit: a **Python** CLI (`specify`) + Markdown command prompts; a
**constitution-first, greenfield** methodology.

**How it works.** `specify` scaffolds a project with a *constitution* (principles), then commands
`specify → clarify → plan → tasks → analyze → implement → converge`, with **rigid phase gates**. Installs
Claude integration via `src/specify_cli/integrations/claude`.

**Uses / when it fits.** New ("0→1") projects where a heavyweight, principle-anchored, gated process adds
value; teams already in GitHub's ecosystem wanting an official tool.

**Advantages.** GitHub-official (strong longevity signal); thorough; the constitution idea is genuinely
good for principle-setting; large community + extensions catalog.

**Disadvantages.** **Python** runtime (our stack is Node/TS — a second language toolchain). **Heavyweight,
rigid phase gates** — OpenSpec itself summarizes it as "thorough but heavyweight … lots of Markdown, Python
setup." Greenfield/constitution framing is a **mismatch** with our brownfield, low-ceremony delta model.

**Real-world implications.** More ceremony than we want for everyday changes; the Python dependency is
friction on a Node-first workspace; the model fights our "delta against a living baseline" habit.

**Recommendation.** 🟡 Strong tool, wrong fit. Borrow the *constitution/principles idea* only (and we
already hold principles in `AGENTS.md`).

---

## Option C — Adopt OpenSpec, vanilla (`Fission-AI/OpenSpec`)

**What it is.** Use OpenSpec as-is: a **Node** CLI (`openspec`, v1.4.x, very active) + Claude **skills**
(`.claude/skills/openspec-*`) and slash commands (`/opsx:*`).

**How it works (two halves).** The **CLI is the engine** (run in the terminal): `openspec init` sets up the
project *and installs the skills/commands into your AI tool*; the CLI also **validates** specs (schemas),
shows a dashboard, and **archives** finished changes. The **slash commands are the steering wheel** (run in
chat): `/opsx:explore → propose → apply → sync → archive` (core profile); an expanded profile adds
`new/continue/ff/verify/bulk-archive/onboard`. Changes live in `openspec/changes/<name>/` (proposal, spec,
design, tasks); the baseline is `openspec/specs/`; archive is dated.

**Uses / when it fits.** Exactly our case: brownfield, low-ceremony, delta-against-baseline, multi-tool,
Node-first.

**Advantages.** **Matches our flow 1:1** (the flow we hand-ran *is* OpenSpec). Already ships as **Claude
skills** (the plugin-native form we wanted). Adds **validation + archive automation we lack**. Lightweight,
"no rigid phase gates". MIT, active, 25+ tools.

**Disadvantages.** Runtime dependency on a **fast-moving pre-stable CLI** (command surface churns). The
namespace is **`/opsx:*`, not `/eunomai:*`** (OpenSpec branding, not ours). It's **per-project `init`**, not
a single distributed plugin — composition with the eunomai plugin needs a bootstrap step.

**Real-world implications.** Fastest path to a working, validated SDD loop. We track an external dep (as we
already do with rulesync). Our "SDD pillar" largely becomes *"we use OpenSpec"* — honest, but eunomai adds
little here on its own.

**Recommendation.** ✅ The right base. But vanilla under-uses OpenSpec's tailoring → see D.

---

## Option D — Adopt OpenSpec + a thin, tailored eunomai layer ✅ recommended

**What it is.** Option C **plus** the 100%-tailoring OpenSpec already supports natively — **no fork of
OpenSpec**:
1. **`openspec/config.yaml`** — inject our *context* (stack, conventions) and per-artifact **rules** (e.g.
   commit policy: Conventional Commits, **no co-author**; "specs use Given/When/Then"; "reference existing
   patterns first"). These are injected straight into the AI prompts for each artifact.
2. **A custom `eunomai` schema** (optional) — `openspec schema fork spec-driven eunomai` to add/rename
   artifacts (e.g. an SPDD **"reasons"** artifact, or a verify/review step) — version-controlled in
   `openspec/schemas/`.
3. **Distribution** — OpenSpec supports **community schemas** (standalone repos copied into a project's
   `openspec/schemas/`). So the eunomai tailoring can ship as a *community schema*, fitting eunomai's
   plugin/distribution model with zero reinvention.

**How it works.** Engine + skills = OpenSpec (unchanged, upgradable via `openspec update`). eunomai owns
only `config.yaml` + (optionally) the `eunomai` schema. The eunomai plugin can include a tiny **bootstrap**
(ensure OpenSpec is initialized + our config/schema applied) and wire SDD to the other pillars (living-docs
sync on archive, safe-controls guardrails on apply).

**Uses / when it fits.** Our exact goal: adopt the best existing engine, tailor it 100% to us, keep it
low-maintenance and upgradable.

**Advantages.** All of C, plus **100% tailored** through supported extension points (not a fork → survives
`openspec update`). Our commit policy and conventions live *inside* the prompts. The SPDD variant is a
schema, not a reimplementation. Clean distribution via community schema.

**Disadvantages.** Same external-dependency + `/opsx:*` namespace caveats as C. A custom schema is a *small*
maintenance surface (kept minimal, ideally just `config.yaml` until a schema is truly needed). Two engines
to track overall (rulesync + openspec).

**Real-world implications.** Best effort-to-value ratio. eunomai's honest contribution to SDD = *the tailored
config/schema + the wiring to the other pillars*, not a new SDD tool — which is precisely the connector
philosophy. Reversible: it's all Markdown + YAML in our repo.

**Recommendation.** ✅ **Adopt this.** Start with `config.yaml` only; add a custom `eunomai` schema *only*
if/when the SPDD variant or a phase tweak is genuinely needed (YAGNI on the schema).

---

## Decision matrix

| Criterion | A build-own | B Spec-Kit | C OpenSpec | D OpenSpec + layer |
|---|---|---|---|---|
| Don't-reinvent | ❌ | 🟡 | ✅ | ✅ |
| Fit our delta/brownfield model | ✅ | ❌ | ✅ | ✅ |
| Stack (Node) | ✅ | ❌ Python | ✅ | ✅ |
| Maintenance | ❌ high | 🟡 | ✅ low | ✅ low (+tiny) |
| 100% tailored | ✅ | 🟡 | 🟡 | ✅ (via config/schema) |
| Plugin-native (Claude skills) | build it | 🟡 | ✅ | ✅ |
| On-brand namespace | ✅ `/eunomai:*` | ❌ | ❌ `/opsx:*` | ❌ `/opsx:*` |
| Validation + archive automation | build it | 🟡 | ✅ | ✅ |
| Distribution path | plugin | extensions | init | community schema |

**The one real trade you're accepting with C/D:** the SDD flow shows as **`/opsx:*` (OpenSpec branding)**,
and eunomai's role becomes *configuring* OpenSpec rather than *being* the SDD tool. In exchange you get a
validated, maintained, plugin-native flow at a fraction of the cost — and full tailoring via supported
extension points. Building your own buys the `/eunomai:*` namespace and total control at the price of
re-solving everything OpenSpec already solved.
