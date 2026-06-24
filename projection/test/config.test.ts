import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ConfigError, loadConfig } from "../src/config.js";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "eunomai-cfg-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function write(name: string, content: string) {
  writeFileSync(join(dir, name), content);
}

describe("loadConfig", () => {
  it("loads a minimal valid config", () => {
    write("AGENTS.md", "# rules\n");
    write("eunomai.yaml", "targets: [claudecode, copilot]\nscopes:\n  project: ./AGENTS.md\n");
    const config = loadConfig(dir);
    expect(config.targets).toEqual(["claudecode", "copilot"]);
    expect(config.agentsPath).toBe(join(dir, "AGENTS.md"));
  });

  it("fails when eunomai.yaml is missing", () => {
    expect(() => loadConfig(dir)).toThrow(ConfigError);
  });

  it("rejects an unknown target", () => {
    write("AGENTS.md", "# rules\n");
    write("eunomai.yaml", "targets: [not-a-tool]\nscopes:\n  project: ./AGENTS.md\n");
    expect(() => loadConfig(dir)).toThrow(/Unknown target/);
  });

  it("rejects agentsmd as a target (it is the source)", () => {
    write("AGENTS.md", "# rules\n");
    write("eunomai.yaml", "targets: [agentsmd]\nscopes:\n  project: ./AGENTS.md\n");
    expect(() => loadConfig(dir)).toThrow(/is the source/);
  });

  it("fails when AGENTS.md is missing", () => {
    write("eunomai.yaml", "targets: [claudecode]\nscopes:\n  project: ./AGENTS.md\n");
    expect(() => loadConfig(dir)).toThrow(/AGENTS.md not found/);
  });
});
