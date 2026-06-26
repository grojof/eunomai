## 1. Explanation doc — the KDD lens

- [x] 1.1 In `docs/knowledge-driven-development.md`, add the **domain × activation** model: introduce the six KDD domains (business · product · technical · operational · historical · AI-ready) as a third, orthogonal axis beside the existing activation spectrum, and show how they cross (a short table or prose).
- [x] 1.2 Cite the AWS Builder KDD article as the source for the domain taxonomy and the seven principles; keep the existing "what eunomai does NOT adopt" framing and extend it to name the rejected scope-cascade / multi-tool projection and Kaddo.
- [x] 1.3 Verify the page keeps valid frontmatter and stays linked from the README map.

## 2. Reference doc — the standard

- [x] 2.1 In `docs/living-docs.md`, add a **knowledge-domain lens** section beside the Diátaxis-as-lens section, stating clearly that mode (Diátaxis) and domain (KDD) are orthogonal and that domain is a coverage judgement, not a frontmatter field or gate rule.
- [x] 2.2 Make **ownership** and **doc↔code drift** explicit: ownership as a suggestion lens (surface unowned system-critical areas), drift framed under "evolve with the system" and anchored to the existing read-only `coherence-auditor` delegation (no new check).
- [x] 2.3 Reaffirm the minimal-sufficient / "earns its place" rule as the governor on all lenses (no push toward heavy documentation); confirm the two-layer guarantee table still shows the gate as shape-only.

## 3. Skill — operationalize the lens

- [x] 3.1 In `skills/eunomai-living-docs/SKILL.md`, add a **six-domain capture checklist** the skill applies when establishing/refreshing docs, surfacing materially under-covered domains as suggestions (human-in-control).
- [x] 3.2 Add the **seven KDD principles** as the skill's operating frame (near the code · minimal sufficient · decisions matter · dual human+AI utility · ownership · evolve/detect-drift · context-not-guesses), wiring drift to the coherence-auditor delegation and ownership to the ownership lens.
- [x] 3.3 Ensure the skill explicitly states the lens adds no required frontmatter field, no per-domain page/folder mandate, and no gate rule — consistent with the spec scenarios.

## 4. Verify & dogfood

- [x] 4.1 Run `node tools/dist/cli.cjs docs-check` and confirm it exits zero (eunomai dogfoods the standard).
- [x] 4.2 Re-read the three artifacts for internal consistency (no duplication across homes; single source of truth respected — link, don't restate).
- [x] 4.3 Run `openspec validate living-docs-kdd-lens` (or `openspec status`) and confirm the change is consistent before `/opsx:apply`.
