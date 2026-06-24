# Decision 0001 — Adopt OpenSpec for the SDD/SPDD pillar

**Date:** 2026-06-24 · **Status:** accepted · **Pillar:** SDD/SPDD

## Decision

Adopt **OpenSpec** (`Fission-AI/OpenSpec`, MIT) as eunomai's SDD/SPDD engine — **Option D**: OpenSpec
unchanged + a thin, tailored eunomai layer via `openspec/config.yaml` (and a custom schema only if a new
artifact like an SPDD "reasons" doc is ever needed). We do **not** build our own SDD, and we do **not** use
Spec-Kit (Python, heavyweight, greenfield/constitution — wrong fit).

See [explore.md](explore.md) and [options.md](options.md) for the full analysis (grounded in the cloned
source). Both Spec-Kit and OpenSpec were studied from source in `../../../../_vendor/`.

## Why (in one line)

OpenSpec **is** the delta-against-baseline flow we had been hand-running (explore → propose → spec/design/
tasks → apply → archive), already shipped as Claude skills, MIT, actively maintained, and it adds the spec
**validation + archive automation** we lacked. Building our own would reinvent it — violating the project's
first principle.

## What changed in the repo

- `openspec init --tools claude` created `openspec/` (changes/ · archive/ · specs/ · config.yaml) and the
  Claude skills/commands (`.claude/skills/openspec-*`, `.claude/commands/opsx/*`).
- `openspec/config.yaml` carries the **eunomai layer** (context + per-artifact rules: commit policy,
  conventions, connector-first framing).
- The hand-run `docs/specs/` scaffolding was retired; SDD now lives in `openspec/`.

## The trade we accepted

The flow surfaces as **`/opsx:*`** (OpenSpec branding), and eunomai's role for this pillar is *configuring*
OpenSpec rather than *being* the SDD tool. In exchange: a validated, maintained, plugin-native flow at a
fraction of the cost, fully tailorable via supported extension points (no fork → survives `openspec
update`).

## How to use it

- `/opsx:explore` → `/opsx:propose <name>` → `/opsx:apply` → `/opsx:archive` (in Claude chat).
- Keep OpenSpec current: `openspec update` (regenerates skills/commands) + `npm i -g @fission-ai/openspec@latest`.
