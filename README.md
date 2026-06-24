# eunomai

> A focused, **Claude-first AI workspace**, tailored to how we work — built on existing tools, not
> reinventing them. Packaged as a **Claude Code plugin**, with best-effort GitHub Copilot parity.

The name comes from **Eunomia** (Εὐνομία), the Greek personification of *good order* (*eu* + *nomos*), with
the `·ai` suffix.

## What it is

A curated Claude Code plugin (skills · commands · hooks · subagents) empowering four pillars, plus a thin
`AGENTS.md` → Copilot projection for best-effort parity. It **does not** reinvent: it stands on Claude
Code's native extensibility and on [`rulesync`](https://github.com/dyoshikawa/rulesync) for projection.

## The four pillars

1. **SDD/SPDD** — the spec-driven flow (explore → … → archive).
2. **Living docs** — always-fresh, split into **dev-docs** (SDD/status/architecture) and **project-docs**
   (README/usage/domain).
3. **Safe controls** — hooks (`PreToolUse` deny/ask) + permissions; commit-policy guardrails.
4. **Skills** — `eunomai-skill-finder` (trust gate) fused with skill-creator: adopt-or-create, always
   improve.

## Layout

```
eunomai/
  .claude-plugin/plugin.json   ← the Claude Code plugin manifest
  skills/                      ← the pillars, as Agent Skills (built incrementally)
  agents/  hooks/              ← (added as pillars land)
  projection/                  ← Copilot best-effort: AGENTS.md → tools via rulesync (+ drift check)
  openspec/                    ← SDD engine (OpenSpec): changes · specs · archive · config.yaml (eunomai layer)
  AGENTS.md                    ← the workspace's own authored source of truth
  docs/VISION.md               ← the charter
  docs/decisions/              ← ADRs (e.g. why we adopted OpenSpec for SDD)
```

## Start here

- **[docs/VISION.md](docs/VISION.md)** — the charter: what eunomai is, principles, pillars, architecture.
- **SDD/SPDD** runs on [OpenSpec](https://github.com/Fission-AI/OpenSpec) (`/opsx:*`; artifacts in
  `openspec/`); see **[docs/decisions/0001-adopt-openspec/](docs/decisions/0001-adopt-openspec/)** for why.
- **[projection/](projection/)** — the Copilot projection tool (`compile` + `compile --check`).

## One principle above all

**Don't reinvent — stand on the best existing tools and build only the tailored glue.**
