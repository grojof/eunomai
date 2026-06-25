## 1. Remove the Copilot / cross-tool projection surface

- [ ] 1.1 Delete `eunomai.yaml` and the generated `.github/copilot-instructions.md`.
- [ ] 1.2 Remove the `rulesync` dependency and the `compile` / `compile --check` commands and their code
      (`projection/src/compile.ts` projection path) from the package.
- [ ] 1.3 Drop the `agentsmd → claudecode/copilot` projection wiring; nothing should call `rulesync` anymore.

## 2. Rehome and trim the CLI to the read-only checks

- [ ] 2.1 Move the bundle out of `projection/` to a neutral path (e.g. `tools/` or `bin/`) and rename the
      package away from "projection"; keep the single self-contained `.cjs` (no `node_modules` at runtime).
- [ ] 2.2 Keep only `docs-check` and `provenance-check` as commands; rebuild the committed bundle.
- [ ] 2.3 Grep and update every `${CLAUDE_PLUGIN_ROOT}/projection/dist/cli.cjs` reference (skills, hooks, docs,
      getting-started) to the new path.

## 3. Consolidate the authored instruction source

- [ ] 3.1 Make `AGENTS.md` the single authored source; strip Copilot/projection/`eunomai.yaml` wording and the
      "generated from AGENTS.md via rulesync" authoring note.
- [ ] 3.2 Resolve `CLAUDE.md`: if Claude Code loads `AGENTS.md` natively, remove `CLAUDE.md`; otherwise keep it
      as a trivial replica (copy/pointer) with no `rulesync`. Document the choice in the apply notes.

## 4. Rewrite prose for Claude-only

- [ ] 4.1 README: remove Copilot parity claims; state Claude-only + OpenSpec-as-sole-dependency; fix the Layout
      and "Getting started" snippet (no `compile`).
- [ ] 4.2 `docs/guides/getting-started.md`: drop Copilot, the `compile` mention, and the rulesync authoring note;
      describe only `docs-check` / `provenance-check`.
- [ ] 4.3 `docs/reference/projection.md`: rename/fold into a checks-CLI reference page; keep the README index
      resolving.

## 5. Sync the spec and verify the gate

- [ ] 5.1 Sync the `distribution` delta into `openspec/specs/distribution/spec.md` (`/opsx:sync`).
- [ ] 5.2 Run `openspec validate --specs` — all specs pass.
- [ ] 5.3 Run the relocated CLI: `docs-check` and `provenance-check` both exit 0; run the hooks tests
      (`node --test "hooks/*.test.mjs"`) and the package's `typecheck` + `lint` + `test`.
- [ ] 5.4 Confirm no `eunomai.yaml`, `rulesync`, `copilot`, or `compile` references remain (grep clean).
