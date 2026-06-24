## 1. Packaging

- [ ] 1.1 Add `.claude-plugin/marketplace.json` — `name`, `owner`, and a `plugins` entry for eunomai with
  `source: "."` (the repo root is the plugin) and a one-line description (req: *Installable as a Claude Code
  plugin*).

## 2. Usage guide

- [ ] 2.1 Write `docs/usage.md` — the end-to-end spine: **prerequisites** (Node ≥ 20, Claude Code, the
  OpenSpec CLI), **install** (`/plugin marketplace add <path>` → `/plugin install eunomai@eunomai` →
  `/reload-plugins`), **apply to a new/existing project** via `eunomai-onboard`, the **daily workflow** (SDD
  loop, hooks, skills, checks), and an **honest note** on what ships with the plugin vs build-from-source
  (req: *Coherent end-to-end usage guide*).
- [ ] 2.2 Add a **Getting started** section to the README that leads with `docs/usage.md`, and index the page
  in the README (req: *README leads with getting started*, *Docs integrity preserved*).

## 3. Docs

- [ ] 3.1 Add a short install/usage pointer in `AGENTS.md` (link `docs/usage.md`) and re-project to
  `CLAUDE.md` / `copilot-instructions.md`.

## 4. Validation gate

- [ ] 4.1 `node projection/dist/cli.js docs-check` exits 0 (usage page indexed).
- [ ] 4.2 `node projection/dist/cli.js provenance-check` exits 0.
- [ ] 4.3 Re-project and verify idempotency: `compile` then `compile --check` (zero drift).
- [ ] 4.4 Validate the change: `openspec validate usage-and-packaging --strict`.
- [ ] 4.5 Sanity (no code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
