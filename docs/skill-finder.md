---
type: reference
title: "Skill finder"
description: "The skill trust gate, provenance, and provenance-check."
tags: [skills, trust, provenance]
updated: 2026-06-25
---

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

## Provenance (one audit registry, not sidecars)

Trust lives in **one** `eunomai-skills-audit.md` at the skills root — `.claude/skills/` in a consumer project,
`skills/` in the eunomai plugin. Skill folders stay clean (just the skill); the registry is the per-project,
generated audit (not a central allowlist):

```yaml
---
generated: <YYYY-MM-DD>
skills:
  - name: <skill dir name>
    origin: <url / marketplace id / "authored">
    ref: <real commit SHA / version | "authored" | "unpinned">
    verdict: adopt | adopt-and-improve | create | authored
    rubric: <one line>
    gaps: []          # e.g. [unpinned] — surfaced, never hidden
---
# eunomai skills audit
<run narrative: what was searched, verdicts, notes>
```

```bash
node tools/dist/cli.cjs provenance-check   # read-only
```

The check scans `.claude/skills/` **and** `skills/`, **fails** on any skill not covered by the registry (or an
invalid registry), and **lists trust gaps** (e.g. `unpinned`) to act on. It runs as part of the gate.
Org-trusted sources, if any, live in the project's **rules** — not here.
