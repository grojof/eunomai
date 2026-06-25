## Why

[ADR-0004](../../../docs/decisions/0004-claude-only/DECISION.md) decided eunomai goes **Claude-only** with
**OpenSpec as the sole external dependency**. The "Copilot best-effort" half never carried the active value
(skills, hooks, subagents are Claude-native) yet cost a `rulesync` dependency, an `eunomai.yaml` config, a
generated `copilot-instructions.md`, the `compile` projection, and "if Copilot…" wording. This change executes
that decision as a clean rebase: fewer moving parts, fewer dependencies, simpler and more robust — losing
nothing the target audience uses. Per ADR-0003 the knowledge substrate stays open Markdown, so Claude-only is
**not** lock-in.

## What Changes

- **Remove Copilot** from principles, README, and `getting-started`; delete the generated
  `.github/copilot-instructions.md`. **BREAKING** for any Copilot consumer (none in practice).
- **Retire the cross-tool projection** (`rulesync`) and **`eunomai.yaml`**; drop the `compile` /
  `compile --check` commands (drift of generated tool files becomes moot).
- **Keep the read-only checks** (`docs-check`, `provenance-check`) as a small **self-contained CLI renamed away
  from "projection"** (Claude-agnostic, still part of the gate).
- **Consolidate to a single open-standard authored instruction file**: `AGENTS.md` is the authored source;
  `CLAUDE.md` becomes a trivial replica or is dropped (resolves the `AGENTS.md ↔ CLAUDE.md` model).
- **OpenSpec** is named as the sole external dependency (SDD engine + historical record of decisions/dev).
- Unchanged: skills, hooks, `openspec/`, `docs/` (Diátaxis), the ADRs.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `distribution`: drop the Copilot/projection packaging; the shipped CLI becomes the two read-only checks (no
  `compile`), renamed away from "projection"; a new requirement fixes the single-host, single-authored-source,
  OpenSpec-sole-dependency shape.

## Impact

- `projection/` — remove the `rulesync`/Copilot role and `compile`; keep `docs-check` + `provenance-check`,
  rename the package/path away from "projection" (e.g. a `tools/`/`bin/` CLI). Update skill invocations.
- `eunomai.yaml` — removed. `.github/copilot-instructions.md` — removed. `CLAUDE.md` — trivial replica or removed.
- `AGENTS.md` — drop Copilot/projection wording; becomes the single authored source.
- `README.md`, `docs/guides/getting-started.md`, `docs/reference/projection.md` — rewrite for Claude-only;
  `projection.md` becomes the checks-CLI reference (or folds in).
- Reuse vs net-new: **pure subtraction + rename** — we remove a dependency (`rulesync`) and a config, keep the
  valuable checks. No new machinery. OpenSpec (reused) is the sole remaining external dependency.
- Lands as a clean rebase (ADR-0004), not an incremental shim. A coherent `0.1.0` is cut afterward.
