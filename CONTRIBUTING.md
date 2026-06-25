# Contributing to eunomai

Thanks for helping improve eunomai. This is the GitHub-discoverable home for working **on** eunomai itself —
the single source of the dev loop (there is no separate `docs/contributing.md`).

## Source of truth

**`CLAUDE.md` is the single authored source of truth** for conventions (Claude-only — see ADR-0004; no
generated instruction files, no projection). Edit `CLAUDE.md` directly; this page is the practical loop, not a
restatement of it.

## Conventions

- UTF-8, **LF** newlines, final newline at EOF.
- **Conventional Commits**, imperative mood, **one logical change per commit**. **No AI-attribution trailers**
  (the commit-trailer hook hard-denies them).
- TypeScript, ESM, Node ≥ 20 in `tools/`. Match the surrounding code; small functions, early returns.
- Validate inputs at boundaries; never weaken validation to "make it work".

## Spec-driven change

Non-trivial work goes through the SDD flow on OpenSpec: `/opsx:explore` → `/opsx:propose <name>` →
`/opsx:apply` → `/opsx:archive`. Keep the OpenSpec layer current with `openspec update`.

## The dev loop

Run the package loop before finishing any change to `tools/`, then the read-only gate:

```bash
cd tools && npm run typecheck && npm run lint && npm test && npm run build   # rebuild + commit the bundle
node tools/dist/cli.cjs docs-check          # README↔docs/ links + frontmatter
node tools/dist/cli.cjs provenance-check    # every skill covered by the audit registry
node --test "hooks/*.test.mjs"              # safe-controls decision logic
```

The bundle (`tools/dist/cli.cjs`) is a **committed artifact** — rebuild and commit it when the source changes,
so consumers need no build step. All green is the definition of done.

## Reporting issues

- **Security vulnerabilities** → **do not** open a public issue; follow [SECURITY.md](SECURITY.md).
- **Bugs / ideas** → open a GitHub issue with a minimal reproduction or a clear proposal.

By contributing you agree your contributions are licensed under the project's [MIT License](LICENSE).
