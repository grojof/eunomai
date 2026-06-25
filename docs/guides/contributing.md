# Contributing (working on eunomai)

For developers working **on** eunomai itself (not just using it). The authoritative conventions live in
[`AGENTS.md`](../../AGENTS.md) — this page is the practical dev loop.

## Source of truth

- **`AGENTS.md` is authored; `CLAUDE.md` and `.github/copilot-instructions.md` are generated** from it via
  [projection](../reference/projection.md). Edit `AGENTS.md`, never the generated files — a hook will ask
  before you edit a generated artifact.
- After changing `AGENTS.md`, regenerate and commit:
  ```bash
  node projection/dist/cli.cjs compile
  ```

## Conventions

- UTF-8, **LF** newlines, final newline at EOF.
- **Conventional Commits**, imperative mood, **one logical change per commit**. **No AI-attribution
  trailers** (the commit-trailer hook hard-denies them).
- TypeScript, ESM, Node ≥ 20 in `projection/`. Match the surrounding code; small functions, early returns.
- Validate inputs at boundaries; never weaken validation to "make it work".

## The projection package (`projection/`)

Run the full loop before finishing any change to the package:

```bash
cd projection
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm test            # vitest run
npm run build       # tsup -> dist/cli.cjs (the shipped, committed bundle)
```

The bundle (`projection/dist/cli.cjs`) is a **committed artifact** — rebuild and commit it when the source
changes, so consumers need no build step.

## The hooks (`hooks/`)

Safe-controls logic is a pure function (`hooks/decide.mjs`) wired by `hooks/guard.mjs`. Test it with Node's
built-in runner:

```bash
node --test "hooks/*.test.mjs"
```

See [safe-controls](../reference/safe-controls.md) for what the hooks enforce.

## Spec-driven change

Non-trivial work goes through the [SDD flow](../reference/sdd.md):
`/opsx:explore` → `/opsx:propose <name>` → `/opsx:apply` → `/opsx:archive`. Keep the OpenSpec layer current
with `openspec update`.

## Before you finish

Run the [gate](run-the-checks.md) — `docs-check`, `provenance-check`, `compile --check` — plus the package
loop above. All green is the definition of done.
