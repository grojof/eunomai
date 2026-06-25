## Context

Two pillar steps are under-specified. `eunomai-onboard` says "gather the author's input" and "create docs from
scratch" without a method, and the just-shipped workspace-scoping phase says "ask on ambiguous" with no
technique. During the 2026-06-25 skill-finder run, mattpocock's grill family (`grilling`, `grill-with-docs`)
surfaced a strong pattern for exactly this: a relentless one-question-at-a-time interview that recommends an
answer per question and produces docs (ADRs, glossary) as it goes. The grill skills were **rejected for
vendoring** into the pillars (too thin, interdependent, and pillars are own-skills-only), so we **harvest the
pattern** — the move skill-finder prescribes for useful-but-rejected candidates.

## Goals / Non-Goals

**Goals:**
- A concrete structured-interview technique in onboard's input-gathering, from-scratch doc creation, and the
  ask-on-ambiguous moment; the same technique referenced from living-docs for thin/missing docs.
- The interview produces decision (ADR) + glossary artifacts when creating docs from scratch.

**Non-Goals:**
- Vendoring the grill skills; a new skill; auto/non-interactive interviewing; expanding the base scope to
  domain/hardware skills.

## Decisions

### Decision 1 — Harvest the pattern, don't vendor (own-skills-only for pillars)

Author the technique into eunomai's own onboard/living-docs skills rather than adopting `grilling`/
`grill-with-docs`. Credit: the pattern was harvested from `mattpocock/skills` (grilling) during the 2026-06-25
skill-finder run; those skills remain candidate **project-level** sources, not pillar dependencies.

- *Why over alternatives:* vendoring third-party skills into the pillars breaks "own skills only" and couples
  the pillars to thin, interdependent external skills. Harvesting keeps the pillars single-sourced and ours.

### Decision 2 — Interview mechanics: one-at-a-time + recommend-a-default + explore-first

The technique is exactly three rules: ask **one question at a time** (batching is bewildering), **recommend a
default** answer per question (so the user can rubber-stamp), and **explore the codebase first** when a question
is answerable from code — don't ask what you can detect.

- *Why over alternatives:* explore-first fuses the interview with workspace-scoping's *detect, don't assume*;
  recommend-a-default keeps ceremony low (the user confirms rather than authors). This is the harvested grilling
  discipline, adapted.

### Decision 3 — The interview produces artifacts when creating docs from scratch

When onboard creates docs from scratch, interview answers crystallize into **decisions/ADRs** (for choices) and
a **glossary** explanation page (for domain language), per the living-docs standard — knowledge captured as a
byproduct, not a separate write-up pass.

- *Why over alternatives:* this is grill-with-docs' best idea (docs emerge from the interview) and it dovetails
  with living-docs (ADRs are dev-facing/out-of-index; the glossary is an indexed explanation page).

### Decision 4 — Human-in-control, skippable, single-confirm not field-by-field

The interview is ask-by-default and skippable, consistent with eunomai's posture everywhere. When a single
confirmation suffices (e.g. an obvious classification), do not interrogate field-by-field.

- *Why over alternatives:* auto-interview or exhaustive interrogation is friction; eunomai's stance is
  floor-raiser + human-in-control.

### Decision 5 — Domain-agnostic technique; base scope unchanged

The interview works for any domain (software and hardware), but this change does **not** add domain/hardware
skills to the base — base stays standards-anchored; such skills remain project-level adoptions via skill-finder.

- *Why over alternatives:* expanding the base by domain reintroduces breadth/maintenance the admission filter
  exists to prevent.

## Risks / Trade-offs

- **Interview becomes interrogation** → mitigated by one-at-a-time + recommend-a-default + single-confirm +
  skippable.
- **Asking what's already in the code** → mitigated by explore-first (detect, don't assume).
- **Scope creep into a new skill** → explicit non-goal; the technique folds into existing pillars only.
- **Low-maintenance check:** playbook text in two existing skills + two doc pages. No new skill, no new check,
  no code, no new dependency.
