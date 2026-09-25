# Changelog

All notable changes to eunomai are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Pre-1.0: minor/patch semantics are best-effort
and the public surface may still change.

## [Unreleased]

### Changed

- **The README is a map again.** It gives what eunomai brings a project, two diagrams (the architecture, and
  which pillar handles what once a project is onboarded), the quickstart with the update commands, and an
  "I want to…" index that reaches every page.
- **The pillars' flows are drawn.** The SDD cycle, onboard, the skill trust gate and the guard's decision each
  have a compact diagram in the same semantic colours the living-docs standard describes. Onboard's flow
  replaces a text block, and its details become a numbered list. The codebase-cartographer agent reuses a
  project's colour classes when it proposes a diagram.
- **The codebase-cartographer agent is leaner.** It keeps its output contract (the comprehension map,
  per-edge confidence, domain signals, one proposed diagram) and drops the step-by-step reading recipe and
  its fixed manifest list, which missed ecosystems such as Dart or PHP. Its tools are read-only (no
  shell), and architecture is drawn as C4 levels in a flowchart, because Mermaid's C4 syntax is experimental. It
  tags an edge it knows only from the project's docs as `documented`, and lists the doc–code differences it
  meets in passing.

## [0.6.0] - 2026-09-25

### Added

- **Guard levels and gate ids.** `critical`, `standard` (default) and `strict`, and every gate can be set on
  its own to `off`, `ask` or `deny`. New gate: `reset-hard`.
- **Layered configuration.** `/config` options (`level`, `mode`), a committed `.claude/eunomai.json` that
  may only tighten, and a gitignored `.claude/eunomai.local.json` that may relax anything. `EUNOMAI_*`
  variables keep working.
- **`hooks/guard.mjs --check` and `--hits`**, a report-only mode, and a hit log that never stores the
  command.
- **An AI-attribution policy.** The guard always refuses an AI co-author line. It asks for a minimal
  `Assisted-by: <tool>` disclosure where the project wants one (pull requests by default, commits on
  request), and asks when a disclosure names the model rather than the tool.
- **The `eunomai-safe-controls` skill.** It shows the effective settings and recent hits, reads a project's
  contribution rules for its attribution policy, and proposes a configuration and Claude Code's
  `attribution` setting. It writes nothing until the user confirms.

### Changed

- **`AGENTS.md` is the instruction file** (ADR-0007, superseding that point of ADR-0004). eunomai's own
  `CLAUDE.md` is now `AGENTS.md`, which Claude Code reads natively from 2.1.277. Onboard seeds `AGENTS.md`
  and offers to migrate a project's `CLAUDE.md`: a rename with the content unchanged, a warning when both
  exist, and a one-line `@AGENTS.md` bridge for older Claude Code. `CLAUDE.local.md` stays.
- **`docs-check` follows the link graph.**
  - A page is reachable through other docs pages, so nested indexes (`docs/<area>/README.md`) pass.
  - Links inside pages and in `AGENTS.md` / `CLAUDE.md` are checked.
  - **BREAKING:** broken links inside pages and in `AGENTS.md` / `CLAUDE.md` now fail the check, so a
    repository that passed may turn red on a stale link; code spans, fences and HTML comments are ignored.
  - **BREAKING:** missing community-health files are warnings, and fail only with `--require-health`,
    which eunomai's own CI passes.
  - Reference-style, HTML and root-absolute (`/docs/…`) links are followed, and a folder index may be named
    `readme.md`.
  - **BREAKING (output):** the messages read "orphaned page (not reachable from the README)" and
    "N README link(s) resolve, N page(s) reachable"; health warnings go to stderr.
- **The living-docs skill runs a short core flow.** Doc-set profiles, structure options, the interview,
  knowledge-domain coverage and activation routing moved to `references/lenses.md`, applied on request or
  when docs are being established.
- **The living-docs standard leads with its five-rule core.** It also:
  - says folders by area are fine;
  - adds Mermaid colour guidance;
  - states the OKF alignment precisely;
  - anchors `CHANGELOG.md` to Keep a Changelog.
