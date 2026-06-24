## Why

A real-world run on a Flutter project exposed three failures of the per-skill `PROVENANCE.md` approach:

- **(A) The check missed the skills entirely.** Consumer projects keep skills in `.claude/skills/`, but
  `provenance-check` scans only top-level `skills/` — so it reported "0 skills, exit 0" (green) while 21 skills
  sat unchecked.
- **(B) The sidecars made the skills "dirty".** A `PROVENANCE.md` injected into every skill folder (21 files)
  clutters them and mixes eunomai metadata into third-party skills.
- **(C) The gate was rationalized, not enforced.** Sidecars recorded `ref: vendored (SHA no registrado)` and
  `rubric: veto OK` even though the veto requires a pinnable SHA.

Replace per-skill sidecars with **one consolidated, honest audit registry per project**: clean skill folders,
real teeth (covers `.claude/skills/`), and a run record to act on.

## What Changes

- **Remove per-skill `PROVENANCE.md` sidecars.** Replace them with a single **`eunomai-skills-audit.md`** at
  the skills root — `.claude/skills/` in a consumer project, `skills/` in the eunomai plugin. Skill folders
  hold only the skill.
- The registry records, per skill: `name`, `origin`, **real `ref` (commit SHA / version) or `authored`**,
  `verdict`, `rubric`, and `gaps` (e.g. `unpinned`); plus a short **run narrative** (what was searched, the
  decisions).
- **`provenance-check` reworked:** scan **`.claude/skills/` and `skills/`**, verify the registry **covers
  every skill**, validate each entry, and **report gaps** (unpinned / placeholder refs) so they can be acted
  on. Exit non-zero on any uncovered or invalid skill.
- **Sharpen `eunomai-skill-finder`:** record the **real SHA** when vendoring (it is available at vendor time);
  never write "veto OK" for an unpinned origin — record it honestly as a `gap`.
- **Dogfood:** eunomai's own three `PROVENANCE.md` sidecars → one `skills/eunomai-skills-audit.md`.
- **Reuse vs net-new (connector-first):** reuse the existing `yaml` + `zod` check infrastructure; net-new is
  only the registry format, the multi-root scan, and the gap reporting.

## Capabilities

### New Capabilities
<!-- None — this reworks the existing `skill-finder` capability. -->

### Modified Capabilities
- `skill-finder`: provenance moves from a **per-skill sidecar** to a **single consolidated audit registry**
  (`eunomai-skills-audit.md`) at the skills root; the check scans `.claude/skills/` + `skills/`, enforces
  coverage, and reports trust gaps; the finder records the real SHA and never rationalizes the veto.

## Impact

- **`projection/src/provenance.ts`:** reworked to read the registry, scan both skill roots, and report gaps
  (function/CLI behavior change; `provenance-check` name kept).
- **`skills/eunomai-skill-finder/SKILL.md`:** produce the registry (not sidecars); honest veto + real SHA.
- **eunomai's own skills:** delete the three `PROVENANCE.md`; add `skills/eunomai-skills-audit.md`.
- **`docs/reference/skill-finder.md`, `AGENTS.md`:** describe the registry + the multi-root check; re-project.
- **Gate:** `provenance-check` (registry) + `docs-check` stay green; `projection/` gate runs (code + tests).
- **Follow-up (separate, on the consumer project):** clean `wsl_manager` — remove the sidecars, generate its
  `.claude/skills/eunomai-skills-audit.md`, record the missing SHAs as gaps.

## Non-goals

- **Not a central curated registry** — the audit file is per-project, generated, and dispensable (lives in
  the generated output), not a global allowlist eunomai maintains.
- **Not auto-pinning via network fetch** — the finder records the SHA it actually vendored from; it does not
  silently resolve refs.
- **Not weakening the veto** — an unpinnable origin still fails; the registry enforces recording the real SHA
  and surfaces any `unpinned` gap instead of hiding it.
