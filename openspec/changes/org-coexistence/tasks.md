## 1. Coexistence contract (canonical home)

- [x] 1.1 Write `docs/org-adoption.md` (`type: how-to`): the four contract clauses, "the project's rules"
      defined, coexistence facts (namespacing, most-restrictive-wins hook merge, guard never allows),
      org-wide rollout (managed settings / marketplaces / private mirrors), pinning + update flow,
      extension seams, removal story
- [x] 1.2 Index the new page in the `README.md` map
- [x] 1.3 Add the coexistence principle line to `CLAUDE.md` (Principles) referencing the page

## 2. Onboard adapts

- [x] 2.1 `agents/workspace-survey.md`: extend `existingConfig` to governance enumeration (hooks +
      permissions in `.claude/settings.json`, `.claude/skills/*`, provenance registry, plugin markers)
- [x] 2.2 `skills/eunomai-onboard/SKILL.md`: insert the coexistence assessment step (classify six surfaces,
      interview conflicts, adapt-first default); make each seed skippable (OpenSpec only where no SDD
      exists; merge-not-replace `CLAUDE.md`)
- [x] 2.3 Inline the canonical activator block into the onboard SKILL; update `docs/onboard.md` to link to
      the skill as the block's home; fix check invocations to state the from-source fallback
- [x] 2.4 Update `docs/onboard.md` narrative to match (assessment step, per-seed opt-out)

## 3. Skill-finder org input

- [x] 3.1 `skills/eunomai-skill-finder/SKILL.md`: org-trust gate input (read from the project's rules,
      recorded in rubric, never bypasses the veto); AUDIT verdicts (keep · keep-with-gaps ·
      flag-for-removal); human confirmation before vendoring; plugin-delivered-skills boundary sentence
- [x] 3.2 Update `docs/skill-finder.md` + `docs/manage-skills.md` to match (verdicts, org-trust, boundary)

## 4. Living-docs coexistence

- [x] 4.1 `skills/eunomai-living-docs/SKILL.md`: fifth activation route (org-owned → link, don't restate);
      frontmatter coexistence rule; ADR create-vs-edit clarification
- [x] 4.2 Update `docs/living-docs.md` to match

## 5. Safe-controls seam (with the hardening batch)

- [x] 5.1 `hooks/decide.mjs` + `hooks/guard.mjs`: `EUNOMAI_TRAILER_RULE` + `EUNOMAI_EXTRA_GATES` (fail-open),
      PowerShell tool coverage — implemented alongside the hardening fixes; tests in `decide.test.mjs`
- [x] 5.2 `docs/safe-controls.md`: coexistence section documents the seam and the merge semantics

## 6. Verify

- [x] 6.1 `node tools/dist/cli.cjs docs-check` and `provenance-check` exit 0 from the repo root
- [x] 6.2 `node --test "hooks/*.test.mjs"` passes; `cd tools && npm run typecheck && npm run lint && npm test`
      passes (no tools code changed by this change, still run as the gate)

