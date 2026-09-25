---
name: eunomai-safe-controls
description: Configure eunomai's safety guard for this project and this user — see what it asks about and why, relax or tighten a gate, pick a level, try a report-only mode, and set the project's AI-attribution policy (Assisted-by in commits or pull requests). Use when the guard asked or denied something the user disagrees with, when setting up a project, or when asked how to tune the guard or what the project requires about AI disclosure.
---

# eunomai-safe-controls

The guard is a fail-open floor-raiser, not a security boundary. Your job is to make it fit this project
and this user: quiet on routine work, firm on what cannot be undone. **Show, propose, and write only after
the user confirms.** Background: `docs/safe-controls.md` in the plugin.

## 1. Look before proposing

```bash
node "${CLAUDE_PLUGIN_ROOT}/hooks/guard.mjs" --check     # effective settings, where each came from, errors
node "${CLAUDE_PLUGIN_ROOT}/hooks/guard.mjs" --hits 50   # the gates that fired recently (no command text)
```

From a source clone of eunomai, use `node <clone>/hooks/guard.mjs` instead. Run `--check` from the project
root. It exits 1 when a config file has an error, or a committed value was ignored as looser; lead with
that.

## 2. Where each setting goes

| Wish | Where | Why |
|---|---|---|
| A personal default level or report mode | `/config`, eunomai's options | per user, every project |
| Relax a gate for this clone only | `.claude/eunomai.local.json` (gitignored) | a committed file may only tighten |
| Tighten for everyone: a level, a gate, protected paths, extra gates | `.claude/eunomai.json` (committed) | the team shares it |
| The project's AI-attribution policy | `attribution` in `.claude/eunomai.json`, and Claude Code's own `attribution` in `.claude/settings.json` | the project's rule, for everyone |

Keys: `level` (critical · standard · strict), `mode` (enforce · report), `gates` ({gate id: off · ask ·
deny}), `protectedPaths`, `extraGates` ([{id, pattern, reason, action}]), `attribution` ({commit: none ·
assisted-by, pr: assisted-by · none, tool}). The gate ids are listed by `--check`.

Prefer the narrowest change: one gate off in the local file, not a lower level. Before relaxing, offer
**report mode** (`"mode": "report"` in the local file) so the user sees what would fire without being
stopped. When a gate is set off, the local file must be gitignored; check it.

## 3. AI attribution

The guard always denies an AI **co-author** line. Disclosure is minimal: the tool, never the model
(`Assisted-by: Claude`). Where it goes is the project's rule. Find it: read `CONTRIBUTING*`, any
`AI_POLICY*` or `*ai*policy*`, `.github/PULL_REQUEST_TEMPLATE*`, and search them for `Assisted-by`,
`Co-authored-by`, `Generated-by`, `AI` and `disclos`.

| The project says | Propose |
|---|---|
| an `Assisted-by:` trailer on AI-assisted commits | `attribution.commit: "assisted-by"`; Claude Code `"attribution": {"commit": "Assisted-by: <tool>"}` |
| disclose in the pull request | `attribution.pr: "assisted-by"`; `"attribution": {"pr": "Assisted-by: <tool>"}` |
| no AI trailers at all | `attribution.commit: "none"`; `"attribution": {"commit": ""}` |
| nothing | the defaults (commit none, pull request `Assisted-by`), and `"attribution": {"commit": ""}` so Claude Code stops adding its co-author line |

Name the file and the words the policy uses when you propose it; if the project asks for something
stricter, such as a sign-off, say it is a human's to add.

## 4. Write, then verify

Show the exact JSON to add and the file it goes to, wait for confirmation, write it, and run `--check`
again until it exits 0. Never edit a managed or another user's settings file.
