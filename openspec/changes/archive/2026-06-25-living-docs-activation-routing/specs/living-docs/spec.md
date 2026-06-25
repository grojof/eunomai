## ADDED Requirements

### Requirement: Route knowledge toward its activation state

During a docs refresh, the `eunomai-living-docs` skill SHALL identify content whose nature places it at a
**higher activation state** than passive prose, and SHALL **surface it as a suggestion** naming the owning
pillar — a recurring convention → `AGENTS.md`; an enforceable policy → a hook (safe-controls); a repeatable
procedure → a skill (via `eunomai-skill-finder`); a trackable requirement → an OpenSpec spec. It SHALL
**delegate** the actual move to that pillar and SHALL NOT perform the move itself (it does not write
`AGENTS.md`, author hooks or skills, or create specs), SHALL keep the human in control, and SHALL add no new
check.

#### Scenario: A recurring convention is routed to AGENTS.md
- **WHEN** a docs refresh finds a recurring "always do X / never do Y" convention living as README prose
- **THEN** living-docs suggests moving it to `AGENTS.md` and does not edit `AGENTS.md` itself

#### Scenario: An enforceable policy is routed to a hook
- **WHEN** the content is a rule that a runtime could enforce (e.g. "block force-push to main")
- **THEN** living-docs flags it as safe-controls (hook) material and delegates, rather than leaving it as prose

#### Scenario: A repeatable procedure is routed to a skill
- **WHEN** the content is a step-by-step know-how an agent could execute
- **THEN** living-docs suggests activating it as a skill via `eunomai-skill-finder` and does not author the skill

#### Scenario: Suggestion only, human in control
- **WHEN** living-docs identifies any activation-routing candidate
- **THEN** it surfaces a suggestion for the author to accept or decline and never auto-applies the move

#### Scenario: Passive content stays passive
- **WHEN** the content is genuinely explanatory or reference material (its correct activation state)
- **THEN** living-docs organizes it under Diátaxis as today and raises no routing suggestion
