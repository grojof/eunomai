# Contributing to eunomai

Thanks for helping improve eunomai. This is the GitHub-discoverable home for working **on** eunomai itself —
the single source of the dev loop (there is no separate `docs/contributing.md`).

## Source of truth

**`AGENTS.md` is the single authored source of truth** for conventions (Claude-only host, ADR-0004; the file
is `AGENTS.md` since ADR-0007; no generated instruction files, no projection). Edit `AGENTS.md` directly;
this page is the practical loop, not a
restatement of it.

## Conventions

- UTF-8, **LF** newlines, final newline at EOF.
- **Conventional Commits**, imperative mood, **one logical change per commit**. **No AI co-author trailer**
  (the guard refuses it); a pull request discloses AI assistance with one line, `Assisted-by: Claude`.
- TypeScript, ESM, Node ≥ 20 in `tools/`. Match the surrounding code; small functions, early returns.
- Validate inputs at boundaries; never weaken validation to "make it work".

## Spec-driven change

Non-trivial work goes through the SDD flow on OpenSpec: `/opsx:explore` → `/opsx:propose <name>` →
`/opsx:apply` → `/opsx:archive`. Keep the OpenSpec layer current with `openspec update`.

## The dev loop

Run the package loop before finishing any change to `tools/`, then the read-only gate:

```bash
cd tools && npm run typecheck && npm run lint && npm test && npm run build   # rebuild + commit the bundle
node tools/dist/cli.cjs docs-check --require-health   # links, reachability, frontmatter, health files
node tools/dist/cli.cjs provenance-check    # every skill covered by the audit registry
node --test "hooks/*.test.mjs"              # safe-controls decision logic
```

The bundle (`tools/dist/cli.cjs`) is a **committed artifact** — rebuild and commit it when the source changes,
so consumers need no build step. All green is the definition of done.

## Releasing

eunomai follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html); before 1.0 a breaking change bumps
the minor version. Users update from `main` through the marketplace, so a release is a commit on `main` with
matching versions, plus its tags.

1. **Start from a settled `main`.** Every change is merged, and `openspec list` shows no open change.
   Branch `release/X.Y.Z`.
2. **Set the version everywhere it is declared.**
   - `.claude-plugin/plugin.json` and the `eunomai` entry of `.claude-plugin/marketplace.json`;
   - `tools/package.json`, then `cd tools && npm install --package-lock-only`;
   - `npm run build`, because the bundle carries the version (`node tools/dist/cli.cjs --version`);
   - the `ref` of every skill in `skills/eunomai-skills-audit.md`, and its `generated` date;
   - the pinned tag in the CI example of `docs/checks.md`.
3. **Cut the changelog.** Rename `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, open a new empty `[Unreleased]`,
   and update the compare links at the bottom. Every breaking change is marked **BREAKING**.
4. **Check.**
   - the dev loop above;
   - `claude plugin validate .claude-plugin/plugin.json` and `claude plugin validate .`;
   - `claude plugin tag --dry-run`, which confirms the plugin and the marketplace declare the same version.
5. **Merge.** Commit `chore(release): cut X.Y.Z`, open a pull request, and squash-merge it once CI is green.
6. **Tag the merge commit on `main`.**
   ```bash
   git tag vX.Y.Z && git push origin vX.Y.Z
   claude plugin tag --push -m "eunomai %s"       # eunomai--vX.Y.Z, Claude Code's plugin release tag
   ```

Users then run `claude plugin marketplace update eunomai` and `claude plugin update eunomai@eunomai`, or
use `/plugin`, and restart Claude Code. A marketplace with auto-update picks the release up at start.

## Reporting issues

- **Security vulnerabilities** → **do not** open a public issue; follow [SECURITY.md](SECURITY.md).
- **Bugs / ideas** → open a GitHub issue with a minimal reproduction or a clear proposal.

By contributing you agree your contributions are licensed under the project's [MIT License](LICENSE).