- **Onboard no longer copies hook scripts into a project.** The hooks come from the installed plugin, from
  a source clone through a local marketplace, and onboard offers the guard and attribution setup through
  `eunomai-safe-controls`.
- **The guard reads commands, not text.** Quoted data, heredoc bodies and redirections no longer trigger
  a gate; `sh -c`, `eval` and friends are still read as code.
  - Recursive deletes ask only for a scope whose loss cannot be a clean-up: a root, a system or home-level
    directory, credentials, the whole project, or a protected path.
  - Secrets ask only when a secret file is read or written.
  - `--force-with-lease`, version bumps and word-level secret matches move to `strict`.
  - Replayed over 5,087 real shell calls, prompts and denials fell from 216 to 25.
- **Every prompt names its gate**, a safer form, and how to stop it asking.
- **Secrets ask on reading only.** Writing a `.env` leaks nothing, and a `grep` pattern is not a file.
- **The guard protects itself.** A shell command writing its settings asks, a committed `.local.json` may
  only tighten, an extra gate that could backtrack for ever is refused, and the hook has a 10-second
  timeout.

### Fixed

- **`provenance-check` accepts the audit verdicts** (`keep` · `keep-with-gaps` · `flag-for-removal`) that
  skill-finder records for installed skills; a registry written by an audit no longer fails the gate.
- **The trailer deny names the trailer it found**, as the safe-controls spec requires.
- **Docs match what ships.** SECURITY no longer claims the permissions baseline is on by default (it is an
  opt-in copy); the `/opsx:*` commands are described as OpenSpec's, not the plugin's; the plugin is
  described without commands; the ADR list includes 0006; the safe-controls spec no longer mentions the
  retired authored-source guard.
- **The repo's own hook wiring** covers `Bash|PowerShell` and drops the dead `Edit|Write` matcher; the skills
  registry attests 0.5.0.

## [0.5.0] - 2026-07-09

### Added

- **Doc-set profiles by repo destination** (living-docs): a canonical catalog inside the
  `eunomai-living-docs` skill (`references/doc-profiles.md`) — **library/SDK · service/API · CLI tool ·
  framework/platform · firmware/embedded · end-user app/internal tool**, plus a first-class **custom** option
  with one-at-a-time follow-ups. Each profile is a visible preview (README skeleton + starter `docs/` pages
  with their Diátaxis `type`s) offered through the structured interview with a default recommended from
  detected signals; skippable, presets over the unchanged v2 standard (the gate stays shape-only), and stood
  down where an incumbent docs standard governs. onboard's establish-docs step delegates to the same catalog
  (profile decisions may crystallize into ADRs).
- **README quality bar + prose register** (living-docs): the root README is required to stay user-friendly
  regardless of profile (what · for whom · why · a diagram when it helps; technical depth in `docs/`), and
  all authored doc prose uses a self-contained, timeless register — no conversational/session references, no
  meta-commentary, no filler. Surfaced as a fourth review lens; never a `docs-check` rule.
- **Same-pass README↔docs sync** (living-docs): adding, removing, or renaming a `docs/` page updates the
  README map in the same set of edits; `docs-check` remains the deterministic backstop.

## [0.4.0] - 2026-07-02

### Added

- **Coexistence contract** (org-coexistence): eunomai is now explicitly a **removable complement** to an
  existing personal/org layer — additive, incumbent-wins-on-conflict, detect-before-seeding, and the
  project's rules as input to every gate. Canonical home: the new [docs/org-adoption.md](docs/org-adoption.md)
  (rollout via managed settings/marketplaces, pinning, extension seams, removal), plus a `CLAUDE.md`
  principle. onboard gains a **coexistence assessment** with per-seed opt-out (OpenSpec is the default SDD
  engine only where none exists; an existing `CLAUDE.md` is merged into, never replaced) and carries the
  canonical activator block inline; `workspace-survey` enumerates existing governance; skill-finder gains
  org-trust gate input, audit verdicts (`keep` · `keep-with-gaps` · `flag-for-removal`), human confirmation
  before vendoring, and an honest plugin-skill coverage boundary; living-docs gains org-owned routing,
  foreign-frontmatter coexistence, and the ADR create-vs-edit boundary.
