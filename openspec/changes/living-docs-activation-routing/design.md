## Context

ADR-0002 adopts KDD as a **lens**: every eunomai artifact sits on a passive→active spectrum, and the test for
any addition is *"what kind of knowledge is this, and at what activation state should it live?"*. The KDD
explanation page already tabulates that spectrum (docs 🟢 passive · AGENTS.md/specs 🟡 semi-active · skills 🔴
active · hooks 🔴 enforced). `eunomai-living-docs` owns the passive end but currently only *organizes* prose;
it never notices when a piece of prose is actually mis-placed knowledge that belongs at a higher activation
state. This change closes that gap with a **recognition-and-handoff lens**, not new machinery.

## Goals / Non-Goals

**Goals:**
- Teach living-docs to spot, during a refresh, content that belongs at a higher activation state and surface it
  with the owning pillar named.
- Keep it strictly suggest-and-delegate: the move is performed by the owning pillar, with the human in control.
- Document the lens once (skill + reference doc), anchored to the existing KDD activation table.

**Non-Goals:**
- No automated moves, no rewriting of `AGENTS.md`/hooks/skills/specs by living-docs.
- No new check, no new CLI surface, no graph/traceability engine (explicitly rejected in ADR-0002).
- No change to the Diátaxis organizing behavior or to `docs-check`.

## Decisions

- **Reuse-first: the routing targets are the existing pillars.** living-docs adds only the *recognition* and
  the *handoff*; the activation itself is done by `AGENTS.md` (authored), safe-controls (hooks),
  `eunomai-skill-finder` (skills), and OpenSpec (specs). We adopt these primitives rather than building any new
  destination. Alternative considered — living-docs performs the move itself — rejected: it breaks the
  in-lane / human-in-control posture and duplicates other pillars.
- **A lens, not a check.** Implemented as guidance in `SKILL.md` (a review step + boundary), surfaced to the
  author as a suggestion. Alternative considered — a `docs-check` rule that fails on "convention-shaped prose"
  — rejected: heuristic, noisy, and adds maintenance; contradicts "no new check" (ADR-0002) and *low
  maintenance over reach*.
- **Anchor to the activation table, don't restate it.** The reference doc cross-links the KDD explanation page
  rather than duplicating the spectrum, keeping one source of truth.

## Risks / Trade-offs

- [Over-flagging — living-docs nags about every paragraph] → Scope the lens to *recurring* conventions /
  *enforceable* policies / *repeatable* procedures / *trackable* requirements; passive explanatory and
  reference content explicitly stays passive (a dedicated scenario pins this down).
- [Blurring lanes with skill-finder / safe-controls] → living-docs only *suggests and points*; the spec forbids
  it from authoring the target artifact. The boundary is encoded as a requirement and a SKILL boundary note.
- [Subjectivity of "right activation state"] → The author decides; every suggestion is accept/decline, never
  auto-applied.

**Low-maintenance check:** adds prose to one skill + one reference doc and a single spec requirement; no code,
no new check, no new dependency. Idempotent — re-running a refresh on already-activated knowledge raises no
suggestion. Passes the base principle *low maintenance over reach*.
