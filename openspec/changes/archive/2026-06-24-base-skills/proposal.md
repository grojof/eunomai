## Why

eunomai ships only its own governance skills. We want a **small, fiercely-curated set of universal
best-practice base skills** — the ones no professional disputes — so every onboarded project starts with a
security/quality floor, *without* imposing company-specific opinion. Each is anchored to a recognized standard
(OWASP, CWE, SLSA, Mermaid/C4), so it is robust and actionable, not fluff. The admission bar is explicit:
**universal · non-prescriptive · standards-anchored · low-maintenance** — anything opinionated or
domain-specific stays out of the base and comes via `skill-finder` + project rules.

## What Changes

- Add **`eunomai-secure-coding`** (base skill): actionable secure-coding directives spanning the **full OWASP
  Top 10** (+ CWE Top 25), mapped to dev tasks — input/output, authn/z, crypto, secrets, deserialization,
  SSRF, misconfiguration, logging — and **A04 Insecure Design** (threat-model the trust boundaries *before*
  coding). Each directive cites its standard (e.g. `OWASP A03 / CWE-89`). It is **proactive guidance**:
  defers diff-level audit to Claude Code's native **`/security-review`**, and complements **safe-controls**
  (the runtime plane). 
- Add **`eunomai-dependency-upgrade`** (base skill, the standardized idea from ai-workspace-generator): the
  add/upgrade-dependency hygiene flow — pin via lockfile, **SCA/CVE scan before merge**, read the changelog,
  take breaking changes one major at a time, run the full test suite, watch transitive deps, and **track
  dependency licenses** (SBOM-adjacent). Anchored to **OWASP A03:2025 Supply-Chain Failures** + **SLSA**.
- Enrich **`eunomai-living-docs`** (modify): teach **Mermaid** diagram selection (match the diagram type to
  the story) and the **C4 model** for architecture (Context → Container → Component), plus rich-but-simple
  Markdown.
- **Reuse vs net-new (connector-first):** *reuse* the standards themselves (OWASP / CWE / SLSA / Mermaid /
  C4 — we encode them, we don't invent them) and Claude Code's native `/security-review` (audit) +
  `safe-controls` (runtime). *Net-new* is only the curated, standards-anchored base skills.

## Capabilities

### New Capabilities
- `base-skills`: a curated set of universal, standards-anchored best-practice skills shipped in eunomai's base
  — today **`eunomai-secure-coding`** and **`eunomai-dependency-upgrade`** — gated by an explicit admission
  filter (universal · non-prescriptive · standards-anchored · low-maintenance).

### Modified Capabilities
- `living-docs`: the standard and the `eunomai-living-docs` skill gain **diagram enrichment** — Mermaid
  (diagram type matched to purpose) and the C4 model for architecture.

## Impact

- **New:** `skills/eunomai-secure-coding/SKILL.md`, `skills/eunomai-dependency-upgrade/SKILL.md`, each
  recorded in the skills audit registry (origin `authored`).
- **`eunomai-living-docs`:** SKILL.md + `docs/reference/living-docs.md` updated for Mermaid/C4.
- **`AGENTS.md`:** a "base skills" note (the admission filter + the two skills); re-project.
- **Gate:** `provenance-check` + `docs-check` stay green; `projection/` gate runs if code changes.
- **Apply order:** apply **after** `skills-audit-registry`, so the two new skills are recorded as registry
  entries (not per-skill sidecars).

## Non-goals

- **Not opinionated / company-policy practices** (code style, testing *how*, framework choices, commit
  conventions) — those belong to `skill-finder` + the project's rules, never the base.
- **Not domain-specific skills** (accessibility/WCAG, i18n) — real but only apply to some projects → bring via
  `skill-finder` where needed.
- **Not reinventing** Claude Code's `/security-review` (diff audit) or `safe-controls` (runtime hooks) —
  `secure-coding` is the proactive writing-time plane.
- **Not a growing catalog** — the base set stays tiny and undisputed; breadth lives in the standards each
  skill cites, not in the number of skills.
