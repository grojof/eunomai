## Why

"Everything needed to use eunomai should ship with the plugin." Today the skills and hooks ship, but the
`projection/` CLI (`compile`, `docs-check`, `provenance-check`) has runtime dependencies in `node_modules`
that don't travel in the plugin cache — so a target project would have to build it from source. A spike
verified the fix: a single self-contained **CJS bundle** (tsup `format: cjs` + `noExternal`) inlines every dep
(`rulesync`, `fast-glob`, `yaml`, `zod`) into one `cli.cjs` that runs all commands with plain `node`, no
`node_modules`. Shipping that bundle makes eunomai complete on install.

## What Changes

- Build the projection CLI as a **self-contained CJS bundle** — `projection/dist/cli.cjs`, via tsup
  `format: ["cjs"]` + `noExternal: [/.*/]`. (Spike-verified: `compile`, `docs-check`, `provenance-check` all
  run from a directory with no `node_modules`.)
- **Commit the bundle** so it travels via git and ships with the plugin — un-gitignore
  `projection/dist/cli.cjs`. Consistent with the "generated files are committed artifacts" principle (like
  `CLAUDE.md`).
- Point `package.json` `bin` at `cli.cjs`; update dev references from `dist/cli.js` → `dist/cli.cjs`.
- **Skills invoke the bundled CLI via `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs`** so it resolves from the
  installed plugin cache in a target project. (Verified: `${CLAUDE_PLUGIN_ROOT}` is substituted inline in skill
  content, not only in hooks.)
- Update `docs/usage.md` to drop the "build from source" caveat — the CLI now ships.
- **Reuse vs net-new (connector-first):** *reuse* tsup (already the bundler) and the Claude Code plugin cache +
  `${CLAUDE_PLUGIN_ROOT}` substitution. *Net-new* is only the self-contained build config, committing the
  bundle, and the skill path change.

## Capabilities

### New Capabilities
<!-- None — this extends the existing `distribution` capability. -->

### Modified Capabilities
- `distribution`: add that eunomai ships a **self-contained CLI** that runs without `node_modules` (so the
  checks/compile work from an installed plugin), and update the usage guide's honesty scenario — the CLI now
  ships rather than requiring a build from source.

## Impact

- **`projection/`:** `tsup.config.ts` (cjs + noExternal), `package.json` `bin` → `cli.cjs`, a `.gitignore`
  exception, and the committed `dist/cli.cjs` (~2.5 MB).
- **Skills** (`eunomai-living-docs`, `eunomai-skill-finder`, `eunomai-onboard`): reference the CLI via
  `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs`.
- **Dev/docs references** (`AGENTS.md`, `docs/usage.md`, `docs/*`, `PROJECT-STATE.md`): `dist/cli.js` →
  `dist/cli.cjs`.
- **Gate:** vitest is unaffected (tests import `src/`); the bundle must run all commands without
  `node_modules`; `docs-check` + `provenance-check` stay green.

## Non-goals

- **Not publishing to npm** — the self-contained bundle removes that need for now.
- **Not the git/remote marketplace** — a separate follow-up; this is about *what ships*, not *where from*.
- **Not bundling the library API** (`index`) for external consumers — only the CLI needs to ship.
