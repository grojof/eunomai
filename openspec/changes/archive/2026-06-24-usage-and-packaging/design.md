## Context

All pillars are shipped and dogfooded in this repo, but eunomai is only usable *here*: there is no
`marketplace.json` (so it can't be installed elsewhere) and no end-to-end usage guide (the docs are
reference-per-pillar). Claude Code's plugin system is the native install mechanism: a marketplace is a git
repo (or local path) with a `.claude-plugin/marketplace.json` cataloguing plugins; the eunomai repo root is
itself one plugin (`.claude-plugin/plugin.json`). A verified caveat matters: installed plugins are copied to a
cache, so a plugin's files that reference paths *outside* the plugin directory don't resolve. eunomai's hooks
already use `${CLAUDE_PLUGIN_ROOT}` (inside), but `projection/dist` is gitignored and so would not travel with
the plugin.

## Goals / Non-Goals

**Goals:**
- Make eunomai installable as a Claude Code plugin (local path now, git later).
- A single coherent usage guide that leads from install → applying eunomai to a new/existing project → daily
  workflow, with the README leading with getting-started.

**Non-Goals:**
- Publishing to a public marketplace or npm; shipping the `projection/` CLI inside the plugin; bundling
  OpenSpec; per-pillar tutorials.

## Decisions

### Decision 1 — Reuse the native plugin/marketplace mechanism; add only the manifest + guide (reuse-first)

Add `.claude-plugin/marketplace.json` listing the eunomai plugin with `source: "."` (the repo *is* the
plugin). Installation, scopes, and `/reload-plugins` are all native. Net-new is just the manifest and the docs.

- *Why over alternatives:* a custom installer/distribution would reinvent the plugin system. A one-file
  manifest unlocks `/plugin marketplace add <path>` → `/plugin install eunomai@eunomai`.

### Decision 2 — Ship skills + hooks now; the projection CLI checks stay build-from-source (honest minimal)

The plugin ships the skills (markdown) and the safe-controls hooks (resolve via `${CLAUDE_PLUGIN_ROOT}`) —
the testable core. The `projection/` CLI checks (`docs-check`, `provenance-check`) are **not** shipped (their
`dist/` is gitignored); they remain dev-gate tools run where `projection/` is built. `usage.md` says so
plainly.

- *Why over alternatives:* committing `dist/` (it's gitignored by convention) or publishing the package is a
  bigger decision than "start testing" needs. The skills + hooks deliver eunomai's value on a target project
  today; shipping the CLI is a clean follow-up. Honesty over over-promising.

### Decision 3 — One usage spine; the per-pillar docs stay the reference

`docs/usage.md` is the single end-to-end thread (prerequisites → install → `eunomai-onboard` on a new/existing
project → daily workflow), linking out to the per-pillar pages for depth. The README leads with a Getting
started section pointing at it.

- *Why over alternatives:* duplicating pillar detail into the guide would rot; a spine that *links* the
  existing reference pages (kept honest by `docs-check`) stays lean and dogfoods living-docs.

### Decision 4 — OpenSpec is a documented prerequisite, not bundled

The SDD pillar reuses OpenSpec; `usage.md` lists installing `@fission-ai/openspec` as a prerequisite rather
than vendoring it.

- *Why over alternatives:* bundling a third-party CLI is the opposite of connector-first.

## Risks / Trade-offs

- **Plugin-cache caveat** (files outside the plugin dir don't resolve) → hooks use `${CLAUDE_PLUGIN_ROOT}`
  (fine); the CLI checks aren't shipped and `usage.md` documents that, so nothing silently breaks.
- **`eunomai-onboard` references the projection CLI** → its core (analyze/establish/seed) works without it; the
  checks are verification run where `projection/` is built. Noted in the guide.
- **`marketplace.json` source path** → `"."` for a repo-root plugin; the install scenario verifies it.
- **Doc dispersion could return** → `usage.md` is the spine, `docs-check` keeps its links honest, living-docs
  maintains it.
- **Low-maintenance check:** one manifest + one usage page + a README section; no code, native mechanism, no
  new check.
