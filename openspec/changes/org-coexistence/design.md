## Context

Every eunomai surface was audited (2026-07-01) against the dual personal/organization goal. The
architecture already composes correctly with an incumbent layer — skills are plugin-namespaced, the guard
never emits `allow` (it can only tighten other governance), permissions merge natively — but the *flows*
assume greenfield: onboard seeds over what exists, the survey only detects file presence, the skill gate has
no org input, and none of this is documented for an org evaluator. The fix is contract + flow changes, not
new machinery.

## Goals / Non-Goals

**Goals:**
- One canonical coexistence contract, stated once, referenced everywhere (single source of truth).
- Onboard adapts to an incumbent layer by default; every seed is individually skippable.
- The gates (skill trust, safety) accept org input without forking.
- An org evaluator can answer install / collide / pin / extend / remove from one docs page.

**Non-Goals:**
- No org config file format, no conformance engine, no central registry, no plugin-skill scanning.
- No behavior change for existing consumers who do nothing (defaults stay as today).

## Decisions

1. **Contract as prose in the docs substrate, not code.** The contract is four clauses (additive · incumbent
   wins · detect before seeding · rules as gate input) in `docs/org-adoption.md`, plus one principle line in
   `CLAUDE.md`. *Alternative considered*: a machine-readable coexistence manifest — rejected; it would be a
   new format to maintain (low-maintenance check fails) and Claude reads prose natively.
2. **"The project's rules" = the project's `CLAUDE.md` + `.claude/settings.json` permissions.** Reuse-first:
   both are Claude Code native surfaces that already travel with the project; no new file.
3. **Coexistence assessment as an onboard step, driven by the existing structured interview.** The survey
   (already read-only) enumerates governance; onboard classifies each surface *absent / present-compatible /
   present-conflicting* and interviews only on conflicts, recommending "adapt to what exists". *Alternative*:
   a separate `eunomai-coexist` skill — rejected; onboard already owns the seeding act, and a second
   orchestrator would blur the one-shot boundary.
4. **Safety-gate seam via two env vars read in `guard.mjs`, passed into a pure `decide(input, config)`.**
   Reuse-first: orgs already distribute env via managed settings; fail-open on any misread keeps the
   floor-raiser posture. *Alternatives*: a JSON config file convention (more surface, same power) or plugin
   config (not a native primitive today) — rejected.
5. **AUDIT verdicts are advisory; removal is human.** `keep · keep-with-gaps · flag-for-removal` keeps the
   gate a criteria gate, not an enforcement engine.
6. **Activator block inlined into the onboard SKILL.** The block *is* the seed; a plugin-installed skill
   cannot rely on a repo-relative `docs/onboard.md`. `docs/onboard.md` keeps the narrative and links to the
   skill as the carrier (one fact, one home — the home moves to the artifact that ships).

**Low-maintenance check:** no new tool, no new file format, no new check; two env reads and prose changes.
The contract adds zero recurring upkeep — it changes what the existing skills *say and do once*.

## Risks / Trade-offs

- [Adapt-first defaults make onboard less prescriptive → weaker "eunomai shape" in org repos] → the checks
  still define "onboarded"; the interview surfaces each divergence explicitly, so divergence is a recorded
  author decision, not silence.
- [Env-var seam can silently relax the trailer rule org-wide] → `off`/`ask` only ever *loosen a deny to the
  native permission flow*; the guard still never emits `allow`, and managed settings are an org-controlled
  surface — the org owns that trade-off deliberately.
- [Governance enumeration adds survey output volume] → keep it a compact structured list (presence +
  location), facts only, no assessment.
- [Inlining the activator block duplicates it if `docs/onboard.md` keeps a copy] → `docs/onboard.md` links
  to the skill instead of carrying the block (single home preserved).
