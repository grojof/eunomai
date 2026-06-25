## Why

eunomai's headline case — *make an unfamiliar or legacy project understandable to a newcomer* (the "author has
left" scenario) — needs two primitives it lacks. onboard *analyzes* a project and living-docs *organizes* its
docs, but nothing **comprehends** an unfamiliar codebase (architecture, entry points, data flow, a diagram) or
**audits coherence** (do the docs still match the code and versions?). These are read-heavy, fan-out tasks —
ideal as **read-only subagents** (token-efficient, isolated context), mirroring the existing `workspace-survey`
agent.

## What Changes

- Add **`codebase-cartographer`** (read-only agent): reads an unfamiliar codebase and returns a **comprehension
  map** — architecture, entry points, module map, data flow, stack + versions — and a proposed **Mermaid/C4
  diagram** for the "at a glance" view. Reports facts + a proposed model; never edits or decides.
- Add **`coherence-auditor`** (read-only agent): a **one-shot** diagnostic comparing documented claims against
  the actual code and versions, returning a **coherence report** (doc↔code drift, stale/constrained versions,
  undocumented areas) the human acts on. Facts + flags; never edits, never a continuous engine or score.
- Wire both as **delegations**: `eunomai-onboard` calls the cartographer in its analyze step (feeding the
  "at a glance" README + diagram) and may call the auditor when normalizing an existing project;
  `eunomai-living-docs` may call the cartographer for diagrams and the auditor to surface stale docs.
- Authoring assisted by Anthropic's `agent-creator`, then fit to eunomai's read-only / facts-not-decisions
  convention. No new check, no machinery.

## Capabilities

### New Capabilities
<!-- none — agents are delegated primitives, governed by existing onboard/living-docs capabilities -->

### Modified Capabilities
- `onboard`: add a requirement that onboard MAY delegate codebase comprehension (cartographer) and, when
  normalizing an existing project, coherence auditing (auditor) to read-only subagents, rather than doing that
  heavy reading inline.
- `living-docs`: add a requirement that living-docs MAY delegate to the cartographer (architecture diagram) and
  the auditor (stale-doc detection), both read-only and suggestion-only.

## Impact

- `agents/codebase-cartographer.md`, `agents/coherence-auditor.md` — two new read-only agent definitions
  (tools: Read, Glob, Grep, Bash), matching `agents/workspace-survey.md` in posture.
- `skills/eunomai-onboard/SKILL.md`, `skills/eunomai-living-docs/SKILL.md` — describe the delegations.
- `openspec/specs/onboard/spec.md`, `openspec/specs/living-docs/spec.md` — delegation requirements (synced).
- No `provenance-check` entry needed — it scans `skills/` only, not `agents/` (as with `workspace-survey`).
- Reuse vs net-new: reuses Claude Code's subagent primitive (as `workspace-survey` does); eunomai adds only the
  two scoped, read-only agent definitions and the delegation wiring. **Anti-tower line:** the auditor is a
  disposable one-shot diagnostic, never a continuous conformance engine (that was the abandoned governance tower).
