## 1. living-docs: choose-the-structure step

- [ ] 1.1 In `skills/eunomai-living-docs/SKILL.md`, add a "Choosing the structure" step: assess size/shape,
      **propose 2–3 options** (flat / by-surface / hybrid) with trade-offs + a recommended default, and confirm
      with the user (infer-then-confirm, skippable).
- [ ] 1.2 Add the **hard rule + anti-pattern flag**: folders never by Diátaxis type; if `guides/`/`reference/`/
      `explanation/` are found, flag and propose migrating. Note the gate stays shape-only (no structure judging).

## 2. onboard: establish-docs proposes structure

- [ ] 2.1 In `skills/eunomai-onboard/SKILL.md`, the establish-docs step proposes the structure the same way
      (2–3 options, recommended default, confirm) rather than assuming a layout.

## 3. Sync specs + verify the gate

- [ ] 3.1 Sync the `living-docs` and `onboard` deltas into the main specs.
- [ ] 3.2 Run `openspec validate --specs` — all specs pass.
- [ ] 3.3 Run `docs-check` + `provenance-check` — both exit 0 (no behaviour/gate change). No code changed.
