## Context

ADR-0006 adopts single-source-of-truth as the governing living-docs principle. The substance is mostly a
**cleanup of eunomai's own meta-docs** (which restate `CLAUDE.md`/ADRs) plus a small standard/skill addition. No
code, no gate change.

## Goals / Non-Goals

**Goals:**
- Encode the principle, the "earns its place" test, and the anti-duplication lens in the standard + skill.
- Make eunomai's own docs hold each fact once: one `CONTRIBUTING.md`; reference pages that don't restate.

**Non-Goals:**
- No gate change — `docs-check` stays shape-only; duplication is judgement, not enforcement (LLM-in-gate = the
  tower).
- No deletion of genuine single-home pages; no aggressive rewrite — slim or sharpen, keep what earns its place.

## Decisions

- **One home, the other links — pick the home by audience.** `CLAUDE.md` is the operational source loaded into
  every agent session (terse conventions); `docs/` is the human-browse home (fuller). Where they overlap, the
  fuller human explanation is the home and `CLAUDE.md` stays terse + points to it; where a `docs/` page only
  restates terse conventions, it is slimmed to a lead + link. Decide per page with the test, in apply.
- **Merge the two CONTRIBUTING.** The GitHub-discoverable root file absorbs the dev loop; `docs/contributing.md`
  is removed and its README link dropped. Alternative — keep both (root short + docs deep) — rejected at this
  size (ceremony, drift).
- **Keep Diátaxis as a lens.** Not touched; this is orthogonal.

## Risks / Trade-offs

- [Over-slimming loses genuinely useful detail] → Apply the test per page; keep pages that are a single home
  (`safe-controls` baseline, `onboard` flow, `living-docs` standard, `vision`, `kdd`, `getting-started`).
- [Removing `docs/contributing.md` breaks its README link] → Drop the link in the same change; re-run
  `docs-check`.

**Low-maintenance check:** prose + a one-time cleanup. No code, no check, no dependency. Deterministic gate
unchanged.

## Migration Plan

Add the principle to the standard + skill → merge `docs/contributing.md` into root `CONTRIBUTING.md` and drop
the README link → slim `sdd`/`skill-finder`/`base-skills`/`checks` per the test → update the README map → sync
the spec → run `docs-check` + `provenance-check` + `openspec validate`.
