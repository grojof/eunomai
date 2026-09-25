# Design: adopt AGENTS.md and lighten the docs standard

## Decision: reuse first

| Need | Adopted | Why |
|---|---|---|
| One instruction file every agent reads | `AGENTS.md`, read natively by Claude Code from 2.1.277 | the open standard; no projection needed |
| Older Claude Code | a one-line `CLAUDE.md` holding `@AGENTS.md` | Claude Code's documented bridge; one copy of the text |
| Personal, uncommitted instructions | `CLAUDE.md`'s `CLAUDE.local.md` | `AGENTS.local.md` is not read |
| Nested scopes | hierarchical discovery | Claude Code reads a subdirectory's `AGENTS.md` on demand when it has no `CLAUDE.md` |

Facts checked against Claude Code's memory documentation:
- when both files are in a directory, Claude Code reads `CLAUDE.md` only;
- `AGENTS.local.md` and `AGENTS.override.md` are not read;
- the choice between the files is a user or managed setting, not a project one.

## docs-check: a link walk, still shape-only

A page is reachable when:
- the README links to it, or to its folder's `README.md` / `index.md`;
- or a reachable page links to it.

The walk follows relative links inside `docs/`, ignores fenced code, and never reads prose for meaning.
Broken links are reported from three places:
- the README into `docs/`;
- a reachable page into `docs/`;
- `AGENTS.md` / `CLAUDE.md` to any relative path.

Community-health files move from failure to warning, because the gate cannot know whether a repository is
public. `--require-health` restores the failure, and eunomai's own CI passes it.

## living-docs: core and lenses

The standard's core fits on one screen:
1. frontmatter shape (`type`, `title`, `description`; `tags` recommended);
2. the README as the map, with every page reachable;
3. one fact, one home;
4. relative links;
5. timeless prose.

The skill runs the core on every refresh. Everything else is a lens it applies on request or when
establishing docs, in `references/lenses.md` next to the skill: the review lenses, KDD domains and
principles, the profile catalog, the structure options and the interview. That is progressive disclosure:
nothing is lost, and a refresh stops paying for it.

## Onboard without copied hooks

Hooks resolve through `${CLAUDE_PLUGIN_ROOT}` only inside an installed plugin. Copying the scripts made
forks, so from a source clone onboard installs the plugin from that clone (a local marketplace) instead.
Hooks then update with the clone.

## Trade-offs

- **Renaming the instruction file touches many references.** Doing it once, now, is cheaper than living
  with two names.
- **Health files become warnings.** A public repository that wants the failure must ask for it. eunomai
  does.

## Low-maintenance check

- No new dependency and no new command: the link walk is about 40 lines in the existing checks CLI.
- The skill gets smaller.
- One ADR.
