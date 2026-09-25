import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkDocs, DocsError } from "../src/docs.js";

let dir: string;
const write = (rel: string, body: string): void => {
  const abs = join(dir, rel);
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, body);
};

/** A page body with valid v2 frontmatter (required type/title/description). */
const page = (type: string, title = "T", description = "D"): string =>
  `---\ntype: ${type}\ntitle: ${title}\ndescription: ${description}\n---\n\n# ${title}\n`;

/** Seed the mandatory community-health files so checkDocs reports none missing. */
const writeHealthFiles = (): void => {
  write("LICENSE", "MIT\n");
  write("SECURITY.md", "# Security\n");
  write("CONTRIBUTING.md", "# Contributing\n");
  write("CHANGELOG.md", "# Changelog\n");
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-docs-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("checkDocs", () => {
  it("passes when every link resolves, every page is indexed, and frontmatter is valid", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", page("how-to", "Guide"));
    writeHealthFiles();
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
    expect(r.missingHealth).toEqual([]);
    expect(r.frontmatterIssues).toEqual([]);
    expect(r.checkedLinks).toBe(1);
    expect(r.scannedPages).toBe(1);
  });

  it("flags a page with no frontmatter", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", "# Guide\n");
    const r = checkDocs(dir);
    expect(r.frontmatterIssues).toEqual(["docs/guide.md: missing frontmatter"]);
  });

  it("flags a page whose type is not an allowed Diátaxis mode", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", page("guide", "Guide")); // 'guide' is not a valid type
    const r = checkDocs(dir);
    expect(r.frontmatterIssues.length).toBe(1);
    expect(r.frontmatterIssues[0]).toMatch(/docs\/guide\.md: invalid 'type'/);
  });

  it("flags missing or empty required fields", () => {
    write("README.md", "# P\n\n- [A](docs/a.md) [B](docs/b.md)\n");
    write("docs/a.md", "---\ntype: reference\ntitle: A\n---\n\n# A\n"); // no description
    write("docs/b.md", "---\ntype: reference\ntitle: ''\ndescription: D\n---\n\n# B\n"); // empty title
    const r = checkDocs(dir);
    expect(r.frontmatterIssues).toEqual([
      "docs/a.md: missing or empty 'description'",
      "docs/b.md: missing or empty 'title'",
    ]);
  });

  it("does not check frontmatter on dev-docs (ADRs under docs/decisions)", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", page("reference", "Guide"));
    write("docs/decisions/0001-x/DECISION.md", "# ADR\n"); // no frontmatter, but out of scope
    const r = checkDocs(dir);
    expect(r.frontmatterIssues).toEqual([]);
  });

  it("flags every mandatory community-health file when none are present", () => {
    write("README.md", "# P\n");
    const r = checkDocs(dir);
    expect(r.missingHealth).toEqual(["LICENSE", "SECURITY.md", "CONTRIBUTING.md", "CHANGELOG.md"]);
  });

  it("accepts community-health files in any GitHub-recognized location", () => {
    write("README.md", "# P\n");
    write("LICENSE.md", "MIT\n"); // root alias
    write(".github/SECURITY.md", "# Security\n"); // .github/
    write("docs/CONTRIBUTING.md", "# Contributing\n"); // docs/
    write("CHANGELOG.md", "# Changelog\n");
    const r = checkDocs(dir);
    expect(r.missingHealth).toEqual([]);
  });

  it("reports only the community-health files that are missing", () => {
    write("README.md", "# P\n");
    write("LICENSE", "MIT\n");
    write("CHANGELOG.md", "# Changelog\n");
    const r = checkDocs(dir);
    expect(r.missingHealth).toEqual(["SECURITY.md", "CONTRIBUTING.md"]);
  });

  it("flags a README link into docs/ that does not resolve", () => {
    write("README.md", "# P\n\n- [Gone](docs/missing.md)\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual(["docs/missing.md"]);
  });

  it("flags an in-scope docs page that is not indexed in the README", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", "# Guide\n");
    write("docs/extra.md", "# Extra\n");
    const r = checkDocs(dir);
    expect(r.orphaned).toEqual(["docs/extra.md"]);
  });

  it("counts a page as indexed when it is reachable from the README through other docs pages", () => {
    write("README.md", "# P\n\n- [Migration](docs/migration/README.md)\n");
    write(
      "docs/migration/README.md",
      page("explanation", "Migration") + "\n- [Running](running.md)\n",
    );
    write(
      "docs/migration/running.md",
      page("how-to", "Running") + "\n[Back](../migration/README.md)\n",
    );
    const r = checkDocs(dir);
    expect(r.orphaned).toEqual([]);
    expect(r.checkedLinks).toBe(1);
  });

  it("follows a link to a docs folder to its README.md or index.md", () => {
    write("README.md", "# P\n\n- [Guides](docs/guides/)\n");
    write("docs/guides/index.md", page("reference", "Guides") + "\n- [One](one.md)\n");
    write("docs/guides/one.md", page("how-to", "One"));
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
  });

  it("reports a broken link inside a reachable docs page", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write(
      "docs/guide.md",
      page("how-to", "Guide") + "\n[Gone](gone.md) [Web](https://x.dev) [Here](#top)\n",
    );
    const r = checkDocs(dir);
    expect(r.brokenInPages).toEqual(["docs/guide.md -> docs/gone.md"]);
  });

  it("reports broken relative links in AGENTS.md and CLAUDE.md", () => {
    write("README.md", "# P\n");
    write("AGENTS.md", "# Agents\n\nSee [roadmap](docs/roadmap.md) and [site](https://x.dev).\n");
    write("CLAUDE.md", "# Claude\n\n[Contrib](CONTRIBUTING.md)\n");
    write("CONTRIBUTING.md", "# C\n");
    const r = checkDocs(dir);
    expect(r.brokenInstructions).toEqual(["AGENTS.md -> docs/roadmap.md"]);
  });

  it("does not read examples as links: inline code, HTML comments, indented fences", () => {
    write(
      "README.md",
      "# P\n\n- [Guide](docs/guide.md)\n\nCite as `[ADR](docs/decisions/NNNN.md)`.\n",
    );
    write(
      "docs/guide.md",
      page("how-to", "Guide") +
        "\nWrite `[text](other.md)`.\n<!-- [old](old.md) -->\n\n- Example:\n\n  ```md\n  [x](missing.md)\n  ```\n",
    );
    write("AGENTS.md", "# A\n\nCite ADRs as ``[ADR-NNNN](docs/decisions/NNNN/DECISION.md)``.\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.brokenInPages).toEqual([]);
    expect(r.brokenInstructions).toEqual([]);
  });

  it("follows reference-style, HTML, root-absolute and bracketed links, and titles with parentheses", () => {
    write(
      "README.md",
      [
        "# P",
        "- [Ref][r]",
        '- <a href="docs/html.md">HTML</a>',
        "- [Root](/docs/root.md)",
        "- [The [beta] guide](docs/beta.md)",
        '- [Titled](docs/titled.md "Guide (v2)")',
        "",
        "[r]: docs/ref.md",
      ].join("\n"),
    );
    for (const f of ["ref", "html", "root", "beta", "titled"])
      write(`docs/${f}.md`, page("reference", f));
    const r = checkDocs(dir);
    expect(r.orphaned).toEqual([]);
    expect(r.broken).toEqual([]);
  });

  it("recognises a folder index whatever its case", () => {
    write("README.md", "# P\n\n- [Area](docs/area/)\n");
    write("docs/area/readme.md", page("explanation", "Area"));
    const r = checkDocs(dir);
    expect(r.orphaned).toEqual([]);
  });

  it("does not flag dev-docs (docs/decisions, ADRs) when unindexed", () => {
    write("README.md", "# P\n\n- [Guide](docs/guides/getting-started.md)\n");
    write("docs/guides/getting-started.md", "# Guide\n");
    write("docs/decisions/0001-x/DECISION.md", "# ADR\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
  });

  it("strips a leading UTF-8 BOM from the README and from pages (Windows editors)", () => {
    write("README.md", "\uFEFF# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", `\uFEFF${page("how-to", "Guide")}`);
    writeHealthFiles();
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
    expect(r.frontmatterIssues).toEqual([]);
    expect(r.missingHealth).toEqual([]);
  });

  it("resolves titled links, stripping the title part", () => {
    write("README.md", `# P\n\n- [Guide](docs/guide.md "The guide") [Also](docs/also.md 'Alt')\n`);
    write("docs/guide.md", page("how-to", "Guide"));
    write("docs/also.md", page("reference", "Also"));
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
    expect(r.checkedLinks).toBe(2);
  });

  it("percent-decodes link targets (%20) and falls back to the raw string on malformed escapes", () => {
    write("README.md", "# P\n\n- [My Page](docs/my%20page.md)\n- [Bad](docs/bad%2.md)\n");
    write("docs/my page.md", page("how-to", "My Page"));
    const r = checkDocs(dir);
    expect(r.orphaned).toEqual([]);
    expect(r.broken).toEqual(["docs/bad%2.md"]); // malformed escape: checked as-is, missing
  });

  it("ignores external URLs and anchors, and strips ./ and #fragments", () => {
    write("README.md", "# P\n\n[ext](https://x.y) [a](#top) [Guide](./docs/guide.md#sec)\n");
    write("docs/guide.md", "# Guide\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
    expect(r.checkedLinks).toBe(1);
  });

  it("throws DocsError when README is missing", () => {
    expect(() => checkDocs(dir)).toThrow(DocsError);
  });
});
