## ADDED Requirements

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
