## ADDED Requirements

### Requirement: Seed a self-sufficient activator block in CLAUDE.md

When seeding a project root, the onboard skill SHALL write into the project's `CLAUDE.md` a natural-language
**activator block** that states eunomai's base disciplines at the level of **principle** (spec-first change,
honest docs, vetting third-party skills/tools before adoption, secure-by-default, deliberate dependency
changes, pausing on irreversible/sensitive actions). The block SHALL name the relevant skills only as
**accelerators** (parenthetically), never as prerequisites, and SHALL honour three invariants: it SHALL remain
meaningful if the skills are absent (**self-sufficient**), SHALL reference capabilities rather than the eunomai
brand/framework (**capabilities, not brand**), and SHALL state the principle rather than the procedure
(**activate, don't duplicate**). onboard SHALL adapt the canonical block to the project rather than copying it
verbatim, and SHALL add no new check.

#### Scenario: The seeded CLAUDE.md carries the activator block
- **WHEN** onboard seeds a confirmed project root
- **THEN** the project's `CLAUDE.md` contains the activator block stating the base disciplines as principles

#### Scenario: Self-sufficient — survives skill removal
- **WHEN** the eunomai skills are not installed in a collaborator's environment
- **THEN** each principle in the block still reads as actionable guidance on its own, with the skill mention as an optional accelerator

#### Scenario: Capabilities, not brand
- **WHEN** the block references how a discipline is automated
- **THEN** it names the capability/skill and never names the "eunomai" framework

#### Scenario: Activate, don't duplicate
- **WHEN** a discipline is also covered in depth by a skill
- **THEN** the block states the principle and defers the procedure to that skill, rather than restating it

#### Scenario: Adapted, not copied
- **WHEN** onboard writes the block for a specific project
- **THEN** it adapts the canonical block to that project's stack and conventions rather than pasting it verbatim
