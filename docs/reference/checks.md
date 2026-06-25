# Checks (the read-only CLI)

eunomai's two **read-only** structural checks, shipped as a single self-contained bundle in
[`tools/`](../../tools/) — no build step for consumers. They enforce *structure*, never prose: they belong in
your gate (CI / pre-merge) and never write anything.

```bash
node tools/dist/cli.cjs <command>
# or, inside a project that installed the plugin:
node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" <command>
```

| Command | Writes? | What it does |
|---------|---------|--------------|
| `docs-check` | no | Verifies every README→`docs/` link resolves, every in-scope `docs/` page is indexed, and the mandatory community-health files are present. See [living-docs](living-docs.md). |
| `provenance-check` | no | Fails on any skill not covered by the skills-audit registry; lists trust gaps. See [skill-finder](skill-finder.md). |

Both run with plain `node` and no `node_modules` (every runtime dependency is inlined into the committed
bundle), so the CLI travels with the plugin and resolves via `${CLAUDE_PLUGIN_ROOT}`.

## Why a CLI and not a hook

These are *gate* checks — deliberate, read-only verifications you run in CI or before merge. The runtime,
ask-by-default guardrails are a separate pillar: the `PreToolUse` hooks (see [safe-controls](safe-controls.md)).

## Development

The dev loop (typecheck · lint · test · build) and how to contribute to this package live in
[contributing](../guides/contributing.md).
