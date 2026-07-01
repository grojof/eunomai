# skill-finder Specification

## Purpose
Define eunomai's trust-gated skills pillar: a trust gate (a security/provenance veto plus weighed judgment that
yields a verdict), acquisition via Anthropic's skill-creator with a fit pass, on-demand auditing of existing
skills, a read-only `provenance-check`, and a single consolidated skills-audit registry per skills root. A
best-effort floor-raiser, not a guarantee — eunomai dogfoods the provenance record on its own skills.
## Requirements
### Requirement: Trust gate — security/provenance veto

The finder SHALL reject (not adopt) any candidate skill that fails the security/provenance veto: its
`SKILL.md` or bundled scripts exhibit dangerous behavior (remote code execution, data exfiltration, secret
access, obfuscation), or it has no pinnable origin (no version/SHA and it cannot be validated). The veto is
the single hard bar; everything else is judgment.

#### Scenario: A candidate runs untrusted remote code
- **WHEN** a candidate's bundled script fetches and executes remote code (e.g. `curl … | bash`) or reads
  credentials
- **THEN** the finder rejects it without adopting and explains the red flag

#### Scenario: A candidate cannot be pinned
- **WHEN** a candidate has no version/SHA and does not pass validation
- **THEN** the finder rejects it as unpinnable

#### Scenario: A candidate passes the veto
- **WHEN** a candidate has a pinnable origin and no dangerous behavior
- **THEN** it proceeds to the weighed judgment

### Requirement: Trust gate — weighed judgment and verdict

For candidates that pass the veto, the finder SHALL weigh authorship, usage, and quality (quality MAY be
measured with skill-creator's eval/benchmark) and produce exactly one verdict: **adopt**,
**adopt-and-improve**, or **create**.

#### Scenario: Strong, trustworthy fit
- **WHEN** a candidate passes the veto and is a strong, well-authored fit
- **THEN** the verdict is adopt

#### Scenario: Weak or ill-fitting candidate
- **WHEN** a candidate passes the veto but is poor, thin, or a weak fit
- **THEN** the verdict is adopt-and-improve or create

#### Scenario: No trustworthy candidate
- **WHEN** no candidate passes the gate as a usable fit
- **THEN** the verdict is create

### Requirement: Acquire via skill-creator with a fit pass

When creating or improving a skill, the finder SHALL delegate authoring to Anthropic's **skill-creator**,
supplying the project's conventions and the criteria provided by the user/org, and SHALL NOT reimplement skill
authoring. On every adopt or create, it SHALL run a fit pass that adapts the skill (at least its
description/triggers and scope) to the project.

#### Scenario: Creating a new skill
- **WHEN** the verdict is create
- **THEN** the finder invokes skill-creator with the project context and criteria and produces a tailored skill

#### Scenario: Fit pass on adoption
- **WHEN** a skill is adopted
- **THEN** the finder runs a fit pass adapting it to the project's conventions before it is considered done

### Requirement: On-demand audit of existing skills

The finder SHALL, when asked, audit existing or named candidate skills against the gate, scoped to what is
requested, and write or update their entries in the **`eunomai-skills-audit.md` registry**. It SHALL NOT run
as a background or continuous process.

#### Scenario: Auditing a skill with no registry entry
- **WHEN** the finder is asked to audit a skill that is not yet in the registry
- **THEN** it evaluates the skill against the gate and adds its entry (with the real ref or an honest gap)

#### Scenario: Audit stays scoped
- **WHEN** the finder is asked to audit a specific skill
- **THEN** it limits its work to that request and does not start a project-wide background sweep

### Requirement: provenance-check (read-only)

The plugin SHALL provide a read-only `provenance-check` that scans the skill roots (`.claude/skills/` **and**
`skills/`), verifies the `eunomai-skills-audit.md` registry **covers every skill** found, and validates each
entry's required fields. It SHALL exit non-zero on any uncovered or invalid skill, **report** any trust gaps
(e.g. `unpinned` / placeholder refs) it finds, make no changes, and run as part of the gate.

#### Scenario: A skill under .claude/skills is not covered
- **WHEN** a skill exists under `.claude/skills/` (or `skills/`) with no entry in the registry
- **THEN** the check reports the uncovered skill and exits non-zero

#### Scenario: An entry is invalid
- **WHEN** a registry entry is missing a required field
- **THEN** the check reports it and exits non-zero

#### Scenario: Covered, with gaps surfaced
- **WHEN** every skill is covered but some entries carry gaps (e.g. `unpinned`)
- **THEN** the check lists those gaps for action and (absent uncovered/invalid skills) exits zero, writing nothing

### Requirement: eunomai dogfoods provenance

eunomai's own skills SHALL be covered by a single `skills/eunomai-skills-audit.md` registry (origin
`authored`), and `provenance-check` SHALL pass on this repository as part of the gate.

