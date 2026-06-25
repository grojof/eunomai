# Decision 0005 — Living-docs v2: Diátaxis as a lens, an OKF-routable substrate

**Date:** 2026-06-25 · **Status:** accepted · **Pillar:** Living docs

## Decision

Revise the living-docs standard to **v2** — **Option D** — so the docs are both **dev-loved** (Stripe-class)
and **routable for AI** (OKF-class), without the four-folder ceremony Diátaxis's own authors warn against:

- **Diátaxis becomes a lens via a `type` frontmatter field**, not a folder mandate. The mode
  (`tutorial | how-to | reference | explanation | decision`) lives in frontmatter; **mode purity** (one page,
  one mode) is kept; the four-folder mandate is **dropped** (folders become convenience).
- **OKF-routable substrate.** Every `docs/` page carries frontmatter — **`type`, `title`, `description`
  required**; **`tags` recommended**; **`audience`, `related`, `updated` optional**. **Path = identity**, pages
  form a **link-graph**, and the README is the **map** (the graph's root index).
- **Product/surface-shaped navigation.** The README map is organized by **journey/surface** (quickstart → the
  pillars → deeper), not by Diátaxis bucket. Files stay **flat** while small; a surface is promoted to its own
  folder only when it grows (~3+ pages) — structure **emerges**.
- **Dev-quality bar (Stripe-drawn).** At-a-glance README + an **architecture diagram** + a quickstart + real
  examples + a layered path (`audience`).
- **Deterministic frontmatter gate.** `docs-check` validates frontmatter **shape** (required fields present;
  `type` in the allowed set) — never prose. **AI coherence-auditing stays out of the gate** (the one-shot,
  human-resolved `coherence-auditor`).

This is the **same move** as [ADR-0002](../0002-adopt-kdd-as-lens/DECISION.md) (KDD as a lens) and
[ADR-0003](../0003-okf-as-projection-target/DECISION.md) (OKF as a substrate): adopt the *lens/substrate*, not
the rigid form.

## Why (in one line)

Diátaxis is a compass its authors say not to nail to the wall as folders; great dev docs are product-shaped and
example-first; and the axis that actually distinguishes eunomai — *legible to human **and** AI* — is OKF's
routable substrate, which Diátaxis never addressed. v2 unifies all three.

## The guarantee is two layers — keep them separate

| Guarantee | Mechanism | Blocks? |
|---|---|---|
| Pages are **routable** (frontmatter shape) + the index/links resolve | `docs-check` (**deterministic**) | ✅ gate |
| Docs tell the **truth** about the code (coherence) | `coherence-auditor` agent (**AI judgment**) | ❌ one-shot, human resolves |
| The Diátaxis **mode** is right | the living-docs skill (lens, suggests) | ❌ judgment |

**AI judgment never enters the gate.** That would be non-deterministic (a flaky gate guarantees nothing) and
the abandoned governance tower. The guarantee is *stronger* when the deterministic part gates and the AI part
diagnoses.

## What changes in the repo (executed in the follow-up change)

- `docs/living-docs.md` + the `eunomai-living-docs` skill — rewritten to the v2 standard.
- `tools/` `docs-check` — extended with deterministic frontmatter-shape validation (reusing the existing `yaml`
  dependency). No new gate; an extension of the existing structural check.
- Pilot on eunomai's own docs — frontmatter on every page, the README as a routable map, and the
  cartographer-proposed architecture diagram (closing the long-standing zero-diagram dogfooding gap).
- `openspec/specs/living-docs/spec.md` — updated requirements (synced).

## The trade we accepted

A one-time frontmatter migration plus a small ongoing per-page cost, in exchange for AI-routability that is a
**deterministic guarantee** rather than an aspiration. Accepted — routability is eunomai's headline thesis, so
its substrate deserves to be enforced (deterministically), not merely hoped.

## How to use it

- Give every doc page frontmatter; put its Diátaxis mode in `type`; keep the page to that one mode.
- Navigate by the README map (surface/journey); let folders emerge only when a surface grows.
- Run `docs-check` for the deterministic floor; run the `coherence-auditor` (one-shot) when you need to know if
  the docs still match the code — and resolve its findings by hand.
