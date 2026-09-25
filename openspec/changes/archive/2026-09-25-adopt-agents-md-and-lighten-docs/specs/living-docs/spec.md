# Spec Delta

## MODIFIED Requirements

### Requirement: README-to-docs integrity check

The plugin SHALL provide a read-only integrity check that verifies, **deterministically**: (a) every README
link into `docs/` resolves; (b) every in-scope page under `docs/` is reachable from the README map, directly
or through the links of other reachable pages, so a nested index (`docs/<area>/README.md`) works; (c) links
between reachable pages, and relative links in the instruction files (`AGENTS.md`, `CLAUDE.md`), resolve; and
(d) every in-scope page carries valid frontmatter **shape** — `type` present and in the allowed set, with non-empty
`title` and `description`. The check SHALL validate **shape, never prose** (it does not judge whether the
content truly matches its `type`, nor doc↔code coherence — that is the `coherence-auditor` agent's one-shot,
human-resolved job, which SHALL NOT be part of the gate). It SHALL exit non-zero on any divergence, report what
diverged, and make no changes. Missing community-health files SHALL be reported as warnings, and SHALL fail
the check only when the caller asks (`--require-health`), because a private repository may rightly lack
them.

#### Scenario: A README link is broken
- **WHEN** the README links to a `docs/` file that does not exist
- **THEN** the check reports the broken link and exits non-zero

#### Scenario: A page is missing or has invalid frontmatter
- **WHEN** an in-scope `docs/` page has no frontmatter, an unknown `type`, or an empty `title`/`description`
- **THEN** the check reports it and exits non-zero

#### Scenario: AI judgment is not in the gate
- **WHEN** the gate runs
- **THEN** it performs only deterministic shape/link checks and never invokes AI judgment on prose or coherence

#### Scenario: A nested index
- **WHEN** the README links to `docs/migration/README.md`, which links to `running.md` in the same folder
- **THEN** `docs/migration/running.md` counts as reachable and is not reported as orphaned

#### Scenario: A broken link in the instruction file
- **WHEN** `AGENTS.md` links to a `docs/` page that no longer exists
- **THEN** the check reports the link and exits non-zero

#### Scenario: A private repository without a LICENSE
- **WHEN** a repository has no `LICENSE` and the check runs without `--require-health`
- **THEN** it warns about the missing file and does not fail for it

### Requirement: Route knowledge toward its activation state

