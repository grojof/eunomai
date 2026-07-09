## 1. Profile catalog (living-docs skill)

- [x] 1.1 Author `skills/eunomai-living-docs/references/doc-profiles.md`: the six destination profiles
  (library/SDK · service/API · CLI tool · framework/platform · firmware/embedded · end-user app/internal
  tool) + custom — each with a preview (approximate README skeleton, starter `docs/` page set annotated with
  Diátaxis `type` and emphasis), detection signals for the recommended default, and the coexistence/skippable
  posture (Req: Doc-set profiles by repo destination)
- [x] 1.2 Update `skills/eunomai-living-docs/SKILL.md`: add the profile-selection step to the flow and
  interview (recommend-from-signals · show previews · custom → follow-ups · skippable · incumbent wins),
  carrying only profile names + a pointer to `references/doc-profiles.md` (Req: Doc-set profiles)

## 2. Quality bar + sync (living-docs skill)

- [x] 2.1 Add the README quality bar and the self-contained/timeless prose register to
  `skills/eunomai-living-docs/SKILL.md` (user-friendly README regardless of profile; register violations
  surfaced as suggestions; never a gate rule) (Req: README quality bar and prose register)
- [x] 2.2 State same-pass README↔docs sync as an authoring duty in the SKILL.md flow (add/remove/rename a
  page ⇒ map updated in the same set of edits) (Req: Same-pass README↔docs synchronization)

## 3. onboard integration

- [x] 3.1 Update `skills/eunomai-onboard/SKILL.md` step 3 (establish docs): offer the profile choice by
  delegating to the living-docs catalog, recommended default from analysis signals, custom included,
  skippable per coexistence; non-obvious decisions may become ADRs (Req: Establishing docs offers a doc-set
  profile)

## 4. Docs page + coherence

- [x] 4.1 Add a "Doc-set profiles" summary section to `docs/living-docs.md` that links to the skill's
  canonical catalog (no second copy) and states the README quality bar + register + same-pass sync in the
  standard's terms (Req: all three living-docs requirements)
- [x] 4.2 Verify coexistence coherence: profiles are default-where-nothing-exists; confirm no change needed
  to `openspec/specs/coexistence/spec.md` or `docs/org-adoption.md`, and that nothing reads as blocking

## 5. Verify

- [x] 5.1 Run `node tools/dist/cli.cjs docs-check` and `provenance-check` from the repo root — both exit 0
- [x] 5.2 Run `openspec validate --change enrich-living-docs-profiles` (delta specs parse; scenarios use 4
  hashtags); no `tools/` code changed, so the tools gate is not required — run it only if anything under
  `tools/` was touched
