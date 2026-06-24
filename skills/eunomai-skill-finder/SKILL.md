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
  the gate and write/refresh its provenance.

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

**Verdict** (exactly one): `adopt` · `adopt-and-improve` · `create`.

## Acquire — delegate authoring to skill-creator

- **create / adopt-and-improve** → invoke **skill-creator** (do not reimplement authoring). Supply: the
  project's conventions, the concrete need, the criteria the user/org specified, and useful ideas harvested
  from candidates you rejected.
- **Always run a fit pass** on adopt/create: adapt `description`/triggers/scope to the project before it's done.
- If skill-creator is not installed, degrade gracefully to manual authoring guidance — never block.

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
    verdict: adopt | adopt-and-improve | create | authored
    rubric: <one line across veto + authorship/usage/quality>
    gaps: []          # e.g. [unpinned] — never hide a gap behind "veto OK"
---
# eunomai skills audit
<what was searched, the verdicts, anything notable>
```

**Pin honestly.** When you vendor from a repo, record the **actual commit SHA** (it is available at vendor
time — `git rev-parse HEAD`). If a SHA is genuinely unavailable, set `ref: unpinned` and `gaps: [unpinned]` —
never write a rationalized "veto OK". eunomai's own skills use `origin: authored`.

Run `node "${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs" provenance-check` — it scans `.claude/skills/` and
`skills/`, fails on any skill not covered by the registry, and lists trust gaps to act on.

## Boundaries

- **Not a sandbox/scanner.** The veto is a read, not a guarantee; pair with safe-controls at runtime.
- **No *central* registry.** Judge fresh each time; the `eunomai-skills-audit.md` is a per-project, generated
  audit — not a global curated allowlist. Any org-trusted sources belong in the project's **rules**, not here.
- **Audit is invoked and scoped** — no background watcher.
- **Not project onboarding** — bootstrapping a whole foreign project is `eunomai-onboard` (the connector axis).
