> Apply **after** `skills-audit-registry` (so the new skills are registry entries, not sidecars).

## 1. Secure-coding base skill

- [ ] 1.1 Add `skills/eunomai-secure-coding/SKILL.md` — actionable directives across the **OWASP Top 10** (+
  CWE Top 25), each citing its standard: injection, broken access control, crypto failures, secrets, **A04
  insecure design / threat-model the trust boundaries first**, misconfiguration, vulnerable components, auth
  failures, integrity, security logging. Proactive guidance that **defers diff audit to `/security-review`**
  and **complements `safe-controls`** (runtime), not duplicating either (req: *Secure-coding base skill*,
  *Base-skill admission filter*).

## 2. Dependency-upgrade base skill

- [ ] 2.1 Add `skills/eunomai-dependency-upgrade/SKILL.md` — add/upgrade hygiene: lockfile, **SCA/CVE scan
  before merge**, read the changelog, breaking changes one major at a time, run the full test suite, watch
  transitive deps, **track licenses**; cite OWASP A03:2025 + SLSA (req: *Dependency-upgrade base skill*).

## 3. Living-docs diagram enrichment

- [ ] 3.1 Update `skills/eunomai-living-docs/SKILL.md` and `docs/reference/living-docs.md` — guide **Mermaid**
  diagrams by purpose (flowchart/sequence/ER/class/state) and the **C4 model** for architecture; keep diagrams
  simple (req: *Diagram enrichment (Mermaid + C4)*).

## 4. Registry + authored source

- [ ] 4.1 Add `eunomai-secure-coding` and `eunomai-dependency-upgrade` to `skills/eunomai-skills-audit.md`
  (`origin: authored`) (req: *Base skills are authored and audited*).
- [ ] 4.2 Update `AGENTS.md` with a **base skills** note (the admission filter + the two skills) and re-project
  to `CLAUDE.md` / `copilot-instructions.md`.

## 5. Validation gate

- [ ] 5.1 `node projection/dist/cli.cjs provenance-check` exits 0 (registry covers all skills, incl. the two new ones).
- [ ] 5.2 `node projection/dist/cli.cjs docs-check` exits 0.
- [ ] 5.3 Re-project and verify idempotency: `cli.cjs compile` then `compile --check` (zero drift).
- [ ] 5.4 Validate the change: `openspec validate base-skills --strict`.
- [ ] 5.5 Sanity (no projection code changed): `cd projection && npm run typecheck && npm run lint && npm test`.
