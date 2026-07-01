## Context

`docs/knowledge-driven-development.md` defines two axes (activation state × knowledge domain) and claims the
lens unifies all pillars; the 2026-07-01 audit showed it lives only in living-docs. The flows that *create*
and *evaluate* knowledge (onboard's interview, the read-only agents, the base skills, skill-finder's gate)
neither capture by domain nor preserve the historical domain they generate.

## Goals / Non-Goals

**Goals:** capture knowledge at the moment it exists — interview by domain, report domain evidence the
agents already walk past, persist the decisions the base skills already force, keep rejection rationale.

**Non-Goals:** no scoring, no gating, no new artifact type, no domain frontmatter, no re-walk of the tree.

## Decisions

1. **Scaffold the interview, don't formalize it.** The six domains order the interview when creating docs
   from scratch; explore-first still wins (skip domains the codebase answers). *Alternative*: a domain
   questionnaire template — rejected (form dump; violates the interview's own rules).
2. **Agents report signals, never assessments.** The cartographer lists domain-relevant artifacts it already
   encountered (confidence-tagged); the auditor states which domains have zero doc coverage — both stay
   within "facts only, decide nothing", and living-docs keeps the judgement (ADR-0002: lens, never gate).
   Reuse-first: the agents are already walking the tree; zero extra passes.
3. **Capture lands in existing homes.** Trust boundaries / waivers → ADRs or the location the project's
   rules designate; rejection rationale → the registry narrative (already defined as the run's record).
   *Alternative*: a decisions log file — rejected (new format, new upkeep).

**Low-maintenance check:** prose additions to six existing files; nothing recurring, nothing enforced.

## Risks / Trade-offs

- [Interview gets longer] → domains are a checklist for the *interviewer*, not questions for the author;
  explore-first and skippability already bound it.
- [Capture steps read as bureaucracy] → one line each, "if non-obvious", pointing at homes that exist.
- [Agents' reports grow] → signals are a compact list; "observed, not assessed" keeps them cheap.
