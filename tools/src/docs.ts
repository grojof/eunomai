import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, posix, relative, resolve } from "node:path";
import { parse } from "yaml";

const DOCS_DIR = "docs";

/** Dev-docs directories excluded from the project-docs standard (out of scope). */
const DEV_DOC_DIRS = ["docs/decisions"];

/**
 * The allowed Diátaxis modes for a page's required `type` frontmatter field (living-docs v2).
 * The mode is a lens carried in frontmatter, not a folder — see docs/living-docs.md.
 */
const DOC_TYPES = new Set(["tutorial", "how-to", "reference", "explanation", "decision"]);

/** Leading YAML frontmatter block (between the opening and closing `---` fences). */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * The mandatory community-health files (the "project surface" layer of the living-docs
 * standard), each with the locations GitHub recognizes. A file is present if any candidate
 * exists. Anchored to GitHub Community Standards; see docs/living-docs.md.
 */
const HEALTH_FILES: ReadonlyArray<{ name: string; candidates: readonly string[] }> = [
  {
    name: "LICENSE",
    candidates: [
      "LICENSE",
      "LICENSE.md",
      "LICENSE.txt",
      "COPYING",
      ".github/LICENSE",
      "docs/LICENSE",
    ],
  },
  { name: "SECURITY.md", candidates: ["SECURITY.md", ".github/SECURITY.md", "docs/SECURITY.md"] },
  {
    name: "CONTRIBUTING.md",
    candidates: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
  },
  { name: "CHANGELOG.md", candidates: ["CHANGELOG.md", "docs/CHANGELOG.md"] },
];

/** Raised when the docs structure cannot be checked (e.g. no README). */
export class DocsError extends Error {}

