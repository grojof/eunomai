# Explore 0005 — Is Diátaxis the right backbone for living-docs?

> Investigation prompted by the doubt: *our docs read fine, but the four-folder Diátaxis layout may be the wrong
> frame — they don't resemble the powerful dev docs we want, and they aren't routable for AI the way OKF is.*
> Grounded in primary sources (Diátaxis, a Stripe docs teardown, the OKF spec), not assumptions.

## Problem

The living-docs standard adopts **Diátaxis as a literal four-folder mandate** (`guides/` · `reference/` ·
`explanation/` · `decisions/`) plus a lean README index. Three doubts:
1. **Quality** — it does not resemble the dev docs we admire (Stripe-class); reading fine ≠ dev-loved.
2. **Structure** — is the four-folder split even the right information architecture for a small project?
3. **Routability** — is it *legible to an AI agent*, not just a human? (the eunomai KDD thesis)

## Findings (from source)

- **Diátaxis says it is a lens, not a blueprint.** Its own "how to use" page: *"The structure it proposes is
  not intended to be a plan... It's a guide, a map to help you check that you're in the right place,"* and it
  *"certainly does not mean you should create empty structures for tutorials/howto/reference/explanation."*
  Structure should **emerge organically**. → We adopted it more rigidly than its authors intend.
- **Stripe (what makes dev docs loved):** information architecture **by product/surface**, not by content-type;
  a **quickstart per action**; **real, runnable examples**; a **layered** path (working integration fast →
  depth); "documentation is a product." (Moesif/apidog teardowns.)
- **OKF (the routable substrate):** Markdown + **YAML frontmatter** (`type` required, plus
  `title/description/tags/timestamp`), **path = identity**, a **markdown-link graph**, an `index.md` map.
  Legible to humans *and* agents — exactly eunomai's KDD thesis, and the axis Diátaxis does not touch at all.

## The realization

Three distinct axes were being treated as one:

| Axis | Question | Diátaxis covers it? |
|------|----------|---------------------|
| Quality / dev-friendliness | "reads like a doc a dev loves?" | no (indirect) |
| Information architecture | "is the folder structure right?" | one answer (by content-type) |
| Routability / machine-legible | "a navigable graph, human + AI?" | **not at all** |

The synthesis is the **same move eunomai already made twice** — adopt the *lens*, not the rigid form (KDD as a
lens, ADR-0002; OKF as a substrate, ADR-0003). Here: **demote Diátaxis from folder-law to a lens encoded as a
`type:` frontmatter field**, add the **OKF-routable substrate**, shape navigation **by product/surface**
(Stripe), and hold a **dev-quality bar**.

## The key design idea

The Diátaxis mode becomes the OKF-required `type` field: `type: reference | how-to | explanation | tutorial |
decision`. One move makes the mode **machine-readable (routable)**, keeps Diátaxis as a **per-page lens** (mode
purity), and **removes the folder mandate** (the page's kind lives in frontmatter, not its path).

## The tension to resolve (resolved in DECISION)

Does the deterministic gate (`docs-check`) validate frontmatter, and does an AI audit belong in the gate?
- **Frontmatter shape → yes, gate it** (deterministic; the only way AI-routability is *guaranteed* not
  aspirational; an extension of the existing structural check, not a new gate).
- **AI coherence audit → never in the gate.** That is non-deterministic judgment and the abandoned governance
  tower. It stays a one-shot, human-resolved diagnostic (the `coherence-auditor` agent). The guarantee is
  *stronger* when the deterministic part gates and the AI part diagnoses — not when AI judgment blocks.

## Options

| Option | What | Verdict |
|---|---|---|
| **A — keep rigid four-folder Diátaxis** | status quo | ❌ Diátaxis itself says don't; over-structured; no routability, no dev bar |
| **B — full product-IA, drop Diátaxis** | Stripe-clone, no modes | ❌ loses mode-purity lens; product-IA is ceremony at our size |
| **C — adopt OKF as a literal doc format/dependency** | frontmatter + graph as a hard format we track | ❌ ADR-0003 settled: align with substrate, don't adopt the format |
| **D — synthesis (lens + routable substrate + product-shaped + dev bar + deterministic gate)** | Diátaxis via `type`, OKF frontmatter/graph, README-map, frontmatter gate, AI audit out of gate | ✅ balances dev + AI; consistent with our prior "as a lens" moves |

## Lean recommendation (confirmed in DECISION)

**Option D.** Living-docs v2: Diátaxis as a lens via `type`; OKF-routable frontmatter substrate; product/
surface-shaped navigation; a Stripe-drawn dev-quality bar; a deterministic frontmatter gate in `docs-check`
(shape only); AI coherence-auditing kept out of the gate.

## Sources
- [Diátaxis — how to use it](https://diataxis.fr/how-to-use-diataxis/) (lens, not blueprint; structure emerges).
- Stripe docs teardowns — [Moesif](https://www.moesif.com/blog/best-practices/api-product-management/the-stripe-developer-experience-and-docs-teardown/), [apidog](https://apidog.com/blog/stripe-docs/).
- [Google — Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing).
- Prior decisions: [ADR-0002 (KDD as a lens)](../0002-adopt-kdd-as-lens/DECISION.md), [ADR-0003 (OKF substrate)](../0003-okf-as-projection-target/DECISION.md).
