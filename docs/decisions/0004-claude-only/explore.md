# Explore 0004 — Should eunomai drop Copilot parity and go Claude-only?

> Investigation prompted by the conclusion that eunomai is a developer utility best served by committing fully
> to one agent host, with OpenSpec as its only external dependency.

## Problem

eunomai today is "**Claude-first, Copilot best-effort**". The best-effort half costs real surface: a `rulesync`
dependency, an `eunomai.yaml` config, a `projection/` tool whose primary job is `AGENTS.md → Copilot`, a
generated `copilot-instructions.md` artifact, and "if Copilot, then…" caveats sprinkled through the docs. Does
that half earn its keep?

## Findings

- The **core value** of eunomai — the seeded standard, the SDD flow, the skills, the hooks — is **Claude-native**
  (Agent Skills, `PreToolUse` hooks, subagents). Copilot gets none of the active layer; it only ever received
  the **projected prose**.
- The Copilot path is therefore a **thin, low-value surface** that nonetheless adds a dependency, a config file,
  a generated artifact, and conditional wording. It is "best-effort" precisely because it never carried the
  real power.
- **Claude-only ≠ vendor lock-in.** [ADR-0003](../0003-okf-as-projection-target/DECISION.md) keeps the
  *knowledge substrate* open and portable (plain Markdown + frontmatter). Choosing one **agent host** is
  orthogonal to keeping the **project's knowledge** dispensable and copyable. Zero lock-in is about the seeded
  artifacts, not the host.
- The user's framing: a utility **100% oriented to developers on Claude Code**, with **OpenSpec as the sole
  external dependency** — its historical record of decisions and development — and **no `eunomai.yaml`** if
  avoidable.

## The realization

The "best-effort Copilot" hedge buys marginal reach at the cost of the project's prized simplicity. Dropping it
removes a dependency (`rulesync`), a config (`eunomai.yaml`), a generated artifact, and a class of "strange
variations" — making the tool **simpler and more robust** while losing nothing its real audience uses.

The one thing the `projection/` package also hosts — the **read-only checks** (`docs-check`, `provenance-check`)
— is **Claude-agnostic and valuable**, and must survive the removal (rehomed, not deleted). The
projection/drift machinery (`compile`, `compile --check`) becomes moot once there is no cross-tool generation.

## The open question this forces

With Copilot gone and `eunomai.yaml`/projection retired, what is the **single authored instruction file**?
- `AGENTS.md` is the **open cross-tool convention** (not Anthropic-branded; keeps ADR-0003's open-substrate
  spirit). Claude Code reads project instructions; whether it reads `AGENTS.md` directly or needs `CLAUDE.md`
  decides the mechanism.
- Options: (a) author `AGENTS.md`, keep `CLAUDE.md` as a trivial replica/pointer (no rulesync); (b) if Claude
  Code reads `AGENTS.md` natively, drop `CLAUDE.md` entirely; (c) author `CLAUDE.md` directly and drop
  `AGENTS.md`.
- Recommendation: prefer **(a)/(b)** — keep `AGENTS.md` as the open-standard authored source; make `CLAUDE.md`
  trivial or unnecessary. Settle the exact mechanism during the rebase. This also resolves the
  `AGENTS.md ↔ CLAUDE.md` replica question behind the base-block idea (T1).

## Options

| Option | What | Verdict |
|---|---|---|
| **A — keep Claude-first + Copilot best-effort** | status quo: rulesync, `eunomai.yaml`, projected `copilot-instructions.md` | ❌ marginal reach, real surface + a dependency + "strange variations" |
| **B — Claude-only; retire Copilot, projection-for-parity, and `eunomai.yaml`; OpenSpec sole dependency; keep the checks** | one host, one authored instruction file, fewer moving parts | ✅ simpler, more robust, zero loss for the real audience |

## Lean recommendation (confirmed in DECISION)

**Option B.** Go Claude-only. Drop Copilot entirely, retire the cross-tool projection and `eunomai.yaml`, keep
OpenSpec as the sole external dependency, rehome the read-only checks, and consolidate to a single open-standard
authored instruction file.

## Open questions (for the rebase)
1. `AGENTS.md` vs `CLAUDE.md` single-source mechanism → prefer open-standard `AGENTS.md`; settle exact wiring.
2. New home for `docs-check` / `provenance-check` once `projection/` loses its parity role → keep as a small
   self-contained CLI, renamed away from "projection".
3. Token efficiency / model routing → separate, later ADR.
