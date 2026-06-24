## 1. Self-contained build

- [x] 1.1 Update `projection/tsup.config.ts` → `format: ["cjs"]` + `noExternal: [/.*/]` so the CLI bundles all
  deps into `dist/cli.cjs` (req: *Self-contained CLI ships with the plugin*).
- [x] 1.2 Point `projection/package.json` `bin.eunomai` at `dist/cli.cjs` (req: *Self-contained CLI*).
- [x] 1.3 Add a `.gitignore` exception so **only** `projection/dist/cli.cjs` is committed (the rest of `dist/`
  stays ignored) (req: *Self-contained CLI*).
- [x] 1.4 Build, then commit `projection/dist/cli.cjs` so it ships with the plugin (req: *Self-contained CLI*).

## 2. Wire references

- [x] 2.1 Update the skills (`eunomai-living-docs`, `eunomai-skill-finder`, `eunomai-onboard`) to invoke
  `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs` (req: *Self-contained CLI* — skills reference the bundle).
- [x] 2.2 Update dev/docs references `dist/cli.js` → `dist/cli.cjs` (`AGENTS.md`, `docs/*`, `PROJECT-STATE.md`)
  and re-project.
- [x] 2.3 Update `docs/usage.md`: the CLI now **ships** with the plugin — drop the build-from-source caveat
  (req: *Coherent end-to-end usage guide* — modified).

## 3. Verify the bundle

- [x] 3.1 Run all three commands from a directory with **no `node_modules`** (`compile`, `docs-check`,
  `provenance-check`) and confirm each succeeds (req: *Self-contained CLI* — runs without node_modules).

## 4. Validation gate

- [x] 4.1 `node projection/dist/cli.cjs docs-check` exits 0.
- [x] 4.2 `node projection/dist/cli.cjs provenance-check` exits 0.
- [x] 4.3 Re-project via the bundle and verify idempotency: `cli.cjs compile` then `compile --check` (zero drift).
- [x] 4.4 Validate the change: `openspec validate self-contained-cli --strict`.
- [x] 4.5 Run the gate (code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
