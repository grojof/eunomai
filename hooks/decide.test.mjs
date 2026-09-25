// eunomai safe-controls — unit tests for the decision logic, the config layers and the runner.
// Run: node --test "hooks/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULTS, GATES, LEVELS, actionFor, loadConfig } from "./config.mjs";
import { decide } from "./decide.mjs";

const CTX = { cwd: "/work/proj", projectDir: "/work/proj", home: "/home/u", env: {}, readFile: () => null };
const at = (level, extra = {}) => ({ ...DEFAULTS, level, ...extra, gates: { ...(extra.gates ?? {}) } });
const bash = (command, config = DEFAULTS, ctx = CTX) => decide("Bash", { command }, config, ctx);

const AI_LINE = "Co-Authored-By: Claude <noreply@anthropic.com>";
const AI_COMMIT = `git commit -m "feat: x\n\n${AI_LINE}"`;

// --- levels ---

test("levels are monotonic: a higher level never loosens a gate", () => {
  const rank = { off: 0, ask: 1, deny: 2 };
  for (const [id, row] of Object.entries(GATES)) {
    for (let k = 1; k < row.length; k++) assert.ok(rank[row[k]] >= rank[row[k - 1]], `${id} loosens at ${LEVELS[k]}`);
  }
});

test("strict asks for what standard lets through", () => {
  const strict = at("strict");
  assert.equal(bash("git push --force-with-lease", strict).decision, "ask");
  assert.equal(bash("rm -rf node_modules", strict).decision, "ask");
  assert.equal(bash("npm version minor", strict).decision, "ask");
  assert.equal(bash("grep -r credential src/", strict).decision, "ask");
});

test("critical keeps only the co-author deny, force-push and risky deletes", () => {
  const critical = at("critical");
  assert.equal(bash("git reset --hard", critical).decision, "allow");
  assert.equal(bash("cat .env", critical).decision, "allow");
  assert.equal(bash("git push --force", critical).decision, "ask");
  assert.equal(bash("rm -rf ~", critical).decision, "ask");
  assert.equal(bash(AI_COMMIT, critical).decision, "deny");
});

// --- explicit gate actions ---

test("a gate set to off stops firing; set to deny it blocks", () => {
  assert.equal(bash("git reset --hard", at("standard", { gates: { "reset-hard": "off" } })).decision, "allow");
  assert.equal(bash("git reset --hard", at("standard", { gates: { "reset-hard": "deny" } })).decision, "deny");
});

test("the reason names the gate, the safer form and how to relax", () => {
  const r = bash("git push --force");
  assert.equal(r.gate, "force-push");
  assert.match(r.reason, /\[force-push\]/);
  assert.match(r.reason, /--force-with-lease/);
  assert.match(r.reason, /eunomai\.local\.json/);
});

test("the co-author deny names the line and the attribution setting", () => {
  const r = bash(AI_COMMIT);
  assert.equal(r.decision, "deny");
  assert.match(r.reason, /noreply@anthropic\.com/);
  assert.match(r.reason, /attribution/);
});

// --- attribution policy ---

test("a project that requires Assisted-by asks for it, and accepts the minimal form", () => {
  const policy = { ...DEFAULTS, attribution: { commit: "assisted-by", pr: "assisted-by", tool: "Claude" } };
  const missing = bash('git commit -m "feat: x"', policy);
  assert.equal(missing.gate, "commit-disclosure");
  assert.match(missing.reason, /Assisted-by: Claude/);
  assert.equal(bash('git commit -m "feat: x" -m "Assisted-by: Claude"', policy).decision, "allow");
});

test("the tool name is configurable", () => {
  const policy = { ...DEFAULTS, attribution: { commit: "assisted-by", pr: "none", tool: "Copilot" } };
  assert.match(bash('git commit -m "feat: x"', policy).reason, /Assisted-by: Copilot/);
  assert.equal(bash('gh pr create --title t --body "no disclosure"', policy).decision, "allow");
});

test("a commit message read from a file is checked", () => {
  const ctx = { ...CTX, readFile: (f) => (f === "/work/proj/msg.txt" ? `feat: x\n\n${AI_LINE}\n` : null) };
  assert.equal(bash("git commit -F msg.txt", DEFAULTS, ctx).decision, "deny");
});

test("a commit message fed on stdin by a heredoc is checked", () => {
  assert.equal(bash(`git commit -F - <<'EOF'\nfeat: x\n\n${AI_LINE}\nEOF`).decision, "deny");
  assert.equal(bash(`git commit -F - <<'EOF'\nfeat: x\nEOF`).decision, "allow");
});

