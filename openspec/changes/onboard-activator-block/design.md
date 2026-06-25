## Context

ADR-0004 made `CLAUDE.md` the single authored instruction source; ADR-0002 frames it as the **semi-active**
layer of the knowledge-activation spectrum. onboard already seeds `CLAUDE.md`'s structural half (boundary +
paths); this change adds the behavioural half — an activator block — governed by the **audience gradient**: a
project is read by collaborators with the full plugin, with only OpenSpec, or with nothing, so the block must
degrade gracefully to plain prose.

## Goals / Non-Goals

**Goals:**
- Seed a principle-level, self-sufficient activator block into the project's `CLAUDE.md`.
- Point to the skills as accelerators without depending on them or naming the framework.
- Document one canonical block; have onboard adapt it per project.

**Non-Goals:**
- No new check, no machinery, no enforcement that the block exists (it is a seed, then disowned).
- No restating of skill procedures in `CLAUDE.md` (that would duplicate and bloat).
- Not a Fase-3 agent and not a living-docs concern — this is onboard's seed only.

## Decisions

- **Principle vs procedure is the reconciliation.** The block states durable *principles* (low churn,
  self-sufficient → dispensability) while the *procedures* stay in the skills (high detail, not duplicated →
  lean). This resolves the self-sufficiency-vs-no-duplication tension at the principle/procedure boundary.
  Alternative — embed the procedures in `CLAUDE.md` — rejected: duplicates the skills and bloats the seed.
- **Capabilities, not brand.** "Claude-only" host ≠ vendor lock-in (ADR-0003); likewise the block names
  *capabilities* (the skills) and never the framework, so a removed/renamed eunomai leaves the project's
  `CLAUDE.md` coherent. Alternative — brand the block "eunomai conventions" — rejected: reintroduces lock-in
  feel and breaks dispensability.
- **One canonical block, adapted.** The canonical text lives in `docs/reference/onboard.md`; onboard adapts it
  to each project. This keeps a single source for the wording without making onboard a template-copier
  (consistent with "the seed is derived from eunomai's own live conventions").

## Risks / Trade-offs

- [The block drifts from eunomai's evolving conventions] → It is seeded **once and disowned** (no back-sync);
  the canonical reference is updated like any doc, and re-onboarding re-seeds. No registry, no lock-in.
- [Authors treat the block as boilerplate and ignore it] → It is principle-level and short; the skills (when
  present) do the heavy lifting, so the block is a floor, not the whole control — matching eunomai's posture.
- [Over-prescription creeping into "principles"] → The spec pins principle-not-procedure and capabilities-not-
  brand as invariants with dedicated scenarios.

**Low-maintenance check:** adds prose to one skill + one reference page + one spec requirement; no code, no
check, no dependency. The seed is one-shot and dispensable.
