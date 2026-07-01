---
type: explanation
title: "Vision / Charter"
description: "What eunomai is, its principles, pillars, and architecture."
tags: [vision, charter]
updated: 2026-07-01
---

# eunomai — Vision / Charter

> A focused, **Claude-only AI workspace**, tailored 100% to how we work — built on existing tools, not
> reinventing them. Distributed as a **Claude Code plugin**; **OpenSpec** is the only external dependency.

The name comes from **Eunomia** (Εὐνομία), the Greek personification of *good order* — *eu* (good) + *nomos*
(norm) — with the `·ai` suffix.

## What eunomai is (and isn't)

- **Is:** a curated Claude Code plugin (skills + commands + hooks + subagents) empowering four pillars. It
  works as a **one-shot connector / bootstrap**: it seeds a project with conventions (OpenSpec config + a lean
  `CLAUDE.md` + skills + rules) and then **steps aside** — dispensable, because everything it seeds lives in the
  project's own files (zero lock-in).
- **Is not:** a cross-tool *governance control plane* (abandoned 2026-06-24 — irreducible gaps + high
  maintenance); a **continuous cross-project sync / conformance engine** (that *is* the abandoned tower — the
  bootstrap is one-shot, seed-and-step-aside); an SDD framework (we use **OpenSpec**, the sole external
  dependency).

## Principles

1. **Don't reinvent** — stand on existing tools (Claude Code native, OpenSpec) and build only the tailored
   glue.
2. **Claude-only.** Claude Code is the only host; OpenSpec is the sole external dependency (see ADR-0004).
3. **Low maintenance over reach.** Useful to us beats winning a market; fine if superseded one day.
4. **Trust-gated skills.** Adopt only skills that pass a criteria gate (usage, authorship, origin, quality);
   else create; always improve.
5. **Spec-first** for non-trivial change (SDD on **OpenSpec**, in `openspec/`).

## The four pillars (as plugin skills/commands)

1. **SDD/SPDD** — the spec-driven flow (explore → propose → apply → archive), running on **OpenSpec** with
   eunomai's tailoring in `openspec/config.yaml`.
2. **Living docs** — kept always-fresh **project documentation** (dev-docs/SDD artifacts now belong to
   OpenSpec, not here):
   - a **lean root `README.md`** as index + summary + links (the front door),
   - extending into **`docs/`** for deeper docs, by topic, only when needed.
3. **Safe controls** — hooks (`PreToolUse` deny / ask) + settings permissions; commit-policy guardrails.
4. **Skills** — **our own skills only** — **`eunomai-skill-finder`** as the trust-gated steward (a *criteria*
   gate fused with skill-creator: find a trustworthy skill → adopt; else create; always improve), plus a tiny
   **standards-anchored base set** (see [base-skills.md](base-skills.md)). Third-party skills of any origin
   are brought by the user/org and secured via the project's **rules**, not bundled here.

## Connector / bootstrap (how the pillars travel)

eunomai is also the **one-shot connector** that distributes a team's or individual's **templates** (OpenSpec
config + a lean `CLAUDE.md` that references per-project MDs) + skills + rules into new or existing projects,
then **steps aside**. It is the starting point, not a dependency: everything it seeds lives in the project's
own files, so removing eunomai leaves a working project (zero lock-in). Deliberately **not** a continuous sync
engine — seed-and-step-aside, never re-govern N projects over time.

## The unifying lens (knowledge activation)

The four pillars cohere under one idea: eunomai is a **knowledge-activation workspace** — it moves a project's
knowledge from *passive* (docs a human reads) to *active* (skills an agent runs, hooks a runtime enforces).
That is the **KDD lens** — adopted as vocabulary, **not** as the heavyweight methodology (no knowledge graph,
no conformance engine — that would be the abandoned tower). See
[knowledge-driven-development.md](knowledge-driven-development.md) and
[decisions/0002-adopt-kdd-as-lens](decisions/0002-adopt-kdd-as-lens/).

## Architecture

- **eunomai = a Claude Code plugin:** `.claude-plugin/plugin.json` + `skills/` (+ `agents/`, `hooks/`).
  Distributed via the **public marketplace** (the repository itself); orgs can mirror/fork and pin.
- **Claude support is native (verified):** plugins bundle skills/agents/hooks/MCP; hooks enforce
  (`PreToolUse` → `deny`/`ask`); the marketplace gives provenance (commit-SHA pin, `author`) plus
  `claude plugin validate` and automated safety screening — the primitives the skill-trust gate builds on.
- **Read-only checks:** the `tools/` CLI bundles `docs-check` + `provenance-check` (no cross-tool projection —
  see ADR-0004). They enforce structure, never prose.

## Reuse vs net-new

- **Reuse:** Claude Code native config; **OpenSpec** (the SDD engine + decision history); skill-creator patterns.
- **Net-new:** the tailored assembly of the four pillars + the **trust gate** of the skill-finder (built as
  a criteria gate on top of Claude's provenance primitives — *not* a hand-curated registry, to avoid
  reintroducing maintenance).

## Status

All four pillars are shipped. **SDD** runs on OpenSpec; **safe controls** (`PreToolUse` hooks) are live;
**living docs** and **skills** ship as plugin skills — five in total (`onboard`, `living-docs`,
`skill-finder`, plus the base pair `secure-coding` / `dependency-upgrade`), with three read-only subagents
(`workspace-survey`, `codebase-cartographer`, `coherence-auditor`) and the checks CLI (`tools/` —
`docs-check` + `provenance-check`). The decision history lives in the [ADR series](decisions/) and
`openspec/`.
