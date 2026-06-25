# Contributing to eunomai

Thanks for helping improve eunomai. This is the GitHub-discoverable entry point; the **full developer guide**
lives at **[docs/contributing.md](docs/contributing.md)** — read it before opening a PR.

## TL;DR

- **`CLAUDE.md` is the single authored source of truth.** There are no generated instruction files and no
  cross-tool projection (Claude-only — see ADR-0004).
- **Conventional Commits**, imperative mood, one logical change per commit. **No AI-attribution trailers**
  (a hook hard-denies them).
- **Non-trivial change is spec-first** via OpenSpec: `/opsx:explore → /opsx:propose <name> → /opsx:apply →
  /opsx:archive`. See [docs/sdd.md](docs/sdd.md).

## Before you open a PR

Run the package dev loop and the read-only gate; all green is the definition of done:

```bash
cd tools && npm run typecheck && npm run lint && npm test && npm run build
node tools/dist/cli.cjs docs-check
node tools/dist/cli.cjs provenance-check
```

## Reporting issues

- **Security vulnerabilities** → **do not** open a public issue; follow [SECURITY.md](SECURITY.md).
- **Bugs / ideas** → open a GitHub issue with a minimal reproduction or a clear proposal.

By contributing you agree your contributions are licensed under the project's [MIT License](LICENSE).
