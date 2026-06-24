## Context

Skills are open text + code in a folder (`SKILL.md` + optional scripts/resources) — inspectable, not opaque
binaries — but the format carries no trust or provenance metadata. Anthropic's **skill-creator** (verified) is
a strong meta-skill for *authoring*: create, edit/improve existing, eval/benchmark (pass-rate, timing,
tokens), and description-optimization — but it explicitly does **not** do sourcing, adoption, trust,
provenance, or security audit. eunomai already has the matching infrastructure to build on: the existing
`projection/` Node/TS package with a read-only `--check` pattern (now `compile --check` + `docs-check`), the
safe-controls `PreToolUse` hooks (a runtime backstop), and a uniform "guided skill + thin deterministic check"
shape across pillars. This pillar fills the exact gap skill-creator leaves.

## Goals / Non-Goals

**Goals:**
- A trust-gated skill lifecycle steward (`eunomai-skill-finder`): discover → gate → adopt/improve/create →
  fit pass, plus on-demand audit.
- A decentralized, per-skill provenance record and a deterministic `provenance-check` that joins the gate.
- Reuse skill-creator for all authoring; dogfood on eunomai's own skills.

**Non-Goals:**
- A security guarantee, sandbox, or malware scanner; a curated registry/allowlist; reimplementing
  skill-creator; continuous/background auditing; the project onboarding/bootstrap (the `eunomai-onboard`
  axis); maintaining the org's trusted-source list.

## Decisions

### Decision 1 — Reuse skill-creator + provenance primitives + safe-controls; build only the gate, the record, and the check (reuse-first)

skill-creator owns authoring (create/improve/eval); Claude Code marketplaces own provenance signals (SHA-pin,
`author`, `claude plugin validate`); safe-controls owns runtime defense; `projection/` owns the `--check`
pattern. eunomai's net-new is only the **trust gate** (security veto + judgment), the **provenance record +
schema**, the **`provenance-check`**, and the **acquire/audit playbook** that orchestrates skill-creator.

- *Why over alternatives:* a self-built creator/evaluator would duplicate a mature, verified tool; a security
  scanner or sandbox is the abandoned-tower trap. The verified scope split (skill-creator skips
  sourcing/trust/provenance) makes the boundary clean and the reuse total.

### Decision 2 — Trust gate = one hard security/provenance veto + weighed judgment

Mirroring safe-controls (one hard deny, the rest ask): the **veto** is the single objective bar — read the
candidate's `SKILL.md` + scripts for dangerous behavior, and require a pinnable origin. The other axes
(authorship, usage, quality) are weighed judgment, with **quality made partly objective** by running
skill-creator's eval/benchmark. Output is one of three verdicts (adopt / adopt-and-improve / create).

- *Why over alternatives:* numeric thresholds ("≥N stars") are arbitrary and rot; a pure-judgment gate has no
  floor. A hard veto + judgment gives an objective security floor without a brittle scoring system.

### Decision 3 — Provenance as a decentralized per-skill sidecar, not a registry

Each `skills/<name>/` carries a `PROVENANCE.md` sidecar (YAML frontmatter): `origin`, `ref` (version/SHA or
`authored`), `date`, `verdict`, `rubric` notes, and `modifications`. It travels with the skill — provenance
lives in the generated output, not in a central list eunomai maintains.

- *Why over alternatives:* a central registry is exactly the maintenance trap the project avoids elsewhere.
  Per-skill sidecars are zero-central-maintenance, auditable, and consistent with "everything lives in the
  generated output / dispensable".

### Decision 4 — `provenance-check` in `projection/`, validating the sidecar schema

Implemented in `projection/` as a `provenance-check` command, reusing tsup/eslint/vitest and the existing
`yaml` + `zod` stack to validate each sidecar's required fields. Read-only, non-zero on a missing/invalid
record, joins the gate alongside `docs-check`.

- *Why over alternatives:* a second package or standalone script duplicates the toolchain. zod already
  validates `eunomai.yaml`; reusing it for the provenance schema is cheap and consistent.

### Decision 5 — Audit is invoked and scoped; safe-controls is the runtime backstop

Auditing runs only when asked and only over the requested scope — never a background watcher (which would be
the cross-project sync trap). Because the gate is best-effort (obfuscated malice can pass a read), the
safe-controls hooks catch dangerous behavior at execution time: the pillars defend each other.

## Risks / Trade-offs

- **Best-effort, not a guarantee** (obfuscated malice can pass a read) → documented as a floor-raiser;
  safe-controls is the runtime backstop; the veto + provenance record make decisions auditable.
- **Judgment is non-deterministic** → the deterministic teeth (`provenance-check`) guarantee *coverage*, and
  the per-skill record makes each judgment inspectable; the rubric is documented in the skill.
- **skill-creator availability** → it is an installed Anthropic skill; if absent at use time, degrade to
  manual authoring guidance rather than failing. Confirm presence when the create branch runs.
- **Provenance busywork** → keep required fields minimal; authored skills are one trivial record
  (`origin: authored`).
- **Scope creep toward onboarding/registry** → explicit non-goals; the onboarding orchestrator is the separate
  `eunomai-onboard` axis.
- **Low-maintenance check:** one skill + one check command on the existing gate + a small zod schema; no
  registry, no scanner, no background process.
