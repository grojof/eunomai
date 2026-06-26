# Design — living-docs KDD lens enrichment

## Context

The living-docs pillar (v2) already encodes two axes: **Diátaxis** (content *mode*, in the `type` frontmatter
field) and **activation state** (passive → enforced, the KDD lens from ADR-0002, realized by the
"Route knowledge toward its activation state" requirement). The AWS Builder KDD article
([source](https://builder.aws.com/content/3Euh1e1W8NQquMJZM2LTCtsbABQ/que-es-knowledge-driven-development-y-por-que-la-ia-lo-necesita))
adds a third axis we don't track — the **knowledge domain** (business · product · technical · operational ·
historical · AI-ready) — plus two under-stated practices (ownership, drift). The same questions arose from a
review of `grojof/ai-workspace-generator`, whose robustness came from a *scope cascade*
(universal → language → framework → environment → company → project); that scope axis is deliberately **not**
adopted here (see Decisions).

## Goals / Non-Goals

**Goals**
- Add the **knowledge-domain** axis as a *capture/coverage lens* in the skill and the standard.
- Make **ownership** and **doc↔code drift** explicit, reusing what already exists (coherence-auditor).
- Keep eunomai's docs green under `docs-check` (dogfooding) and the gate unchanged.

**Non-Goals**
- No new required frontmatter field; no new `docs-check` rule; the deterministic gate stays shape-only.
- No scope cascade (universal→project), no multi-tool projection, no knowledge graph, no Kaddo-style toolkit.
- No continuous conformance engine — drift stays a one-shot, human-resolved diagnostic.

## Decisions

### D1 — The three axes are orthogonal; we add the missing one as a *lens*, not a schema
`mode` (Diátaxis, `type`) × `activation` (passive→enforced) × `domain` (the six KDD domains). A page keeps
**one** Diátaxis `type`; domain and activation are *judgement lenses* the skill applies, not fields the gate
enforces. **Why over alternatives:** encoding domain as a required frontmatter field (option B from the
direction question) would add gate surface and maintenance for marginal benefit, and risk one-page-per-domain
sprawl — the opposite of "minimal sufficient." A lens delivers the completeness benefit at near-zero cost.

### D2 — Reject the scope cascade (ai-workspace-generator's layering)
The generator's robustness came from a scope cascade bound to **multi-tool projection** (`AGENTS.md` →
Copilot/Codex/OpenCode) and a `workspace.config.yaml` generator. That is precisely what **ADR-0004
(Claude-only)** and the abandoned "governance tower" rejected (irreducible gaps + high maintenance). We take the
*idea that layering adds robustness* and apply it on the **domain** axis (a lens), not by resurrecting the
**scope** axis (an engine). The article itself argues for minimal-sufficient knowledge near the code, which
aligns with this choice.

### D3 — Ownership and drift reuse existing primitives
Ownership becomes a *suggestion lens* (surface unowned system-critical areas), recorded lightly if at all —
not a registry. Drift is **not** net-new: it is the existing read-only `coherence-auditor` delegation, reframed
under the KDD "evolve with the system" principle. **Why:** don't reinvent; the agents already exist and are
read-only, one-shot, human-resolved.

### D4 — Where each enrichment lands
- `docs/knowledge-driven-development.md` — the **domain × activation** model + article citation (explanation).
- `docs/living-docs.md` — the domain lens beside Diátaxis (mode vs domain are orthogonal) + ownership/drift
  framing (reference).
- `skills/eunomai-living-docs/SKILL.md` — operationalized: the six-domain capture checklist, the seven KDD
  principles, the minimal-sufficient / "earns its place" rule, ownership prompts, drift via coherence-auditor.

## Risks / Trade-offs

- **[Lens drifts into heavy documentation]** → the requirement binds the lens to "minimal sufficient" and the
  "earns its place" test; sufficient coverage explicitly raises **no** suggestion.
- **[Perceived as resurrecting the abandoned tower]** → design states the scope cascade and multi-tool
  projection are out of scope; only the domain *lens* is added, gate behaviour is unchanged.
- **[Domain lens mistaken for a frontmatter requirement]** → spec scenarios assert no new field and no gate
  rule; `docs-check` stays shape-only.

## Migration Plan

Prose/skill enrichment only — no code, schema, or gate changes, so no migration or rollback machinery.
Validate by running `docs-check` on this repo after the doc edits (must stay green) and re-reading the skill
for internal consistency. Rollback = revert the doc/skill edits.

## Open Questions

- ~~Should ownership notes have a *suggested* (non-required) frontmatter convention (e.g. `owner:`), or stay
  free-form in the page body?~~ **Resolved: free-form** in the page body for now (YAGNI); revisit only if a
  project asks for a structured owner field.
- **AI-ready domain vs activation axis:** the `AI-ready` domain (context curated for agents) partially overlaps
  the *semi-active* activation state. **Resolved:** keep it as a sixth domain (faithful to the article) and the
  KDD doc explicitly notes the overlap, rather than collapsing it into the activation axis.
