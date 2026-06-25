## Context

[ADR-0004](../../../docs/decisions/0004-claude-only/DECISION.md) supersedes "Claude-first, Copilot best-effort".
Today `projection/` uses `rulesync.convertFromTool` to project `AGENTS.md` → `CLAUDE.md` +
`.github/copilot-instructions.md`, driven by `eunomai.yaml` (`targets: [claudecode, copilot]`), and the same
package hosts `docs-check` / `provenance-check`. This change removes the Copilot/projection reason-for-being
while preserving the two checks. It lands as a clean rebase, not an incremental shim.

## Goals / Non-Goals

**Goals:**
- Remove every Copilot/cross-tool surface: `rulesync` dependency, `eunomai.yaml`, generated
  `copilot-instructions.md`, the `compile` command, and "if Copilot…" wording.
- Keep `docs-check` + `provenance-check` working, rehomed under a non-"projection" name.
- One authored instruction file (`AGENTS.md`); `CLAUDE.md` trivial or gone.
- Name OpenSpec as the sole external dependency.

**Non-Goals:**
- No change to skills, hooks, `openspec/`, or the Diátaxis `docs/` structure (beyond rewording Copilot refs).
- No new checks, no new dependencies.
- The base activator block (T1) and the new agents are **later** changes, unblocked by this one.

## Decisions

- **Reuse-first: keep the checks, drop the projection.** The valuable, Claude-agnostic part of `projection/`
  is the two read-only checks; the disposable part is the `rulesync` projection + `compile`. We **subtract**
  the latter and **rename** the package away from "projection" (it no longer projects). Alternative — keep a
  Claude-only `compile` (AGENTS.md → CLAUDE.md) — rejected: it reintroduces a config + a generated artifact for
  a single trivial copy; prefer a direct authored `AGENTS.md`.
- **`AGENTS.md` is the single open-standard source.** Prefer the vendor-neutral filename (consistent with
  ADR-0003's open substrate). Mechanism for `CLAUDE.md`: if Claude Code reads `AGENTS.md` directly, drop
  `CLAUDE.md`; otherwise keep `CLAUDE.md` as a trivial replica (a copy, or a pointer) with no `rulesync`.
  Decide empirically during apply. Alternative — author `CLAUDE.md` directly, drop `AGENTS.md` — rejected:
  ties the source to a vendor-specific filename.
- **CLI new home.** Move the bundle out of `projection/` to a neutral path (e.g. `tools/` or `bin/`) and update
  the `${CLAUDE_PLUGIN_ROOT}`-relative invocations in skills and docs. Keep the single self-contained `.cjs`
  bundle approach (no `node_modules` at runtime).

## Risks / Trade-offs

- [Stale `${CLAUDE_PLUGIN_ROOT}/projection/...` references after the rename] → Grep every invocation in skills,
  docs, hooks, and the getting-started guide; update in the same change; re-run the gate.
- [`CLAUDE.md` mechanism uncertainty] → Resolve at apply time by checking whether Claude Code loads `AGENTS.md`;
  fall back to a trivial `CLAUDE.md` replica. Either way, no `rulesync`.
- [Losing Copilot reach] → Accepted per ADR-0004; never load-bearing.
- [`docs-check` references / README index churn] → Update `docs/reference/projection.md` (rename/fold to the
  checks-CLI reference) and keep the README index resolving; verify `docs-check` exits 0.

**Low-maintenance check:** the change is net **subtraction** — one fewer dependency (`rulesync`), one fewer
config (`eunomai.yaml`), one fewer generated artifact, one fewer command (`compile`). Strictly simpler; aligns
with *keep it simple*, *don't reinvent*, *low maintenance over reach*.

## Migration Plan

Clean rebase (no shim): remove `eunomai.yaml`, the `rulesync` dep, and `copilot-instructions.md`; relocate +
trim the CLI; rewrite Copilot wording across `AGENTS.md` / README / getting-started / `projection.md`; resolve
the `CLAUDE.md` mechanism; run the full gate (`docs-check`, `provenance-check`, hooks tests). Cut a coherent
`0.1.0` afterward.

## Open Questions

- Does the installed Claude Code load `AGENTS.md` natively (→ drop `CLAUDE.md`), or is a `CLAUDE.md` replica
  required? Resolve at apply time.
- Final CLI home/name (`tools/` vs `bin/`, and the package name) — pick during apply, keep it boring.
