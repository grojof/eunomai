# living-docs Specification

## Purpose
Define eunomai's living-docs pillar (v2) for project-facing documentation: Diátaxis as a **lens** via a `type`
frontmatter field (not a folder mandate), an **OKF-routable substrate** (frontmatter + path-as-identity + a
link-graph), a **product-shaped README map** with a dev-quality bar, and a **deterministic frontmatter gate**
in `docs-check` — with AI coherence-auditing kept out of the gate. Plus an on-demand refresh skill, Mermaid/C4
diagrams, workspace-aware per-repo auditing, and recovery of thin/missing docs via the structured interview.
Dev-facing ADRs are out of scope; eunomai dogfoods the standard on its own docs.
## Requirements
### Requirement: Project-docs structure standard

The root `README.md` SHALL be a **routable map** — a short at-a-glance summary, an architecture diagram, a
quickstart, and an index organized by **surface/journey** (not by Diátaxis bucket). Detailed documentation
SHALL live under `docs/` as a **routable substrate**: every page SHALL carry YAML frontmatter with **required**
`type` (∈ `tutorial | how-to | reference | explanation | decision`), `title`, and `description`; **recommended**
`tags`; and **optional** `audience`, `related`, `updated`. The Diátaxis mode SHALL be expressed by the `type`
field (a **lens** — one page, one mode), **not** by a mandated folder tree: folders are a convenience and MAY
stay flat while small, a surface promoted to its own folder only as it grows. Each page's path SHALL serve as
its identity, pages SHALL link to form a navigable graph, and every in-scope page SHALL be reachable from the
README map. The README SHALL NOT inline long-form content that belongs in a `docs/` page.

#### Scenario: A reader opens the README
- **WHEN** a reader opens `README.md`
- **THEN** they get an at-a-glance summary, an architecture diagram, a quickstart, and a surface-organized map of links to the `docs/` pages

#### Scenario: A page declares its mode in frontmatter
- **WHEN** new documentation is authored
- **THEN** it carries frontmatter whose `type` states its single Diátaxis mode, and it is reachable from the README map — regardless of which folder it sits in

#### Scenario: Folders are convenience, not mandate
- **WHEN** a project is small
- **THEN** `docs/` pages MAY stay flat (the `type` field classifies them), and no empty Diátaxis folders are required

### Requirement: On-demand docs refresh skill

The plugin SHALL provide an `eunomai-living-docs` skill that, when invoked, refreshes project docs toward the
standard: it updates the README summary and index to match the current state, keeps the index in sync with
the pages under `docs/`, and surfaces README sections that should move into topic pages. The skill SHALL be
human-invoked and SHALL keep the human in control (it does not silently rewrite docs).

#### Scenario: A docs page is missing from the index
- **WHEN** a project-doc page exists under `docs/` that is not linked from the README index, and the skill is invoked
- **THEN** the skill adds a link to that page in the README index

#### Scenario: The skill is invoked to refresh
- **WHEN** the user invokes the skill
- **THEN** it brings the README summary and index in line with the current project state, with the user in control of the changes

### Requirement: README-to-docs integrity check

The plugin SHALL provide a read-only integrity check that verifies, **deterministically**: (a) every README
link into `docs/` resolves; (b) every in-scope page under `docs/` is reachable from the README map; and (c)
every in-scope page carries valid frontmatter **shape** — `type` present and in the allowed set, with non-empty
`title` and `description`. The check SHALL validate **shape, never prose** (it does not judge whether the
content truly matches its `type`, nor doc↔code coherence — that is the `coherence-auditor` agent's one-shot,
human-resolved job, which SHALL NOT be part of the gate). It SHALL exit non-zero on any divergence, report what
diverged, and make no changes.

#### Scenario: A README link is broken
- **WHEN** the README links to a `docs/` file that does not exist
- **THEN** the check reports the broken link and exits non-zero

#### Scenario: A page is missing or has invalid frontmatter
- **WHEN** an in-scope `docs/` page has no frontmatter, an unknown `type`, or an empty `title`/`description`
- **THEN** the check reports it and exits non-zero

#### Scenario: AI judgment is not in the gate
- **WHEN** the gate runs
- **THEN** it performs only deterministic shape/link checks and never invokes AI judgment on prose or coherence

### Requirement: Dev-docs excluded from scope

The standard and the integrity check SHALL treat dev-docs as out of scope: pages under `docs/decisions/`
(ADRs) SHALL NOT be required to appear in the README index.

#### Scenario: A dev-doc is not indexed
- **WHEN** an ADR exists under `docs/decisions/` and is not linked from the README
- **THEN** the integrity check does not flag it

### Requirement: eunomai dogfoods the standard

eunomai's own `README.md` and `docs/` SHALL conform to the standard, and the integrity check SHALL pass on
this repository as part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** the integrity check runs against this repository
- **THEN** it exits zero

