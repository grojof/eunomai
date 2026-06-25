# Docs single-source-of-truth — options analysis

> Companion to `explore.md`. The question: how to stop the docs feeling redundant/messy after v2, coherently
> with GitHub best-practice, KDD, OKF, and Diátaxis.

## Shared facts (true for any option)

- README best practice: a short front door that **links out**, never duplicates (research).
- Diátaxis is a **lens**, applied in small steps — not the cause of the redundancy (its own guidance).
- eunomai is a **meta-tool**: its `CLAUDE.md` + ADRs already describe it, so `docs/reference/*` tends to restate
  them — the duplication is structural to this project.
- The four pillars already endorse the same idea (single source of truth / one node per concept).

## Option A — Keep allowing duplication (status quo)

**What it is.** No rule against a fact living in both `CLAUDE.md`/an ADR and a `docs/` page; two CONTRIBUTING.

**Disadvantages.** This **is** the mess the user sees. Redundancy rots (two homes drift), and the docs read as
ceremony. Contradicts every source.

**Recommendation.** ❌ Reject.

## Option B — Abandon Diátaxis

**What it is.** Drop the `type` lens / Diátaxis framing entirely.

**Disadvantages.** Misdiagnosis — Diátaxis (a cheap per-page lens) is not what causes duplication. Research and
Diátaxis's own authors say it is a flexible lens, not a blueprint. Dropping it removes a useful clarity for no
gain.

**Recommendation.** ❌ Reject.

## Option C — Single-source-of-truth + an anti-duplication lens ✅ recommended

**What it is.** Make **"one fact, one home — everything else links"** the governing principle of living-docs.
Add to the skill an **"earns its place" test** (is this fact already canonical in `CLAUDE.md`/an ADR/the code?
→ link, don't restate) and an **anti-duplication lens** (flag pages that duplicate another home; propose merge
or link). Keep Diátaxis as a `type` lens. Clean eunomai's own docs (merge the two CONTRIBUTING; slim the
reference pages that restate `CLAUDE.md`/ADRs to a lead + a link).

**Advantages.** Names and fixes the real cause. Converges GitHub + KDD + OKF + Diátaxis. Low-maintenance (a lens
+ a principle, no machinery, gate unchanged). Makes the docs genuinely lean and dev-/AI-legible.

**Disadvantages.** A one-time cleanup of eunomai's own docs; ongoing judgement ("does this duplicate?") — but
that is the skill's job, human-in-control.

**Recommendation.** ✅ **Adopt this.** A refinement of ADR-0005.

## Decision matrix

| Criterion | A keep | B drop Diátaxis | C single-source-of-truth |
|---|---|---|---|
| Fixes the redundancy | ❌ | ❌ | ✅ |
| Coherent with GitHub/KDD/OKF | ❌ | 🟡 | ✅ |
| Keeps the useful lens | ✅ | ❌ | ✅ |
| Low maintenance / no machinery | ✅ | ✅ | ✅ |
