import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CLI_VERSION, run } from "../src/run.js";

/** The single source of truth the build injects (see tsup.config.ts / vitest.config.ts). */
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("run", () => {
  it("prints the package.json version for --version and exits 0", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(run(["node", "cli", "--version"])).toBe(0);
    expect(log).toHaveBeenCalledWith(pkg.version);
  });

  it("bakes the injected version into CLI_VERSION", () => {
    expect(CLI_VERSION).toBe(pkg.version);
  });

  it("shows the version and the --version flag in the help text", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(run(["node", "cli", "--help"])).toBe(0);
    const help = String(log.mock.calls[0]?.[0]);
    expect(help).toContain(pkg.version);
    expect(help).toContain("--version");
  });
});

describe("docs-check community-health files", () => {
  const repo = (): string => {
    const dir = mkdtempSync(join(tmpdir(), "eunomai-cli-"));
    mkdirSync(join(dir, "docs"));
    writeFileSync(join(dir, "README.md"), "# P\n\n- [Guide](docs/guide.md)\n");
    writeFileSync(
      join(dir, "docs", "guide.md"),
      "---\ntype: how-to\ntitle: G\ndescription: D\n---\n",
    );
    return dir;
  };

  it("warns about a missing LICENSE and passes", () => {
    const dir = repo();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    expect(run(["node", "cli", "docs-check"], dir)).toBe(0);
    expect(warn.mock.calls.flat().join("\n")).toMatch(/LICENSE/);
    rmSync(dir, { recursive: true, force: true });
  });

  it("fails on a missing LICENSE with --require-health", () => {
    const dir = repo();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(run(["node", "cli", "docs-check", "--require-health"], dir)).toBe(1);
    expect(error.mock.calls.flat().join("\n")).toMatch(/missing community-health file: LICENSE/);
    rmSync(dir, { recursive: true, force: true });
  });
});
