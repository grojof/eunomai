import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";

const DOCS_DIR = "docs";

/** Dev-docs directories excluded from the project-docs standard (out of scope). */
const DEV_DOC_DIRS = ["docs/decisions"];

/**
 * The allowed Diátaxis modes for a page's required `type` frontmatter field (living-docs v2).
 * The mode is a lens carried in frontmatter, not a folder — see docs/reference/living-docs.md.
 */
const DOC_TYPES = new Set(["tutorial", "how-to", "reference", "explanation", "decision"]);

/** Leading YAML frontmatter block (between the opening and closing `---` fences). */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * The mandatory community-health files (the "project surface" layer of the living-docs
 * standard), each with the locations GitHub recognizes. A file is present if any candidate
 * exists. Anchored to GitHub Community Standards; see docs/reference/living-docs.md.
 */
const HEALTH_FILES: ReadonlyArray<{ name: string; candidates: readonly string[] }> = [
  { name: "LICENSE", candidates: ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING", ".github/LICENSE", "docs/LICENSE"] },
  { name: "SECURITY.md", candidates: ["SECURITY.md", ".github/SECURITY.md", "docs/SECURITY.md"] },
  { name: "CONTRIBUTING.md", candidates: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"] },
  { name: "CHANGELOG.md", candidates: ["CHANGELOG.md", "docs/CHANGELOG.md"] },
];

/** Raised when the docs structure cannot be checked (e.g. no README). */
export class DocsError extends Error {}

export type DocsCheckResult = {
  /** README links into docs/ that do not resolve to an existing file (repo-relative). */
  broken: string[];
  /** In-scope docs/ pages not reachable from the README index (repo-relative). */
  orphaned: string[];
  /** Mandatory community-health files absent from every recognized location (by name). */
  missingHealth: string[];
  /** In-scope docs/ pages whose frontmatter shape is missing or invalid (`page: reason`). */
  frontmatterIssues: string[];
  /** Count of README links into docs/ that were checked. */
  checkedLinks: number;
  /** Count of in-scope project-doc pages scanned. */
  scannedPages: number;
};

const MD_LINK = /\[[^\]]*\]\(([^)]+)\)/g;

const toPosix = (p: string): string => p.split("\\").join("/");

const isDevDoc = (relPosix: string): boolean =>
  DEV_DOC_DIRS.some((d) => relPosix === d || relPosix.startsWith(`${d}/`));

/** README link targets that point into docs/ (relative, non-anchor, non-URL). */
function docsLinks(readme: string): string[] {
  const targets: string[] = [];
  for (const match of readme.matchAll(MD_LINK)) {
    const captured = match[1];
    if (captured === undefined) continue;
    let target = captured.trim().replace(/^<|>$/g, "");
    const hash = target.indexOf("#");
    if (hash >= 0) target = target.slice(0, hash);
    if (target === "" || /^[a-z]+:/i.test(target)) continue; // skip empty, http:, mailto:, …
    target = toPosix(target.replace(/^\.\//, ""));
    if (target === DOCS_DIR || target.startsWith(`${DOCS_DIR}/`)) targets.push(target);
  }
  return targets;
}

/** Recursively collect in-scope project-doc `.md` pages under docs/ (repo-relative posix). */
function inScopePages(cwd: string): string[] {
  const root = resolve(cwd, DOCS_DIR);
  if (!existsSync(root)) return [];
  const pages: string[] = [];
  const walk = (absDir: string): void => {
    for (const entry of readdirSync(absDir)) {
      const abs = join(absDir, entry);
      const rel = toPosix(relative(cwd, abs));
      if (statSync(abs).isDirectory()) {
        if (!isDevDoc(rel)) walk(abs);
      } else if (entry.toLowerCase().endsWith(".md") && !isDevDoc(rel)) {
        pages.push(rel);
      }
    }
  };
  walk(root);
  return pages;
}

/**
 * Validate a page's frontmatter **shape** (not its prose): a leading YAML block with a
 * `type` in {@link DOC_TYPES} and non-empty `title` and `description`. Returns a short
 * reason string when the shape is wrong, or `null` when it is valid. Deterministic — it
 * never judges whether the content truly matches its `type` (that is the coherence-auditor's
 * one-shot, human-resolved job, deliberately not part of the gate).
 */
function frontmatterIssue(text: string): string | null {
  const match = FRONTMATTER.exec(text);
  if (!match || match[1] === undefined) return "missing frontmatter";

  let data: unknown;
  try {
    data = parse(match[1]);
  } catch {
    return "unparseable frontmatter";
  }
  if (data === null || typeof data !== "object") return "empty frontmatter";

  const fm = data as Record<string, unknown>;
  if (typeof fm.type !== "string" || !DOC_TYPES.has(fm.type)) {
    return `invalid 'type' (expected one of ${[...DOC_TYPES].join(", ")})`;
  }
  if (typeof fm.title !== "string" || fm.title.trim() === "") return "missing or empty 'title'";
  if (typeof fm.description !== "string" || fm.description.trim() === "") {
    return "missing or empty 'description'";
  }
  return null;
}

/** Mandatory community-health files with no recognized location present (by name). */
function missingHealthFiles(cwd: string): string[] {
  return HEALTH_FILES.filter((f) => !f.candidates.some((c) => existsSync(resolve(cwd, c)))).map(
    (f) => f.name,
  );
}

/**
 * Read-only README↔docs/ integrity check. Verifies every README link into docs/
 * resolves, every in-scope docs/ page is referenced by the README index, and the
 * mandatory community-health files (the project-surface layer) are present.
 * Writes nothing. Dev-docs (docs/decisions — ADRs) are out of scope.
 */
export function checkDocs(cwd: string = process.cwd()): DocsCheckResult {
  const readmePath = resolve(cwd, "README.md");
  if (!existsSync(readmePath)) throw new DocsError(`No README.md found at ${cwd}.`);

  const links = docsLinks(readFileSync(readmePath, "utf8"));
  const broken: string[] = [];
  const referenced = new Set<string>();
  for (const target of links) {
    if (existsSync(resolve(cwd, target))) referenced.add(target);
    else broken.push(target);
  }

  const pages = inScopePages(cwd);
  const orphaned = pages.filter((p) => !referenced.has(p)).sort();

  const frontmatterIssues: string[] = [];
  for (const page of pages) {
    const issue = frontmatterIssue(readFileSync(resolve(cwd, page), "utf8"));
    if (issue !== null) frontmatterIssues.push(`${page}: ${issue}`);
  }
  frontmatterIssues.sort();

  return {
    broken: [...new Set(broken)].sort(),
    orphaned,
    missingHealth: missingHealthFiles(cwd),
    frontmatterIssues,
    checkedLinks: links.length,
    scannedPages: pages.length,
  };
}
