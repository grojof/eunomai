# Security Policy

eunomai is a Claude-first AI workspace (a Claude Code plugin: skills · hooks · the projection CLI). Its
**safe-controls** hooks are a best-effort floor-raiser, **not** a security boundary — a determined agent can
bypass a `PreToolUse` hook. Treat the hooks and the skill trust gate as defence-in-depth, never the only
control. See [docs/reference/safe-controls.md](docs/reference/safe-controls.md).

## Supported versions

eunomai is pre-1.0 and ships from the tip of `main`. Only the **latest released version** receives security
fixes; please reproduce on the current `main` before reporting.

## Reporting a vulnerability

**Do not open a public issue for a security problem.** Instead:

- Use **GitHub Private Vulnerability Reporting** (the repo's *Security → Report a vulnerability* tab), or
- email **guillermo.rojo.fdez@gmail.com** with the details.

Please include: affected component (skill / hook / `projection` CLI), version or commit SHA, a minimal
reproduction, and the impact you observed. We aim to acknowledge within a few business days and will keep you
updated on the fix and disclosure timeline.

## Scope

In scope: the plugin's hooks (`hooks/`), the skills under `skills/`, and the projection CLI
(`projection/`). Out of scope: vulnerabilities in upstream tools eunomai stands on
([Claude Code](https://www.anthropic.com/), [OpenSpec](https://github.com/Fission-AI/OpenSpec),
[rulesync](https://github.com/dyoshikawa/rulesync)) — report those to their respective projects.

## Handling secrets

Never paste secrets, tokens, or `.env` contents into a report. eunomai's permissions baseline denies reading
common secret paths by default; if your report involves credentials, redact them.
