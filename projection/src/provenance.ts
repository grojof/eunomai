import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const SKILLS_DIR = "skills";

/** Required shape of a `PROVENANCE.md` sidecar's YAML frontmatter. */
const ProvenanceSchema = z.object({
  origin: z.string().min(1),
  ref: z.string().min(1), // version/SHA, or "authored"
  date: z.string().min(1),
  verdict: z.enum(["adopt", "adopt-and-improve", "create", "authored"]),
  rubric: z.string().min(1),
  modifications: z.string().min(1), // "none" is fine
});

export type ProvenanceCheckResult = {
  /** Skill names with no `PROVENANCE.md`. */
  missing: string[];
  /** `name (reason)` for skills whose provenance frontmatter is invalid. */
  invalid: string[];
  /** Count of skill directories checked. */
  checked: number;
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

/**
 * Read-only check that every skill under `skills/` (a directory containing a
 * `SKILL.md`) carries a valid `PROVENANCE.md` sidecar. Writes nothing.
 */
export function checkProvenance(cwd: string = process.cwd()): ProvenanceCheckResult {
  const root = resolve(cwd, SKILLS_DIR);
  const result: ProvenanceCheckResult = { missing: [], invalid: [], checked: 0 };
  if (!existsSync(root)) return result;

  for (const entry of readdirSync(root)) {
    const dir = join(root, entry);
    if (!statSync(dir).isDirectory() || !existsSync(join(dir, "SKILL.md"))) continue;
    result.checked += 1;

    const provPath = join(dir, "PROVENANCE.md");
    if (!existsSync(provPath)) {
      result.missing.push(entry);
      continue;
    }
    const parsed = ProvenanceSchema.safeParse(frontmatter(readFileSync(provPath, "utf8")));
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      result.invalid.push(`${entry} (${detail})`);
    }
  }
  return result;
}
