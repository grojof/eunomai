# OKF alignment — deep options analysis

> Companion to `explore.md`. Each option: what it is, how it works, advantages, disadvantages, real-world
> implications, recommendation. The question is **how** eunomai should relate to Google's Open Knowledge Format
> (OKF), given eunomai's substrate is already MD + frontmatter + a markdown-link graph.

## Shared facts (true for any option)

- OKF is a **vendor-neutral open spec** ("format, not platform"): Markdown + YAML frontmatter, path = identity,
  graph via markdown links. v0.1, evolving.
- eunomai **already** stores knowledge that way (skills, registry, specs, memory, docs) — substrate-compatible
  by construction.
- OKF and eunomai sit on **different layers**: OKF = subject/data knowledge; eunomai = project/process
  knowledge. Complementary.
- The project values **don't-reinvent**, **low maintenance over reach**, **zero lock-in**, **connector-first**.
- The **governance tower** (a continuously maintained conformance/graph fabric) was deliberately abandoned; any
  option that recreates it is disqualified.

---

## Option A — Adopt OKF as a platform / dependency now

**What it is.** Treat OKF as a first-class dependency: build OKF emit + ingest into the core, track the v0.1
spec and Google's tooling (enrichment agent, catalog, visualizer), and make eunomai's knowledge round-trip
through OKF.

**How it works.** A new emitter/importer, a frontmatter mapping kept in lockstep with the spec, and CI to keep
bundles valid as OKF evolves.

**Advantages.** Immediate interop with the OKF ecosystem; "OKF-native" badge; ready if OKF becomes the lingua
franca tomorrow.

**Disadvantages.** **Premature** — OKF is v0.1 and will change. Adds an **external dependency** and tracking
burden, and courts **lock-in to an evolving format** — the exact thing the project avoids. Reinvents (a bespoke
emit/ingest layer) before any real demand. Most interop value is theoretical today.

**Real-world implications.** Perpetual chase of a moving spec for a benefit (data-layer interop) that eunomai's
*process-layer* users have not asked for. High cost, speculative payoff.

**Recommendation.** ❌ Avoid. Depending on an external platform/format at v0.1 is the opposite of connector-first
and zero lock-in.

---

## Option B — Ignore OKF entirely

**What it is.** No acknowledgment; let eunomai's frontmatter and structure evolve with no regard for the
convergent substrate.

**How it works.** Nothing changes; future field names and conventions are chosen ad hoc.

**Advantages.** Zero effort now.

**Disadvantages.** Forfeits **near-free future-proofing**. Risks **gratuitous divergence** — inventing
frontmatter field names that conflict with a vocabulary the industry is converging on, making a future OKF
projection harder than it needed to be. Leaves a strategic signal unread.

**Real-world implications.** A slow, invisible drift that only bites later, when emitting OKF (or interop with
an OKF consumer) suddenly requires renaming and reshaping that could have been free.

**Recommendation.** 🟡 Avoid. Doing nothing is cheap today and expensive later, for no principled reason.

---

## Option C — Align with the open-knowledge substrate as a lens + future projection target ✅ recommended

**What it is.** Recognize that eunomai already inhabits the same open substrate OKF formalizes; adopt OKF as a
**lens** (a sharper way to judge knowledge artifacts) and a **future projection target** — never a dependency.
Add one cheap guideline: *don't diverge gratuitously from the OKF frontmatter vocabulary* (`type`, `title`,
`description`, `tags`, `timestamp`, path-as-identity, link-graph). Build no emit/ingest now; if real demand
appears, emit OKF **via the existing projection architecture**, exactly like `AGENTS.md → CLAUDE.md/Copilot`.

**How it works.** This ADR + a note in the KDD explanation page (the substrate is the activation spectrum's
medium). The guideline rides along living-docs / skill conventions. No new check, no new dependency.

**Advantages.** **Zero machinery, zero dependency.** Maximal fit with *don't reinvent*, *zero lock-in*,
*connector-first*. Aligns with the **architecture** (a global standard, not Google's platform), keeping eunomai
free of Google. Future OKF emit becomes an add-on, not a migration. Honest — names what eunomai already is.
Fully reversible (prose).

**Disadvantages.** No interop *today* (accepted — there is no demonstrated demand). Relies on authors actually
honouring the vocabulary guideline — matching eunomai's floor-raiser, human-in-control posture everywhere else.

**Real-world implications.** Immediate strategic clarity at ~zero cost; the door to OKF emit stays open and
cheap. If OKF stalls or a different substrate wins, nothing was wasted — eunomai bet on the *architecture*, not
the brand.

**Recommendation.** ✅ **Adopt this.** Align with the substrate now; project to OKF only if/when real demand
appears, and then connector-first through the existing projection — never a graph engine, never a dependency.

---

## Decision matrix

| Criterion | A platform/dependency | B ignore | C substrate lens + future projection |
|---|---|---|---|
| Don't-reinvent | ❌ | ✅ | ✅ |
| Low maintenance over reach | ❌ | ✅ | ✅ |
| Zero lock-in | ❌ (external format) | ✅ | ✅ |
| Future-proofs the substrate | ✅ | ❌ | ✅ |
| Avoids tracking a moving v0.1 spec | ❌ | ✅ | ✅ (defers emit) |
| Connector-first fit | 🟡 | ❌ | ✅ |
| Cost to ship | high | ~zero | ~zero |

**The one real trade with C:** no OKF interop today. That is correct — there is no demonstrated demand, and
pursuing interop now means depending on an external format at v0.1. Aligning with the architecture captures the
strategic upside while paying none of the dependency cost.