export type DocsCheckResult = {
  /** README links into docs/ that do not resolve to an existing file (repo-relative). */
  broken: string[];
  /** Links from a reachable docs/ page into docs/ that do not resolve (`page -> target`). */
  brokenInPages: string[];
  /** Relative links in the instruction files (AGENTS.md, CLAUDE.md) that do not resolve (`file -> target`). */
  brokenInstructions: string[];
  /** In-scope docs/ pages not reachable from the README map, directly or through other pages (repo-relative). */
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

// An inline link or image: text may hold one level of brackets; the target may hold balanced parentheses;
// an optional title in quotes or parentheses follows.
const MD_LINK =
  /\[(?:[^[\]\n]|\[[^\]\n]*\])*\]\(\s*(<[^>\n]*>|[^\s()]+(?:\([^\s()]*\)[^\s()]*)*)(?:\s+(?:"[^"\n]*"|'[^'\n]*'|\([^)\n]*\)))?\s*\)/g;
/** A reference-style link definition: `[label]: target`. */
const MD_REF_DEF = /^[ \t]{0,3}\[[^\]\n]+\]:[ \t]*(<[^>\n]*>|\S+)/gm;
/** An HTML anchor's href. */
const HTML_HREF = /<a\s[^>]*?href\s*=\s*["']([^"']+)["']/gi;

const toPosix = (p: string): string => p.split("\\").join("/");

/** Read a UTF-8 text file, stripping a leading BOM (common from Windows editors). */
const readText = (abs: string): string => readFileSync(abs, "utf8").replace(/^\uFEFF/, "");

const isDevDoc = (relPosix: string): boolean =>
  DEV_DOC_DIRS.some((d) => relPosix === d || relPosix.startsWith(`${d}/`));

/** Percent-decode a link target (`%20` → space); malformed escapes fall back to the raw string. */
function decodeTarget(target: string): string {
  try {
    return decodeURIComponent(target);
  } catch {
    return target;
  }
}

/** Examples rather than links: HTML comments, fenced code (indented too), and inline code spans. */
function withoutExamples(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[`~]*[ \t]*$/gm, "")
    .replace(/(`+)[^`\n][\s\S]*?\1/g, "");
}

type Link = { target: string; rooted: boolean };

/**
 * Local link targets in a Markdown text: inline links and images, reference definitions, and HTML
 * anchors — URLs, anchors and query strings stripped. `rooted` targets start with `/` and resolve from
 * the repository root, as GitHub resolves them.
 */
function relativeLinks(text: string): Link[] {
  const clean = withoutExamples(text);
  const raw = [
    ...[...clean.matchAll(MD_LINK)].map((m) => m[1]),
    ...[...clean.matchAll(MD_REF_DEF)].map((m) => m[1]),
    ...[...clean.matchAll(HTML_HREF)].map((m) => m[1]),
  ];
  const links: Link[] = [];
  for (const captured of raw) {
    if (captured === undefined) continue;
    let target = captured.trim().replace(/^<|>$/g, "");
    const cut = target.search(/[#?]/);
    if (cut >= 0) target = target.slice(0, cut);
    if (target === "" || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) continue; // URLs, anchors
    const rooted = target.startsWith("/");
    links.push({ target: toPosix(decodeTarget(rooted ? target.slice(1) : target)), rooted });
  }
  return links;
}

const inDocs = (rel: string): boolean => rel === DOCS_DIR || rel.startsWith(`${DOCS_DIR}/`);

/** README link targets that point into docs/ (repo-relative). */
function docsLinks(readme: string): string[] {
  return relativeLinks(readme)
    .map((l) => posix.normalize(l.target).replace(/\/+$/, ""))
    .filter(inDocs);
}

/** The page a link reaches: the file itself, or a folder's README.md / index.md. */
function pageOf(cwd: string, rel: string): string | null {
  const abs = resolve(cwd, rel);
  const stat = statSync(abs, { throwIfNoEntry: false });
  if (stat === undefined) return null;
  if (stat.isFile()) return rel.toLowerCase().endsWith(".md") ? rel : null;
  // The folder's index, whatever its case (GitHub renders readme.md as the folder's README).
  const entries = readdirSync(abs);
  for (const wanted of ["readme.md", "index.md"]) {
    const found = entries.find((e) => e.toLowerCase() === wanted);
    if (found !== undefined) return posix.join(rel, found);
  }
  return null;
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
      const stat = statSync(abs, { throwIfNoEntry: false }); // undefined for broken symlinks
      if (stat === undefined) continue;
      if (stat.isDirectory()) {
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
 * Read-only README↔docs/ integrity check. Verifies every README link into docs/ resolves, every
 * in-scope docs/ page is reachable from the README map (directly, or through the links of other
 * reachable pages, so nested indexes work), links inside reachable pages and in the instruction
 * files (AGENTS.md, CLAUDE.md) resolve, and reports the community-health files that are missing.
 * Writes nothing. Dev-docs (docs/decisions — ADRs) are out of scope.
 */
export function checkDocs(cwd: string = process.cwd()): DocsCheckResult {
  const readmePath = resolve(cwd, "README.md");
  if (!existsSync(readmePath)) throw new DocsError(`No README.md found at ${cwd}.`);

  const links = docsLinks(readText(readmePath));
  const broken: string[] = [];
  const brokenInPages: string[] = [];
  const reached = new Set<string>();
  const queue: string[] = [];
  const reach = (rel: string): void => {
    const target = pageOf(cwd, rel);
    if (target !== null && !reached.has(target)) {
      reached.add(target);
      queue.push(target);
    }
  };
  for (const target of links) {
    if (existsSync(resolve(cwd, target))) reach(target);
    else broken.push(target);
  }
  // Follow the link graph through docs/: a page linked from a reachable page is reachable too.
  while (queue.length > 0) {
    const current = queue.shift() as string;
    if (isDevDoc(current)) continue;
    for (const link of relativeLinks(readText(resolve(cwd, current)))) {
      const from = link.rooted ? link.target : posix.join(posix.dirname(current), link.target);
      const target = posix.normalize(from).replace(/\/+$/, "");
      if (!inDocs(target)) continue;
      if (existsSync(resolve(cwd, target))) reach(target);
      else brokenInPages.push(`${current} -> ${target}`);
    }
  }

  const brokenInstructions: string[] = [];
  for (const file of ["AGENTS.md", "CLAUDE.md"]) {
    const abs = resolve(cwd, file);
    if (!existsSync(abs)) continue;
    for (const link of relativeLinks(readText(abs))) {
      const target = posix.normalize(link.target).replace(/\/+$/, "");
      if (!existsSync(resolve(cwd, target))) brokenInstructions.push(`${file} -> ${target}`);
    }
  }

  const pages = inScopePages(cwd);
  const orphaned = pages.filter((p) => !reached.has(p)).sort();

  const frontmatterIssues: string[] = [];
  for (const page of pages) {
    const issue = frontmatterIssue(readText(resolve(cwd, page)));
    if (issue !== null) frontmatterIssues.push(`${page}: ${issue}`);
  }
  frontmatterIssues.sort();

  return {
    broken: [...new Set(broken)].sort(),
    brokenInPages: [...new Set(brokenInPages)].sort(),
    brokenInstructions: [...new Set(brokenInstructions)].sort(),
    orphaned,
    missingHealth: missingHealthFiles(cwd),
    frontmatterIssues,
    checkedLinks: links.length,
    scannedPages: pages.length,
  };
}
