## Context

ADR-0005 set the v2 direction. Today `tools/src/docs.ts` parses the README and `docs/` to check links + index +
community-health; it already reads files and `tools/` already depends on `yaml`. So adding deterministic
frontmatter-shape validation is a small extension, not a new surface. The pillar's standard prose
(`docs/reference/living-docs.md`, the skill) and eunomai's own docs (no frontmatter, no diagram) are migrated to
v2 in the same change.

## Goals / Non-Goals

**Goals:**
- Deterministic frontmatter-shape gate in `docs-check` (required `type`/`title`/`description`).
- Rewrite the living-docs standard + skill to v2 (lens via `type`, routable substrate, product-shaped map, dev bar).
- Pilot on eunomai's docs: frontmatter on every page, README-as-map, an architecture diagram.

**Non-Goals:**
- **No AI judgment in the gate** — coherence/accuracy is the `coherence-auditor` (one-shot, human-resolved).
- No prose-quality scoring, no conformance engine.
- No forced folder restructure now — files stay flat; folders emerge when a surface grows.

## Decisions

- **Gate validates shape, not truth.** `docs-check` checks frontmatter presence + `type ∈ set` + non-empty
  `title`/`description`. It never decides whether the content *is* reference, or whether docs match code.
  Alternative — an LLM-judge gate — rejected: non-deterministic (a flaky gate guarantees nothing) and the
  abandoned governance tower.
- **Diátaxis mode lives in `type`.** One field makes the mode machine-routable (OKF), keeps mode-purity
  (Diátaxis lens), and removes the folder mandate. Alternative — keep Diátaxis folders — rejected per ADR-0005.
- **Reuse, don't add deps.** Frontmatter parsing uses the `yaml` dep already present; the architecture diagram
  is proposed by the existing `codebase-cartographer`. Net-new is only the shape rule + the rewritten standard.
- **Flat now.** eunomai is ~12 pages; flat `docs/*.md` + a surface-organized README map beats per-pillar folders
  (ceremony at this size). `docs/decisions/` stays a series and is excluded from the index as today.

## Risks / Trade-offs

- [Migration churn — frontmatter on ~12 pages] → One-time, mechanical; done in this change; the skill keeps it
  cheap thereafter.
- [`type` becomes a box-tick] → The living-docs skill frames it as a think-prompt (the lens); the gate only
  guarantees the floor (presence), not the thinking.
- [docs-check change could regress the existing link/index checks] → Add frontmatter checks alongside, keep the
  existing logic and its tests, extend `tools/test/docs.test.ts` with frontmatter cases; rebuild + run the bundle.
- [ADRs and frontmatter] → `docs/decisions/` is out of the indexed scope; ADRs are not required to carry the
  page frontmatter (their `type` is conceptually `decision`; keep them exempt from the gate as today).

**Low-maintenance check:** one shape rule in an existing check (no new dep, no new gate, no AI), a rewritten
standard, and a one-time doc migration. Deterministic and reversible.

## Migration Plan

Extend `docs.ts` + tests → rebuild bundle → add frontmatter to every `docs/` page → rewrite README as the map +
add the cartographer diagram → rewrite the standard + skill → sync the spec → run the full gate (`docs-check`,
`provenance-check`, hooks tests, `tools` typecheck/lint/test/build).

## Open Questions

- Exact `type` vocabulary casing (`how-to` vs `howto`) — use `how-to`. Allowed set:
  `tutorial | how-to | reference | explanation | decision`.
- Whether `docs-check` should also require `tags` — no; `tags` is recommended, not gated (keep the gate to the
  irreducible routing minimum).
