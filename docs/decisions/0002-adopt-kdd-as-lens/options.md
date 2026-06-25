# KDD adoption — deep options analysis

> Companion to `explore.md`. Each option: what it is, how it works, advantages, disadvantages, real-world
> implications, recommendation. The question is **how** to adopt KDD, given eunomai is already knowledge-driven
> in substance.

## Shared facts (true for any option)

- eunomai **already** encodes knowledge across all pillars at different activation states (passive docs →
  active skills/hooks). KDD is not net-new behaviour; it is a way to *name* and *judge* what exists.
- The project values **don't-reinvent**, **low maintenance over reach**, **Claude-first**, **zero lock-in**.
- The **governance tower** (a continuous cross-project conformance/sync engine) was deliberately abandoned on
  2026-06-24; any option that recreates it is disqualified by charter.

---

## Option A — Adopt KDD as a full methodology

**What it is.** Implement KDD-the-methodology: a Product-Process Matrix, formal Statements of Relevance as
atomic units, and a maintained **knowledge graph** with end-to-end traceability (requirement → spec → code →
test → doc) as the single source of truth.

**How it works.** A new structuring layer and tooling to capture atomic knowledge units, index them by
product × process, link them, and keep the graph honest over time — likely a new schema, store, and check.

**Advantages.** Maximal rigor; genuine end-to-end traceability; the strongest answer to "where did this
requirement go?"; matches the published methodology faithfully.

**Disadvantages.** **Reintroduces the abandoned governance tower** — a continuously maintained conformance
fabric. Heavy authoring + maintenance cost; collides head-on with *low maintenance over reach* and
*don't reinvent*. Most of the value (structured, fresh knowledge) eunomai already gets from Diátaxis + specs.

**Real-world implications.** High, perpetual cost for a benefit (traceability) that is nice-to-have, not the
project's bottleneck. The matrix/graph would rot without dedicated curation — the exact failure mode eunomai
fled.

**Recommendation.** ❌ Avoid. This is the governance tower in new clothes.

---

## Option B — Adopt the lens **and** build light traceability now

**What it is.** Take the KDD lens (Option C) **plus** ship a first traceability mechanism immediately: a
cross-reference convention (spec ↔ doc ↔ skill ↔ ADR) backed by a new read-only check that flags missing links.

**How it works.** Define a link scheme (extend the `[[...]]` style used in memory), then add a `trace-check`
(or extend `docs-check`) that verifies declared links resolve and key artifacts are connected.

**Advantages.** Captures KDD's one genuinely-missing feature (traceability) early; still lighter than the full
methodology; builds on existing index/provenance checks.

**Disadvantages.** **Premature.** A traceability *check* is a conformance surface — start small and it tends to
grow into the governance engine. No demonstrated pain yet that justifies the new check and its maintenance.
Adds a fourth check to the gate before the need is proven.

**Real-world implications.** Plausible *later*, once concrete traceability pain appears; doing it now optimizes
a problem we do not yet have, against the project's bias for low maintenance.

**Recommendation.** 🟡 Defer. Right idea, wrong time; revisit incrementally and link-first if pain emerges.

---

## Option C — Adopt KDD as a lens / vocabulary only ✅ recommended

**What it is.** Adopt KDD purely as a **framing**: name eunomai a *knowledge-activation workspace*, document
the passive→active spectrum across the pillars, and use it as a judgment tool for new capabilities. No new
pillar, no new machinery, no new check.

**How it works.** One explanation page ([knowledge-driven-development.md](../../knowledge-driven-development.md))
+ this ADR + a pointer from `vision.md`. The lens then informs how future proposals are reasoned about (*what
kind of knowledge is this, at what activation state?*).

**Advantages.** **Zero maintenance** beyond a doc page. Maximal philosophical fit (*don't reinvent*, *low
maintenance*). Sharper design discipline: keeps docs explaining, skills acting, hooks enforcing, specs
tracking. Honest — it describes what eunomai already is. Fully reversible (it's prose).

**Disadvantages.** Does **not** deliver traceability (accepted trade). A lens with no enforcement relies on
authors actually applying it — but that matches eunomai's "floor-raiser, human-in-control" posture everywhere
else.

**Real-world implications.** Immediate value (vocabulary + design test) at essentially no cost; leaves the door
open to Option B *later* if traceability pain becomes real.

**Recommendation.** ✅ **Adopt this.** Lens now; traceability only if/when a concrete need appears, and then
link-first, never a graph engine (YAGNI on the machinery).

---

## Decision matrix

| Criterion | A full methodology | B lens + traceability now | C lens only |
|---|---|---|---|
| Don't-reinvent | ❌ | 🟡 | ✅ |
| Low maintenance over reach | ❌ | 🟡 | ✅ |
| Avoids the governance tower | ❌ | 🟡 (risks creep) | ✅ |
| Delivers traceability | ✅ | ✅ | ❌ (deferred) |
| Philosophical fit | ❌ | 🟡 | ✅ |
| Reversibility | 🟡 | 🟡 | ✅ (prose) |
| Cost to ship | high | medium | ~zero |

**The one real trade with C:** you adopt the vocabulary without KDD's traceability payoff. That is the correct
trade today — the missing piece is a nice-to-have, and pursuing it now risks rebuilding the conformance engine
the project deliberately walked away from.
