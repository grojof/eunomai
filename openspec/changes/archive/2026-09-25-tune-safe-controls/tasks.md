# Tasks

- [x] 1.1 The false-positive corpus from the review as a failing test (`hooks/corpus.test.mjs`): every
      everyday command that fired must pass silently, every real hit must still fire (Safety gate, Commit-trailer guard)
- [x] 1.2 `hooks/segments.mjs`: split segments, drop quoted data and heredoc bodies, keep `sh -c`/`bash -c`/`eval`
      code, extract commit messages and PR bodies; unit tests (Safety gate)
- [x] 1.3 `decide.mjs`: gate ids, the level table, recursive-delete targets resolved against the project and
      temp dirs, secret-read verbs, the attribution gates, reasons naming gate · why · safer · how to relax
      (Safety gate, Commit-trailer guard)
- [x] 2.1 `hooks/config.mjs`: layers (defaults, userConfig env, legacy env, tighten-only project file, local
      file), errors and ignored values collected; tests (Org override seam)
- [x] 2.2 `guard.mjs`: `--check` and `--hits`, report mode, the bounded hit log without command text, the
      config-error note in reasons (configuration visible, report mode)
- [x] 2.3 `.claude-plugin/plugin.json` `userConfig` (`level`, `mode`); `hooks.json` keeps one handler (the
      `if` filter was measured and set aside: see design)
- [x] 3.1 Skill `skills/eunomai-safe-controls/SKILL.md` and its registry entry (guided setup)
- [x] 3.2 Docs: `docs/safe-controls.md` rewritten (levels, gate table, layers, attribution policy, "why did it
      stop me?"), `README.md` map, `SECURITY.md`, `CHANGELOG.md`
- [x] 3.3 Gate: `node --test "hooks/*.test.mjs"`, `cd tools && npm run typecheck && npm run lint && npm test`,
      `docs-check`, `provenance-check`, `openspec validate --specs`
