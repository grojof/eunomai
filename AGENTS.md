# eunomai — AI Agent Guide (AGENTS.md)

A focused, **Claude-first AI workspace**, packaged as a Claude Code plugin, built on existing tools (Claude
Code native + rulesync) — not reinventing them. Four pillars: SDD/SPDD, living docs, safe controls, and
trust-gated skills. See `docs/explanation/vision.md` for the charter.

This file is the **single source of truth** for AI agents working *on* eunomai. The tool-specific files
(`CLAUDE.md`, `.github/copilot-instructions.md`) are **generated** from it by the `projection/` tool — edit
rules here, not there.

## Conventions
- Files are UTF-8, newlines are LF, with a final newline at EOF.
- Conventional Commits in the imperative mood. One logical change per commit. No AI-attribution trailers.
- TypeScript, ESM, Node ≥ 20 (in `projection/`). Match the surrounding code; small functions, early returns.
- Validate inputs at boundaries; handle errors explicitly. Never weaken validation to "make it work".

## Principles (do not break)
- **Don't reinvent** — stand on Claude Code native config + rulesync; build only the tailored glue.
- **Claude-first, Copilot best-effort** — where Copilot adds gaps, go Claude-only and document it.
- **Low maintenance over reach.** Trust-gated skills are a *criteria* gate, never a hand-curated registry.
- **`AGENTS.md` is authored, never generated** (zero lock-in). Projection is delegated to rulesync.
- **Idempotency is sacred** — a second projection with unchanged inputs changes 0 files. Generated files
  (`CLAUDE.md`, `.github/copilot-instructions.md`) are **committed artifacts**.

## Structure
- `.claude-plugin/` (`plugin.json` + `marketplace.json`) + `skills/` + `hooks/` (+ `agents/`) — the Claude
  Code plugin (the deliverable; installable via the marketplace).
- `projection/` — the Copilot best-effort tool (`compile` + `compile --check`), an npm/TS package.
- `openspec/` — the SDD engine's home (changes/ · specs/ · archive/ · `config.yaml` = the eunomai layer).
- `docs/` — project-docs, **Diátaxis-organized**: `guides/` (how-to), `reference/` (per-pillar facts),
  `explanation/` (the why), `decisions/` (ADRs). All in-scope pages are indexed from the lean root
  `README.md`; `decisions/` is dev-facing and excluded from the index.
- **Using/installing eunomai:** see `docs/guides/getting-started.md` (install as a plugin + apply to a project).

## Workflow
- **SDD/SPDD runs on OpenSpec** (adopted — see `docs/decisions/0001-adopt-openspec/`). For non-trivial
  change use `/opsx:explore → /opsx:propose <name> → /opsx:apply → /opsx:archive`; artifacts live in
  `openspec/changes/<name>/`. eunomai's tailoring is in `openspec/config.yaml`. Keep it current with
  `openspec update`.
- For the projection tool: `cd projection && npm run typecheck && npm run lint && npm test` before finishing.

## Safe controls
- The plugin enforces its conventions via `PreToolUse` hooks (`hooks/hooks.json` → `hooks/guard.mjs`; pure
  logic in `hooks/decide.mjs`, tested with `node --test "hooks/*.test.mjs"`): **commit-trailer guard**
  (deny AI-attribution trailers), **safety gate** (ask before force-push / `rm -rf` / version bumps /
  secret access), and **authored-source guard** (ask before editing generated `CLAUDE.md` /
  `copilot-instructions.md`).
- **Ask-by-default, fail-open** — only the trailer rule is a hard deny; a hook error never blocks work. It
  is a floor-raiser, not a security boundary. Claude-only (Copilot has no hook API).
- Static path rules (secrets/auth) use the native `permissions` baseline, not hook code — see
  `docs/reference/safe-controls.md`.

## Living docs
- **Project-docs only**, organized by **Diátaxis** (`guides/` · `reference/` · `explanation/`); `decisions/`
  (ADRs) is dev-facing and out of the index. The README is a lean index + summary + links; depth lives under
  `docs/`, each in-scope page linked from the README. See `docs/reference/living-docs.md`.
- Refresh on demand with the **`eunomai-living-docs`** skill (human-in-control, never auto-rewrites).
- **`node projection/dist/cli.cjs docs-check`** — read-only: verifies every README→`docs/` link resolves and
  every in-scope page is indexed (exit 1 on drift). Part of the gate; enforces structure, not prose.

## Skills
- **Own skills only.** `eunomai-skill-finder` is the trust-gated steward: discover → gate → adopt / improve /
  create (authoring delegated to Anthropic's **skill-creator**) → fit pass; plus on-demand, scoped **audit**.
  See `docs/reference/skill-finder.md`.
- **Gate = security/provenance veto + weighed judgment** (authorship · usage · quality). One hard bar
  (reject), the rest judgment. Best-effort floor-raiser, **not** a guarantee — safe-controls is the runtime
  backstop. No *central* registry; org-trusted sources live in the project's rules.
- Provenance is **one** `eunomai-skills-audit.md` at the skills root (`.claude/skills/` in a project,
  `skills/` here) — not per-skill sidecars; skill folders stay clean. Record the real SHA when vendoring;
  unpinned → `gaps: [unpinned]`, never "veto OK".
  **`node projection/dist/cli.cjs provenance-check`** — read-only; scans `.claude/skills/` + `skills/`, fails
  on any skill not covered by the registry, lists trust gaps. Part of the gate.

## Base skills
- A tiny, **standards-anchored** set shipped in the base — today **`eunomai-secure-coding`** (OWASP Top 10 +
  CWE; proactive, defers diff audit to `/security-review`, complements safe-controls) and
  **`eunomai-dependency-upgrade`** (lockfile · SCA/CVE · changelog · licenses; OWASP A03:2025 + SLSA).
- **Admission filter:** a skill is base-eligible only if **universal · non-prescriptive · standards-anchored ·
  low-maintenance**. Opinionated/company-policy or domain-only practices stay out — they come via
  `skill-finder` + project rules. The base set stays small and undisputed; breadth lives in the cited standards.

## Connector / bootstrap
- `eunomai-onboard` is the **cold-start** orchestrator: analyze a new/existing project → establish docs
  (living-docs standard) → seed conventions (lean `AGENTS.md`, `openspec/config.yaml`, permissions, hooks) →
  audit skills via skill-finder → drive `docs-check` + `provenance-check` green → step aside. See
  `docs/reference/onboard.md`.
- **Establish, don't maintain** (the pillars maintain); **orchestrate, don't reimplement**; **one-shot &
  dispensable** (seeds live in the project; zero lock-in). No new check, no conformance engine — "onboarded"
  means the existing checks pass. The seed is derived from eunomai's own live conventions, not template copies.
