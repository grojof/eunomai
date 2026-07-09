## Why

The living-docs flows (living-docs refresh + onboard's establish-docs step) already propose a **folder
structure**, but they say nothing about which **doc set** a repository actually needs — a library, an HTTP
API, a CLI, a firmware project, and an end-user app each want a different README skeleton and starter page
set. Today the author gets one generic outcome and no way to *see* alternatives or state their own idea.
Separately, the standard's README quality bar is implicit: nothing forbids conversational or session-bound
prose ("as discussed", meta-commentary) from landing in authored docs, and the README↔docs sync duty is
stated only as gate behavior, not as an authoring rule.

## What Changes

- **Doc-set profiles by repo destination** — a small canonical catalog of presets (library/SDK · service/API ·
  CLI tool · framework/platform · firmware/embedded · end-user app/internal tool) over the *same* v2 standard:
  each profile is a visible **preview** (approximate README skeleton + starter `docs/` page set with Diátaxis
  `type` and emphasis). Offered through the existing structured interview with a **recommended default
  inferred from detected signals**, always including a **custom** option ("describe your idea") that triggers
  follow-up questions. Skippable; an incumbent docs standard wins (coexistence contract) — never blocking.
- **Catalog home** — the canonical catalog lives inside the `eunomai-living-docs` skill as a
  progressive-disclosure reference file (resolves in installed-plugin mode, same precedent as onboard's
  activator block); `docs/living-docs.md` summarizes and links, holding no second copy.
- **README quality bar, made explicit** — the root README is **always user-friendly** regardless of profile
  (what · for whom · why, a diagram when it helps, references out); technical depth belongs in `docs/`.
- **Self-contained, timeless register** for all authored doc prose — no conversational or session references
  ("as you said", "as discussed"), no meta-commentary about how the doc was produced, no filler; logical and
  direct, every sentence earns its place.
- **README↔docs sync as an authoring duty** — any pass that adds/removes/renames a `docs/` page updates the
  README map **in the same pass**; `docs-check` remains the deterministic enforcement (unchanged).
- **onboard integration** — the establish-docs step offers the profile choice by **delegating to the
  living-docs catalog** (no duplicated copy); the profile decision may crystallize into an ADR like any other
  non-trivial interview outcome.

Reuse vs net-new: everything rides on existing primitives — the structured interview,
infer-then-confirm structure proposals, the coexistence contract, the shape-only `docs-check` gate, and the
skill-carried-canonical-content precedent. Net-new is only the profile catalog reference file and the
explicit prose-register/quality-bar requirements.

## Capabilities

### New Capabilities

(none — both changes extend existing capabilities)

### Modified Capabilities

- `living-docs`: add doc-set profile selection (catalog + preview + interview + custom path + coexistence
  deference); make the README user-friendly quality bar and the self-contained/timeless prose register
  explicit requirements; state README↔docs same-pass sync as an authoring duty of the skill.
- `onboard`: the establish-docs step offers the profile choice via the living-docs catalog (delegation, no
  reimplementation), with the decision recordable as an ADR.

## Impact

- `openspec/specs/living-docs/spec.md`, `openspec/specs/onboard/spec.md` — via delta specs.
- `skills/eunomai-living-docs/SKILL.md` + new `skills/eunomai-living-docs/references/doc-profiles.md`.
- `skills/eunomai-onboard/SKILL.md` (establish-docs step wording).
- `docs/living-docs.md` (summary section + link; no second catalog copy).
- **No `tools/` CLI change** — the gate stays shape-only; profiles are judgement/interview material, never a
  `docs-check` rule. Coexistence spec expected unchanged (profiles are a default-where-nothing-exists;
  verified during design).

## Non-goals / out of scope

- No template *engine*, placeholders, or generated docs — profiles are authoring presets, not generators.
- No new check, no conformance rule, no new frontmatter field, no per-profile folder mandate.
- No hand-curated growth of the catalog beyond the small destination set; **custom** absorbs the long tail.
- No change to ADR handling, community-health file requirements, or the coexistence contract itself.