- **Safety-gate org override seam** (fail-open, no fork): `EUNOMAI_TRAILER_RULE` (`deny`|`ask`|`off`) and
  `EUNOMAI_EXTRA_GATES` (JSON gate list), settable via managed settings.
- **KDD across the pillars** (kdd-native): the from-scratch onboard interview is scaffolded by the six
  knowledge domains; `codebase-cartographer` maps **domain signals** (observed, not assessed);
  `coherence-auditor` reports a facts-only domain-coverage line; the base skills end with a
  decision-capture step (trust boundaries, CVE waivers); skill-finder records rejection rationale +
  harvested ideas in the registry narrative.
- Minimal **CI** (GitHub Actions): tools typecheck/lint/test + dist-freshness, hooks tests, and both checks.
- `--version` on the checks CLI (injected at build; `tools/package.json` now versioned with the plugin and
  `private`).

### Fixed

- **Safe-controls guard**: the PowerShell tool is now routed through the guard (was a whole-channel bypass
  on Windows); `git -C`/`-c` global options no longer skip the trailer/push rules; force-push short/refspec
  forms, split/long `rm` flags, `git clean -f`, `Remove-Item -Recurse -Force`, and `id_ed25519` are gated;
  `process.env` and `credential.helper` false positives removed; the dead `Edit|Write` matcher dropped.
- **Checks CLI**: UTF-8 BOMs no longer break the frontmatter gate; titled/percent-encoded links resolve;
  broken symlinks are skipped; `provenance-check` flags stale registry entries and duplicate names.
- **Docs drift**: getting-started (public marketplace, `tools/` not `projection/`, all five skills,
  update/pinning notes), refresh-living-docs rewritten to v2 (dead command and Diátaxis-folder table
  removed), vision/status refreshed, `skills/README.md` provenance-model fix, ADR-0004 typo, ADR-0003
  superseded-in-part note, honest `${CLAUDE_PLUGIN_ROOT}` guidance + a working CI recipe in checks.
- `eunomai-secure-coding` re-anchored to **OWASP Top 10:2025** with explicit year tags (its A03 numbering
  no longer collides with `eunomai-dependency-upgrade`'s A03:2025 anchor).

### Changed

- Plugin metadata: `plugin.json` gains `homepage`/`repository`/`license`; the marketplace entry declares
  `version` + `license`. Release tags are the pinnable refs (`v0.3.0` backfilled; `v0.4.0` cut).
- The authored-skills registry now pins `ref` to the attested plugin version and carries the
  evaluated-and-rejected history (rationale + harvested ideas).

## [0.3.0] - 2026-06-26

### Added

- **KDD knowledge-domain capture lens** (living-docs): a second, orthogonal axis — the six knowledge domains
  (business · product · technical · operational · historical · AI-ready) from the AWS Builder KDD article —
  applied by the `eunomai-living-docs` skill as a **coverage lens** alongside the seven KDD principles, plus an
  explicit **ownership** and **doc↔code drift** framing (the latter reusing the existing `coherence-auditor`).
  Adopted as a **lens only**: no new frontmatter field, no `docs-check` rule, no scope cascade / multi-tool
  projection, no toolkit — consistent with ADR-0002 (KDD as a lens) and ADR-0004 (Claude-only). Adds two
  requirements to the `living-docs` spec.

## [0.2.0] - 2026-06-25

### Changed

- **Docs single-source-of-truth** (ADR-0006): adopt *one fact, one home — everything else links* as the
  governing living-docs principle; add an "earns its place" test + an anti-duplication lens to the skill.
  Cleaned eunomai's own docs — merged the duplicated `CONTRIBUTING.md` into one, merged the `checks` reference
  and `run-the-checks` how-to into a single page, and removed the empty Diátaxis leftover folders (14 → 12
  pages). Also added: the living-docs/onboard skills now **propose** the docs folder structure (2–3 options,
  default by size) instead of assuming it (ADR-0005 follow-up).
- **Living-docs v2** (ADR-0005): Diátaxis becomes a **lens** via a `type` frontmatter field (not a folder
  mandate); docs gain an **OKF-routable substrate** (frontmatter + path-as-identity + link-graph); the README
  becomes a **product-shaped map** with an architecture diagram; and `docs-check` gains a **deterministic
  frontmatter-shape gate** (AI coherence-auditing stays out of the gate). Piloted on eunomai's own docs —
  frontmatter on every page, a new README map, and the first architecture diagram (closing the zero-diagram
  dogfooding gap).

## [0.1.0] - 2026-06-25

### Changed

- **Reoriented to Claude-only** (ADR-0004): Claude Code is the only host and **OpenSpec** is the sole external
  dependency. `CLAUDE.md` is now the single authored instruction source.
- Renamed the `projection/` package to `tools/` — a read-only checks CLI (`docs-check`, `provenance-check`).
  Decision records: ADR-0003 (OKF / open substrate), ADR-0004 (Claude-only).

### Removed

- The Copilot best-effort surface: the `rulesync` dependency, `eunomai.yaml`, the generated
  `.github/copilot-instructions.md`, and the `compile` / `compile --check` projection commands.
- The safe-controls **authored-source guard** — moot once there is no generated instruction file.

### Added

- onboard now seeds a self-sufficient **activator block** into the project's `CLAUDE.md` (principle-level base
  disciplines pointing to the skills as accelerators) — see [docs/onboard.md](docs/onboard.md).
