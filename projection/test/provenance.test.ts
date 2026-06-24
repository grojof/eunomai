import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkProvenance } from "../src/provenance.js";

let dir: string;

const VALID = `---
origin: authored
ref: authored
date: 2026-06-24
verdict: authored
rubric: Authored in-repo.
modifications: none
---
`;

const skill = (name: string, provenance?: string): void => {
  const d = join(dir, "skills", name);
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, "SKILL.md"), `---\nname: ${name}\ndescription: x\n---\n`);
  if (provenance !== undefined) writeFileSync(join(d, "PROVENANCE.md"), provenance);
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-prov-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("checkProvenance", () => {
  it("passes when every skill has a valid PROVENANCE.md", () => {
    skill("a", VALID);
    skill("b", VALID);
    const r = checkProvenance(dir);
    expect(r.missing).toEqual([]);
    expect(r.invalid).toEqual([]);
    expect(r.checked).toBe(2);
  });

  it("flags a skill with no PROVENANCE.md", () => {
    skill("a", VALID);
    skill("b"); // no provenance
    const r = checkProvenance(dir);
    expect(r.missing).toEqual(["b"]);
  });

  it("flags a skill whose provenance is missing a required field", () => {
    skill("a", "---\norigin: authored\ndate: 2026-06-24\n---\n"); // missing ref/verdict/rubric/modifications
    const r = checkProvenance(dir);
    expect(r.invalid).toHaveLength(1);
    expect(r.invalid[0]).toContain("a (");
  });

  it("flags provenance with no frontmatter at all", () => {
    skill("a", "just prose, no frontmatter\n");
    const r = checkProvenance(dir);
    expect(r.invalid).toHaveLength(1);
  });

  it("ignores directory entries that are not skills (no SKILL.md)", () => {
    skill("a", VALID);
    mkdirSync(join(dir, "skills", "not-a-skill"), { recursive: true });
    writeFileSync(join(dir, "skills", "README.md"), "# skills\n");
    const r = checkProvenance(dir);
    expect(r.checked).toBe(1);
    expect(r.missing).toEqual([]);
  });

  it("returns empty when there is no skills/ directory", () => {
    const r = checkProvenance(dir);
    expect(r).toEqual({ missing: [], invalid: [], checked: 0 });
  });
});
