---
type: reference
title: "Living-docs lenses"
description: "The deeper lenses the living-docs skill applies on request or when establishing docs: doc-set profiles, structure options, the structured interview, knowledge-domain coverage and activation routing."
---

# Living-docs lenses

The skill's core flow runs on every refresh. These lenses cost more and are applied **on request, or when
docs are being established** (onboard, or a project with thin docs). Each stays suggestion-only.

## Choosing the doc set (profiles by repo destination)

When **establishing** docs (or restructuring thin/missing ones), first offer the **doc-set profile** — which
starter README skeleton + `docs/` page set the repo's destination calls for. The canonical catalog lives in
[`doc-profiles.md`](doc-profiles.md): **library/SDK · service/API · CLI tool ·
framework/platform · firmware/embedded · end-user app/internal tool**, plus a first-class **custom** option.
Offer it through the structured interview:

- **Recommend a default** inferred from detected signals (manifests, cartographer output, repo shape) — don't
  ask what you can detect.
- **Show the previews** (README skeleton + starter pages with their `type`s) so the author can intuit the
  resulting shape before choosing.
- **Custom** → follow-up questions one at a time (see the catalog) until the intended doc set is clear.
- **Skippable**, and where an incumbent docs standard/toolchain governs, the coexistence contract applies —
  the incumbent wins and profiles stand down.

Profiles are presets over the same v2 standard — previews are **starting points** trimmed or extended by the
earns-its-place test; `docs-check` never checks profile conformance. A plain refresh of healthy docs needs no
profile question.

## Choosing the structure (propose, never assume)

Don't assume the folder layout — **propose 2–3 options** with trade-offs and a **recommended default** by the
project's size/shape, then let the author choose (infer-then-confirm, skippable):

- **Flat** `docs/*.md` — recommended while small (~< 15 pages); navigation is the README map + the `type` field.
- **By surface** `docs/<surface>/` — once a surface reaches ~3+ pages; nest by **semantics/product** (Stripe/OKF
  style), letting the folder *emerge*.
- **Hybrid** — a flat core plus a folder for a surface that has grown.

**Hard rule:** folders are **never** organized by Diátaxis *type* — the mode lives in `type`. If you find
content-type folders (`guides/`/`reference/`/`explanation/`), **flag them as an anti-pattern** and propose
migrating (flatten, or re-nest by surface). The deterministic `docs-check` gate never judges structure — this
is a guided choice, not enforcement.

## Thin or missing docs → the structured interview

When a project root's docs are **thin or missing**, recover its knowledge with a **structured interview**, not
a form dump: ask **one question at a time**, **recommend a default** per question, and **explore the codebase
first** when a question is answerable from code — don't ask what you can detect. Keep it human-in-control;
write the recovered knowledge into the docs standard (and, for non-trivial choices, an ADR). This is the same
technique `eunomai-onboard` uses to create docs from scratch. Lead the recovery with the **doc-set profile**
question (above) so the interview fills a shape the author has already seen and chosen.

## Knowledge-domain coverage (the KDD capture lens)

Diátaxis tells you a page's **mode**; it never asks whether the project's **knowledge domains** are covered.
Apply this second, orthogonal lens (see `docs/knowledge-driven-development.md` in the plugin)
when establishing docs, or when the author asks for it — a **coverage checklist**, surfaced as suggestions, not a gate:

- **business** — needs, rules, constraints, processes, priorities.
- **product** — what's being built, scope, roadmap, acceptance criteria.
- **technical** — architecture, integrations, patterns, conventions, ADRs, contracts.
- **operational** — deploy, monitoring, observability, security, ownership, support.
- **historical** — past decisions, trade-offs, lessons (the most overlooked).
- **AI-ready** — context curated and kept fresh for agents.

Ask: *which domains has this project left materially under-captured for the work an agent must do?* Surface
the gaps as suggestions for the author. The lens is governed by the **seven KDD principles**:

1. **Near the code** — knowledge lives in the repo, not a far wiki.
2. **Minimal sufficient** — capture enough for good decisions, never heavy documentation (the "earns its place"
   test in the skill's *Single source of truth* section is this principle).
3. **Decisions matter as much as code** — record the *why*, not only the *what* (→ ADRs).
4. **Dual utility** — written for humans *and* agents.
5. **Ownership** — system-critical knowledge needs a named owner; surface unowned critical areas as a
   suggestion to assign (recorded lightly, free-form — never a registry, never invented, never gated).
6. **Evolve / detect drift** — knowledge moves with the system; surface doc↔code drift via the one-shot
   `coherence-auditor` delegation (the skill's *Surfacing stale docs*), never a continuous check.
7. **Context, not guesses** — give the agent reliable context rather than letting it fill gaps.

**Boundaries of this lens (hold them):** it adds **no required frontmatter field**, mandates **no
page-or-folder-per-domain**, and is **never a `docs-check` rule** (the deterministic gate stays shape-only). A
page still declares exactly one Diátaxis `type`; domain and ownership are judgement, surfaced for the author to
accept or decline. Sufficient coverage raises **no** suggestion — don't push toward heavy docs.

## Activation routing (knowledge that belongs at a higher state)

Docs are the **passive** end of eunomai's knowledge-activation spectrum (the KDD lens — see
`docs/knowledge-driven-development.md`). Some prose is really knowledge sitting
at the **wrong** state: it would be better *activated* in another pillar.
When this lens is applied, **notice and surface** such content — naming the owning pillar — then **delegate** the move:

- a recurring **convention** ("always do X / never do Y") → `AGENTS.md` (🟡 semi-active)
- an enforceable **policy** ("block force-push to main") → a hook via **safe-controls** (🔴 enforced)
- a repeatable **procedure** (step-by-step know-how an agent could run) → a skill via **`eunomai-skill-finder`**
  (🔴 active)
- a trackable **requirement** → an **OpenSpec** spec (🟡 traceable)
- knowledge **already owned by an org skill, plugin, or rule** → **link to the owner and defer** — never
  restate it in project prose (the coexistence contract's incumbent-wins clause, applied to knowledge; it
  also keeps the SSoT lens honest)

This is a **review lens, not a new check**, and not an automatic move. You **suggest and point**; the author
accepts or declines, and the owning pillar performs the actual move. Content that is genuinely explanatory or
reference — its correct passive state — stays where it is; don't route it.
