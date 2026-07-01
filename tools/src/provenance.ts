import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";

/** Skill roots: `.claude/skills/` (consumer projects) and `skills/` (the eunomai plugin). */
const SKILL_ROOTS = [".claude/skills", "skills"];

/** The consolidated audit registry filename, at each skills root. */
const REGISTRY = "eunomai-skills-audit.md";

/** Required shape of one audit entry in the registry frontmatter. */
const EntrySchema = z.object({
  name: z.string().min(1),
  origin: z.string().min(1),
  ref: z.string().min(1), // a real commit SHA / version, "authored", or "unpinned"
  verdict: z.enum(["adopt", "adopt-and-improve", "create", "authored"]),
  rubric: z.string().min(1),
  gaps: z.array(z.string()).optional().default([]),
});

const RegistrySchema = z.object({
  generated: z.string().optional(),
  skills: z.array(EntrySchema),
});

export type SkillsAuditResult = {
  /** `<root>/<dir>` for a skill with `SKILL.md` but no registry entry. */
  uncovered: string[];
  /** `<root>: <reason>` for a missing/invalid registry or a drifted entry (stale, duplicate). */
  invalid: string[];
  /** `<root>/<name>: <gap>` for entries carrying trust gaps (e.g. `unpinned`). */
  gaps: string[];
  /** Count of skill directories checked. */
  checked: number;
  /** Skill roots that were scanned. */
  roots: string[];
};

/** Read a UTF-8 text file, stripping a leading BOM (common from Windows editors). */
const readText = (abs: string): string => readFileSync(abs, "utf8").replace(/^\uFEFF/, "");

/** Extract and parse leading YAML frontmatter (between `---` fences). */
function frontmatter(text: string): unknown {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return undefined;
  try {
    return parse(match[1] ?? "");
  } catch {
    return undefined;
  }
}

/** Heuristic for a ref that records no real pin (SHA/version) — a trust gap, not a failure. */
const isUnpinned = (ref: string): boolean =>
  /^unpinned$|\bnot recorded\b|\bno sha\b|\bunknown\b|\bTBD\b/i.test(ref);

/**
 * Read-only check that every skill under the skill roots (`.claude/skills/` and
 * `skills/`) is covered by that root's `eunomai-skills-audit.md` registry. Reports
 * uncovered skills and missing/invalid/drifted registries — stale entries whose skill
 * folder is gone, duplicate names — (failures) and trust gaps (warnings). Writes nothing.
 */
export function checkSkillsAudit(cwd: string = process.cwd()): SkillsAuditResult {
  const result: SkillsAuditResult = { uncovered: [], invalid: [], gaps: [], checked: 0, roots: [] };

  for (const rel of SKILL_ROOTS) {
    const root = resolve(cwd, rel);
    if (!existsSync(root)) continue;

    const skillDirs = readdirSync(root).filter(
      (e) =>
        // throwIfNoEntry keeps a broken symlink from crashing the scan (it is skipped)
        statSync(join(root, e), { throwIfNoEntry: false })?.isDirectory() === true &&
        existsSync(join(root, e, "SKILL.md")),
    );
    const registryPath = join(root, REGISTRY);
    if (skillDirs.length === 0 && !existsSync(registryPath)) continue;
    result.roots.push(rel);
    result.checked += skillDirs.length;

    if (!existsSync(registryPath)) {
      result.invalid.push(`${rel}: missing ${REGISTRY}`);
      for (const dir of skillDirs) result.uncovered.push(`${rel}/${dir}`);
      continue;
    }

    const parsed = RegistrySchema.safeParse(frontmatter(readText(registryPath)));
    if (!parsed.success) {
      const detail = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
      result.invalid.push(`${rel}/${REGISTRY}: ${detail}`);
      for (const dir of skillDirs) result.uncovered.push(`${rel}/${dir}`);
      continue;
    }

    const names = parsed.data.skills.map((s) => s.name);
    for (const dup of new Set(names.filter((n, i) => names.indexOf(n) !== i))) {
      result.invalid.push(`${rel}/${REGISTRY}: duplicate entry '${dup}'`);
    }

    const present = new Set(skillDirs);
    for (const name of new Set(names)) {
      if (!present.has(name)) {
        result.invalid.push(`${rel}/${REGISTRY}: stale entry '${name}' (skill folder ${rel}/${name} not found)`);
      }
    }

    const byName = new Map(parsed.data.skills.map((s) => [s.name, s]));
    for (const dir of skillDirs) {
      const entry = byName.get(dir);
      if (!entry) {
        result.uncovered.push(`${rel}/${dir}`);
        continue;
      }
      if (entry.gaps.length > 0 || isUnpinned(entry.ref)) {
        const detail = entry.gaps.length > 0 ? entry.gaps.join(", ") : "unpinned ref";
        result.gaps.push(`${rel}/${dir}: ${detail}`);
      }
    }
  }

  return result;
}