test("bundled -am carries the message", () => {
  assert.equal(bash(`git commit -am "feat: x\n\n${AI_LINE}"`).decision, "deny");
});

// --- protected paths and extra gates ---

test("a protected path inside the project asks", () => {
  const config = { ...DEFAULTS, protectedPaths: ["data"] };
  assert.equal(bash("rm -rf data/cache", config).gate, "recursive-delete");
  assert.equal(bash("rm -rf build", config).decision, "allow");
});

test("extra gates fire with their own action", () => {
  const config = { ...DEFAULTS, extraGates: [{ id: "prune", pattern: "docker\\s+system\\s+prune", reason: "org: docker prune", action: "deny" }] };
  const r = bash("docker system prune -a", config);
  assert.equal(r.decision, "deny");
  assert.equal(r.gate, "prune");
});

// --- config layers ---

function files(map) {
  return (p) => (p in map ? map[p] : null);
}

test("config: defaults when nothing is set", () => {
  const { config, errors, ignored } = loadConfig({ env: {}, projectDir: "/p", readFile: files({}) });
  assert.equal(config.level, "standard");
  assert.deepEqual([errors, ignored], [[], []]);
});

test("config: the committed project file may only tighten", () => {
  const { config, ignored } = loadConfig({
    env: {},
    projectDir: "/p",
    readFile: files({ "/p/.claude/eunomai.json": JSON.stringify({ level: "critical", gates: { "force-push": "off", "git-clean": "deny" } }) }),
  });
  assert.equal(config.level, "standard");
  assert.equal(actionFor(config, "force-push"), "ask");
  assert.equal(actionFor(config, "git-clean"), "deny");
  assert.equal(ignored.length, 2);
});

test("config: the project file may raise the level and set attribution outright", () => {
  const { config, sources } = loadConfig({
    env: {},
    projectDir: "/p",
    readFile: files({ "/p/.claude/eunomai.json": JSON.stringify({ level: "strict", attribution: { commit: "assisted-by" } }) }),
  });
  assert.equal(config.level, "strict");
  assert.equal(config.attribution.commit, "assisted-by");
  assert.equal(sources.attribution, "project");
});

test("config: the local file may relax anything", () => {
  const { config, sources } = loadConfig({
    env: {},
    projectDir: "/p",
    readFile: files({
      "/p/.claude/eunomai.json": JSON.stringify({ gates: { "reset-hard": "deny" } }),
      "/p/.claude/eunomai.local.json": JSON.stringify({ gates: { "reset-hard": "off" }, mode: "report" }),
    }),
  });
  assert.equal(actionFor(config, "reset-hard"), "off");
  assert.equal(config.mode, "report");
  assert.equal(sources["gates.reset-hard"], "local");
});

test("config: /config options and the legacy variables apply", () => {
  const { config } = loadConfig({
    env: { CLAUDE_PLUGIN_OPTION_LEVEL: "strict", EUNOMAI_TRAILER_RULE: "ask" },
    projectDir: "/p",
    readFile: files({}),
  });
  assert.equal(config.level, "strict");
  assert.equal(actionFor(config, "ai-coauthor"), "ask");
});

test("config: errors are collected, never thrown", () => {
  const { errors } = loadConfig({
    env: { EUNOMAI_TRAILER_RULE: "nonsense", EUNOMAI_EXTRA_GATES: "/missing.json" },
    projectDir: "/p",
    readFile: files({
      "/p/.claude/eunomai.local.json": "{ not json",
      "/p/.claude/eunomai.json": JSON.stringify({ gates: { "no-such-gate": "ask" }, extraGates: [{ pattern: "(" }], typo: 1 }),
    }),
  });
  assert.equal(errors.length, 6, errors.join("\n"));
});

// --- non-shell tools and malformed input ---

test("allow: non-shell tools and missing input", () => {
  assert.equal(decide("Edit", { file_path: "CLAUDE.md" }).decision, "allow");
  assert.equal(decide("Bash", {}).decision, "allow");
  assert.equal(decide("Bash", undefined).decision, "allow");
  assert.equal(decide("PowerShell", {}).decision, "allow");
});

// --- the runner, spawned ---

const GUARD = join(dirname(fileURLToPath(import.meta.url)), "guard.mjs");

function runGuard(args, input, env = {}, cwd) {
  const r = spawnSync(process.execPath, [GUARD, ...args], {
    input: input === undefined ? "" : typeof input === "string" ? input : JSON.stringify(input),
    encoding: "utf8",
    cwd,
    env: { ...process.env, EUNOMAI_TRAILER_RULE: "", EUNOMAI_EXTRA_GATES: "", CLAUDE_PLUGIN_OPTION_LEVEL: "", CLAUDE_PLUGIN_OPTION_MODE: "", ...env },
  });
  return { status: r.status, stdout: r.stdout };
}

