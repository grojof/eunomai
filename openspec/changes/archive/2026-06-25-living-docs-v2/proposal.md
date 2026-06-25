## Why

[ADR-0005](../../../docs/decisions/0005-living-docs-v2/DECISION.md) decided living-docs v2: Diátaxis as a lens
(via a `type` frontmatter field, not folders), an OKF-routable substrate (frontmatter + path-as-identity +
link-graph), product/surface-shaped navigation, a Stripe-drawn dev-quality bar, and a **deterministic
frontmatter gate** in `docs-check` — with AI coherence-auditing kept out of the gate. This change implements it
and pilots it on eunomai's own docs (closing the long-standing zero-diagram dogfooding gap).

## What Changes

- **`docs-check` v2** — extend the existing check (reusing the `yaml` dep already in `tools/`) to validate
  frontmatter **shape** deterministically: `type` ∈ {tutorial, how-to, reference, explanation, decision},
  `title` and `description` non-empty. Exit 1 on missing/invalid. It judges **shape, never prose**; it is an
  **extension** of the existing structural check, not a new gate.
- **Rewrite the standard** — `docs/reference/living-docs.md` + `eunomai-living-docs` skill to the v2 model:
  Diátaxis-as-lens via `type`; the frontmatter schema (`type`/`title`/`description` required, `tags`
  recommended, `audience`/`related`/`updated` optional); product-shaped README-as-map; the dev-quality bar; and
  the rule that AI coherence-auditing (the `coherence-auditor` agent) stays a one-shot, human-resolved
  diagnostic **outside** the gate.
- **Pilot on eunomai's own docs** — add frontmatter to every `docs/` page, rewrite the README as a routable
  **map** (organized by surface/journey) with an **architecture diagram** proposed by the `codebase-cartographer`,
  keep `docs/decisions/` as the ADR series.
- **BREAKING (docs-check):** after this change, a `docs/` page without valid frontmatter fails the gate.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `living-docs`: replace the "project-docs structure standard" and "README-to-docs integrity check" with the v2
  model — Diátaxis-as-lens via `type`, the OKF-routable frontmatter substrate, product-shaped navigation, the
  dev-quality bar, and a deterministic frontmatter-shape gate; AI coherence-auditing remains out of the gate.

## Impact

- `tools/src/docs.ts` (+ `tools/test/docs.test.ts`) — frontmatter-shape validation; rebuild the committed bundle.
- `docs/reference/living-docs.md`, `skills/eunomai-living-docs/SKILL.md` — the v2 standard.
- Every page under `docs/` (≈12) — gains frontmatter; `README.md` — becomes the routable map + diagram.
- `openspec/specs/living-docs/spec.md` — v2 requirements (synced).
- Reuse vs net-new: reuses the existing `docs-check`, the `yaml` dep, and the `codebase-cartographer` (for the
  diagram); eunomai adds only the frontmatter-shape rule and the rewritten standard. The two-layer guarantee
  (deterministic gate + AI one-shot diagnostic) keeps AI judgment **out** of the gate — no conformance engine.
