import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkSkillsAudit } from "../src/provenance.js";

let dir: string;

const write = (rel: string, body: string): void => {
  const abs = join(dir, rel);
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, body);
};

/** Add a skill folder under a skills root (default `.claude/skills`). */
const skill = (name: string, root = ".claude/skills"): void =>
  write(`${root}/${name}/SKILL.md`, `---\nname: ${name}\ndescription: x\n---\n`);

/** Write the audit registry for a root from a list of entries. */
const registry = (
  entries: { name: string; ref?: string; verdict?: string; gaps?: string[] }[],
  root = ".claude/skills",
): void => {
  const body = entries
    .map(
      (e) =>
        `  - name: ${e.name}\n    origin: authored\n    ref: ${e.ref ?? "authored"}\n` +
        `    verdict: ${e.verdict ?? "authored"}\n    rubric: t\n    gaps: [${(e.gaps ?? []).join(", ")}]`,
    )
    .join("\n");
  write(`${root}/eunomai-skills-audit.md`, `---\ngenerated: 2026-06-24\nskills:\n${body}\n---\n# audit\n`);
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-audit-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("checkSkillsAudit", () => {
  it("passes when the registry covers every skill", () => {
    skill("a");
    skill("b");
    registry([{ name: "a" }, { name: "b" }]);
    const r = checkSkillsAudit(dir);
    expect(r.uncovered).toEqual([]);
    expect(r.invalid).toEqual([]);
    expect(r.gaps).toEqual([]);
    expect(r.checked).toBe(2);
    expect(r.roots).toEqual([".claude/skills"]);
  });

  it("flags a skill with no registry entry (uncovered)", () => {
    skill("a");
    skill("b");
    registry([{ name: "a" }]); // b missing
    const r = checkSkillsAudit(dir);
    expect(r.uncovered).toEqual([".claude/skills/b"]);
  });

  it("flags an invalid registry (missing required field) and treats skills as uncovered", () => {
    skill("a");
    write(".claude/skills/eunomai-skills-audit.md", "---\nskills:\n  - name: a\n---\n"); // missing fields
    const r = checkSkillsAudit(dir);
    expect(r.invalid.length).toBe(1);
    expect(r.uncovered).toEqual([".claude/skills/a"]);
  });

  it("flags a missing registry when skills exist", () => {
    skill("a");
    const r = checkSkillsAudit(dir);
    expect(r.invalid[0]).toContain("missing");
    expect(r.uncovered).toEqual([".claude/skills/a"]);
  });

  it("surfaces gaps (unpinned) but keeps them non-fatal (covered)", () => {
    skill("vendored");
    registry([{ name: "vendored", ref: "unpinned", verdict: "adopt", gaps: ["unpinned"] }]);
    const r = checkSkillsAudit(dir);
    expect(r.uncovered).toEqual([]);
    expect(r.invalid).toEqual([]);
    expect(r.gaps).toEqual([".claude/skills/vendored: unpinned"]);
  });

  it("flags a stale registry entry whose skill folder no longer exists", () => {
    skill("a");
    registry([{ name: "a" }, { name: "ghost" }]);
    const r = checkSkillsAudit(dir);
    expect(r.uncovered).toEqual([]);
    expect(r.invalid).toEqual([
      ".claude/skills/eunomai-skills-audit.md: stale entry 'ghost' (skill folder .claude/skills/ghost not found)",
    ]);
  });

  it("flags stale entries even when no skill folders remain", () => {
    registry([{ name: "gone" }]);
    const r = checkSkillsAudit(dir);
    expect(r.invalid.length).toBe(1);
    expect(r.invalid[0]).toContain("stale entry 'gone'");
    expect(r.checked).toBe(0);
  });

  it("flags duplicate registry entries instead of letting the last one win silently", () => {
    skill("a");
    registry([{ name: "a" }, { name: "a" }]);
    const r = checkSkillsAudit(dir);
    expect(r.uncovered).toEqual([]);
    expect(r.invalid).toEqual([".claude/skills/eunomai-skills-audit.md: duplicate entry 'a'"]);
  });

  it("treats English unpinned phrasings as gaps, and matches TBD only as a whole word", () => {
    skill("a");
    skill("b");
    skill("c");
    skill("d");
    registry([
      { name: "a", ref: "not recorded", verdict: "adopt" },
      { name: "b", ref: "no sha available", verdict: "adopt" },
      { name: "c", ref: "TBD", verdict: "adopt" },
      { name: "d", ref: "9TBDf00d", verdict: "adopt" }, // TBD inside a SHA-like word: pinned
    ]);
    const r = checkSkillsAudit(dir);
    expect([...r.gaps].sort()).toEqual([
      ".claude/skills/a: unpinned ref",
      ".claude/skills/b: unpinned ref",
      ".claude/skills/c: unpinned ref",
    ]);
  });

  it("parses a registry written with a leading UTF-8 BOM", () => {
    skill("a");
    write(
      ".claude/skills/eunomai-skills-audit.md",
      "\uFEFF---\ngenerated: 2026-06-24\nskills:\n  - name: a\n    origin: authored\n" +
        "    ref: authored\n    verdict: authored\n    rubric: t\n---\n",
    );
    const r = checkSkillsAudit(dir);
    expect(r.invalid).toEqual([]);
    expect(r.uncovered).toEqual([]);
  });

  it("checks the top-level skills/ root too (the eunomai plugin)", () => {
    skill("own", "skills");
    registry([{ name: "own" }], "skills");
    const r = checkSkillsAudit(dir);
    expect(r.roots).toEqual(["skills"]);
    expect(r.uncovered).toEqual([]);
  });

  it("returns empty when there are no skills", () => {
    const r = checkSkillsAudit(dir);
    expect(r).toEqual({ uncovered: [], invalid: [], gaps: [], checked: 0, roots: [] });
  });
});