### Requirement: Diagram enrichment (Mermaid + C4)

The living-docs standard and the `eunomai-living-docs` skill SHALL guide diagrams using **Mermaid**, matching
the diagram type to its purpose (flowchart for process/decisions, sequence for interactions over time, ER or
class for data/structure, state for status changes, and the **C4 model** for architecture), and SHALL keep
each diagram simple (one idea per diagram).

#### Scenario: Architecture needs a diagram
- **WHEN** a doc needs to show software architecture
- **THEN** the skill recommends Mermaid with the **C4** model (Context → Container → Component)

#### Scenario: A process or interaction needs a diagram
- **WHEN** a doc needs to show a process/decision or an interaction over time
- **THEN** the skill recommends the matching Mermaid type (flowchart or sequence) and keeps it simple

### Requirement: Workspace-aware doc audit

The `eunomai-living-docs` skill SHALL operate on a **project root**, which may not be the current directory in
a workspace that contains nested or multiple repos. When invoked in such a workspace it SHALL first run the
read-only workspace survey to identify project roots, audit and refresh docs against a chosen project root
(running `docs-check` from that root), and report doc state per repository — never assuming the workspace root
is the project. It SHALL remain human-in-control and SHALL change nothing during the survey.

#### Scenario: Nested project, not the workspace root
- **WHEN** living-docs is invoked in a workspace whose root is environment and the project is a nested repo
- **THEN** it audits and runs `docs-check` against the nested project root, not the workspace root

#### Scenario: Per-repo report across a multirepo workspace
- **WHEN** the workspace holds multiple project repos
- **THEN** living-docs reports each repo's doc state separately and refreshes only the project root(s) the user chooses

#### Scenario: Single-repo behavior is unchanged
- **WHEN** living-docs is invoked in a plain single repo (cwd = project root = workspace)
- **THEN** it behaves exactly as before, with no extra survey ceremony required

### Requirement: Recover thin or missing docs via the structured interview

The `eunomai-living-docs` skill SHALL, when a project root's docs are thin or missing, use the **structured
interview** technique — one question at a time, recommend a default, explore the codebase first — to recover
the project's knowledge into the docs standard. It SHALL remain human-in-control and SHALL NOT ask what is
already discoverable in the codebase.

#### Scenario: Thin docs are filled by interview
- **WHEN** living-docs is invoked on a project whose docs are missing or skeletal
- **THEN** it recovers the missing knowledge through the structured interview and writes it into the docs standard

#### Scenario: Explore before asking
- **WHEN** a gap can be filled from the codebase (stack, structure, existing conventions)
- **THEN** living-docs explores the codebase to fill it instead of asking the user

### Requirement: Route knowledge toward its activation state

During a docs refresh, the `eunomai-living-docs` skill SHALL identify content whose nature places it at a
**higher activation state** than passive prose, and SHALL **surface it as a suggestion** naming the owning
pillar — a recurring convention → `CLAUDE.md`; an enforceable policy → a hook (safe-controls); a repeatable
procedure → a skill (via `eunomai-skill-finder`); a trackable requirement → an OpenSpec spec. It SHALL
**delegate** the actual move to that pillar and SHALL NOT perform the move itself (it does not write
`CLAUDE.md`, author hooks or skills, or create specs), SHALL keep the human in control, and SHALL add no new
check.

#### Scenario: A recurring convention is routed to CLAUDE.md
- **WHEN** a docs refresh finds a recurring "always do X / never do Y" convention living as README prose
- **THEN** living-docs suggests moving it to `CLAUDE.md` and does not edit `CLAUDE.md` itself

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

### Requirement: Delegate diagrams and stale-doc detection to read-only agents

The living-docs skill SHALL be able to delegate read-only work to subagents: the **codebase-cartographer** to
derive an architecture diagram (Mermaid/C4) for the "at a glance" view, and the **coherence-auditor** to
surface docs that have drifted from the code or cite stale versions. Both delegations SHALL be **read-only**
and **suggestion-only** — living-docs remains human-in-control and the agents never edit docs or decide; the
coherence audit SHALL be a one-shot diagnostic, not a continuous check.

#### Scenario: Cartographer proposes an architecture diagram
- **WHEN** living-docs needs an architecture diagram for a project's README/docs
- **THEN** it may delegate to the read-only cartographer for a proposed Mermaid/C4 diagram, which the author accepts or declines

#### Scenario: Auditor surfaces stale docs
- **WHEN** living-docs refreshes a project's docs
- **THEN** it may delegate a one-shot coherence audit that flags doc↔code drift for the author to resolve, without editing anything itself

### Requirement: Propose the docs structure, never assume it

