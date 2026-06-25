---
generated: 2026-06-25
skills:
  - name: openspec-apply-change
    origin: "@fission-ai/openspec (openspec init)"
    ref: 1.4.1
    verdict: adopt
    rubric: Scaffolded by `openspec init` from the OpenSpec CLI — the SDD engine eunomai adopted; trusted tool, pinned to the installed version.
    gaps: []
  - name: openspec-archive-change
    origin: "@fission-ai/openspec (openspec init)"
    ref: 1.4.1
    verdict: adopt
    rubric: Scaffolded by `openspec init`; same OpenSpec CLI source and version.
    gaps: []
  - name: openspec-explore
    origin: "@fission-ai/openspec (openspec init)"
    ref: 1.4.1
    verdict: adopt
    rubric: Scaffolded by `openspec init`; same OpenSpec CLI source and version.
    gaps: []
  - name: openspec-propose
    origin: "@fission-ai/openspec (openspec init)"
    ref: 1.4.1
    verdict: adopt
    rubric: Scaffolded by `openspec init`; same OpenSpec CLI source and version.
    gaps: []
  - name: openspec-sync-specs
    origin: "@fission-ai/openspec (openspec init)"
    ref: 1.4.1
    verdict: adopt
    rubric: Scaffolded by `openspec init`; same OpenSpec CLI source and version.
    gaps: []
  - name: diagnosing-bugs
    origin: "https://github.com/mattpocock/skills (skills/engineering/diagnosing-bugs)"
    ref: 5d78bd0903420f97c791f834201e550c765699f8
    verdict: adopt-and-improve
    rubric: "Veto pass — SKILL.md + scripts/hitl-loop.template.sh benign (set -euo pipefail; no curl|bash, exfil, or secret access). Strong authorship (Matt Pocock, maintained) + quality (feedback-loop-first debugging discipline). Fit pass: CONTEXT.md->AGENTS.md/CLAUDE.md, softened sibling-skill references."
    gaps: []
---

# eunomai skills audit (`.claude/skills/`)

These skills are scaffolded by `openspec init` from the **OpenSpec CLI** (`@fission-ai/openspec` 1.4.1) — the
SDD engine eunomai adopted (see [`../../docs/decisions/0001-adopt-openspec/`](../../docs/decisions/0001-adopt-openspec/)).
They are tool-managed; `openspec update` may refresh them. Origin is the OpenSpec CLI, pinned to the installed
version — no trust gaps. eunomai's *own* skills are audited separately in `skills/eunomai-skills-audit.md`.

**`diagnosing-bugs`** is a **third-party, dev-time** skill vendored from
[`mattpocock/skills`](https://github.com/mattpocock/skills) (engineering/diagnosing-bugs) via
`eunomai-skill-finder` on 2026-06-25. It lives here in `.claude/skills/` (used while developing eunomai),
**not** in the plugin's `skills/` — that root is eunomai's own (`eunomai-*`) skills only. Veto passed on the
`SKILL.md` and the bundled `scripts/hitl-loop.template.sh`; pinned to the real commit SHA; a fit pass adapted
the `CONTEXT.md` convention to `AGENTS.md`/`CLAUDE.md` and softened references to Matt's sibling skills that
are not adopted here. Best-effort floor-raiser, not a guarantee — safe-controls is the runtime backstop.
