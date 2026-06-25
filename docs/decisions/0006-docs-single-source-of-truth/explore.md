# Explore 0006 — Why do the docs still feel redundant after v2?

> Investigation prompted by the observation: even after v2 (frontmatter, flattening), the docs still feel off —
> a `CONTRIBUTING.md` duplicated in `docs/`, reference pages that restate `CLAUDE.md`, loose files. Should we
> abandon Diátaxis? Grounded in research on README/OSS-docs best practice and Diátaxis's own guidance.

## Findings (from source)

- **README best practice is unanimous: link out, don't duplicate.** "Shorter READMEs that link out make a
  project look more organized"; "rather than duplicating information, link to another resource." The README is
  the entry point; depth lives elsewhere and is *referenced*, not copied.
  ([welcometothejungle](https://www.welcometothejungle.com/en/articles/btc-readme-documentation-best-practices),
  [archbee](https://www.archbee.com/blog/readme-creating-tips), [eheidi.dev](https://eheidi.dev/posts/documentation-101/))
- **Diátaxis is a lens, not the problem.** Its own guidance and reviewers agree it is "a valuable aid… not a
  literal blueprint", does not require separate pages, and is applied in small steps.
  ([diataxis.fr](https://diataxis.fr/how-to-use-diataxis/),
  [idratherbewriting](https://idratherbewriting.com/blog/what-is-diataxis-documentation-framework))

## The realization

The problem was never Diátaxis. It is **duplication** — eunomai has no *single-source-of-truth* discipline —
amplified because eunomai is a **meta-tool**: its `CLAUDE.md` and ADRs already describe the tool, so the
`docs/reference/*` pages (sdd, skill-finder, base-skills, checks…) **restate** them. That redundancy, plus the
two `CONTRIBUTING.md` files, is what reads as "messy / nothing changed".

This is the convergence of everything already decided:

| Source | Same principle |
|--------|----------------|
| GitHub README best-practice | link out, don't duplicate |
| KDD (ADR-0002) | single source of truth; one knowledge, one activation state |
| OKF (ADR-0003) | `path = identity`; one node per concept |
| Diátaxis | structure emerges; a lens, not a blueprint |

→ **One fact, one home — everything else links.**

## Options

| Option | What | Verdict |
|--------|------|---------|
| **A — keep allowing duplication** | status quo | ❌ that *is* the mess |
| **B — abandon Diátaxis** | drop the lens | ❌ Diátaxis isn't the problem; research + Diátaxis itself disagree |
| **C — adopt single-source-of-truth + an anti-duplication lens** | one fact one home; the skill flags/merges duplicates; keep Diátaxis-as-lens | ✅ names and fixes the real cause |

## Lean recommendation (confirmed in DECISION)

**Option C.** Make *single source of truth* the governing principle of living-docs, add an "earns its place"
test + an anti-duplication lens to the skill, and clean eunomai's own docs (merge the two CONTRIBUTING, slim the
reference pages that restate `CLAUDE.md`/ADRs). Keep Diátaxis as a lens. A refinement of
[ADR-0005](../0005-living-docs-v2/DECISION.md).
