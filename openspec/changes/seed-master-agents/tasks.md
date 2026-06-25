## 1. Author the two read-only agents (via agent-creator, fit to eunomai)

- [ ] 1.1 Draft `agents/codebase-cartographer.md` with `agent-creator`, then fit it to the house style:
      frontmatter (`name`, `description`, `tools: Read, Glob, Grep, Bash`); read-only; outputs a comprehension
      map (architecture, entry points, module map, data flow, stack + versions) + a proposed Mermaid/C4 diagram;
      facts + proposal, never edits/decides; Boundaries mirror `agents/workspace-survey.md`.
- [ ] 1.2 Draft `agents/coherence-auditor.md` likewise: one-shot diagnostic comparing doc claims vs code/versions,
      returning a report (doc↔code drift, stale versions, undocumented areas); read-only; **anti-tower** boundary
      (disposable diagnostic, never a continuous engine/score).
- [ ] 1.3 Sanity-check both agents with `plugin-validator` / `skill-reviewer` where useful; keep them lean.

## 2. Wire the delegations

- [ ] 2.1 `skills/eunomai-onboard/SKILL.md`: in the analyze step, delegate comprehension to the cartographer and
      (for existing projects) a one-shot coherence audit to the auditor — read-only, human confirms.
- [ ] 2.2 `skills/eunomai-living-docs/SKILL.md`: delegate the architecture diagram to the cartographer and
      stale-doc detection to the auditor — read-only, suggestion-only.

## 3. Sync specs + verify the gate

- [ ] 3.1 Sync the `onboard` and `living-docs` deltas into the main specs.
- [ ] 3.2 Run `openspec validate --specs` — all specs pass.
- [ ] 3.3 Run `node tools/dist/cli.cjs docs-check` and `provenance-check` — both exit 0 (agents need no registry
      entry). No code changed.
