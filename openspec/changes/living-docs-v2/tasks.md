## 1. docs-check v2 (deterministic frontmatter-shape gate)

- [ ] 1.1 Extend `tools/src/docs.ts` to parse each in-scope `docs/` page's YAML frontmatter (reuse the `yaml`
      dep) and validate **shape**: `type` ∈ {tutorial, how-to, reference, explanation, decision}, non-empty
      `title` and `description`. Collect violations; exit non-zero with a clear report. Keep the existing
      link/index/community-health checks intact. Exclude `docs/decisions/` (ADR series) as today.
- [ ] 1.2 Extend `tools/test/docs.test.ts` with cases: missing frontmatter, unknown `type`, empty
      `title`/`description`, and a valid page. Keep prose/coherence explicitly out of scope.
- [ ] 1.3 `cd tools && npm run typecheck && npm run lint && npm test && npm run build`; commit the rebuilt bundle.

## 2. Rewrite the v2 standard

- [ ] 2.1 Rewrite `docs/reference/living-docs.md` to the v2 model: Diátaxis-as-lens via `type`; the frontmatter
      schema (required `type`/`title`/`description`; recommended `tags`; optional `audience`/`related`/`updated`);
      product/surface-shaped README map; the dev-quality bar; path-as-identity + link-graph; and the rule that
      AI coherence-auditing (`coherence-auditor`) stays a one-shot, human-resolved diagnostic **outside** the gate.
- [ ] 2.2 Update `skills/eunomai-living-docs/SKILL.md` to the v2 standard (frontmatter, the map, `type` lens,
      the two-layer guarantee).

## 3. Pilot on eunomai's own docs

- [ ] 3.1 Add v2 frontmatter to every page under `docs/guides/`, `docs/reference/`, `docs/explanation/`
      (`type`/`title`/`description` required; `tags` + sensible optionals).
- [ ] 3.2 Delegate to the `codebase-cartographer` for an "at a glance" architecture diagram (Mermaid/C4) and
      place it in the README.
- [ ] 3.3 Rewrite `README.md` as the routable **map**: at-a-glance summary · the diagram · quickstart · the
      surface-organized index. Keep `docs/decisions/` excluded from the index.

## 4. Sync spec + verify the gate

- [ ] 4.1 Sync the `living-docs` delta into `openspec/specs/living-docs/spec.md` and update its Purpose to v2.
- [ ] 4.2 Run `openspec validate --specs` — all specs pass.
- [ ] 4.3 Run the full gate: `docs-check` (now incl. frontmatter) + `provenance-check` exit 0; hooks tests pass;
      `tools` typecheck/lint/test/build green. Grep-confirm every `docs/` page (excl. decisions) has frontmatter.
