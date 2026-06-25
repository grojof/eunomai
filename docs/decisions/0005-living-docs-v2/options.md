# Living-docs v2 — options analysis

> Companion to `explore.md`. The question: what backbone should the living-docs standard have, to be both
> dev-loved (Stripe-class) and routable for AI (OKF-class), without the ceremony Diátaxis's own authors warn
> against?

## Shared facts (true for any option)

- Diátaxis's own guidance: it is a **lens/compass**, not a folder blueprint; structure should emerge.
- The dev docs we admire (Stripe) are **product/surface-shaped**, example-first, layered — not content-type folders.
- OKF gives the **routable substrate** (frontmatter, path-as-identity, link-graph) that makes docs legible to
  humans *and* agents — the eunomai KDD thesis; Diátaxis does not address it.
- Project values: **low maintenance over reach**, **don't reinvent**, **no conformance engine**, reversibility,
  and (ADR-0003) the **open Markdown substrate**.

---

## Option A — Keep rigid four-folder Diátaxis (status quo)

**What it is.** Mandate `guides/`, `reference/`, `explanation/`, `decisions/` as the doc tree; README is a lean
index.

**Advantages.** Already in place; familiar; separates content modes.

**Disadvantages.** **Diátaxis's authors say not to do this** (no empty mandated structures). Over-structured for
a one-page-per-pillar project (ceremony). Delivers **neither** AI-routability **nor** the dev "at a glance" bar
— the two things actually wanted.

**Recommendation.** ❌ Drop the mandate.

---

## Option B — Full product-IA, drop Diátaxis entirely

**What it is.** Organize purely by product/surface like Stripe; abandon the four modes.

**Advantages.** Maximally dev-shaped navigation; matches the admired docs.

**Disadvantages.** Loses the **one genuinely valuable** Diátaxis idea — **mode purity** (don't mix a how-to
with reference on one page), the #1 cause of confusing docs. Product-IA's payoff appears **at scale**; for a
small project it is its own ceremony.

**Recommendation.** ❌ Throws out the lens with the folders.

---

## Option C — Adopt OKF as a literal doc format / dependency

**What it is.** Treat OKF as a hard format the docs must conform to and track.

**Advantages.** Maximal machine-routability today.

**Disadvantages.** **ADR-0003 already settled this**: align with the open substrate, do not adopt the
format/platform as a dependency (it is v0.1; that is reinvention + lock-in). Premature.

**Recommendation.** ❌ Re-litigates a settled decision.

---

## Option D — Synthesis: lens + routable substrate + product-shaped + dev bar ✅ recommended

**What it is.** Living-docs v2:
- **Diátaxis as a lens via `type`** — the mode is an OKF-style required frontmatter field
  (`type: tutorial | how-to | reference | explanation | decision`), not a folder. Mode purity kept; folder
  mandate dropped (folders become convenience).
- **OKF-routable substrate** — every page carries frontmatter (`type`, `title`, `description` required;
  `tags` recommended; `audience`, `related`, `updated` optional); **path = identity**; a **link-graph**; the
  README is the **map** (`index.md` root).
- **Product/surface-shaped navigation** — the README map is organized by journey/surface (quickstart → the
  pillars → deeper), not by Diátaxis bucket. Files stay **flat** while small; a surface is promoted to its own
  folder only when it grows (~3+ pages) — structure *emerges*.
- **Dev-quality bar (Stripe-drawn)** — at-a-glance README + an architecture diagram + a quickstart + real
  examples + layered (`audience`).
- **Deterministic frontmatter gate** — `docs-check` validates frontmatter **shape** (required fields, `type`
  in the allowed set); it does **not** judge prose. AI coherence-auditing stays **out of the gate** (the
  one-shot `coherence-auditor`, human-resolved).

**How it works.** Rewrite the living-docs standard + skill; extend `docs-check` (it already parses files; add a
frontmatter shape check using the existing `yaml` dep); pilot on eunomai's own docs (frontmatter on every page,
README-map, the cartographer-proposed diagram).

**Advantages.** Balances **dev + AI** (the chosen priority). Keeps Diátaxis's value without its ceremony.
Makes AI-routability a **guaranteed** substrate, deterministically. Consistent with the "adopt the lens, not
the rigid form" move of ADR-0002/0003. Folders emerge (Diátaxis-faithful). The gate stays structural, never a
conformance engine.

**Disadvantages.** A migration (frontmatter on existing pages) — done once in the pilot. A small per-page
frontmatter cost going forward — paid by the gate's guarantee and eased by the living-docs skill.

**Recommendation.** ✅ **Adopt this.**

---

## Decision matrix

| Criterion | A rigid Diátaxis | B full product-IA | C OKF-as-format | D synthesis |
|---|---|---|---|---|
| Faithful to Diátaxis's own guidance | ❌ | 🟡 | n/a | ✅ |
| Dev-loved (Stripe-class) | ❌ | ✅ | ❌ | ✅ |
| Routable for AI (OKF axis) | ❌ | ❌ | ✅ | ✅ |
| Keeps mode-purity lens | ✅ | ❌ | 🟡 | ✅ |
| Avoids ceremony at our size | ❌ | ❌ | 🟡 | ✅ |
| No conformance engine / AI-in-gate | ✅ | ✅ | 🟡 | ✅ |
| Don't reinvent / reversible | ✅ | 🟡 | ❌ | ✅ |

**The one real trade with D:** a one-time frontmatter migration + a tiny ongoing per-page cost. Accepted: it is
exactly what turns "AI-routable" from aspiration into a deterministic guarantee.