#### Scenario: Check runs on the eunomai repo
- **WHEN** `provenance-check` runs against this repository
- **THEN** it exits zero with every `skills/` entry covered by the registry

### Requirement: Consolidated skills-audit registry

The finder SHALL record provenance in a **single** `eunomai-skills-audit.md` at the skills root —
`.claude/skills/` in a consumer project, `skills/` in the eunomai plugin — NOT in per-skill sidecars. Skill
folders SHALL contain only the skill's own files. The registry SHALL list, per skill: `name`, `origin`, `ref`
(a real commit SHA / version, or `authored`), `verdict`, `rubric`, and `gaps`; plus a short run narrative.

#### Scenario: Adoption writes a registry entry, not a sidecar
- **WHEN** a skill is adopted or created
- **THEN** its entry is written/updated in `eunomai-skills-audit.md`, and **no** `PROVENANCE.md` is added to
  the skill folder

#### Scenario: Vendored skills record the real SHA, gaps are honest
- **WHEN** a skill is vendored from a repository
- **THEN** the entry records the actual commit SHA; if a SHA is genuinely unavailable, `ref` is `unpinned` and
  `gaps` includes `unpinned` — never a rationalized "veto OK"

### Requirement: Rejected candidates leave a durable trace

The registry's run narrative SHALL record, for candidates that were evaluated and not adopted, the
**rejection rationale** and any **ideas harvested** from them (historical-domain knowledge). When a
candidate proves to be *knowledge* rather than *procedure* — good ideas, not a runnable skill — the finder
SHALL route it toward the docs substrate (a docs note or ADR suggestion) instead of forcing a skill.

#### Scenario: A rejection is recorded with its why
- **WHEN** a candidate is evaluated and rejected or passed over
- **THEN** the registry narrative records what was evaluated, why it was not adopted, and any harvested ideas

#### Scenario: Knowledge routes to docs, not to a forced skill
- **WHEN** a candidate's value is conceptual (ideas worth keeping) rather than procedural
- **THEN** the finder suggests capturing the ideas in the docs substrate and does not author a skill for them

### Requirement: Org-trusted sources are an input to the gate

The finder SHALL consult the project's rules (per the coexistence contract's definition) for **org-trusted
sources** before gating a candidate. A candidate from an org-trusted source still passes through the gate,
but the org's trust is weighed as provenance context (e.g. an internal marketplace or repository identifier
is an acceptable `origin`), and the registry entry SHALL record that the org trust was relied on. Org trust
SHALL NOT silently pre-clear a candidate past the security veto.

#### Scenario: Candidate from an org-trusted source
- **WHEN** a candidate comes from a source the project's rules declare trusted
- **THEN** the finder records the org trust in the entry's rubric and still checks for dangerous behavior

#### Scenario: Org trust does not bypass the veto
- **WHEN** an org-trusted candidate exhibits dangerous behavior
- **THEN** the finder rejects it and reports the conflict to the author

### Requirement: Audit verdicts for already-installed skills

When auditing skills that are **already installed**, the finder SHALL use an audit verdict vocabulary —
**keep**, **keep-with-gaps** (recorded in `gaps`), or **flag-for-removal** — instead of the acquisition
verdicts. Removal SHALL be the human's decision; the finder only flags and explains.

#### Scenario: Installed skill fails the gate
- **WHEN** an audit finds an installed skill with a veto-level problem
- **THEN** the verdict is flag-for-removal with the reason, and the finder does not delete it

#### Scenario: Installed skill passes with gaps
- **WHEN** an installed skill passes the veto but has an unpinned ref or thin provenance
- **THEN** the verdict is keep-with-gaps and the gaps are listed honestly in the registry

### Requirement: Human confirmation before vendoring

The finder SHALL present its verdict and rubric and obtain the author's confirmation **before** vendoring
third-party skill content into the project. Adoption without a human yes SHALL NOT happen.

#### Scenario: Adoption is confirmed
- **WHEN** the gate yields an adopt / adopt-and-improve verdict
- **THEN** the finder shows the verdict + rubric and vendors the skill only after the author confirms

### Requirement: Plugin-delivered skills are a stated coverage boundary

Audit reports and the registry narrative SHALL state honestly that skills delivered by **installed plugins**
are outside the registry's scope — they are trusted at the plugin/marketplace level, not scanned by
`provenance-check`. The finder SHALL NOT claim audit coverage over them.

#### Scenario: Audit report names the boundary
- **WHEN** the finder completes an audit in a project that has plugin-delivered skills
- **THEN** the report notes those skills are covered by plugin/marketplace trust, not by the registry

