# Specs

We work **spec-first**: we iterate on specs here *before* writing implementation code. Specs are the source
of truth for *what* must be true; design covers *how*; both are plain Markdown — **no external CLI
dependency** (idea borrowed from OpenSpec/Spec Kit, not their tooling).

## Layout

```
specs/
  README.md            ← this file
  baseline/            ← stable, agreed specs (the current truth)
  changes/<name>/      ← in-flight deltas: proposal.md · spec.md · design.md · tasks.md
  archive/<name>/      ← folded, shipped changes (full history, incl. verify.md)
```

## Working rhythm

1. **Explore** a topic → short notes (or straight into a proposal).
2. **Propose** → why, scope (in/out), approach, risks.
3. **Clarify** → resolve ambiguity before the spec is finalized.
4. **Spec** (what) + **Design** (how) → testable requirements + technical approach.
5. **Tasks** → small, checkable steps.
6. Implement → **verify** against the spec → **archive**.

## Status

**Fresh start (2026-06-24).** The project was re-scoped to a Claude-first AI workspace plugin; prior
governance-era specs were retired with the clean restart. The next specs build the four pillars (see
`../../skills/README.md`), each as its own change. The verified Copilot projection tool lives in
`../../projection/`.
