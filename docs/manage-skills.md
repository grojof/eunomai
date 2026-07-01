---
type: how-to
title: "Manage skills"
description: "Add or audit a skill behind the trust gate."
tags: [skills, skill-finder]
updated: 2026-07-01
---

# Add or audit a skill

How to bring a skill into a project behind eunomai's trust gate, and how to (re)audit one. The mechanics live
in the [`eunomai-skill-finder`](skill-finder.md) reference; this is the task recipe.

## Add a skill (acquire)

Invoke the steward and describe the capability you want:

```text
/eunomai:eunomai-skill-finder
```

It runs one flow with you in control:

1. **Discover** candidate skills for the capability.
2. **Trust gate** — a hard veto (dangerous behavior in `SKILL.md`/scripts, or no pinnable origin → **reject**),
   then weighed judgment on authorship · usage · quality.
3. **Outcome** — `adopt`, `adopt-and-improve`, or `create` (authoring delegated to Anthropic's
   **skill-creator**), followed by a **fit pass** that adapts the skill to your project. Third-party content
   is vendored only after you confirm the verdict.
4. **Provenance** — the result is recorded in the one `eunomai-skills-audit.md` registry at the skills root.

> The gate is a **floor-raiser, not a guarantee**. [safe-controls](safe-controls.md) is the
> runtime backstop, and org-trusted sources belong in the project's **rules** — where the gate reads them as
> provenance context (see [org-adoption](org-adoption.md)) — not a central allowlist.

## Audit an existing skill

Use the same steward, scoped to audit, to evaluate a present or named skill and write/refresh its provenance
entry — useful when vendoring a skill someone else added, or re-checking after an upgrade. Installed skills
get audit verdicts: `keep` · `keep-with-gaps` · `flag-for-removal` (removal stays your decision). Skills
delivered by other installed plugins are outside the registry's scope — trusted at the plugin/marketplace
level, and the audit report says so.

## Verify provenance coverage

After any change to `skills/` (or `.claude/skills/` in a consumer project), confirm every skill is covered:

```bash
node <clone>/tools/dist/cli.cjs provenance-check   # from your project root, via a clone of eunomai
```

(Inside a Claude Code session the skills invoke it via the plugin root automatically;
`${CLAUDE_PLUGIN_ROOT}` resolves only in plugin contexts, not in your shell.)

It **fails** on any skill missing a registry entry and **lists trust gaps** (e.g. `unpinned`) to act on.
Record the **real SHA** when vendoring — an unpinned skill is surfaced as a gap, never hidden. See
[checks](checks.md).

## Base skills are different

The [base skills](base-skills.md) (`eunomai-secure-coding`, `eunomai-dependency-upgrade`) ship
with eunomai and are recorded as `verdict: authored` — you don't acquire them through this flow.
