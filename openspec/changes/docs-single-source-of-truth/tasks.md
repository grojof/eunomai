## 1. Standard + skill: the single-source principle

- [x] 1.1 Add to `docs/living-docs.md`: the principle (**one fact, one home — everything else links**), the
      layer model, the **"earns its place" test**, and the **anti-duplication lens**.
- [x] 1.2 Add the same to `skills/eunomai-living-docs/SKILL.md` (a step + a boundary): apply the test; surface
      duplicates; propose merge/link; note the gate stays shape-only.

## 2. Clean eunomai's own docs

- [x] 2.1 Merge `docs/contributing.md` into the root `CONTRIBUTING.md` (one file); remove the `docs/` page and
      its README link.
- [x] 2.2 Apply the test to `docs/sdd.md`, `docs/skill-finder.md`, `docs/base-skills.md`, `docs/checks.md` —
      slim to a lead + link to the canonical home (`CLAUDE.md`/ADR), or sharpen to non-overlapping detail.
- [x] 2.3 Update the README map (pillars/links) to match.

## 3. Sync spec + verify the gate

- [x] 3.1 Sync the `living-docs` delta into `openspec/specs/living-docs/spec.md`.
- [x] 3.2 Run `openspec validate --specs` — all specs pass.
- [x] 3.3 Run `docs-check` (links + frontmatter) + `provenance-check` — both exit 0. Internal-link sweep clean.
