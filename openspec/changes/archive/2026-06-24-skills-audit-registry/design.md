## Context

The skill-finder pillar recorded trust as a `PROVENANCE.md` sidecar in every skill folder, verified by
`provenance-check` scanning top-level `skills/`. A real run on a Flutter project (`wsl_manager`) broke all
three assumptions: consumer skills live in **`.claude/skills/`** (so the check found 0 and passed vacuously);
21 injected sidecars made the folders "dirty"; and entries recorded `ref: vendored (SHA no registrado)` with
`rubric: veto OK`, rationalizing the pinnability veto. The fix is a single consolidated, honest **audit
registry** per project.

## Goals / Non-Goals

**Goals:**
- One `eunomai-skills-audit.md` registry per skills root; clean skill folders.
- A check that actually covers `.claude/skills/`, enforces coverage, and surfaces trust gaps to act on.
- An honest finder that records the real SHA and never rationalizes the veto.

**Non-Goals:**
- A central curated registry; auto-pinning via network fetch; weakening the veto.

## Decisions

### Decision 1 — One consolidated registry, not per-skill sidecars

Provenance moves to a single `eunomai-skills-audit.md` at the skills root. Skill folders hold only the skill.

- *Why over alternatives:* the sidecar's one merit — "provenance travels with the skill" — is irrelevant for
  project-level governance and not worth polluting 21 third-party folders. One file is reviewable, is the run
  audit the user asked for, and keeps folders clean.

### Decision 2 — Scan both skill roots: `.claude/skills/` and `skills/`

The check (and the finder) operate on `.claude/skills/` (consumer projects) **and** `skills/` (the eunomai
plugin). Each root has its own registry.

- *Why over alternatives:* hardcoding `skills/` was the root cause of the vacuous pass. eunomai itself is a
  plugin (`skills/`); everyone else is a consumer (`.claude/skills/`).

### Decision 3 — Registry = Markdown + YAML frontmatter; reuse yaml + zod

`eunomai-skills-audit.md` carries a YAML frontmatter `skills:` list (`name`, `origin`, `ref`, `verdict`,
`rubric`, `gaps[]`) plus a prose run narrative. The check parses the frontmatter with the existing `yaml` +
`zod` stack.

- *Why over alternatives:* a `.log` is write-only noise; pure YAML is less readable. Markdown-with-frontmatter
  is both human-reviewable (it's an audit) and machine-checkable.

### Decision 4 — Coverage is the hard gate; gaps are surfaced, not silently fatal

`provenance-check` exits non-zero when a skill is **uncovered** or an entry is **invalid**. Trust **gaps**
(e.g. `ref: unpinned`) are **reported** for action but do not by themselves fail the gate.

- *Why over alternatives:* the original sin was a check with no teeth (vacuous pass). Coverage gives teeth;
  gaps are a judgment call the human/finder resolves (record the SHA) — surfacing them is exactly the
  "audit + record to take actions" the user wants. Hard-failing every unpinned vendor skill would be too
  blunt; hiding them is what we are fixing.

### Decision 5 — Honest veto in the finder; keep the `provenance-check` command name

The finder records the **real commit SHA** it vendored from; if genuinely unavailable, `ref: unpinned` +
`gaps: [unpinned]` — never "veto OK". The CLI command stays `provenance-check` (it still checks provenance) to
avoid churn.

## Risks / Trade-offs

- **Gaps non-fatal could let unpinned slide** → accepted by design: the registry + check *surface* it for
  action; coverage is the enforced floor. A later `--strict` could fail on gaps if needed.
- **Both roots present** → handled independently; eunomai has only `skills/`, consumers only `.claude/skills/`.
- **Losing per-skill provenance "travel"** → governance is project-level; the registry is the right grain.
- **Low-maintenance check:** one registry format + a reworked check + skill text; no new deps, no central
  registry.
