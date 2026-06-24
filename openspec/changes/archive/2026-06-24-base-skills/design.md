## Context

eunomai ships only governance skills. A real onboarding run showed the value of universal best-practice skills
(the project pulled in dependency-upgrade, security, etc.), but ad-hoc adoption is exactly the trust problem
`skill-finder` exists to gate. The user wants a **tiny, curated base set** of universal skills that every
project gets — with **real work behind them** (anchored to OWASP / CWE / SLSA / Mermaid / C4), not generic
fluff. Web research fixed the canon: OWASP Top 10 + Secure Coding Practices + CWE Top 25 (security), OWASP
A03:2025 Supply-Chain + SLSA + SCA/SBOM (dependencies), Mermaid + the C4 model (diagrams).

## Goals / Non-Goals

**Goals:**
- A curated base set (today: secure-coding, dependency-upgrade), each anchored to a recognized standard.
- Enrich living-docs with Mermaid/C4 diagram guidance.
- Keep it lean and undisputed via an explicit admission filter.

**Non-Goals:**
- Opinionated/company-policy skills; domain-only skills; reinventing `/security-review` or `safe-controls`; a
  growing catalog.

## Decisions

### Decision 1 — Anchor every directive to a recognized standard (the anti-fluff rule, reuse-first)

Each base skill encodes directives that **cite a standard** (e.g. `OWASP A03 / CWE-89`, `SLSA`, `C4`). eunomai
does not invent guidance — it distills the consensus into actionable, triggered checklists.

- *Why over alternatives:* generic "write good code" advice is the fluff the user rejects. Citing the standard
  gives authority, universality, and concreteness, and lets the skill point to the living source instead of
  freezing a list.

### Decision 2 — An explicit admission filter keeps the base tiny

A skill is base-eligible only if **universal · non-prescriptive · standards-anchored · low-maintenance**.
Everything else (style, testing-how, frameworks, accessibility, i18n) is per-project via `skill-finder` +
rules.

- *Why over alternatives:* without a hard filter, "best practices" balloons into the framework-of-everything
  the project fled. The filter is the guardrail.

### Decision 3 — Security lives in three non-overlapping planes

`eunomai-secure-coding` = **writing-time guidance** (proactive). Claude Code's native **`/security-review`** =
**diff-level audit**. `safe-controls` = **runtime** hooks. The skill defers to and complements the other two
rather than duplicating them.

- *Why over alternatives:* re-implementing a security reviewer or runtime guard would violate "don't reinvent"
  and create overlap. Three planes cover proactive + audit + runtime cleanly.

### Decision 4 — Authored skills recorded in the audit registry; apply after `skills-audit-registry`

The two new skills are `origin: authored` and listed in `skills/eunomai-skills-audit.md`. This change is
applied **after** `skills-audit-registry`, so they are registry entries (not per-skill sidecars).

## Risks / Trade-offs

- **Standards evolve** (OWASP refreshes every 3–4 years) → cite the standard by name + link the living source,
  not a frozen copy; low update cadence.
- **Scope creep into opinion** → the admission filter is the documented gate.
- **Overlap with `/security-review` / `safe-controls`** → explicit defer/complement; the three-plane split.
- **Ordering** → depends on `skills-audit-registry` (registry, not sidecars).
- **Low-maintenance check:** two skill files + a living-docs enrichment + two registry lines; the breadth
  lives in the cited standards, not in maintained content.
