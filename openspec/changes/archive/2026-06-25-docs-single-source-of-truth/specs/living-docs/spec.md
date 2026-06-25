## ADDED Requirements

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
