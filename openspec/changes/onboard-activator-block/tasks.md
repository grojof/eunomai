## 1. Canonical block (reference doc)

- [x] 1.1 Add the canonical **activator block** to `docs/reference/onboard.md`: principle-level disciplines
      (spec-first · honest docs · vet third-party skills/tools · secure-by-default · deliberate deps · pause on
      irreversible/sensitive actions), each with its skill named as a parenthetical accelerator.
- [x] 1.2 State the three invariants alongside it (self-sufficient · capabilities-not-brand · activate-not-duplicate).

## 2. Onboard seed step

- [x] 2.1 In `skills/eunomai-onboard/SKILL.md`, extend the "Seed conventions" step: onboard writes the activator
      block into the project's `CLAUDE.md`, adapting (not copying) the canonical block, honouring the invariants.
- [x] 2.2 Add a boundary note: the block is seeded once and disowned (no back-sync, no new check).

## 3. Sync spec + verify the gate

- [x] 3.1 Sync the `onboard` delta into `openspec/specs/onboard/spec.md`.
- [x] 3.2 Run `openspec validate --specs` — `spec/onboard` passes.
- [x] 3.3 Run `node tools/dist/cli.cjs docs-check` — exits 0 (no orphan/broken link introduced). No code changed.
