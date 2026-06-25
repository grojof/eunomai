## Why

[ADR-0006](../../../docs/decisions/0006-docs-single-source-of-truth/DECISION.md) named the real cause of the
leftover doc mess: no **single-source-of-truth** discipline — a fact could live in both `CLAUDE.md`/an ADR and a
`docs/` page — worsened because eunomai is a meta-tool whose `CLAUDE.md`/ADRs already describe it. This change
enacts the principle (**one fact, one home — everything else links**) in the standard, the skill, and eunomai's
own docs.

## What Changes

- **Standard + skill** — add to `docs/living-docs.md` and `eunomai-living-docs`: the single-source principle,
  the **"earns its place" test** (is this fact already canonical in `CLAUDE.md`/an ADR/the code? → link, don't
  restate), and an **anti-duplication lens** (during a refresh, flag pages/sections that duplicate another home
  and propose merge or link — human-in-control). Diátaxis stays a `type` lens; the gate is unchanged.
- **Clean eunomai's own docs:**
  - **Merge** `docs/contributing.md` into the single root `CONTRIBUTING.md` (drop the duplicate page).
  - **Slim** the reference pages that restate `CLAUDE.md`/ADRs (`sdd`, `skill-finder`, `base-skills`, `checks`)
    to a short lead + a link to the canonical home, or sharpen them to genuinely non-overlapping detail.
  - **Keep** the pages that are a genuine single home (`living-docs`, `safe-controls`, `onboard`, `vision`,
    `knowledge-driven-development`, `getting-started`).
  - Update the README map accordingly.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `living-docs`: add a requirement that docs hold each fact once (single source of truth) — pages do not
  duplicate `CLAUDE.md`/ADRs/another page; the skill applies an "earns its place" test and an anti-duplication
  lens.

## Impact

- `docs/living-docs.md`, `skills/eunomai-living-docs/SKILL.md` — the principle, test, and lens.
- `CONTRIBUTING.md` (absorbs the dev guide), `docs/contributing.md` (removed), `docs/sdd.md` ·
  `docs/skill-finder.md` · `docs/base-skills.md` · `docs/checks.md` (slimmed/sharpened), `README.md` (map).
- `openspec/specs/living-docs/spec.md` — the no-duplication requirement (synced).
- No code, no new check, no machinery. Reuse: the existing refresh skill + the activation-routing pattern;
  eunomai adds only the single-source lens. The deterministic gate is unchanged.
