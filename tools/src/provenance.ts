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
  /** `<root>: <reason>` for a missing or invalid registry. */
  invalid: string[];
  /** `<root>/<name>: <gap>` for entries carrying trust gaps (e.g. `unpinned`). */
  gaps: string[];
  /** Count of skill directories checked. */
  checked: number;
  /** Skill roots that were scanned. */
  roots: string[];
};

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

const isUnpinned = (ref: string): boolean => /^unpinned$|no registrado|sin sha|\bTBD\b/i.test(ref);

/**
 * Read-only check that every skill under the skill roots (`.claude/skills/` and
 * `skills/`) is covered by that root's `eunomai-skills-audit.md` registry. Reports
 * uncovered skills and invalid registries (failures) and trust gaps (warnings).
 * Writes nothing.
 */
export function checkSkillsAudit(cwd: string = process.cwd()): SkillsAuditResult {
  const result: SkillsAuditResult = { uncovered: [], invalid: [], gaps: [], checked: 0, roots: [] };

  for (const rel of SKILL_ROOTS) {
    const root = resolve(cwd, rel);
    if (!existsSync(root)) continue;

    const skillDirs = readdirSync(root).filter(
      (e) => statSync(join(root, e)).isDirectory() && existsSync(join(root, e, "SKILL.md")),
    );
    if (skillDirs.length === 0) continue;
    result.roots.push(rel);
    result.checked += skillDirs.length;

    const registryPath = join(root, REGISTRY);
    if (!existsSync(registryPath)) {
      result.invalid.push(`${rel}: missing ${REGISTRY}`);
      for (const dir of skillDirs) result.uncovered.push(`${rel}/${dir}`);
      continue;
    }

    const parsed = RegistrySchema.safeParse(frontmatter(readFileSync(registryPath, "utf8")));
    if (!parsed.success) {
      const detail = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
      result.invalid.push(`${rel}/${REGISTRY}: ${detail}`);
      for (const dir of skillDirs) result.uncovered.push(`${rel}/${dir}`);
      continue;
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
