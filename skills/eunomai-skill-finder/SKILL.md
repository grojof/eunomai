---
name: eunomai-skill-finder
description: Trust-gated steward for a project's skills. Use when you need a capability and want to adopt/create a skill safely, when a third-party skill should be vetted before use, or when asked to audit existing skills. Discovers candidates, applies a trust gate (security veto + judgment), adopts/improves/creates via skill-creator, and records per-skill provenance. Best-effort floor-raiser, not a security guarantee.
---

# eunomai-skill-finder

The judgment layer skill-creator omits. skill-creator authors/improves/evaluates skills; this steward decides
**which** skill to trust, **whether** to adopt/improve/create, and keeps every decision auditable via a
provenance record. It is a **best-effort floor-raiser, not a security guarantee** — safe-controls hooks are
the runtime backstop, and a determined, obfuscated skill can still slip a read.

## Two modes

- **ACQUIRE** — you need a capability: discover → gate → adopt / adopt-and-improve / create → fit pass.
- **AUDIT** — on demand and **scoped** (never a background sweep): evaluate an existing or named skill against
  the gate and write/refresh its provenance. Already-installed skills get their own verdicts: **keep** ·
  **keep-with-gaps** (gaps listed honestly) · **flag-for-removal** (veto-level problem — explain it; the
  human decides removal, you never delete).

## The trust gate

A hard veto first, then weighed judgment — mirroring safe-controls (one hard bar, the rest is judgment).

**1. Security / provenance VETO (the one hard bar — fail = reject, do not adopt):**
- Read the candidate's `SKILL.md` **and its bundled scripts/resources**. Reject on dangerous behavior:
  remote code execution (`curl … | bash`), data exfiltration, secret/credential access, or obfuscation.
- Require a **pinnable origin** — a version/SHA, and `claude plugin validate` where applicable. Unpinnable →
  reject.

**2. Weighed JUDGMENT (for candidates that pass the veto):**
- **Authorship** — who made it; track record; maintained?
- **Usage** — adoption/activity signals (not numeric thresholds — signals).
- **Quality** — does it do one thing well and fit the need? Make this **objective** where possible by running
  **skill-creator's eval/benchmark** (pass-rate, token efficiency).
- **Org trust as input** — before gating, check the project's rules (its `CLAUDE.md` + settings permissions)
  for **org-trusted sources**. Trust declared there weighs into authorship/provenance (an internal
  marketplace or repository id is an acceptable `origin`), and the entry's rubric records that org trust was
  relied on. It **never bypasses the veto** — a dangerous org-sourced skill is still rejected, and the
  conflict reported.

**Verdict** (exactly one): `adopt` · `adopt-and-improve` · `create` (ACQUIRE) — or `keep` · `keep-with-gaps` ·
`flag-for-removal` (AUDIT).

**Human confirmation.** Present the verdict and rubric **before vendoring** any third-party content into the
project; adopt only on the author's yes. (Removal, likewise, is always the human's call.)

## Acquire — delegate authoring to skill-creator

- **create / adopt-and-improve** → invoke **skill-creator** (do not reimplement authoring). Supply: the
  project's conventions, the concrete need, the criteria the user/org specified, and useful ideas harvested
  from candidates you rejected.
- **Always run a fit pass** on adopt/create: adapt `description`/triggers/scope to the project before it's done.
- If skill-creator is not installed, degrade gracefully to manual authoring guidance — never block.
- **Knowledge is not always a skill.** When a candidate's value is conceptual — good ideas, not a runnable
  procedure — route it to the docs substrate (suggest a docs note or ADR) instead of forcing a skill, and
  record the harvest in the registry narrative.

## Provenance — one audit registry, not sidecars

Record every decision in a **single** `eunomai-skills-audit.md` at the skills root — `.claude/skills/` in a
consumer project, `skills/` in the eunomai plugin. **Do not** drop a `PROVENANCE.md` into skill folders; keep
each folder to the skill itself. The registry's YAML frontmatter lists one entry per skill, plus a short run
narrative in the body:

```yaml
---
generated: <YYYY-MM-DD>
skills:
  - name: <skill dir name>
    origin: <url / marketplace id / "authored">
    ref: <real commit SHA or version | "authored" | "unpinned">
    verdict: adopt | adopt-and-improve | create | authored | keep | keep-with-gaps | flag-for-removal
    rubric: <one line across veto + authorship/usage/quality>
    gaps: []          # e.g. [unpinned] — never hide a gap behind "veto OK"
---
# eunomai skills audit
<what was searched, the verdicts, anything notable — including, for candidates evaluated and NOT adopted,
the rejection rationale and any ideas harvested from them (historical knowledge worth keeping)>
```

**Pin honestly.** When you vendor from a repo, record the **actual commit SHA** (it is available at vendor
time — `git rev-parse HEAD`). If a SHA is genuinely unavailable, set `ref: unpinned` and `gaps: [unpinned]` —
never write a rationalized "veto OK". eunomai's own skills use `origin: authored`.

Run `node "${CLAUDE_PLUGIN_ROOT}/tools/dist/cli.cjs" provenance-check` (from a source clone:
`node <clone>/tools/dist/cli.cjs provenance-check`) — it scans `.claude/skills/` and `skills/`, fails on any
skill not covered by the registry, and lists trust gaps to act on.

## Boundaries

- **Not a sandbox/scanner.** The veto is a read, not a guarantee; pair with safe-controls at runtime.
- **No *central* registry.** Judge fresh each time; the `eunomai-skills-audit.md` is a per-project, generated
  audit — not a global curated allowlist. Org-trusted sources are declared in the project's **rules** (its
  `CLAUDE.md` + settings permissions) and consumed by the gate as input — see above.
- **Plugin-delivered skills are outside the registry's scope.** Skills that arrive via installed plugins are
  trusted at the plugin/marketplace level; `provenance-check` scans only `.claude/skills/` and `skills/`.
  Say so in every audit report — never imply coverage the registry doesn't have.
- **Audit is invoked and scoped** — no background watcher.
- **Not project onboarding** — bootstrapping a whole foreign project is `eunomai-onboard` (the connector axis).
