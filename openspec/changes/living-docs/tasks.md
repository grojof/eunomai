## 1. Project-docs structure standard

- [ ] 1.1 Document the standard as a project-doc page (`docs/living-docs.md`): lean README = summary + index
  of links; `docs/` = topic pages; dev-docs (`docs/decisions/`, `docs/development/`) excluded (req:
  *Project-docs structure standard*, *Dev-docs excluded from scope*).

## 2. Refresh skill

- [ ] 2.1 Add `skills/eunomai-living-docs/SKILL.md` (name + description frontmatter) describing the
  human-invoked refresh flow: update the README summary, sync the index with `docs/` pages, and surface
  sections to split into topic pages — keeping the user in control (req: *On-demand docs refresh skill*).

## 3. Integrity check (in `projection/`)

- [ ] 3.1 Implement `docs-check` in `projection/src/` — parse README Markdown links into `docs/`, verify each
  resolves, and verify every in-scope `docs/` page is a README link target; exclude `docs/decisions/` and
  `docs/development/`; read-only, non-zero exit on divergence with a report (req: *README-to-docs integrity
  check*, *Dev-docs excluded from scope*).
- [ ] 3.2 Expose it as a CLI command (e.g. `node projection/dist/cli.js docs-check`), kept separate from
  `compile` (req: *README-to-docs integrity check*).
- [ ] 3.3 Add vitest coverage: broken link → non-zero; orphaned in-scope page → non-zero; in-sync → zero + no
  writes; dev-doc not indexed → not flagged (req: *README-to-docs integrity check*, *Dev-docs excluded*).

## 4. Dogfood & docs

- [ ] 4.1 Bring `README.md` + `docs/` into conformance: every in-scope `docs/` page (e.g. `VISION.md`,
  `safe-controls.md`, `living-docs.md`) is indexed in the README and all links resolve (req: *eunomai
  dogfoods the standard*).
- [ ] 4.2 Document the pillar in `AGENTS.md` — the standard, the skill, and `docs-check` — and re-project to
  `CLAUDE.md` / `copilot-instructions.md` (req: *Project-docs structure standard*).

## 5. Validation gate

- [ ] 5.1 Run the integrity check on this repo: `node projection/dist/cli.js docs-check` exits 0 (req:
  *eunomai dogfoods the standard*).
- [ ] 5.2 Re-project and verify idempotency: `node projection/dist/cli.js compile` then `compile --check`
  (zero drift).
- [ ] 5.3 Validate the change: `openspec validate living-docs --strict`.
- [ ] 5.4 Run the gate (code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
