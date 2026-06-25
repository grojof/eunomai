## 1. Skill: add the activation-routing lens

- [x] 1.1 Add an "Activation routing" section to `skills/eunomai-living-docs/SKILL.md` describing the
      refresh-time review step and the routing map (convention → `AGENTS.md`; policy → hook/safe-controls;
      procedure → skill/skill-finder; requirement → OpenSpec spec).
- [x] 1.2 Add a boundary note that living-docs **suggests and delegates** only — never writes `AGENTS.md`,
      authors hooks/skills, or creates specs — and never auto-applies (maps to the suggestion-only scenario).
- [x] 1.3 Confirm passive explanatory/reference content stays passive in the wording (maps to the
      "passive content stays passive" scenario).

## 2. Reference doc

- [x] 2.1 Document the routing lens in `docs/reference/living-docs.md`, cross-linking
      `docs/explanation/knowledge-driven-development.md` (the activation table) rather than restating it.
- [x] 2.2 Ensure the README index still resolves (no new orphan page introduced).

## 3. Sync spec + verify the gate

- [x] 3.1 Sync the delta into `openspec/specs/living-docs/spec.md` (`/opsx:sync`) so the new requirement lands
      in the main spec.
- [x] 3.2 Run `openspec validate --specs` — `spec/living-docs` passes.
- [x] 3.3 Run `node projection/dist/cli.cjs docs-check` from the repo root — exits 0 (links resolve, page
      indexed, community-health present). No code changed, so the projection/test gate is not triggered.
