---
type: how-to
title: "Adopt in an organization"
description: "The coexistence contract, org-wide rollout, pinning, extension seams, and removal — eunomai as a removable complement to an existing layer."
tags: [org, adoption, coexistence]
updated: 2026-07-01
---

# Adopt in an organization

eunomai is designed as a **removable complement**: a base that establishes what a project lacks and adapts to
what it already has — personal setups and organizations alike. This page is the canonical home of the
**coexistence contract** and the org rollout mechanics. Everything below rides on Claude Code native
primitives; eunomai adds no machinery of its own.

## The coexistence contract

Every eunomai flow (onboard, living-docs, skill-finder, safe-controls) honours four clauses:

1. **Additive, never replacing.** eunomai's layers sit alongside what exists; nothing is overwritten.
2. **On conflict, the incumbent wins** — unless the author explicitly decides otherwise. Conflicts are
   surfaced (the structured interview), with *adapt to what exists* as the recommended default.
3. **Detect before seeding.** The workspace survey enumerates the existing layer — `CLAUDE.md`, docs
   standard, SDD process, permissions, hooks, skills — before anything is proposed.
4. **The project's rules are an input to every gate.** *The project's rules* means, mechanically: the
   project's `CLAUDE.md` (plus any hierarchical parents Claude Code loads) and the `permissions` in its
   `.claude/settings.json`. Org-trusted skill sources, mandated tooling, and stricter policies declared
   there are consumed by the skill trust gate and respected by the base skills.

## Coexistence facts (what composes, verified)

- **Skills cannot collide.** Plugin skills are namespaced (`/eunomai:eunomai-onboard`); an org's own skills
  and other plugins' skills keep their names.
- **Hooks merge most-restrictive-wins.** All matching `PreToolUse` hooks run; `deny` > `ask` > `allow`.
  eunomai's guard **never emits `allow`** — it can only tighten, never loosen, another layer's decision, and
  overlapping asks resolve to one prompt.
- **Permissions merge natively.** The recommended baseline is plain Claude Code `permissions` in the
  project's own settings; org-managed settings stack above it.
- **OpenSpec is a default, not a requirement.** Onboard seeds it only where no SDD/change process exists;
  an incumbent process is recorded and respected.

## Roll out org-wide

- **Distribute**: managed settings can add the marketplace and enable the plugin for everyone
  (`extraKnownMarketplaces` + `enabledPlugins`); `strictKnownMarketplaces` allowlists which marketplaces are
  installable at all.
- **Mirror privately**: any git host (or a raw `marketplace.json` URL) works — fork/mirror this repo behind
  the firewall; token auth (`GITHUB_TOKEN`/`GITLAB_TOKEN`) covers private remotes.
- **Pin**: install from a mirror/fork at a fixed release tag. Third-party marketplaces do **not**
  auto-update; updates arrive only when you run `/plugin marketplace update eunomai`.

## Extend without forking

- **Your own rules** → the project's `CLAUDE.md` and permissions (they are the gates' input).
- **Your own hooks** → ship them in your org plugin; they merge with eunomai's most-restrictive-wins.
- **The safety gate** → two fail-open env vars (set them in managed settings; see
  [safe-controls](safe-controls.md)): `EUNOMAI_TRAILER_RULE` (`deny` | `ask` | `off`) tunes the one hard
  rule, and `EUNOMAI_EXTRA_GATES` (path to a JSON list of `{pattern, reason}`) adds org-specific ask-gates —
  protected branches, internal secret paths — inside the same prompt flow.
- **Your own skills** → vet them once through [skill-finder](skill-finder.md)'s gate; declare org-trusted
  sources in the project's rules and the gate consumes them as provenance context (the security veto still
  applies). Skills delivered by other installed plugins are trusted at the plugin/marketplace level — the
  provenance registry covers only `.claude/skills/` and `skills/`, and audit reports say so.

## Remove

Uninstalling the plugin removes the skills, agents, hooks, and checks. Everything seeded — `CLAUDE.md` (with
its self-sufficient activator block), `docs/`, `openspec/`, the permissions baseline, the provenance
registry — lives in the project's own files and keeps working. If the checks were wired into CI from a
pinned eunomai clone, that gate survives the uninstall too ([checks](checks.md)).
