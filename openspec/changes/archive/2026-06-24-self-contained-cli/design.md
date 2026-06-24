## Context

eunomai is installable (marketplace.json) and its skills + hooks ship and work. But the `projection/` CLI
(`compile`, `docs-check`, `provenance-check`) depends on `node_modules` (`rulesync`, `fast-glob`, `yaml`,
`zod`), which the plugin cache does not carry — so a target project would have to build it from source. The
plugin directory *is* copied to the cache (`source: "."`), and `${CLAUDE_PLUGIN_ROOT}` is substituted inline in
skill content (both verified in the Claude Code docs). A spike settled the bundling question (below).

## Goals / Non-Goals

**Goals:**
- Ship a self-contained CLI so every command runs from an installed plugin with no `node_modules` or build step.

**Non-Goals:**
- Publishing to npm; the git/remote marketplace; bundling the library API for external consumers.

## Decisions

### Decision 1 — Self-contained CJS bundle via tsup (spike-verified)

Build the CLI with tsup `format: ["cjs"]` + `noExternal: [/.*/]` → one `dist/cli.cjs` (~2.5 MB) with every dep
inlined. **Spike result:** the naive ESM bundle (`format: esm`) fails at runtime — `Dynamic require of "os"`
from `fast-glob` (ESM output can't do dynamic `require`); the **CJS** bundle runs `compile` (rulesync included),
`docs-check`, and `provenance-check` from a directory with no `node_modules`.

- *Why over alternatives:* an ESM bundle is broken for these deps; publishing to npm adds an outward-facing
  release + network dependency per project; the documented npm-install-on-first-run pattern is heavier. A CJS
  bundle is self-contained, offline, and reuses the bundler we already have.

### Decision 2 — Commit the bundle; ship only `cli.cjs`

`projection/dist/` is gitignored; add a precise exception so **only `cli.cjs`** is committed, so it travels via
git into the plugin. Consistent with eunomai already committing generated artifacts (`CLAUDE.md`,
`copilot-instructions.md`).

- *Why over alternatives:* `git add -f` works but hides intent; an explicit `.gitignore` exception documents
  that the bundle is a shipped artifact. We ship only `cli.cjs` (not the whole `dist/`) to keep the diff tight.
- *Trade-off:* a ~2.5 MB committed file that must be rebuilt + committed when `projection/` source changes
  (rare). The gate builds it; acceptable cost for "everything ships".

### Decision 3 — Two invocation contexts: skills use the plugin root, the repo uses a relative path

Skills run in a *target* project where eunomai is an installed plugin, so they invoke
`${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs`. eunomai's own dev gate and dev-docs run in *this* repo (no
plugin install, `node_modules` present), so they use `node projection/dist/cli.cjs`.

- *Why:* `${CLAUDE_PLUGIN_ROOT}` is only set when running as an installed plugin; using it in the repo's own
  gate would not resolve. Each context uses the path that resolves there.

## Risks / Trade-offs

- **2.5 MB committed artifact + rebuild churn** → only when `projection/` source changes; the gate rebuilds it.
- **Bundle correctness across dep updates** → the gate runs a smoke test of the bundle from a `node_modules`-free
  directory (all three commands), on top of the `src/` unit tests.
- **A future ESM-only dep that won't bundle to CJS** → revisit (npm-publish fallback); currently spike-verified
  working.
- **Low-maintenance check:** one tsup config flag flip + a `.gitignore` exception + path updates; reuses the
  existing bundler and the native plugin cache.
