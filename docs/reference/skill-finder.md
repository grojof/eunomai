# Skill finder

The judgment layer for a project's skills. Anthropic's **skill-creator** authors/improves/evaluates skills
well, but does not do sourcing, trust, provenance, or security. `eunomai-skill-finder` fills that gap — and is
a **best-effort floor-raiser, not a security guarantee** (safe-controls hooks are the runtime backstop).

## What it does

Two modes, sharing one gate:

- **Acquire** — discover candidates → trust gate → adopt / adopt-and-improve / create (via skill-creator) → a
  fit pass that adapts the skill to the project.
- **Audit** — on demand and scoped: evaluate an existing or named skill and write/refresh its provenance.

## The trust gate

A hard veto, then weighed judgment (mirroring safe-controls: one hard bar, the rest judgment).

| Stage | What | Result |
|-------|------|--------|
| **Veto** (hard bar) | read `SKILL.md` + bundled scripts for dangerous behavior; require a pinnable origin (SHA / `claude plugin validate`) | fail → **reject** |
| **Judgment** | authorship · usage · quality (quality measurable via skill-creator's eval/benchmark) | `adopt` / `adopt-and-improve` / `create` |

Reuse is total: skill-creator owns authoring; eunomai owns the gate, the provenance, and the playbook.

## Provenance (no registry)

Every skill under `skills/` carries a `PROVENANCE.md` sidecar (YAML frontmatter) — decentralized, so trust
lives *with* the skill, not in a central allowlist:

```yaml
origin: <url / marketplace id / "authored">
ref: <version or SHA, or "authored">
date: <YYYY-MM-DD>
verdict: adopt | adopt-and-improve | create | authored
rubric: <one-line justification>
modifications: <what changed, or "none">
```

```bash
node projection/dist/cli.cjs provenance-check   # read-only; exit 1 if any skill lacks a valid record
```

It runs as part of the gate. Org-trusted sources, if any, live in the project's **rules** — not here.
