## Why

The KDD lens declares itself "the lens that unifies all the pillars", yet it is operationalized in exactly
one place — the living-docs coverage lens. Onboard's interview covers business/historical domains only by
accident, the read-only agents walk right past domain evidence without reporting it, the base skills produce
decisions (trust boundaries, CVE waivers) and let them evaporate, and skill-finder discards the rationale of
rejected candidates — the historical domain, "the most overlooked", lost at the moment of capture.

## What Changes

- **onboard**: the structured interview, when creating docs from scratch, is **scaffolded by the six KDD
  domains** (business → product → technical → operational → historical → AI-ready) so coverage lands by
  construction, not by later repair. Judgement, not a form: skip domains the codebase already answers.
- **codebase-cartographer**: a sixth mapped thing — **domain signals (observed, not assessed)**: artifacts
  already encountered per domain (CI/IaC/Dockerfiles → operational; ADRs/CHANGELOG → historical;
  README claims/glossary → business/product), confidence-tagged like the rest of the map.
- **coherence-auditor**: the report gains a facts-only **domain-coverage line** (domains with no doc
  coverage found) — evidence for living-docs' lens, never a score.
- **base skills**: each ends with a one-line **capture step** — record the non-obvious decision (a trust
  boundary; a CVE exploitability waiver with id, rationale, revisit date) where the project keeps decisions.
  Universal, non-prescriptive, low-maintenance — passes the admission filter.
- **skill-finder**: the registry narrative **captures rejection rationale + harvested ideas** (historical
  domain); when a candidate turns out to be knowledge rather than procedure, it is **routed to docs/ADR**
  instead of forcing a skill (the activation spectrum runs both ways).

## Capabilities

### New Capabilities

(none — this change deepens existing capabilities)

### Modified Capabilities

- `onboard`: domain-scaffolded from-scratch interview; cartographer's map includes domain signals.
- `living-docs`: the delegated coherence audit surfaces domain-coverage facts feeding the KDD lens.
- `base-skills`: both base skills end with a decision-capture step.
- `skill-finder`: rejected-candidate rationale and harvested ideas are recorded; knowledge-not-procedure
  candidates route to the docs substrate.

## Impact

- Files: `skills/eunomai-onboard/SKILL.md`, `agents/codebase-cartographer.md`, `agents/coherence-auditor.md`,
  `skills/eunomai-secure-coding/SKILL.md`, `skills/eunomai-dependency-upgrade/SKILL.md`,
  `skills/eunomai-skill-finder/SKILL.md`, `docs/base-skills.md` (sync).
- Reuse vs net-new: prose-only changes to existing skills/agents; no new tool, check, field, or format.

## Non-goals / out of scope

- No knowledge graph, no Product-Process Matrix, no domain frontmatter field, no `docs-check` rule
  (ADR-0002: KDD is a lens, never a gate).
- No new capture location — decisions land in the homes that already exist (ADRs, docs, the registry).
