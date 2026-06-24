## Why

Bringing third-party skills into a project is a real risk surface. A skill grabbed off the internet (say a
"TypeScript helper") can ship malicious bundled scripts, be trivially poor, or simply not fit the project —
and the skill format carries no trust or provenance metadata. Anthropic's **skill-creator** is excellent at
*authoring* skills but, by its own scope, does not do sourcing, trust, provenance, or security audit. eunomai
needs the missing **judgment layer**: decide whether to adopt, improve, or create a skill; audit existing
skills on demand; and keep every adoption auditable. It is a best-effort floor-raiser, not a security
guarantee — paired with safe-controls as the runtime backstop.

## What Changes

- Add an **`eunomai-skill-finder`** skill (a playbook, not infrastructure) with two modes:
  - **ACQUIRE** — discover candidates → **trust gate** → adopt / adopt-and-improve / create → a fit-improve
    pass that adapts the skill to the project's conventions.
  - **AUDIT** — on demand (scoped, never a background watcher), evaluate existing or candidate skills against
    the same gate and ensure each has a provenance record.
- **Trust gate = security/provenance veto + weighed judgment.** The veto (the one hard bar) reads the skill's
  actual `SKILL.md` and bundled scripts for dangerous behavior and requires a pinnable origin
  (`claude plugin validate` / SHA). The weighed axes are authorship, usage, and quality — quality made partly
  *objective* via skill-creator's eval/benchmark.
- **Per-skill provenance record** (a sidecar in each `skills/<name>/`): origin, version/SHA, date, verdict,
  rubric notes, and any modifications. Uniform across every project skill, including eunomai's own
  (`origin: authored`).
- Add a **`provenance-check`** (deterministic, read-only, in `projection/`): every skill under `skills/` has a
  valid provenance record. Joins the gate; parallels `docs-check`.
- **Dogfood**: give eunomai's own skills (`eunomai-living-docs`, `eunomai-skill-finder`) provenance records so
  the repo passes its own `provenance-check`.
- **Reuse vs net-new (connector-first):** *reuse* Anthropic **skill-creator** (create / improve / eval /
  benchmark / description-optimization), the Claude Code skill mechanism + marketplace provenance (SHA-pin,
  author, `validate`), **safe-controls** (runtime defense-in-depth), and the projection `--check` pattern.
  eunomai's *net-new* glue is only: the **trust gate** (security veto + judgment rubric), the **provenance
  record + its schema**, the **`provenance-check`**, and the **acquire/audit playbook** that orchestrates
  skill-creator.

## Capabilities

### New Capabilities
- `skill-finder`: a trust-gated skill lifecycle steward — discover, gate (security veto + judgment), adopt /
  improve / create (via skill-creator), audit on demand, and a per-skill provenance record enforced by a
  read-only `provenance-check`.

### Modified Capabilities
<!-- None — `safe-controls` and `living-docs` are unaffected (this composes with them). -->

## Impact

- **New:** `skills/eunomai-skill-finder/SKILL.md`; a `provenance-check` in `projection/` + tests; provenance
  sidecars for existing own skills.
- **`AGENTS.md`:** document the pillar, the provenance record, and `provenance-check` (re-projected, idempotent).
- **Gate:** `provenance-check` joins `typecheck && lint && test && docs-check`.
- **Trusted sources**, if any, live in the user/org **project rules**, not in eunomai (no registry, no catalog).
- **No new runtime dependencies**; the gate logic stays in the existing `projection/` package.

## Non-goals

- **Not a security guarantee, sandbox, or full malware scanner** — best-effort floor-raising; obfuscated
  malice can pass a read, which is why safe-controls is the runtime backstop.
- **Not a curated registry / allowlist** of approved skills (the maintenance trap) — fresh judgment + the
  decentralized provenance record instead.
- **Not reimplementing skill-creator** — adopt it for authoring/improving/evaluating.
- **Not continuous or background auditing** — auditing is invoked and scoped.
- **Not the project onboarding/bootstrap** (analyze + restructure a whole foreign project) — that is the
  `eunomai-onboard` connector axis, a separate later change that *invokes* this skill.
- **Not maintaining the org's trusted-source list** — that is the org's project rules.