When docs are being established, or the author asks for this lens, the `eunomai-living-docs` skill SHALL
identify content whose nature places it at a
**higher activation state** than passive prose, and SHALL **surface it as a suggestion** naming the owning
pillar — a recurring convention → `AGENTS.md`; an enforceable policy → a hook (safe-controls); a repeatable
procedure → a skill (via `eunomai-skill-finder`); a trackable requirement → an OpenSpec spec; and knowledge
**already owned by an org skill, plugin, or rule → link to the owner and defer**, never restating it (the
coexistence contract's incumbent-wins clause applied to knowledge). It SHALL **delegate** the actual move to
that pillar and SHALL NOT perform the move itself (it does not write `AGENTS.md`, author hooks or skills, or
create specs), SHALL keep the human in control, and SHALL add no new check.

#### Scenario: A recurring convention is routed to AGENTS.md
- **WHEN** the routing lens finds a recurring "always do X / never do Y" convention living as README prose
- **THEN** living-docs suggests moving it to `AGENTS.md` and does not edit `AGENTS.md` itself

#### Scenario: A recurring convention is routed to CLAUDE.md
- **WHEN** the project keeps its instructions in `CLAUDE.md` (it declined the migration) and the routing lens finds a
  recurring convention living as README prose
- **THEN** living-docs suggests moving it to that `CLAUDE.md`, and does not edit it itself


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

### Requirement: Docs hold each fact once (single source of truth)

The living-docs standard SHALL hold each fact in exactly **one home** — the README maps and links but does not
restate; `AGENTS.md` holds the authored conventions; ADRs hold the decisions; `docs/` pages hold only
user-facing content that is not already canonical elsewhere; and there SHALL be exactly **one**
`CONTRIBUTING.md`. The `eunomai-living-docs` skill SHALL apply an **"earns its place" test** when authoring or
refreshing — if a fact is already canonical in `AGENTS.md`, an ADR, or the code, it SHALL be **linked, not
restated** — and SHALL surface pages or sections that **duplicate** another home, proposing a **merge or link**
(human-in-control). This is a judgement lens, not a gate rule: the deterministic `docs-check` SHALL remain
shape-only and SHALL NOT judge duplication.

#### Scenario: A fact already canonical elsewhere is linked, not restated
- **WHEN** authoring or refreshing a `docs/` page whose content is already canonical in `AGENTS.md`, an ADR, or the code
- **THEN** the page links to that home instead of duplicating it

#### Scenario: Duplicate pages are surfaced for merge
- **WHEN** the skill finds two pages (or a page and `AGENTS.md`/an ADR) stating the same fact
- **THEN** it flags the duplication and proposes merging or linking, with the author in control

#### Scenario: The gate does not judge duplication
- **WHEN** `docs-check` runs
- **THEN** it validates frontmatter shape and links only, and never fails a project for duplicated prose

### Requirement: Diagram enrichment (Mermaid + C4)

The living-docs standard and the `eunomai-living-docs` skill SHALL guide diagrams using **Mermaid**, matching
the diagram type to its purpose (flowchart for process/decisions, sequence for interactions over time, ER or
class for data/structure, state for status changes, and the **C4 model** for architecture), and SHALL keep
each diagram simple (one idea per diagram, a single row or a short column where it fits). Where colour
carries meaning, the guidance SHALL use a small set of semantic classes (for example action, decision,
safeguard, stop, data), each with an explicit text colour that reads in both light and dark themes, used the
same way across a project's diagrams; colour SHALL never be the only carrier of meaning.

#### Scenario: Architecture needs a diagram
- **WHEN** a doc needs to show software architecture
- **THEN** the skill recommends Mermaid with the **C4** model (Context → Container → Component)

#### Scenario: A process or interaction needs a diagram
- **WHEN** a doc needs to show a process/decision or an interaction over time
- **THEN** the skill recommends the matching Mermaid type (flowchart or sequence) and keeps it simple

#### Scenario: A diagram with semantic colours
- **WHEN** a diagram colours its nodes
- **THEN** the colours follow the project's semantic classes, carry an explicit text colour for both themes, and the labels still say what each node is

### Requirement: Knowledge-domain capture lens

The `eunomai-living-docs` skill SHALL apply a **knowledge-domain lens** — orthogonal to Diátaxis (which
classifies a page's *mode*) and to activation state (which classifies how *executable* knowledge is) — to check
**coverage** across the six KDD domains: **business** (needs, rules, constraints, processes), **product** (what
is being built, scope, acceptance criteria), **technical** (architecture, integrations, patterns, ADRs,
conventions), **operational** (deploy, monitoring, observability, security, support), **historical** (past
decisions, trade-offs, lessons), and **AI-ready** (context curated for agents). When docs are being established, or the
author asks for this lens, the skill SHALL surface domains that are **materially under-covered** for the project as
**suggestions** (human-in-control), guided by the article's "minimal sufficient information, not heavy
documentation" rule and the existing "earns its place" test. The lens SHALL NOT introduce a new required
frontmatter field, SHALL NOT mandate one page or folder per domain, and SHALL NOT become a `docs-check` gate
rule — the deterministic gate stays shape-only.

#### Scenario: An under-covered domain is surfaced
- **WHEN** the lens is applied to a project whose docs cover technical how-to richly but say nothing about operational concerns (deploy, observability, ownership) an agent would need
- **THEN** it surfaces the operational (and any other under-covered) domain as a suggestion to capture, applying the minimal-sufficient rule, with the author in control

#### Scenario: The domain lens does not mandate structure or frontmatter
- **WHEN** the domain lens is applied
- **THEN** it adds no required frontmatter field and demands no one-page-per-domain or one-folder-per-domain layout — a page still declares a single Diátaxis `type`, and the domain is a coverage judgement only

#### Scenario: The gate ignores domain coverage
- **WHEN** `docs-check` runs
- **THEN** it validates frontmatter shape and links only, and never fails a project for under-covered or missing knowledge domains

#### Scenario: Sufficient coverage raises no suggestion
- **WHEN** the project's docs already capture the minimal sufficient knowledge across the relevant domains
- **THEN** living-docs raises no domain-coverage suggestion (it does not push toward heavy documentation)

### Requirement: Surface unowned system-critical knowledge

The `eunomai-living-docs` skill SHALL apply an **ownership lens**: when docs are being established, or the
author asks for this lens, it SHALL surface **system-critical knowledge areas that lack a named owner** as a **suggestion** for the author to
assign — human-in-control. Ownership MAY be recorded lightly (e.g. an `audience`/owner note in frontmatter or a
line in the page), and the skill SHALL NOT invent owners, SHALL NOT assign ownership itself, and SHALL NOT add
an ownership rule to the deterministic `docs-check` gate.

#### Scenario: A critical area has no owner
- **WHEN** the lens is applied to a project and finds a system-critical knowledge area (e.g. the security model or a core integration) with no named owner
- **THEN** it surfaces the gap as a suggestion to assign an owner, without inventing or assigning one itself

#### Scenario: Ownership is not gated
- **WHEN** `docs-check` runs
- **THEN** it never fails a project for missing ownership notes — ownership is a judgement lens, not a gate rule
