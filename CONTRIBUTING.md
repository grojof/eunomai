# Contributing to eunomai

Thanks for helping improve eunomai. This is the GitHub-discoverable entry point; the **full developer guide**
lives at **[docs/guides/contributing.md](docs/guides/contributing.md)** — read it before opening a PR.

## TL;DR

- **`AGENTS.md` is the authored source of truth.** `CLAUDE.md` and `.github/copilot-instructions.md` are
  **generated** — edit `AGENTS.md`, then regenerate with `node projection/dist/cli.cjs compile`.
- **Conventional Commits**, imperative mood, one logical change per commit. **No AI-attribution trailers**
  (a hook hard-denies them).
- **Non-trivial change is spec-first** via OpenSpec: `/opsx:explore → /opsx:propose <name> → /opsx:apply →
  /opsx:archive`. See [docs/reference/sdd.md](docs/reference/sdd.md).

## Before you open a PR

Run the package dev loop and the read-only gate; all green is the definition of done:

```bash
cd projection && npm run typecheck && npm run lint && npm test && npm run build
node projection/dist/cli.cjs docs-check
node projection/dist/cli.cjs provenance-check
node projection/dist/cli.cjs compile --check
```

## Reporting issues

- **Security vulnerabilities** → **do not** open a public issue; follow [SECURITY.md](SECURITY.md).
- **Bugs / ideas** → open a GitHub issue with a minimal reproduction or a clear proposal.

By contributing you agree your contributions are licensed under the project's [MIT License](LICENSE).
