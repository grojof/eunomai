# eunomai — Vision / Charter

> A focused, **Claude-first AI workspace**, tailored 100% to how we work — built on existing tools, not
> reinventing them. Distributed as a **Claude Code plugin**.

The name comes from **Eunomia** (Εὐνομία), the Greek personification of *good order* — *eu* (good) + *nomos*
(norm) — with the `·ai` suffix.

## What eunomai is (and isn't)

- **Is:** a curated Claude Code plugin (skills + commands + hooks + subagents) empowering four pillars, plus
  a thin `AGENTS.md` → Copilot projection for best-effort parity. It works as a **one-shot connector /
  bootstrap**: it seeds a project with conventions (OpenSpec config + lean `AGENTS.md`/`CLAUDE.md` + skills
  + rules) and then **steps aside** — dispensable, because everything lives in the generated output (zero
  lock-in).
- **Is not:** a cross-tool *governance control plane* (abandoned 2026-06-24 — irreducible gaps + high
  maintenance); a **continuous cross-project sync / conformance engine** (that *is* the abandoned tower — the
  bootstrap is one-shot, seed-and-step-aside); a rule-sync engine (we consume **rulesync**); an SDD framework
  (we use **OpenSpec**).

## Principles

1. **Don't reinvent** — stand on existing tools (Claude Code native, rulesync) and build only the tailored
   glue.
2. **Claude-first, Copilot best-effort.** Where Copilot adds gaps, go Claude-only and document it.
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
4. **Skills** — **our own skills only** — today **`eunomai-skill-finder`**, a trust gate by *criteria* fused
   with skill-creator (find a trustworthy skill → adopt; else create; always improve). Third-party skills of
   any origin are brought by the user/org and secured via the project's **rules**, not bundled here.

## Connector / bootstrap (how the pillars travel)

eunomai is also the **one-shot connector** that distributes a team's or individual's **templates** (OpenSpec
config + lean `AGENTS.md`/`CLAUDE.md` that reference per-project MDs) + skills + rules into new or existing
projects, then **steps aside**. It is the starting point, not a dependency: everything lives in the generated
output, so removing eunomai leaves a working project (zero lock-in). Deliberately **not** a continuous sync
engine — seed-and-step-aside, never re-govern N projects over time.

## The unifying lens (knowledge activation)

The four pillars cohere under one idea: eunomai is a **knowledge-activation workspace** — it moves a project's
knowledge from *passive* (docs a human reads) to *active* (skills an agent runs, hooks a runtime enforces).
That is the **KDD lens** — adopted as vocabulary, **not** as the heavyweight methodology (no knowledge graph,
no conformance engine — that would be the abandoned tower). See
[knowledge-driven-development.md](knowledge-driven-development.md) and
[decisions/0002-adopt-kdd-as-lens](../decisions/0002-adopt-kdd-as-lens/).

## Architecture

- **eunomai = a Claude Code plugin:** `.claude-plugin/plugin.json` + `skills/` (+ `agents/`, `hooks/`).
  Distributed via a private/team marketplace (git).
- **Claude support is native (verified):** plugins bundle skills/agents/hooks/MCP; hooks enforce
  (`PreToolUse` → `deny`/`ask`); the marketplace gives provenance (commit-SHA pin, `author`) plus
  `claude plugin validate` and automated safety screening — the primitives the skill-trust gate builds on.
- **Copilot best-effort:** the `projection/` tool projects the authored `AGENTS.md` → Copilot (and other
  tools) via rulesync, with a drift check. Gaps are documented, never faked.

## Reuse vs net-new

- **Reuse:** Claude Code native config; **rulesync** (Copilot projection); skill-creator patterns.
- **Net-new:** the tailored assembly of the four pillars + the **trust gate** of the skill-finder (built as
  a criteria gate on top of Claude's provenance primitives — *not* a hand-curated registry, to avoid
  reintroducing maintenance).

## Status

Clean restart **2026-06-24**. The Copilot projection tool (`projection/`) is implemented and verified.
**SDD** (pillar 1, on OpenSpec) and **safe controls** (pillar 3, `PreToolUse` hooks — verified live) are
done; living docs and skills are built incrementally as plugin skills via the SDD flow.
