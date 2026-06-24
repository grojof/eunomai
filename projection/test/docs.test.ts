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

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-docs-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("checkDocs", () => {
  it("passes when every link resolves and every in-scope page is indexed", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", "# Guide\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
    expect(r.checkedLinks).toBe(1);
    expect(r.scannedPages).toBe(1);
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

  it("does not flag dev-docs (docs/decisions, docs/development) when unindexed", () => {
    write("README.md", "# P\n\n- [Guide](docs/guide.md)\n");
    write("docs/guide.md", "# Guide\n");
    write("docs/decisions/0001-x/DECISION.md", "# ADR\n");
    write("docs/development/status/STATE.md", "# State\n");
    const r = checkDocs(dir);
    expect(r.broken).toEqual([]);
    expect(r.orphaned).toEqual([]);
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