test("guard.mjs: fail-open, deny output, report mode, hit log, --check", () => {
  const project = mkdtempSync(join(tmpdir(), "eunomai-proj-"));
  const data = mkdtempSync(join(tmpdir(), "eunomai-data-"));
  const env = { CLAUDE_PROJECT_DIR: project, CLAUDE_PLUGIN_DATA: data };
  try {
    // Malformed stdin -> exit 0, no output.
    const bad = runGuard([], "this is not json", env);
    assert.deepEqual([bad.status, bad.stdout], [0, ""]);

    // A co-author line -> deny.
    const commit = { tool_name: "Bash", tool_input: { command: AI_COMMIT }, cwd: project };
    const deny = runGuard([], commit, env);
    assert.equal(JSON.parse(deny.stdout).hookSpecificOutput.permissionDecision, "deny");

    // Report mode from the local file -> nothing emitted, the hit recorded without the command.
    mkdirSync(join(project, ".claude"));
    writeFileSync(join(project, ".claude", "eunomai.local.json"), JSON.stringify({ mode: "report" }));
    assert.equal(runGuard([], commit, env).stdout, "");
    const log = readFileSync(join(data, "guard-hits.jsonl"), "utf8");
    assert.match(log, /"gate":"ai-coauthor"/);
    assert.match(log, /"mode":"report"/);
    assert.doesNotMatch(log, /noreply/);
    assert.match(runGuard(["--hits"], undefined, env).stdout, /ai-coauthor/);

    // --check: exit 0 when clean, 1 with a looser committed value, and the note reaches the reason.
    assert.equal(runGuard(["--check"], undefined, env, project).status, 0);
    writeFileSync(join(project, ".claude", "eunomai.local.json"), "{}");
    writeFileSync(join(project, ".claude", "eunomai.json"), JSON.stringify({ gates: { "force-push": "off" } }));
    const checked = runGuard(["--check"], undefined, env, project);
    assert.equal(checked.status, 1);
    assert.match(checked.stdout, /IGNORED .*force-push/);
    const push = { tool_name: "Bash", tool_input: { command: "git push --force" }, cwd: project };
    assert.match(JSON.parse(runGuard([], push, env).stdout).hookSpecificOutput.permissionDecisionReason, /--check/);
  } finally {
    rmSync(project, { recursive: true, force: true });
    rmSync(data, { recursive: true, force: true });
  }
});

test("docs/safe-controls.md documents every gate with the actions the code uses", () => {
  const doc = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "safe-controls.md"), "utf8");
  for (const [id, row] of Object.entries(GATES)) {
    const m = doc.match(new RegExp("^\\| `" + id + "` \\|[^\\n]*\\| (\\w+) \\| (\\w+) \\| (\\w+) \\|$", "m"));
    assert.ok(m, `docs/safe-controls.md has no row for ${id}`);
    assert.deepEqual(m.slice(1), row, `docs/safe-controls.md row for ${id}`);
  }
});

test("config: a local file that git tracks may only tighten", () => {
  const { config, errors, sources } = loadConfig({
    env: {},
    projectDir: "/p",
    readFile: files({ "/p/.claude/eunomai.local.json": JSON.stringify({ mode: "report", gates: { "force-push": "off" } }) }),
    isTracked: (f) => f === "/p/.claude/eunomai.local.json",
  });
  assert.equal(config.mode, "enforce");
  assert.equal(actionFor(config, "force-push"), "ask");
  assert.ok(errors.some((e) => /tracked by git/.test(e)));
  assert.notEqual(sources.mode, "local");
});

test("a command the reader cannot handle asks instead of passing", () => {
  let deep = "git push --force";
  for (let k = 0; k < 6000; k++) deep = `"$(echo ${deep})"`;
  const r = bash(`echo ${deep}; git push --force`);
  assert.notEqual(r.decision, "allow");
});

test("config: an extra gate that could backtrack for ever is refused", () => {
  const { config, errors } = loadConfig({
    env: {},
    projectDir: "/p",
    readFile: files({ "/p/.claude/eunomai.local.json": JSON.stringify({ extraGates: [{ pattern: "^(\\w+\\s?)*$" }, { pattern: "(a+)+" }, { pattern: "docker\\s+system\\s+prune" }] }) }),
  });
  assert.equal(config.extraGates.length, 1);
  assert.equal(errors.filter((e) => /backtrack/.test(e)).length, 2);
});
