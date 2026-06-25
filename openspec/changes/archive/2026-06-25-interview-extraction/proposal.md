## Why

onboard's "gather the author's input" and "create docs from scratch" steps are vague, and the workspace-scoping
phase says "ask on ambiguous" with no technique. mattpocock's grill family (grilling, grill-with-docs)
demonstrates a strong pattern but was **rejected for vendoring** into the pillars (thin, interdependent,
opinionated — and pillars are own-skills-only). So we **harvest the idea, not the code**, authoring it into our
own skills. Net-new is only playbook additions to two existing skills — no new skill, no new check, no code.

## What Changes

- Add a **structured-interview** technique to `eunomai-onboard`'s analyze/gather step, its create-docs-from-
  scratch step, and the workspace-scoping *ask-on-ambiguous* moment: ask **one question at a time** (multiple
  at once is bewildering), **recommend a default** answer per question, and **explore the codebase first** when
  a question is answerable from code — don't ask what you can detect (ties into *detect, don't assume*).
- When documenting a project from scratch, the interview **produces artifacts as byproducts**: decisions/ADRs
  for the choices made and a **glossary** (an explanation page) for the domain language — feeding the
  living-docs standard.
- Reference the same technique from `eunomai-living-docs` for **recovering thin or missing docs**.
- **Reuse vs net-new (connector-first):** reuse the harvested *pattern*; author it into our own skills. No
  third-party skill in the pillars, no new check, no new code — just playbook additions + doc updates.

## Capabilities

### New Capabilities
<!-- None — the technique folds into the existing onboard + living-docs pillars; no new capability. -->

### Modified Capabilities
- `onboard`: gather input and resolve ambiguous scope via a structured interview; creating docs from scratch
  yields decision + glossary artifacts.
- `living-docs`: use the interview technique to recover thin/missing docs.

## Impact

- **Skills:** `skills/eunomai-onboard/SKILL.md` and `skills/eunomai-living-docs/SKILL.md` gain the interview
  technique (playbook text only).
- **Docs:** `docs/reference/onboard.md` and `docs/reference/living-docs.md` updated; `AGENTS.md` re-projected
  if its sections change.
- **Gate:** `docs-check` + `provenance-check` stay green. **No code change**, no new check, no new runtime
  dependency.

## Non-goals

- **Not vendoring** grilling/grill-with-docs/grill-me — rejected for pillar use; they remain candidate
  project-level sources via skill-finder.
- **Not a new skill** — the technique folds into the existing onboard + living-docs pillars.
- **Not auto-interview** — human-in-control, ask-by-default, skippable; never interrogate field-by-field when a
  single confirmation suffices.
- **No base-scope expansion** — the technique is domain-agnostic (software *and* hardware), but the base stays
  standards-anchored; domain/hardware-specific skills remain project-level adoptions.
