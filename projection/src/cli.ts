#!/usr/bin/env node
import { check, compile } from "./compile.js";
import { ConfigError, loadConfig } from "./config.js";

const HELP = `eunomai — connector-first governance for cross-tool AI workspaces

Usage:
  eunomai compile [--check]    Project AGENTS.md to the declared targets (via rulesync).
                               --check: read-only; exit 1 if any output has drifted.
  eunomai --help               Show this help.

Config: eunomai.yaml at the repo root, e.g.
  targets: [claudecode, copilot]
  scopes:
    project: ./AGENTS.md`;

/** Runs the CLI and returns a process exit code (does not call process.exit). */
async function run(argv: string[]): Promise<number> {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return 0;
  }

  const [cmd, ...rest] = args;
  if (cmd !== "compile") {
    console.error(`Unknown command: ${cmd}\n\n${HELP}`);
    return 1;
  }

  const isCheck = rest.includes("--check");
  const config = loadConfig();

  if (isCheck) {
    const { drifted, checked } = await check(config);
    if (drifted.length > 0) {
      console.error(`Drift detected in ${drifted.length} file(s):`);
      for (const f of drifted) console.error(`  - ${f}`);
      console.error("Run 'eunomai compile' to regenerate.");
      return 1;
    }
    console.log(`Up to date: ${checked.length} file(s) match AGENTS.md.`);
    return 0;
  }

  const { targets } = await compile(config);
  console.log(`Projected AGENTS.md to ${targets.length} target(s): ${targets.join(", ")}`);
  return 0;
}

run(process.argv)
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    if (err instanceof ConfigError) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    console.error("Unexpected error:", err);
    process.exit(2);
  });
