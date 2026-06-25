# SDD/SPDD (spec-driven development)

The first pillar: non-trivial change flows **spec-first**. eunomai does **not** build an SDD framework — it
runs on [**OpenSpec**](https://github.com/Fission-AI/OpenSpec) and adds only a thin, tailored layer. The
*why* of adopting OpenSpec lives in [the ADR](../decisions/0001-adopt-openspec/); this page is the facts.

## The flow

Four phases, each a Claude Code command (namespaced by the plugin). Artifacts live in
`openspec/changes/<name>/` and graduate into `openspec/specs/` on archive.

| Phase | Command | What it produces |
|-------|---------|------------------|
| **Explore** | `/opsx:explore` | a thinking pass — investigate the problem, clarify requirements (no artifact required) |
| **Propose** | `/opsx:propose <name>` | the change: design, delta specs, and a task list, ready to implement |
| **Apply** | `/opsx:apply` | the implementation, working through the change's tasks |
| **Archive** | `/opsx:archive` | folds the delta specs into `openspec/specs/` and moves the change to `archive/` |

`/opsx:sync` can fold delta specs into the main specs **without** archiving, when you need the specs current
mid-change.

> Use the flow for **non-trivial** change. A one-line fix or a typo does not need a proposal — match the
> ceremony to the risk.

## The eunomai layer

OpenSpec is the engine (upgradable via `openspec update`); eunomai's tailoring is **one file**,
`openspec/config.yaml`, injected into the AI prompts for each artifact:

- **`context`** — what eunomai is, the stack, the guiding principles, and the conventions (commit policy,
  safety gate) so every spec/proposal is generated against them.
- **`rules`** — per-artifact guidance (proposal, design, tasks).

A custom schema (`openspec/schemas/eunomai/`) is added **only** if a new artifact type is ever needed (e.g.
an SPDD "reasons" doc) — YAGNI until then. Keep the layer current with `openspec update`.

## Layout

```
openspec/
  config.yaml      ← the eunomai layer (context + rules; the only tailoring)
  changes/         ← in-flight changes (changes/<name>/), plus changes/archive/
  specs/           ← the living specs, one folder per capability
```

## Setup

The OpenSpec CLI is **reused, not bundled** — install it separately:

```bash
npm i -g @fission-ai/openspec
```

See [getting-started](../guides/getting-started.md) for the full install path.