- Two read-only subagents — **`codebase-cartographer`** (comprehension + an "at a glance" Mermaid/C4 diagram)
  and **`coherence-auditor`** (a one-shot doc↔code coherence report) — delegated from onboard and living-docs,
  mirroring `workspace-survey`.

### Security

- Upgraded the `tools/` dev toolchain (`vitest` 2→4, `vite` 5→8, `esbuild` → 0.27.7), clearing the critical /
  high / moderate advisories in the test chain. The remaining single **low** advisory affects only the esbuild
  dev-server (never run here) and is not in the shipped bundle (which inlines only `yaml` + `zod`).

## [0.0.3] - 2026-06-25

### Added

- Living-docs **project-surface layer**: the standard now defines the community-health files (anchored to
  GitHub Community Standards) alongside the Diátaxis content tree — see
  [docs/living-docs.md](docs/living-docs.md).
- Community-health files: `LICENSE` (MIT), `SECURITY.md`, `CONTRIBUTING.md`, and this `CHANGELOG.md`.
- Reference pages for previously undocumented pillars/components: `sdd`, `base-skills`, `projection`.
- How-to guides: `manage-skills`, `refresh-living-docs`, `run-the-checks`, `contributing`.
- Explanation: the **KDD lens** (eunomai as a knowledge-activation spectrum) + ADR 0002.

### Changed

- `docs-check` now also verifies the mandatory community-health files are present (fails if any is missing),
  in addition to README↔`docs/` link and index integrity. **This can make a previously-green gate fail** for
  projects missing these files.
- `README.md` index reorganized into Guides (how-to) and Reference (one page per pillar/component); base
  skills surfaced.

## [0.0.2] - 2026-06-25

### Added

- **Base skills** (standards-anchored): `eunomai-secure-coding` (OWASP Top 10 + CWE) and
  `eunomai-dependency-upgrade` (OWASP A03:2025 + SLSA).
- **Skills audit registry**: one `eunomai-skills-audit.md` at the skills root, plus the `provenance-check`
  command that fails on any skill not covered by the registry.

## [0.0.1] - 2026-06-24

### Added

- Installable Claude Code **plugin** via a git marketplace, with a coherent getting-started guide.
- Self-contained **projection CLI** shipped as a pre-built bundle (`projection/dist/cli.cjs`) — no build step
  for consumers (`compile`, `compile --check`, `docs-check`).
- Project docs **restructured by Diátaxis** (`guides/` · `reference/` · `explanation/` · `decisions/`);
  dev-docs dropped in favour of OpenSpec for SDD artifacts.

[Unreleased]: https://github.com/grojof/eunomai/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/grojof/eunomai/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/grojof/eunomai/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/grojof/eunomai/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/grojof/eunomai/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/grojof/eunomai/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/grojof/eunomai/releases/tag/v0.1.0

The 0.0.x entries predate release tagging; they are kept above as history without compare links.
