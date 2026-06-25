# Base skills

A tiny, **standards-anchored** set of skills shipped in the base — the universal, undisputed practices that
every project benefits from. They are distinct from the [skill-finder](skill-finder.md) pillar: skill-finder
*gates and adopts* project-specific skills; the base set is the small, fixed floor that travels with eunomai.

## The set (today)

| Skill | Anchored to | Does | Defers to |
|-------|-------------|------|-----------|
| **`eunomai-secure-coding`** | [OWASP Top 10](https://owasp.org/www-project-top-ten/) + CWE Top 25 | proactive, **writing-time** secure-coding directives (injection, broken access control, crypto/auth failures, SSRF, unsafe deserialization) | `/security-review` for a **diff audit**; [safe-controls](safe-controls.md) for **runtime** blocking |
| **`eunomai-dependency-upgrade`** | [OWASP A03:2025](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/) + [SLSA](https://slsa.dev/) | universal hygiene for adding/upgrading deps: lockfile pin · SCA/CVE scan · changelog · incremental breaking changes · licenses | your package manager (it's the checklist around it, not a replacement) |

Three non-overlapping planes for security: **secure-coding** (write-time) → **`/security-review`**
(diff-time) → **safe-controls** (run-time).

## The admission filter

A skill is **base-eligible only if all four** hold:

- **Universal** — applies to essentially every project, regardless of stack or domain.
- **Non-prescriptive** — guidance, not company policy or opinionated process.
- **Standards-anchored** — backed by a recognized standard (OWASP, CWE, SLSA, …), not one team's taste.
- **Low-maintenance** — stable; it doesn't need constant curation as the ecosystem shifts.

Anything opinionated, company-specific, or domain-only stays **out** — it arrives via
[skill-finder](skill-finder.md) + the project's rules. The base set stays small and undisputed; breadth lives
in the cited standards, not in more base skills.

## Relationship to the other pillars

- **vs. skill-finder** — base skills are authored and shipped; skill-finder skills are discovered, gated, and
  adopted per project. Both are recorded in the [provenance registry](skill-finder.md#provenance-one-audit-registry-not-sidecars)
  (base skills as `verdict: authored`).
- **vs. safe-controls** — `secure-coding` advises while you write; [safe-controls](safe-controls.md) blocks at
  runtime. Advice is not enforcement; pair them.
