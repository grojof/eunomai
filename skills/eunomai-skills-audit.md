---
generated: 2026-07-02
skills:
  - name: eunomai-living-docs
    origin: authored
    ref: 0.4.0
    verdict: authored
    rubric: Authored in-repo (living-docs pillar); origin trusted (us), no third-party code.
    gaps: []
  - name: eunomai-skill-finder
    origin: authored
    ref: 0.4.0
    verdict: authored
    rubric: Authored in-repo (skill-finder pillar); origin trusted (us), no third-party code.
    gaps: []
  - name: eunomai-onboard
    origin: authored
    ref: 0.4.0
    verdict: authored
    rubric: Authored in-repo (connector/bootstrap axis); origin trusted (us), no third-party code.
    gaps: []
  - name: eunomai-secure-coding
    origin: authored
    ref: 0.4.0
    verdict: authored
    rubric: Authored in-repo (base skill); universal secure-coding directives anchored to OWASP/CWE, no third-party code.
    gaps: []
  - name: eunomai-dependency-upgrade
    origin: authored
    ref: 0.4.0
    verdict: authored
    rubric: Authored in-repo (base skill); universal dependency hygiene anchored to OWASP A03:2025/SLSA, no third-party code.
    gaps: []
---

# eunomai skills audit

All skills under `skills/` are eunomai's own, authored in this repository (`origin: authored`; `ref` pins
the plugin version the entry attests, refreshed on each release cut). No third-party skills are vendored
into the plugin, so there are no trust gaps. This file is the consolidated provenance record the
`eunomai-skill-finder` pillar produces (one registry per project, not per-skill sidecars) and that
`provenance-check` verifies. See [`docs/skill-finder.md`](../docs/skill-finder.md).

**Evaluated and not adopted** (rejection rationale + harvested ideas — the historical record this registry
also carries): `mattpocock/skills` — a trustworthy, well-authored engineering source, but nothing in it is
base-eligible (opinionated/stack-specific; candidates remain adoptable per project through the gate).
`open-gsd/gsd-core` — rejected as a framework adoption (a multi-tool SDD framework that clashes with
Claude-only, don't-reinvent, and low-maintenance); harvested its edge-level-confidence idea into the
`codebase-cartographer` agent (per-edge `extracted | inferred | ambiguous` tagging).
