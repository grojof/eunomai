# Explore 0003 — Does Google's Open Knowledge Format change eunomai's bet?

> Investigation prompted by the question: *Google published the Open Knowledge Format (OKF). Is this where the
> future points, and should eunomai pre-empt / semi-compatibilize with it?* Grounded in the primary source (see
> Sources), not assumptions.

## Problem

If an open, vendor-neutral knowledge format becomes the lingua franca for feeding AI agents, eunomai must not
wake up incompatible. The worry: do we need to adopt OKF, build emit/ingest tooling, or restructure the
substrate to stay relevant — and at what maintenance/lock-in cost?

## Findings (from source)

**OKF v0.1, precisely:**
- **Format, not platform.** A portable, vendor-neutral *open specification* — explicitly "never tied to specific
  clouds, databases, model providers, or agent frameworks."
- **Substrate:** Markdown files with **YAML frontmatter**, organized as a **directory hierarchy where the file
  path is the concept's identity**. No proprietary extensions; shippable as tarballs or git repos.
- **Frontmatter:** `type` (mandatory) + optional `title`, `description`, `resource`, `tags`, `timestamp`.
- **Graph by links:** concepts reference each other with **standard markdown links**, forming a directed graph;
  optional `index.md` (navigation) and `log.md` (change history).
- **Producer/consumer independence:** bundles hand-authored, pipeline-generated, or LLM-synthesized; consumed by
  agents, visualizers, or humans. Google ships an enrichment agent, a static HTML visualizer, and a catalog —
  but the format needs none of them.
- **Domain:** *data/metadata* knowledge — table schemas, metric definitions, runbooks, API deprecations, join
  paths.

## The realization

**eunomai is already OKF-shaped, by construction** — because it chose plain MD + frontmatter + a markdown-link
graph instead of a bespoke format:

| OKF (data layer) | eunomai (project/process layer) |
|---|---|
| `.md` + YAML frontmatter | skills, skills-audit registry, OpenSpec specs, memory — all `.md` + frontmatter |
| path = concept identity | `openspec/specs/<cap>/spec.md`, `docs/<diátaxis>/…` |
| graph via markdown links | README index, KDD cross-refs, the link-first traceability we keep favouring |
| "format, not platform", no SDK/cloud/model lock-in | "don't reinvent", AGENTS.md authored (not generated), zero lock-in, dispensable |

### Complementary layers, not rivals

- **OKF** answers *"what is our data and what does it mean?"* — knowledge of the **subject**.
- **eunomai** answers *"how is this project understood and worked on?"* — knowledge of the **process**.

A eunomai-normalized repo could, in future, **emit an OKF bundle** of the knowledge it documents — exactly as
it already emits `CLAUDE.md`/Copilot from `AGENTS.md`. OKF is a candidate **projection target**, not a
migration.

## The tension

Adopting OKF *as a platform/dependency* now — building emit/ingest into the core, tracking an evolving v0.1
external spec and its tooling — would **reinvent + add a dependency + court lock-in to an external format still
at v0.1**. That collides with *don't reinvent*, *low maintenance over reach*, and zero lock-in. The format is
the convergent bet; Google's *platform* is not something to depend on.

## Options

| Option | What | Verdict |
|---|---|---|
| **A — adopt OKF as a platform/dependency now** | build OKF emit/ingest into the core; track the spec + Google tooling | ❌ premature (v0.1), reinvents, adds a dependency and external lock-in |
| **B — ignore OKF entirely** | no acknowledgment; let the substrate drift on its own | 🟡 misses near-free future-proofing; risks gratuitous divergence from a convergent vocabulary |
| **C — align with the open-knowledge substrate as a lens + future projection target** | recognize eunomai is already substrate-compatible; add a "don't diverge gratuitously from the OKF frontmatter vocabulary" guideline; treat OKF emit/ingest as a future projection; build nothing now | ✅ max fit; connector-first; zero new machinery |

## Lean recommendation (confirmed in DECISION)

**Option C.** Treat OKF as evidence of a **convergent open substrate** that eunomai already inhabits. Align with
the *architecture* (global standard, not Google's platform); keep OKF emit/ingest as a future, connector-first
projection; add no dependency and no machinery now.

## Open questions (resolved in DECISION/options)
1. Adopt OKF now or align only? → align only; OKF emit is a future projection if real demand appears.
2. Any new code/dependency? → no. One ADR + a substrate-vocabulary guideline; reuse the existing projection
   architecture when/if emit is built.
3. What about the broader "go full Claude / OpenSpec-only" and "token efficiency / model routing" ideas raised
   alongside? → **out of scope here**; each is its own decision (separate ADRs). This ADR is OKF only.

## Sources
- "How the Open Knowledge Format can improve data sharing" — Google Cloud blog (OKF v0.1 announcement).
- OKF open specification (published vendor-neutral on GitHub, per the announcement).
