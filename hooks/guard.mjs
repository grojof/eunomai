#!/usr/bin/env node
// eunomai safe-controls — PreToolUse hook runner, and its two read-only commands.
//
//   node guard.mjs            the hook: reads the tool call on stdin, emits a decision only for
//                             `ask` or `deny`; any error falls open (exit 0, no output)
//   node guard.mjs --check    the effective configuration, where each value came from, and every
//                             configuration error or ignored value; exit 1 if there is one
//   node guard.mjs --hits [N] the last N gates that fired (default 20)
//
// Settings are merged by config.mjs (defaults · /config · EUNOMAI_* · .claude/eunomai.json tighten-only
// · .claude/eunomai.local.json). In `report` mode the hook decides nothing and only records.
// The hit log keeps the time, gate, action, mode and project — never the command text.

import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { GATES, actionFor, loadConfig } from "./config.mjs";
import { decide } from "./decide.mjs";

const LOG_NAME = "guard-hits.jsonl";
const LOG_KEEP = 500;

const readFile = (file) => {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
};

function logDirs(env) {
  if (env.CLAUDE_PLUGIN_DATA) return [env.CLAUDE_PLUGIN_DATA];
  // Outside a hook (the skill runs --hits by hand), look where Claude Code keeps plugin data.
  const base = path.join(homedir(), ".claude", "plugins", "data");
  let found = [];
  try {
    found = readdirSync(base)
      .filter((d) => d.startsWith("eunomai"))
      .map((d) => path.join(base, d));
  } catch {
    found = [];
  }
  return [...found, path.join(tmpdir(), "eunomai")];
}

function record(env, entry) {
  try {
    const dir = logDirs(env)[0];
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, LOG_NAME);
    appendFileSync(file, JSON.stringify(entry) + "\n");
    const lines = (readFile(file) ?? "").split("\n").filter(Boolean);
    if (lines.length > LOG_KEEP + 100) writeFileSync(file, lines.slice(-LOG_KEEP).join("\n") + "\n");
  } catch {
    // Recording is best-effort; it never affects the decision.
  }
}

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(""));
  });
}

// Whether git tracks a file: a local override that is committed belongs to the repository.
function isTracked(file) {
  try {
    const r = spawnSync("git", ["ls-files", "--error-unmatch", path.basename(file)], {
      cwd: path.dirname(file),
      stdio: "ignore",
      timeout: 2000,
    });
    return r.status === 0;
  } catch {
    return false;
  }
}

function projectOf(env, cwd) {
  return env.CLAUDE_PROJECT_DIR || cwd;
}

function check(env) {
  const projectDir = projectOf(env, process.cwd());
  const { config, sources, errors, ignored } = loadConfig({ env, projectDir, readFile, sep: path.sep, isTracked });
  const out = [];
  out.push(`project: ${projectDir}`);
  out.push(`level: ${config.level}   (from ${sources.level})`);
  out.push(`mode: ${config.mode}   (from ${sources.mode})`);
  out.push(
    `attribution: commit=${config.attribution.commit} pr=${config.attribution.pr} tool=${config.attribution.tool}   (from ${sources.attribution})`,
  );
  out.push("gates:");
  for (const id of Object.keys(GATES)) {
    const from = sources[`gates.${id}`] ?? `level ${config.level}`;
    out.push(`  ${id.padEnd(22)} ${actionFor(config, id).padEnd(5)} (from ${from})`);
  }
  for (const g of config.extraGates) out.push(`  ${g.id.padEnd(22)} ${g.action.padEnd(5)} (extra gate)`);
  if (config.protectedPaths.length) out.push(`protected paths: ${config.protectedPaths.join(", ")}`);
  for (const e of errors) out.push(`ERROR   ${e}`);
  for (const i of ignored) out.push(`IGNORED ${i}`);
  if (!errors.length && !ignored.length) out.push("configuration OK");
  process.stdout.write(out.join("\n") + "\n");
  return errors.length || ignored.length ? 1 : 0;
}

function hits(env, count) {
  const entries = [];
  for (const dir of logDirs(env)) {
    const text = readFile(path.join(dir, LOG_NAME));
    if (text) for (const line of text.split("\n").filter(Boolean)) {
      try {
        entries.push(JSON.parse(line));
      } catch {
        // skip a damaged line
      }
    }
  }
  entries.sort((a, b) => String(a.time).localeCompare(String(b.time)));
  const recent = entries.slice(-count);
  if (!recent.length) {
    process.stdout.write("no gate has fired yet\n");
    return 0;
  }
  for (const e of recent) process.stdout.write(`${e.time}  ${e.mode.padEnd(7)} ${e.action.padEnd(5)} ${e.gate}  ${e.project}\n`);
  return 0;
}

async function hook(env) {
  const input = JSON.parse(await readStdin());
  const cwd = typeof input.cwd === "string" ? input.cwd : process.cwd();
  const projectDir = projectOf(env, cwd);
  const { config, errors, ignored } = loadConfig({ env, projectDir, readFile, sep: path.sep, isTracked });
  const result = decide(input.tool_name, input.tool_input ?? {}, config, { cwd, projectDir, env });
  if (result.decision === "allow") return;

  record(env, {
    time: new Date().toISOString(),
    gate: result.gate,
    action: result.decision,
    mode: config.mode,
    project: projectDir,
  });
  if (config.mode === "report") return;

  const note = errors.length || ignored.length ? " (eunomai config has problems: run hooks/guard.mjs --check)" : "";
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: result.decision,
        permissionDecisionReason: (result.reason ?? "") + note,
      },
    }),
  );
}

const args = process.argv.slice(2);
try {
  if (args[0] === "--check") process.exit(check(process.env));
  if (args[0] === "--hits") process.exit(hits(process.env, Number(args[1]) > 0 ? Number(args[1]) : 20));
  await hook(process.env);
  process.exit(0);
} catch {
  // Fail open: never block the user because a guardrail malfunctioned.
  process.exit(0);
}
