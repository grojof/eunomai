# Tasks

- [x] 1.1 `docs-check`: reachability through `docs/` links (folder indexes included), broken links in pages and in
      `AGENTS.md` / `CLAUDE.md`, community-health files as warnings unless `--require-health`; tests; CI passes
      `--require-health` (README-to-docs integrity check)
- [x] 2.1 ADR-0007: `AGENTS.md` is the single authored instruction file (supersedes that point of ADR-0004)
- [x] 2.2 eunomai's own `CLAUDE.md` renamed to `AGENTS.md`; every live reference updated (distribution)
- [x] 2.3 Onboard skill and page: seed `AGENTS.md`, offer the migration (rename, both-files warning, `@AGENTS.md`
      bridge, `CLAUDE.local.md` kept), install hooks from the plugin (no copied scripts), offer
      `eunomai-safe-controls` (onboard: AGENTS.md, seed conventions)
- [x] 3.1 Living-docs skill: a short core flow; lenses, KDD, profiles, structure options and the interview moved to
      `references/lenses.md` (living-docs)
- [x] 3.2 Living-docs page: the core first, folders-by-area note, Mermaid colour guidance, the OKF claim stated
      precisely, CHANGELOG anchored to Keep a Changelog (living-docs: diagrams, single source of truth)
- [x] 3.3 CHANGELOG, README, the other docs that name `CLAUDE.md`
- [x] 3.4 Gate: hooks tests, `cd tools && npm run typecheck && npm run lint && npm test && npm run build`,
      `docs-check --require-health`, `provenance-check`, `openspec validate --specs`
