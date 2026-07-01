# coexistence Specification (delta)

## ADDED Requirements

### Requirement: Coexistence contract

eunomai SHALL define a single canonical **coexistence contract** governing how every pillar behaves in an
environment that already has an authored layer (personal or organizational): (1) eunomai's layers are
**additive, never replacing**; (2) on conflict with an incumbent convention, standard, or control, the
**incumbent wins** unless the author explicitly decides otherwise; (3) the existing layer SHALL be
**detected before seeding**; (4) **the project's rules are an input to every gate** (skill trust, safety).
The contract SHALL be stated once (in the org-adoption docs page, with a principle line in `CLAUDE.md`) and
referenced — not restated — by the skills that apply it.

#### Scenario: Conflict defaults to the incumbent
- **WHEN** an eunomai flow (onboard, living-docs, skill-finder) meets an existing convention that conflicts
  with eunomai's default
- **THEN** it surfaces the conflict and recommends adapting to what exists, proceeding otherwise only on the
  author's explicit choice

#### Scenario: Single home, referenced everywhere
- **WHEN** a skill needs the contract
- **THEN** it links to the canonical statement rather than carrying its own divergent copy

### Requirement: "The project's rules" is defined mechanically

The phrase **"the project's rules"** SHALL be defined as the project's `CLAUDE.md` (with any hierarchical
parents Claude Code loads) plus the `permissions` in the project's `.claude/settings.json`. Skills that take
org input (trusted sources, mandated tooling, stricter policies) SHALL read it from there — no new file
format or manifest SHALL be introduced.

#### Scenario: A gate consumes org input
- **WHEN** a gate needs org-trusted sources or org policy
- **THEN** it reads them from the project's `CLAUDE.md` / settings permissions, and cites where it found them

### Requirement: Org adoption mechanics are documented

The docs SHALL include an org-adoption how-to page, indexed in the README map, that answers an evaluator's
core questions with Claude Code native mechanics: coexistence facts (plugin-namespaced skills cannot
collide; PreToolUse decisions merge most-restrictive-wins; the guard never emits `allow`, so it can only
tighten other governance), org-wide rollout (managed settings, marketplace allowlisting, private mirrors),
version pinning and the update flow, the sanctioned extension seams (own hooks/permissions, the safety-gate
env overrides, org marketplaces vetted through the skill gate), and removal (what uninstalling leaves
behind: the project's own files, working).

#### Scenario: Evaluator answers without reading code
- **WHEN** an org evaluator reads the org-adoption page
- **THEN** they can determine how to install org-wide, pin a version, extend the controls without forking,
  and what removal leaves behind
