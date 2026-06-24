import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const DOCS_DIR = "docs";

/** Dev-docs directories excluded from the project-docs standard (out of scope). */
const DEV_DOC_DIRS = ["docs/decisions", "docs/development"];

/** Raised when the docs structure cannot be checked (e.g. no README). */
export class DocsError extends Error {}

export type DocsCheckResult = {
  /** README links into docs/ that do not resolve to an existing file (repo-relative). */
  broken: string[];
  /** In-scope docs/ pages not reachable from the README index (repo-relative). */
  orphaned: string[];
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
 * Read-only README↔docs/ integrity check. Verifies every README link into docs/
 * resolves, and every in-scope docs/ page is referenced by the README index.
 * Writes nothing. Dev-docs (docs/decisions, docs/development) are out of scope.
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

  return {
    broken: [...new Set(broken)].sort(),
    orphaned,
    checkedLinks: links.length,
    scannedPages: pages.length,
  };
}
