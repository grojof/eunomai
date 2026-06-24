## 1. Restructure docs/

- [x] 1.1 Create `docs/guides/`, `docs/reference/`, `docs/explanation/`; move `usage.md` →
  `guides/getting-started.md`, `VISION.md` → `explanation/vision.md`, and the four pillar pages
  (`safe-controls`, `living-docs`, `skill-finder`, `onboard`) → `reference/` (req: *Project-docs structure
  standard*).
- [x] 1.2 Remove `docs/development/` (`PROJECT-STATE.md`) (req: *Dev-docs excluded from scope*; proposal: dev
  handoff now lives in memory + specs).

## 2. Re-link

- [x] 2.1 Update the README index + Layout to the new Diátaxis paths (req: *Project-docs structure standard*).
- [x] 2.2 Update every cross-link to the moved files and remove references to `PROJECT-STATE` / `development/`
  across the repo (`AGENTS.md`, the docs pages, skills) — grep to confirm none remain.

## 3. Diátaxis in the skill + the denylist

- [x] 3.1 Update `eunomai-living-docs` SKILL.md and `reference/living-docs.md` to teach the Diátaxis types
  (where each kind of page goes) (req: *On-demand docs refresh skill*, *Project-docs structure standard*).
- [x] 3.2 Narrow the dev-doc denylist to `docs/decisions/` in `projection/src/docs.ts` (drop
  `docs/development`) and update the `docs.test.ts` dev-doc fixture accordingly (req: *Dev-docs excluded from
  scope*).

## 4. Authored source + projection

- [x] 4.1 Update `AGENTS.md` (the `docs/` structure bullet + the denylist mention) and re-project to
  `CLAUDE.md` / `copilot-instructions.md`.

## 5. Validation gate

- [x] 5.1 `node projection/dist/cli.cjs docs-check` exits 0 (all pages indexed at their new paths).
- [x] 5.2 `node projection/dist/cli.cjs provenance-check` exits 0.
- [x] 5.3 Re-project and verify idempotency: `cli.cjs compile` then `compile --check` (zero drift).
- [x] 5.4 Validate the change: `openspec validate docs-restructure --strict`.
- [x] 5.5 Run the gate (code changed in `projection/`): rebuild, then `cd projection && npm run typecheck &&
  npm run lint && npm test`.
