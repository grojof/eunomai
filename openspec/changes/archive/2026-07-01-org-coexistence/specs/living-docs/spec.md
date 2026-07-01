## ADDED Requirements

### Requirement: Foreign frontmatter coexists

The skill SHALL preserve foreign frontmatter keys untouched when adding the standard's required fields to
pages whose frontmatter is also owned by another toolchain (static-site generators, publishing pipelines).
If the `type` key is already used with different semantics, the skill SHALL surface the collision to the
author (adapt, rename, or exclude those pages from scope) rather than overwriting it.

#### Scenario: SSG keys are preserved
- **WHEN** a page carries e.g. `sidebar_position` or `layout` keys owned by another tool
- **THEN** adding `type`/`title`/`description` leaves the foreign keys intact

#### Scenario: A colliding type key is surfaced
- **WHEN** a page's existing `type` key means something else to another toolchain
- **THEN** the skill reports the conflict and lets the author decide, changing nothing silently

### Requirement: ADRs — create from interview, never edit

The skill SHALL NOT edit existing ADRs (immutable decision records — superseding is a new ADR), and it MAY
create ADRs when structured-interview answers crystallize a non-trivial decision.

#### Scenario: Interview answer becomes a new ADR
- **WHEN** the interview settles a non-trivial choice during docs recovery
- **THEN** the skill records it as a new ADR under `docs/decisions/`

#### Scenario: Existing ADRs stay untouched
- **WHEN** a refresh finds an outdated claim inside an existing ADR
- **THEN** the skill flags it for a superseding ADR rather than editing the record

## MODIFIED Requirements

### Requirement: Route knowledge toward its activation state

During a docs refresh, the `eunomai-living-docs` skill SHALL identify content whose nature places it at a
**higher activation state** than passive prose, and SHALL **surface it as a suggestion** naming the owning
pillar — a recurring convention → `CLAUDE.md`; an enforceable policy → a hook (safe-controls); a repeatable
procedure → a skill (via `eunomai-skill-finder`); a trackable requirement → an OpenSpec spec; and knowledge
**already owned by an org skill, plugin, or rule → link to the owner and defer**, never restating it (the
coexistence contract's incumbent-wins clause applied to knowledge). It SHALL **delegate** the actual move to
that pillar and SHALL NOT perform the move itself (it does not write `CLAUDE.md`, author hooks or skills, or
create specs), SHALL keep the human in control, and SHALL add no new check.

#### Scenario: A recurring convention is routed to CLAUDE.md
- **WHEN** a docs refresh finds a recurring "always do X / never do Y" convention living as README prose
- **THEN** living-docs suggests moving it to `CLAUDE.md` and does not edit `CLAUDE.md` itself

#### Scenario: An enforceable policy is routed to a hook
- **WHEN** the content is a rule that a runtime could enforce (e.g. "block force-push to main")
- **THEN** living-docs flags it as safe-controls (hook) material and delegates, rather than leaving it as prose

#### Scenario: A repeatable procedure is routed to a skill
- **WHEN** the content is a step-by-step know-how an agent could execute
- **THEN** living-docs suggests activating it as a skill via `eunomai-skill-finder` and does not author the skill

#### Scenario: Org-owned knowledge is linked, not restated
- **WHEN** the content is already owned and enforced by an org skill, plugin, or rule
- **THEN** living-docs suggests linking to the owner and removing the local restatement, rather than
  duplicating org-owned knowledge into project prose

#### Scenario: Suggestion only, human in control
- **WHEN** living-docs identifies any activation-routing candidate
- **THEN** it surfaces a suggestion for the author to accept or decline and never auto-applies the move

#### Scenario: Passive content stays passive
- **WHEN** the content is genuinely explanatory or reference material (its correct activation state)
- **THEN** living-docs organizes it under Diátaxis as today and raises no routing suggestion
