## Context

Living-docs v2 (ADR-0005/0006) already gives every project the same substrate — frontmatter, `type` lens,
product-shaped README map, shape-only `docs-check` — and the skills already propose the **folder structure**
(2–3 options, recommended default). What is missing is one level up: **which doc set** the repo's destination
calls for, and an explicit quality bar for the prose that lands in it. The onboard skill carries a precedent
for canonical content that must resolve in installed-plugin mode: the activator block lives inside the skill
itself, and the docs page links to it.

## Goals / Non-Goals

**Goals:**
- Let the author *see and choose* a doc-set preset by repo destination, or describe their own, via the
  existing structured interview.
- Make the README's user-friendly bar, the timeless/self-contained prose register, and same-pass README↔docs
  sync explicit, testable requirements.
- Keep onboard a pure delegator to the living-docs catalog.

**Non-Goals:**
- No template engine or placeholder substitution; no generated docs.
- No new check or `docs-check` rule; no new frontmatter field; no folder mandates.
- No change to the coexistence contract (profiles must *fit under* it, not extend it).

## Decisions

1. **Profiles are presets, not standards** (reuse-first). A profile only fixes a *starter* README skeleton +
   `docs/` page set + emphasis over the unchanged v2 substrate. Rationale: any per-profile rules would fork
   the standard and leak into the gate; presets keep `docs-check` shape-only and the maintenance surface flat.
   Alternative considered — per-profile frontmatter/gate variants — rejected as a conformance engine in embryo.
2. **Canonical catalog inside the skill** at `skills/eunomai-living-docs/references/doc-profiles.md`
   (progressive disclosure; SKILL.md summarizes and points). Rationale: same precedent as the onboard
   activator block — it must resolve when installed as a plugin, where `docs/` may not be present.
   `docs/living-docs.md` gets a short summary section that links; one home, no second copy (ADR-0006).
3. **Six destination profiles + custom**: library/SDK · service/API · CLI tool · framework/platform ·
   firmware/embedded · end-user app/internal tool. Rationale: covers the common repo destinations with
   clearly distinct doc needs; **custom** absorbs the long tail so the catalog never grows curatorially
   (low-maintenance check: the set is criteria-shaped, not a registry to groom).
4. **Selection rides the structured interview** (reuse): infer a recommended profile from detected signals
   (manifests, cartographer output, repo shape), show the previews, ask one question, accept custom with
   follow-ups. Skippable; where an incumbent docs standard governs, the coexistence contract already answers
   — incumbent wins, profile selection stands down. No new interview machinery.
5. **Prose register as a requirement, not a lint**. "User-friendly README" and "timeless, self-contained
   register" are authored-quality requirements enforced by the skill's judgement and the author's review —
   never a `docs-check` rule (prose judgement in the gate is the abandoned governance tower).
6. **onboard delegates**. Its establish-docs step names the profile choice and points at the living-docs
   catalog; the decision may crystallize into an ADR via the existing interview-byproduct mechanism. No copy
   of the catalog in onboard.

## Risks / Trade-offs

- [Catalog drift between SKILL.md summary and the reference file] → SKILL.md carries only the profile *names*
  and the pointer; all content lives in `references/doc-profiles.md`.
- [Profile previews read as mandates and authors over-fit] → every preview is labeled a starting point;
  pages are added/removed by the same earns-its-place test; the gate never checks profile conformance.
- [Six profiles still miss a destination] → **custom** is a first-class option with follow-up questions, not
  an escape hatch; new named profiles require a spec change (deliberate, low-churn).
- [Register rule could be read as banning changelogs/history] → the rule targets *conversational/session*
  references and meta-commentary, not dated records (CHANGELOG, ADRs remain dated by design).

## Migration Plan

Docs-only change (skills + specs + one docs page). No code, no data, no rollout order. Rollback = revert the
commit. Existing onboarded projects are unaffected; profiles apply on the next establish/refresh.

## Open Questions

None — resolved during exploration (catalog home, profile set, coexistence posture).
