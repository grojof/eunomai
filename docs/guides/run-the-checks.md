# Run the checks (the gate)

eunomai ships three **read-only** checks, plus one write command, in the [projection](../reference/projection.md)
CLI. Together the read-only three are the **gate** — wire them into CI / pre-merge so structure and provenance
can't silently drift.

## The commands

Run from a clone, or via `${CLAUDE_PLUGIN_ROOT}` inside a project that installed the plugin:

```bash
node projection/dist/cli.cjs docs-check          # README <-> docs/ integrity
node projection/dist/cli.cjs provenance-check     # every skill covered by the audit registry
node projection/dist/cli.cjs compile --check      # generated CLAUDE.md / copilot files match AGENTS.md
```

| Check | Passes when | Fails on |
|-------|-------------|----------|
| **`docs-check`** | every README→`docs/` link resolves and every in-scope page is indexed | broken links · orphaned pages |
| **`provenance-check`** | every skill under `skills/` (and `.claude/skills/`) has a registry entry | uncovered skills · invalid registry (warns on gaps like `unpinned`) |
| **`compile --check`** | every generated file matches `AGENTS.md` | drift — run `compile` and commit the result |

All three exit **non-zero** on failure and **write nothing**. `docs-check` excludes `docs/decisions/` (ADRs
are dev-facing, out of the index).

## Fixing failures

- **`docs-check`** → add the missing README link (or remove the dead one); see
  [refresh-living-docs](refresh-living-docs.md).
- **`provenance-check`** → record the skill in `eunomai-skills-audit.md` with its real SHA; see
  [add or audit a skill](manage-skills.md).
- **`compile --check`** → run `node projection/dist/cli.cjs compile` and commit the regenerated
  `CLAUDE.md` / `.github/copilot-instructions.md`.

## Example: a CI gate

```bash
node projection/dist/cli.cjs docs-check \
  && node projection/dist/cli.cjs provenance-check \
  && node projection/dist/cli.cjs compile --check
```

This is the same gate eunomai runs on itself. For the package's own dev loop (typecheck · lint · test) see
[contributing](contributing.md).
