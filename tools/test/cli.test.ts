import { readFileSync } from "node:fs";
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
