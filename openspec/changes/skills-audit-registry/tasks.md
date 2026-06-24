## 1. Registry + check rework (`projection/`)

- [ ] 1.1 Rework `projection/src/provenance.ts`: define a zod schema for the `eunomai-skills-audit.md`
  frontmatter (`skills[]`: `name`, `origin`, `ref`, `verdict`, `rubric`, optional `gaps[]`); scan the skill
  roots `.claude/skills/` **and** `skills/`; for each existing root, parse its registry and verify it covers
  every skill dir (a dir with `SKILL.md`); collect `uncovered`, `invalid`, and `gaps`. Read-only (req:
  *Consolidated skills-audit registry*, *provenance-check*).
- [ ] 1.2 Update the `provenance-check` CLI: exit non-zero on uncovered/invalid; print a **gaps** section
  (e.g. `unpinned`) for action; success message reports skills covered (req: *provenance-check*).
- [ ] 1.3 Rewrite `projection/test/provenance.test.ts` for the registry model: covered → ok; uncovered skill
  → non-zero; invalid entry → non-zero; gaps surfaced but non-fatal; a skill under `.claude/skills/` is
  checked; no skills → ok (req: *provenance-check*).

## 2. Skill-finder

- [ ] 2.1 Update `skills/eunomai-skill-finder/SKILL.md`: maintain the **`eunomai-skills-audit.md` registry**
  (not sidecars) at the skills root; record the **real SHA** when vendoring; unpinned → `gaps: [unpinned]`,
  never "veto OK"; document the registry format + location (req: *Consolidated skills-audit registry*,
  *On-demand audit of existing skills*).

## 3. Dogfood

- [ ] 3.1 Delete eunomai's three `PROVENANCE.md` sidecars; add `skills/eunomai-skills-audit.md` covering
  `eunomai-living-docs`, `eunomai-skill-finder`, `eunomai-onboard` (origin `authored`) (req: *eunomai
  dogfoods provenance*).

## 4. Docs + authored source

- [ ] 4.1 Update `docs/reference/skill-finder.md`: the consolidated registry (not sidecars), the multi-root
  check, and gap reporting.
- [ ] 4.2 Update the `AGENTS.md` Skills section (registry, not per-skill sidecar) and re-project to
  `CLAUDE.md` / `copilot-instructions.md`.

## 5. Validation gate

- [ ] 5.1 Rebuild the bundle, then `node projection/dist/cli.cjs provenance-check` exits 0 (registry covers
  the three own skills).
- [ ] 5.2 `node projection/dist/cli.cjs docs-check` exits 0.
- [ ] 5.3 Re-project and verify idempotency: `cli.cjs compile` then `compile --check` (zero drift).
- [ ] 5.4 Validate the change: `openspec validate skills-audit-registry --strict`.
- [ ] 5.5 Run the gate (code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
