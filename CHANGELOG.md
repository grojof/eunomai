# Changelog

All notable changes to eunomai are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Pre-1.0: minor/patch semantics are best-effort
and the public surface may still change.

## [Unreleased]

## [0.0.3] - 2026-06-25

### Added

- Living-docs **project-surface layer**: the standard now defines the community-health files (anchored to
  GitHub Community Standards) alongside the Diátaxis content tree — see
  [docs/reference/living-docs.md](docs/reference/living-docs.md).
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

[Unreleased]: https://github.com/grojof/eunomai/compare/v0.0.3...HEAD
[0.0.3]: https://github.com/grojof/eunomai/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/grojof/eunomai/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/grojof/eunomai/releases/tag/v0.0.1
