## 1. Provenance record

- [ ] 1.1 Define and document the per-skill `PROVENANCE.md` sidecar (YAML frontmatter): required keys
  `origin`, `ref` (version/SHA or `authored`), `date`, `verdict`, `rubric`, `modifications` (req: *Per-skill
  provenance record*).

## 2. provenance-check (in `projection/`)

- [ ] 2.1 Implement `checkProvenance` in `projection/src/` — walk `skills/`, require each skill directory to
  have a `PROVENANCE.md` whose frontmatter validates against a zod schema; read-only, collect missing/invalid
  (req: *provenance-check*).
- [ ] 2.2 Expose a `provenance-check` CLI command (separate from `compile` / `docs-check`); non-zero exit with
  a report on any divergence (req: *provenance-check*).
- [ ] 2.3 Add vitest coverage: missing record → non-zero; incomplete/invalid frontmatter → non-zero; all valid
  → zero + no writes (req: *provenance-check*).

## 3. The eunomai-skill-finder skill

- [ ] 3.1 Add `skills/eunomai-skill-finder/SKILL.md` — the playbook: **ACQUIRE** (discover → gate → adopt /
  adopt-and-improve / create → fit pass) and **AUDIT** (on-demand, scoped). Encode the gate (security/provenance
  **veto** + weighed **judgment** on authorship/usage/quality, quality measurable via skill-creator eval),
  delegate authoring/improving to **skill-creator**, and write/update the provenance record. Note the
  safe-controls runtime backstop (req: *Trust gate — security/provenance veto*, *Trust gate — weighed judgment
  and verdict*, *Acquire via skill-creator with a fit pass*, *On-demand audit of existing skills*, *Per-skill
  provenance record*).

## 4. Dogfood provenance

- [ ] 4.1 Add `PROVENANCE.md` for the existing own skills (`eunomai-living-docs`, `eunomai-skill-finder`) with
  `origin: authored` (req: *Per-skill provenance record*, *eunomai dogfoods provenance*).

## 5. Docs

- [ ] 5.1 Add `docs/skill-finder.md` (project-doc: the gate, provenance, `provenance-check`) and index it in the
  README (keeps `docs-check` green; dogfoods living-docs).
- [ ] 5.2 Document the pillar in `AGENTS.md` — the gate, the provenance record, `provenance-check`, and the
  safe-controls backstop — then re-project to `CLAUDE.md` / `copilot-instructions.md`.

## 6. Validation gate

- [ ] 6.1 `node projection/dist/cli.js provenance-check` exits 0 on this repo (req: *eunomai dogfoods provenance*).
- [ ] 6.2 `node projection/dist/cli.js docs-check` exits 0 (new docs page indexed).
- [ ] 6.3 Re-project and verify idempotency: `compile` then `compile --check` (zero drift).
- [ ] 6.4 Validate the change: `openspec validate skill-finder --strict`.
- [ ] 6.5 Run the gate (code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
