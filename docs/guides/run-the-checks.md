# Run the checks (the gate)

eunomai ships two **read-only** checks in the [checks](../reference/checks.md) CLI. Together they are the
**gate** — wire them into CI / pre-merge so structure and provenance can't silently drift. They write nothing.

## The commands

Run from a clone, or via `${CLAUDE_PLUGIN_ROOT}` inside a project that installed the plugin:

```bash
node tools/dist/cli.cjs docs-check          # README <-> docs/ integrity + community-health files
node tools/dist/cli.cjs provenance-check    # every skill covered by the audit registry
```

| Check | Passes when | Fails on |
|-------|-------------|----------|
| **`docs-check`** | every README→`docs/` link resolves, every in-scope page is indexed, and the mandatory community-health files are present | broken links · orphaned pages · missing community-health files |
| **`provenance-check`** | every skill under `skills/` (and `.claude/skills/`) has a registry entry | uncovered skills · invalid registry (warns on gaps like `unpinned`) |

Both exit **non-zero** on failure and **write nothing**. `docs-check` excludes `docs/decisions/` (ADRs are
dev-facing, out of the index).

## Fixing failures

- **`docs-check`** → add the missing README link (or remove the dead one); see
  [refresh-living-docs](refresh-living-docs.md).
- **`provenance-check`** → record the skill in `eunomai-skills-audit.md` with its real SHA; see
  [add or audit a skill](manage-skills.md).

## Example: a CI gate

```bash
node tools/dist/cli.cjs docs-check \
  && node tools/dist/cli.cjs provenance-check
```

This is the same gate eunomai runs on itself. For the package's own dev loop (typecheck · lint · test · build)
see [contributing](contributing.md).
