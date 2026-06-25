# Claude-only — options analysis

> Companion to `explore.md`. The question: keep the Copilot best-effort half, or commit fully to Claude Code?

## Shared facts (true for any option)

- The **active** value (skills, hooks, subagents) is Claude-native; Copilot only ever got projected prose.
- **Claude-only ≠ lock-in.** The seeded knowledge stays open Markdown ([ADR-0003](../0003-okf-as-projection-target/DECISION.md)); the host choice is orthogonal to dispensability.
- The project values **don't-reinvent**, **low maintenance over reach**, **keep it simple**, **zero lock-in**.
- OpenSpec is wanted as the **sole external dependency** (SDD engine + historical record of decisions/dev).

---

## Option A — Keep Claude-first + Copilot best-effort (status quo)

**What it is.** Retain `rulesync`, `eunomai.yaml` (`targets: [claudecode, copilot]`), the `projection/` tool,
and the generated `copilot-instructions.md`; keep "if Copilot…" caveats in the docs.

**Advantages.** Nominal multi-tool reach; nothing to rewrite.

**Disadvantages.** A **dependency** (`rulesync`) and a **config file** for a surface that never carried the real
power. "Strange variations" and conditional wording across the docs. Maintenance for marginal value. Pulls
against *keep it simple*.

**Real-world implications.** Ongoing upkeep of a parity path the target audience (developers on Claude Code)
does not use.

**Recommendation.** ❌ Drop it.

---

## Option B — Claude-only; retire Copilot, parity projection, and `eunomai.yaml` ✅ recommended

**What it is.** Commit fully to Claude Code. Remove Copilot from principles/README/docs, retire the cross-tool
projection and `eunomai.yaml`, keep **OpenSpec as the sole external dependency**, **rehome the read-only checks**
(`docs-check`, `provenance-check`) as a small self-contained CLI, and consolidate to a single open-standard
authored instruction file (`AGENTS.md`).

**How it works.** Delete the Copilot target and the `rulesync` projection; drop `eunomai.yaml` and
`copilot-instructions.md`; `compile`/`compile --check` (drift of generated files) become moot and go; the two
real checks survive under a non-"projection" name.

**Advantages.** **Fewer moving parts**, fewer dependencies, no config file, no generated parity artifact, no
conditional wording. **Simpler and more robust.** Loses nothing the real audience uses. Keeps zero lock-in (the
substrate is still portable Markdown).

**Disadvantages.** Forfeits best-effort Copilot reach (never load-bearing). Requires a rebase to clean out the
parity surface — acceptable and intended.

**Real-world implications.** A leaner, sharper utility, exactly "100% developer-oriented on Claude Code".

**Recommendation.** ✅ **Adopt this.**

---

## Decision matrix

| Criterion | A keep Copilot best-effort | B Claude-only |
|---|---|---|
| Keep it simple | ❌ | ✅ |
| Fewer dependencies | ❌ (`rulesync`) | ✅ (OpenSpec only) |
| Zero lock-in | ✅ | ✅ (substrate stays open) |
| Loss for the real audience | none either way | none |
| Maintenance | higher (parity path) | lower |

**The one real trade with B:** no best-effort Copilot output. Accepted — it was never load-bearing, and its
removal is a net simplification aligned with every project principle.
