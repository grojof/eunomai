# Changelog

All notable changes to eunomai are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Pre-1.0: minor/patch semantics are best-effort
and the public surface may still change.

## [Unreleased]

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

[Unreleased]: https://github.com/grojof/eunomai/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/grojof/eunomai/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/grojof/eunomai/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/grojof/eunomai/compare/v0.0.3...v0.1.0
[0.0.3]: https://github.com/grojof/eunomai/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/grojof/eunomai/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/grojof/eunomai/releases/tag/v0.0.1
