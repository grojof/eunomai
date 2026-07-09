# Doc-set profiles (canonical catalog)

Presets over the **unchanged v2 standard** — same frontmatter, same shape-only gate — keyed by the
repository's **destination**. A profile fixes only a *starting* README skeleton, a *starter* `docs/` page set
(each page with its Diátaxis `type`), and an emphasis. It never adds rules: pages are kept or dropped by the
earns-its-place test, `docs-check` never checks profile conformance, and the folder structure remains the
separate propose-2–3-options choice.

**How to offer them (the interview):** infer a **recommended default** from detected signals (manifests,
cartographer output, repo shape) — never ask what you can detect; show the candidate **previews** so the
author can intuit the resulting shape; ask **one question**; always include **custom**. The choice is
**skippable**, and where an incumbent docs standard/toolchain governs, the coexistence contract applies — the
incumbent wins and profiles stand down.

**Invariant across every profile:** the root README stays **user-friendly** — what it is, who it is for, why
it exists, a diagram when it helps, references onward. The profile changes what sits *behind* the README, not
the README's register; technical depth lives in `docs/`.

## Detection signals → recommended default

| Signal (examples) | Recommended profile |
|---|---|
| Package manifest with public exports/`main`, no executable entry; published to a registry | library / SDK |
| Server framework deps, `Dockerfile`/compose, port bindings, OpenAPI/proto files | service / API |
| Executable entry (`bin`, console scripts), arg-parsing deps, man-page/completion files | CLI tool |
| Plugin/extension points, scaffolding generators, projects built *on top of* this one | framework / platform |
| Cross-compilation toolchains, board/target configs, HAL/RTOS sources, flash scripts | firmware / embedded |
| GUI/desktop/mobile manifests, end-user strings, install/access instructions for non-developers | end-user app / internal tool |
| Mixed or none of the above | ask — lead with custom |

## The profiles

### library / SDK — read by developers embedding it

Emphasis: **reference + how-to**; a runnable first example within a minute of arriving.

- README skeleton: at a glance · install · a minimal working code example · index (getting started / API /
  recipes) · compatibility (versions, platforms).
- Starter pages: `getting-started` (tutorial) · `api` (reference) · `concepts` (explanation) · `recipes`
  (how-to) · `migration` (how-to; only once there are breaking releases).

### service / API — a running system others integrate with

Emphasis: **reference (the contract) + operational how-to**; the architecture diagram matters most here.

- README skeleton: at a glance · architecture diagram · run-it-locally quickstart · index (API / integration /
  operations) · environments & status.
- Starter pages: `api` (reference: endpoints/contract) · `integration` (how-to: authenticate + call it) ·
  `operations` (how-to: deploy, monitor, troubleshoot) · `architecture` (explanation) · `configuration`
  (reference).

### CLI tool — installed and invoked by developers or operators

Emphasis: **scannable reference + recipes**; the README's example commands *are* the product tour.

- README skeleton: at a glance · install · the 3–5 most common invocations with real output · index
  (commands / recipes / configuration).
- Starter pages: `commands` (reference: every command/flag) · `recipes` (how-to: task-shaped combinations) ·
  `configuration` (reference: files, env vars, precedence).

### framework / platform — others build on it

Emphasis: **tutorial + explanation**; newcomers need a guided first build before any reference helps.

- README skeleton: at a glance · what building on it looks like (short sample) · quickstart pointer · index
  (first project / concepts / extending / API).
- Starter pages: `first-project` (tutorial) · `concepts` (explanation: the mental model) · `extending`
  (how-to: plugins/extension points) · `api` (reference) · `upgrading` (how-to).

### firmware / embedded — code bound to hardware

Emphasis: **how-to (build/flash) + reference (interfaces/constraints)**; state the target hardware before
anything else.

- README skeleton: at a glance (incl. supported targets/boards) · block or context diagram · build-and-flash
  quickstart · index (setup / interfaces / architecture / troubleshooting) · safety or certification notes
  where they apply.
- Starter pages: `hardware-setup` (how-to: wiring, jumpers, debug probe) · `build-and-flash` (how-to:
  toolchain, targets, flags) · `interfaces` (reference: protocols, registers, pinout, message formats) ·
  `architecture` (explanation: tasks/ISRs, memory and timing constraints) · `troubleshooting` (how-to).

### end-user app / internal tool — non-developer readers dominate

Emphasis: **tutorial/how-to in plain language**; keep developer jargon out of the user-facing pages entirely.

- README skeleton: what you can do with it (plain language) · a screenshot or flow diagram · how to get
  access / run it · index (user guide / administration / FAQ) · where to get help.
- Starter pages: `user-guide` (tutorial + how-to, jargon-free) · `administration` (how-to: install, configure,
  operate — the technical depth lives here) · `faq` (reference) · `architecture` (explanation; maintainer
  `audience`).

## Custom — the author's own idea

First-class, not an escape hatch. When the author picks it (or none of the previews fit), run follow-ups
**one at a time**, recommending a default each time:

1. Who reads these docs, and in what order do they arrive? (developer integrating · operator running ·
   end user using · contributor changing)
2. What must a newcomer achieve in their first ten minutes?
3. What is the contract surface — an API, commands, protocols, screens — that needs scannable reference?
4. What operational knowledge exists only in someone's head today?
5. Is there an existing structure to respect or migrate from?

Then compose the doc set from the building blocks above (any starter page can be borrowed across profiles)
and confirm the resulting preview before writing anything.
