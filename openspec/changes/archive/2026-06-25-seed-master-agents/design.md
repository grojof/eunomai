## Context

eunomai already has one read-only agent (`agents/workspace-survey.md`): it maps repo topology, reports facts +
a proposed classification, and decides nothing. This change adds two more in the same mould, filling the gap
between onboard's *analyze* and living-docs' *organize*: **comprehension** of an unfamiliar codebase and
**coherence** of its docs. ADR-0004 made eunomai Claude-only, so leaning on Claude Code's subagent primitive is
the right reuse; the read-heavy/fan-out nature makes subagents (isolated context, cheaper model) the
token-efficient home for this work.

## Goals / Non-Goals

**Goals:**
- Two scoped, **read-only** agents (`codebase-cartographer`, `coherence-auditor`) matching `workspace-survey`'s
  facts-not-decisions posture and boundaries.
- Wire them as optional delegations from onboard and living-docs.

**Non-Goals:**
- No new check, no machinery, no registry. The auditor is **not** a conformance engine or a score.
- Agents do not edit, seed, or decide — the calling skill mediates and the human confirms.
- No `provenance-check` entry (it scans `skills/` only, not `agents/`).

## Decisions

- **Reuse the subagent primitive, mirror `workspace-survey`.** Each agent file carries the same frontmatter
  shape (`name`, `description`, `tools: Read, Glob, Grep, Bash`) and the same Boundaries section (read-only;
  facts + proposal, not decisions; detect, don't assume). Alternative — fold comprehension/audit into the
  skills inline — rejected: it bloats the skills' context and forfeits the token efficiency of an isolated
  read-only agent.
- **Anti-tower line for the auditor (load-bearing).** The coherence-auditor produces a **disposable one-shot
  report** the human acts on — explicitly not a persistent conformance fabric, score, or cross-project engine
  (the governance tower eunomai abandoned). The spec pins this with a dedicated scenario.
- **Authoring via `agent-creator`, fit to eunomai.** Draft with Anthropic's `agent-creator`, then adapt to the
  read-only / facts-only convention and the house Boundaries — the same "scaffold then fit" pattern eunomai
  uses for skills via skill-creator.

## Risks / Trade-offs

- [The auditor drifts toward a conformance engine] → Spec + agent Boundaries fix it as a one-shot diagnostic;
  no state, no score, no scheduling.
- [Cartographer "hallucinates" architecture] → It reports what it reads (entry points, imports, manifests) and
  marks confidence/ambiguity, like `workspace-survey`; the human confirms before it informs docs.
- [Agents overstep into editing] → Tools are read-only (Read/Glob/Grep/Bash) and the Boundaries forbid edits;
  the calling skill performs any change.

**Low-maintenance check:** two markdown agent definitions + delegation prose in two skills + two spec
requirements. No code, no check, no dependency. Removing them leaves onboard/living-docs working (they degrade
to inline analysis).

## Open Questions

- Diagram depth for the cartographer (C4 Context/Container only vs deeper) — keep to Context→Container by
  default, matching the living-docs diagram guidance; deeper only on request.