When the `eunomai-living-docs` skill establishes or refreshes a project's docs, it SHALL NOT silently assume a
folder layout. It SHALL **propose 2–3 structure options** with trade-offs and a **recommended default** chosen
by the project's size/shape (e.g. flat `docs/*.md` while small; by-surface `docs/<surface>/` once a surface has
~3+ pages; or a hybrid), and SHALL proceed only on the user's choice — human-in-control and skippable. Folders
SHALL **never** be organized by Diátaxis type (the mode lives in the `type` frontmatter field); if the skill
detects content-type folders (`guides/`/`reference/`/`explanation/`), it SHALL flag them as an anti-pattern and
propose migrating. The deterministic `docs-check` gate SHALL remain shape-only and SHALL NOT judge structure.

#### Scenario: Structure is proposed, not assumed
- **WHEN** living-docs (re)structures a project's docs
- **THEN** it presents 2–3 folder-structure options with a recommended default and proceeds only on the user's choice

#### Scenario: Content-type folders are flagged as an anti-pattern
- **WHEN** the docs are organized into `guides/`/`reference/`/`explanation/` (by Diátaxis type)
- **THEN** living-docs flags this as an anti-pattern and proposes migrating (flatten, or re-nest by surface), since the mode belongs in the `type` field

#### Scenario: The gate does not judge structure
- **WHEN** `docs-check` runs
- **THEN** it validates frontmatter shape and links only, and never fails a project for its folder structure

### Requirement: Docs hold each fact once (single source of truth)

The living-docs standard SHALL hold each fact in exactly **one home** — the README maps and links but does not
restate; `CLAUDE.md` holds the authored conventions; ADRs hold the decisions; `docs/` pages hold only
user-facing content that is not already canonical elsewhere; and there SHALL be exactly **one**
`CONTRIBUTING.md`. The `eunomai-living-docs` skill SHALL apply an **"earns its place" test** when authoring or
refreshing — if a fact is already canonical in `CLAUDE.md`, an ADR, or the code, it SHALL be **linked, not
restated** — and SHALL surface pages or sections that **duplicate** another home, proposing a **merge or link**
(human-in-control). This is a judgement lens, not a gate rule: the deterministic `docs-check` SHALL remain
shape-only and SHALL NOT judge duplication.

#### Scenario: A fact already canonical elsewhere is linked, not restated
- **WHEN** authoring or refreshing a `docs/` page whose content is already canonical in `CLAUDE.md`, an ADR, or the code
- **THEN** the page links to that home instead of duplicating it

#### Scenario: Duplicate pages are surfaced for merge
- **WHEN** the skill finds two pages (or a page and `CLAUDE.md`/an ADR) stating the same fact
- **THEN** it flags the duplication and proposes merging or linking, with the author in control

#### Scenario: The gate does not judge duplication
- **WHEN** `docs-check` runs
- **THEN** it validates frontmatter shape and links only, and never fails a project for duplicated prose

### Requirement: Knowledge-domain capture lens

The `eunomai-living-docs` skill SHALL apply a **knowledge-domain lens** — orthogonal to Diátaxis (which
classifies a page's *mode*) and to activation state (which classifies how *executable* knowledge is) — to check
**coverage** across the six KDD domains: **business** (needs, rules, constraints, processes), **product** (what
is being built, scope, acceptance criteria), **technical** (architecture, integrations, patterns, ADRs,
conventions), **operational** (deploy, monitoring, observability, security, support), **historical** (past
decisions, trade-offs, lessons), and **AI-ready** (context curated for agents). When refreshing or establishing
docs, the skill SHALL surface domains that are **materially under-covered** for the project as
**suggestions** (human-in-control), guided by the article's "minimal sufficient information, not heavy
documentation" rule and the existing "earns its place" test. The lens SHALL NOT introduce a new required
frontmatter field, SHALL NOT mandate one page or folder per domain, and SHALL NOT become a `docs-check` gate
rule — the deterministic gate stays shape-only.

#### Scenario: An under-covered domain is surfaced
- **WHEN** living-docs refreshes a project whose docs cover technical how-to richly but say nothing about operational concerns (deploy, observability, ownership) an agent would need
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

The `eunomai-living-docs` skill SHALL apply an **ownership lens**: when refreshing or establishing docs it
SHALL surface **system-critical knowledge areas that lack a named owner** as a **suggestion** for the author to
assign — human-in-control. Ownership MAY be recorded lightly (e.g. an `audience`/owner note in frontmatter or a
line in the page), and the skill SHALL NOT invent owners, SHALL NOT assign ownership itself, and SHALL NOT add
an ownership rule to the deterministic `docs-check` gate.

#### Scenario: A critical area has no owner
- **WHEN** living-docs refreshes a project and finds a system-critical knowledge area (e.g. the security model or a core integration) with no named owner
- **THEN** it surfaces the gap as a suggestion to assign an owner, without inventing or assigning one itself

#### Scenario: Ownership is not gated
- **WHEN** `docs-check` runs
- **THEN** it never fails a project for missing ownership notes — ownership is a judgement lens, not a gate rule

