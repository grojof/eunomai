# eunomai — Vision / Charter

> A focused, **Claude-first AI workspace**, tailored 100% to how we work — built on existing tools, not
> reinventing them. Distributed as a **Claude Code plugin**.

The name comes from **Eunomia** (Εὐνομία), the Greek personification of *good order* — *eu* (good) + *nomos*
(norm) — with the `·ai` suffix.

## What eunomai is (and isn't)

- **Is:** a curated Claude Code plugin (skills + commands + hooks + subagents) empowering four pillars, plus
  a thin `AGENTS.md` → Copilot projection for best-effort parity.
- **Is not:** a cross-tool *governance control plane* (abandoned 2026-06-24 — irreducible gaps + high
  maintenance); a rule-sync engine (we consume **rulesync**); an SDD framework (we use the methodology as
  plain Markdown).

## Principles

1. **Don't reinvent** — stand on existing tools (Claude Code native, rulesync) and build only the tailored
   glue.
2. **Claude-first, Copilot best-effort.** Where Copilot adds gaps, go Claude-only and document it.
3. **Low maintenance over reach.** Useful to us beats winning a market; fine if superseded one day.
4. **Trust-gated skills.** Adopt only skills that pass a criteria gate (usage, authorship, origin, quality);
   else create; always improve.
5. **Spec-first** for non-trivial change (SDD as Markdown, in `docs/specs/`).

## The four pillars (as plugin skills/commands)

1. **SDD/SPDD** — the spec-driven flow (explore → propose → clarify → spec → design → tasks → apply →
   verify → archive).
2. **Living docs** — kept always-fresh, split into two domains:
   - **dev-docs** — SDD artifacts, project-state, architecture (the *how* the project is built).
   - **project-docs** — README, usage guides, domain/glossary (the *what* the project is).
3. **Safe controls** — hooks (`PreToolUse` deny / ask) + settings permissions; commit-policy guardrails.
4. **Skills** — **`eunomai-skill-finder`** (a trust gate) **fused with skill-creator**: find a trustworthy
   skill → adopt; else create; always improve.

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

Clean restart **2026-06-24**. The Copilot projection tool (`projection/`) is implemented and verified. The
four pillars are built incrementally as plugin skills via the SDD flow.
