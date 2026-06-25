## 1. onboard — the structured interview

- [x] 1.1 Update `skills/eunomai-onboard/SKILL.md`: add the **structured-interview** technique to the
  analyze/gather step and the workspace-scoping ask-on-ambiguous moment — one question at a time, recommend a
  default, explore the codebase first (don't ask what you can detect); human-in-control, skippable, no
  field-by-field interrogation (req: *Gather input and resolve scope via a structured interview*).
- [x] 1.2 Update the skill so **creating docs from scratch** produces byproduct artifacts via the interview:
  decisions/ADRs for choices and a glossary explanation page for domain language, per the living-docs standard
  (req: *Creating docs from scratch produces decision and glossary artifacts*).

## 2. living-docs — recover thin/missing docs

- [x] 2.1 Update `skills/eunomai-living-docs/SKILL.md`: reference the structured-interview technique to recover
  thin or missing docs (one-at-a-time, recommend-a-default, explore-first), human-in-control (req: *Recover
  thin or missing docs via the structured interview*).

## 3. Docs

- [x] 3.1 Update `docs/reference/onboard.md` — the structured interview in input-gathering and from-scratch doc
  creation (ADRs + glossary byproducts); keep `docs-check` green.
- [x] 3.2 Update `docs/reference/living-docs.md` — the interview technique for recovering thin/missing docs.
- [x] 3.3 If the onboard/living-docs sections of `AGENTS.md` change, update them and **re-project**
  (`node projection/dist/cli.cjs compile`); verify idempotency with `compile --check`.

## 4. Validation gate

- [x] 4.1 `node projection/dist/cli.cjs docs-check` exits 0.
- [x] 4.2 `node projection/dist/cli.cjs provenance-check` exits 0.
- [x] 4.3 `compile` then `compile --check` — zero drift.
- [x] 4.4 Validate the change: `openspec validate interview-extraction --strict`.
- [x] 4.5 No projection/checker code changed; if any did, run `cd projection && npm run typecheck && npm run lint && npm test`.
