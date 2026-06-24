import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { check, compile } from "../src/compile.js";
import { loadConfig } from "../src/config.js";

let dir: string;
const AGENTS = "# Test project\n\n## Conventions\n- LF, UTF-8.\n";

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-compile-"));
  writeFileSync(join(dir, "AGENTS.md"), AGENTS);
  writeFileSync(
    join(dir, "eunomai.yaml"),
    "targets: [claudecode, copilot]\nscopes:\n  project: ./AGENTS.md\n",
  );
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("compile", () => {
  it("projects AGENTS.md to the declared targets via rulesync", async () => {
    const config = loadConfig(dir);
    const result = await compile(config, dir);
    expect(result.targets).toEqual(["claudecode", "copilot"]);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(dir, ".github", "copilot-instructions.md"))).toBe(true);
    expect(readFileSync(join(dir, "CLAUDE.md"), "utf8")).toContain("Test project");
  });

  it("is idempotent (second run leaves files byte-identical)", async () => {
    const config = loadConfig(dir);
    await compile(config, dir);
    const first = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    await compile(config, dir);
    const second = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    expect(second).toBe(first);
  });
});

describe("check", () => {
  it("reports no drift right after a compile", async () => {
    const config = loadConfig(dir);
    await compile(config, dir);
    const { drifted, checked } = await check(config, dir);
    expect(drifted).toEqual([]);
    expect(checked.length).toBeGreaterThan(0);
  });

  it("detects drift when a generated file is hand-edited", async () => {
    const config = loadConfig(dir);
    await compile(config, dir);
    writeFileSync(join(dir, "CLAUDE.md"), "hand-edited\n");
    const { drifted } = await check(config, dir);
    expect(drifted).toContain("CLAUDE.md");
  });

  it("detects drift when a generated file is missing (never compiled)", async () => {
    const config = loadConfig(dir);
    const { drifted } = await check(config, dir);
    expect(drifted.length).toBeGreaterThan(0);
  });
});
