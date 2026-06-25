# Projection (Copilot parity + the checks)

The **best-effort parity** tool and the home of eunomai's read-only checks. `AGENTS.md` is the authored
source of truth; projection compiles it to the other tools' formats and verifies the workspace's structural
invariants. It does **not** reinvent rule-sync — it stands on [`rulesync`](https://github.com/dyoshikawa/rulesync).

It is an npm/TypeScript package in [`projection/`](../../projection/), shipped pre-built as a single
self-contained bundle (`projection/dist/cli.cjs`) — **no build step** for consumers.

## Commands

```bash
node projection/dist/cli.cjs <command>
# or, inside a project that installed the plugin:
node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" <command>
```

| Command | Writes? | What it does |
|---------|---------|--------------|
| `compile` | yes | Projects `AGENTS.md` → the declared targets (`CLAUDE.md`, `.github/copilot-instructions.md`) via rulesync. |
| `compile --check` | no | Drift check: exit 1 if any generated output no longer matches `AGENTS.md`. |
| `docs-check` | no | Verifies every README→`docs/` link resolves and every in-scope `docs/` page is indexed. See [living-docs](living-docs.md). |
| `provenance-check` | no | Fails on any skill not covered by the audit registry; lists trust gaps. See [skill-finder](skill-finder.md). |

The three `*-check` commands are **read-only** and belong in your gate (CI / pre-merge). `compile` is the only
one that writes — the generated files are **committed artifacts**.

## Configuration

`eunomai.yaml` at the repo root declares the targets and the authored scope:

```yaml
targets: [claudecode, copilot]
scopes:
  project: ./AGENTS.md
```

## Idempotency (a hard invariant)

A second `compile` with unchanged inputs changes **zero files**. The generated `CLAUDE.md` and
`.github/copilot-instructions.md` are committed, so `compile --check` is what guards them from drift — if it
fails, run `compile` and commit the result.

## Claude-first, Copilot best-effort

Where Copilot has no equivalent for a Claude capability (e.g. the `PreToolUse` hooks — see
[safe-controls](safe-controls.md)), eunomai stays Claude-only and the gap is **documented, never faked**.

## Development

The dev loop (typecheck · lint · test) and how to contribute to this package live in
[contributing](../guides/contributing.md).
