# living-docs — delta

## ADDED Requirements

### Requirement: Doc-set profiles by repo destination

The `eunomai-living-docs` skill SHALL carry a small canonical catalog of **doc-set profiles** keyed by the
repository's destination — **library/SDK · service/API · CLI tool · framework/platform · firmware/embedded ·
end-user app/internal tool** — plus a first-class **custom** option. Each profile SHALL be a **preset over the
unchanged v2 standard** (same frontmatter, same shape-only gate): a visible **preview** consisting of an
approximate README skeleton and a starter `docs/` page set, each starter page annotated with its Diátaxis
`type` and the profile's emphasis. When establishing docs or restructuring thin/missing docs, the skill SHALL
offer the profile choice through the existing **structured interview**: it SHALL recommend a default profile
inferred from detected signals (manifests, cartographer output, repo shape), show the candidate previews, and
proceed only on the author's choice. Choosing **custom** SHALL trigger follow-up questions (one at a time)
until the intended doc set is clear. The choice SHALL be **skippable**, and where an incumbent docs
standard/toolchain governs the project, the coexistence contract applies — the incumbent wins and profile
selection stands down. Previews are **starting points**: pages are added or removed by the earns-its-place
test, and the deterministic `docs-check` gate SHALL NOT check profile conformance. The canonical catalog SHALL
live **inside the skill** (a progressive-disclosure reference file, so it resolves in installed-plugin mode);
`docs/living-docs.md` SHALL summarize and link to it without holding a second copy.

#### Scenario: A profile is recommended from detected signals
- **WHEN** living-docs establishes docs for a project whose manifests and layout identify it (e.g. a published
  package with a public API surface, or an embedded toolchain)
- **THEN** it recommends the matching profile as the default, shows the profile previews, and proceeds only on
  the author's choice

#### Scenario: The author sees what a profile produces before choosing
- **WHEN** the profile question is asked
- **THEN** each offered profile shows its approximate README skeleton and starter page set with each page's
  Diátaxis `type`, so the author can intuit the resulting structure before committing

#### Scenario: Custom triggers follow-up questions
- **WHEN** the author picks custom or describes their own structure idea
- **THEN** the skill asks follow-up questions one at a time until the intended doc set is clear, and builds
  toward that instead of a named profile

#### Scenario: An incumbent docs standard stands the profiles down
- **WHEN** the project's docs are governed by an existing standard or toolchain
- **THEN** profile selection defers to the incumbent per the coexistence contract and is not offered as a
  restructuring over it

#### Scenario: The gate ignores profiles
- **WHEN** `docs-check` runs on a project established from any profile (or none)
- **THEN** it validates frontmatter shape and links only, and never fails a project for deviating from a
  profile's preview

#### Scenario: The catalog resolves in installed-plugin mode
- **WHEN** the skill runs from the installed plugin (not a repo clone)
- **THEN** the profile catalog is available from the skill's own reference file without a repo-relative path

### Requirement: README quality bar and prose register

The root `README.md` SHALL be **user-friendly regardless of profile**: it SHALL describe the repository for a
first-time reader — what it is, who it is for, and why it exists — include a diagram when a picture carries
the story better than prose, and **reference** detailed material in `docs/` rather than inlining it; technical
depth belongs in `docs/` pages, whose register MAY be as technical and structured as the destination demands.
All authored doc prose (README and `docs/` pages) SHALL use a **self-contained, timeless register**: no
conversational or session references ("as you said", "as discussed", allusions to a chat or working session),
no meta-commentary about how the document was produced, and no filler — logical, direct prose where every
sentence earns its place. Dated records (CHANGELOG entries, ADRs) remain dated by design and are not affected.
This bar SHALL be applied by the skill's judgement during authoring and refresh (surfacing violations for the
author) and SHALL NOT become a `docs-check` rule — the gate stays shape-only.

#### Scenario: The README stays user-friendly on a technical repo
- **WHEN** docs are established for a deeply technical repository (e.g. firmware or an API service)
- **THEN** the root README still reads for a first-time human — what/for whom/why, a diagram if it helps,
  links onward — while the technical depth lands in `docs/` pages

#### Scenario: Conversational prose is surfaced and removed
- **WHEN** a refresh finds prose referencing a conversation or session ("as we discussed, the parser…") or
  meta-commentary ("this section was added after review")
- **THEN** the skill surfaces it as a register violation and proposes self-contained wording, with the author
  in control

#### Scenario: The register bar is not gated
- **WHEN** `docs-check` runs
- **THEN** it never fails a project for prose register or README friendliness — the bar is authoring
  judgement, not a gate rule

### Requirement: Same-pass README↔docs synchronization

The `eunomai-living-docs` skill (and any eunomai flow authoring project docs) SHALL update the root README
map **in the same pass** whenever it **adds, removes, or renames** a `docs/` page — the page set and the map
are never left divergent between passes. The deterministic `docs-check` gate remains the enforcement backstop
and is unchanged.

#### Scenario: A new page lands with its map entry
- **WHEN** a refresh creates a new `docs/` page
- **THEN** the same set of proposed edits includes the README map entry for it, and `docs-check` passes after
  applying

#### Scenario: A removed page leaves no dangling link
- **WHEN** a page is removed or renamed during a pass
- **THEN** the README map is corrected in that same pass, never deferred to a later invocation
