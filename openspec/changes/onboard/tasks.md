## 1. The eunomai-onboard skill

- [x] 1.1 Add `skills/eunomai-onboard/SKILL.md` — the cold-start playbook: **analyze** the project + gather
  author input → **docs** (restructure to the lean README → `docs/` standard, or create from scratch) →
  **seed** conventions (lean `AGENTS.md`, `openspec/config.yaml`, permissions baseline, hooks wiring),
  derived from eunomai's own live conventions, adapted to the target → **invoke `eunomai-skill-finder`** in
  audit mode → drive `docs-check` + `provenance-check` green → **hand off** to the steady-state pillars.
  Detect plugin-install vs source for the hooks wiring (req: *Analyze project and gather author input*,
  *Establish docs to the living-docs standard*, *Seed eunomai conventions*, *Audit existing skills via
  skill-finder*, *Orchestrate, do not reimplement*, *One-shot, dispensable hand-off*).
- [x] 1.2 Add `skills/eunomai-onboard/PROVENANCE.md` (`origin: authored`) so `provenance-check` stays green
  (req: *onboard carries provenance*).

## 2. Docs

- [x] 2.1 Add `docs/onboard.md` (project-doc: the cold-start orchestrator, what it seeds, the hand-off) and
  index it in the README (keeps `docs-check` green; dogfoods living-docs).
- [x] 2.2 Document the connector/bootstrap axis in `AGENTS.md` — onboard as the cold-start orchestrator that
  seeds and steps aside — then re-project to `CLAUDE.md` / `copilot-instructions.md`.

## 3. Validation gate

- [x] 3.1 `node projection/dist/cli.js docs-check` exits 0 (new page indexed).
- [x] 3.2 `node projection/dist/cli.js provenance-check` exits 0 (three skills now, all with provenance).
- [x] 3.3 Re-project and verify idempotency: `compile` then `compile --check` (zero drift).
- [x] 3.4 Validate the change: `openspec validate onboard --strict`.
- [x] 3.5 Sanity (no code changed, but confirm nothing broke): `cd projection && npm run typecheck && npm run lint && npm test`.
