## Why

Our living-docs pillar already carries two strong axes — **Diátaxis** (content *mode*, via `type`) and
**activation state** (passive → enforced, the KDD lens). A close read of the AWS Builder KDD article
([source](https://builder.aws.com/content/3Euh1e1W8NQquMJZM2LTCtsbABQ/que-es-knowledge-driven-development-y-por-que-la-ia-lo-necesita))
surfaces a **third, orthogonal axis we don't capture: the knowledge *domain*** — *what the knowledge is about*
(business · product · technical · operational · historical · AI-ready). Diátaxis tells us a page's shape; it
never asks "have we captured the operational and historical knowledge an agent needs, or only the technical
how-to?" The article also names two practices we under-state: **ownership** of each knowledge area, and framing
**doc↔code drift** as a first-class concern. Adopting the domain axis as a *capture lens* makes the skill
materially more complete at near-zero maintenance cost — and the article's own thesis ("minimal sufficient
information, not heavy documentation") is exactly our posture.

## What Changes

- Add a **knowledge-domain capture lens** to the living-docs standard: the six KDD domains (business, product,
  technical, operational, historical, AI-ready) as a checklist for *coverage* — orthogonal to Diátaxis (mode)
  and to activation state. A page still declares one Diátaxis `type`; the domain lens is the skill's
  completeness check, **not** a new required frontmatter field and **not** a gate rule.
- Make **knowledge ownership** an explicit lens: the skill surfaces system-critical knowledge areas that lack a
  named owner (suggestion-only, human-in-control).
- Make **doc↔code drift** explicit as the "evolve with the system" principle, anchored to the existing
  read-only `coherence-auditor` delegation (no new check, no continuous engine).
- Enrich `docs/knowledge-driven-development.md` with the **domain × activation** model and a citation to the
  article; enrich `docs/living-docs.md` with the domain lens beside Diátaxis plus the ownership/drift framing;
  operationalize all of it in the `eunomai-living-docs` skill (the six-domain capture checklist + the seven KDD
  principles + the minimal-sufficient / "earns its place" rule).

## Capabilities

### New Capabilities
<!-- none — this enriches the existing living-docs pillar, it does not introduce a separable capability -->

### Modified Capabilities
- `living-docs`: adds the knowledge-domain capture lens and the explicit ownership lens as
  **suggestion-only, judgement** requirements (the deterministic `docs-check` gate is unchanged); reframes the
  existing coherence-auditor delegation under the "evolve / detect drift" principle. No new frontmatter field,
  no scope cascade, no toolkit.

## Impact

- **Docs:** `docs/knowledge-driven-development.md`, `docs/living-docs.md` (prose/lens enrichment; eunomai
  dogfoods, so `docs-check` must stay green).
- **Skill:** `skills/eunomai-living-docs/SKILL.md` (new capture checklist + principles; human-in-control,
  suggestion-only — no behavioural change to the gate).
- **Spec:** `openspec/specs/living-docs/` (delta with ADDED requirements).
- **Reuse vs net-new:** *reuse* — Diátaxis, the existing activation-routing requirement, and the
  `coherence-auditor`/`codebase-cartographer` agents already in the pillar. *Net-new* — only the domain
  capture lens and the explicit ownership lens, both as prose/skill guidance.
- **No impact on:** `docs-check` (`tools/`) behaviour, frontmatter schema, hooks, or any other pillar.
- **Principle check:** consistent with ADR-0002 (KDD as a lens, not a methodology) and ADR-0004 (Claude-only);
  explicitly rejects the abandoned scope-cascade / multi-tool projection and any Kaddo-style toolkit.
