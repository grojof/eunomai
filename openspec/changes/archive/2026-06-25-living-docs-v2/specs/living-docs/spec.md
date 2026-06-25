## MODIFIED Requirements

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
