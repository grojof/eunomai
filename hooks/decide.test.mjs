// eunomai safe-controls — unit tests for the pure decision logic.
// Run: node --test "hooks/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decide } from "./decide.mjs";

const bash = (command, config) => decide("Bash", { command }, config);
const pwsh = (command, config) => decide("PowerShell", { command }, config);
const edit = (file_path) => decide("Edit", { file_path });

const TRAILER_COMMIT = 'git commit -m "feat: x\n\nCo-Authored-By: Claude <noreply@anthropic.com>"';

// --- Commit-trailer guard (deny) ---

test("deny: commit with Co-Authored-By Claude trailer", () => {
  const r = bash(TRAILER_COMMIT);
  assert.equal(r.decision, "deny");
  assert.match(r.reason, /trailer/i);
});

test("deny: commit with 'Generated with Claude Code' line", () => {
  const r = bash('git commit -m "fix: y\n\n🤖 Generated with Claude Code"');
  assert.equal(r.decision, "deny");
});

test("deny: trailer commit behind git global options (-C / -c)", () => {
  const c = 'commit -m "feat: z\n\nCo-Authored-By: Claude <noreply@anthropic.com>"';
  assert.equal(bash(`git -C /some/repo ${c}`).decision, "deny");
  assert.equal(bash(`git -c user.email=x@y.dev ${c}`).decision, "deny");
});

test("deny: trailer commit issued through the PowerShell tool", () => {
  assert.equal(pwsh(TRAILER_COMMIT).decision, "deny");
});

test("allow: clean conventional-commit message", () => {
  const r = bash('git commit -m "feat: add safe-controls hooks"');
  assert.equal(r.decision, "allow");
});

// --- Safety-gate escalation (ask) ---

test("ask: force push in all its spellings", () => {
  assert.equal(bash("git push --force origin main").decision, "ask");
  assert.equal(bash("git push --force-with-lease").decision, "ask");
  assert.equal(bash("git push -f origin main").decision, "ask");
  assert.equal(bash("git push origin +main").decision, "ask");
  assert.equal(bash("git -C /some/repo push --force").decision, "ask");
});

test("ask: recursive force delete (bundled, split, long flags)", () => {
  assert.equal(bash("rm -rf build/").decision, "ask");
  assert.equal(bash("rm -fr ./dist").decision, "ask");
  assert.equal(bash("rm -r -f node_modules").decision, "ask");
  assert.equal(bash("rm --recursive --force out/").decision, "ask");
});

test("ask: git clean with an f-flag", () => {
  assert.equal(bash("git clean -fdx").decision, "ask");
  assert.equal(bash("git clean -xdf").decision, "ask");
  assert.equal(bash("git clean --force -d").decision, "ask");
});

test("ask: PowerShell-native recursive force delete, any flag order", () => {
  assert.equal(pwsh("Remove-Item -Recurse -Force build").decision, "ask");
  assert.equal(pwsh("Remove-Item build -Force -Recurse").decision, "ask");
  assert.equal(pwsh("del temp -Recurse -Force").decision, "ask");
  assert.equal(pwsh("ri .\\dist -recurse -force").decision, "ask");
});

test("ask: version bump", () => {
  assert.equal(bash("npm version minor").decision, "ask");
  assert.equal(bash("pnpm version patch").decision, "ask");
});

test("ask: command touching secrets / .env / ssh keys", () => {
  assert.equal(bash("cat .env").decision, "ask");
  assert.equal(bash("vim config/secrets/key").decision, "ask");
  assert.equal(bash("cat ~/.ssh/id_ed25519").decision, "ask");
  assert.equal(bash("cat ~/.ssh/id_rsa").decision, "ask");
});

test("allow: ordinary reversible commands", () => {
  assert.equal(bash("git status").decision, "allow");
  assert.equal(bash("npm test").decision, "allow");
  assert.equal(bash("git push origin main").decision, "allow");
  assert.equal(bash("rm -f single-file.log").decision, "allow");
  assert.equal(bash("git clean -n -d").decision, "allow");
  assert.equal(pwsh("Remove-Item build").decision, "allow");
});

// --- Confirmed false positives stay allowed ---

test("allow: process.env is not a .env file", () => {
  assert.equal(bash('node -e "console.log(process.env.PATH)"').decision, "allow");
  assert.equal(bash('grep -rn "process.env" src/').decision, "allow");
});

test("allow: git's credential.helper config key is not a credential file", () => {
  assert.equal(bash("git config credential.helper store").decision, "allow");
});

// --- Org override seam (config) ---

test("config: trailer rule 'ask' downgrades the deny", () => {
  const r = bash(TRAILER_COMMIT, { trailerRule: "ask" });
  assert.equal(r.decision, "ask");
  assert.match(r.reason, /trailer/i);
});

test("config: trailer rule 'off' disables the rule", () => {
  assert.equal(bash(TRAILER_COMMIT, { trailerRule: "off" }).decision, "allow");
});

test("config: unknown trailer rule falls back to deny", () => {
  assert.equal(bash(TRAILER_COMMIT, { trailerRule: "nonsense" }).decision, "deny");
});

test("config: extra gates append to the ask-gates", () => {
  const config = { extraGates: [{ pattern: "docker\\s+system\\s+prune", reason: "org: docker prune" }] };
  const r = bash("docker system prune -a", config);
  assert.equal(r.decision, "ask");
  assert.match(r.reason, /docker prune/);
});

test("config: invalid extra-gate entries are ignored (fail open)", () => {
  assert.equal(bash("docker system prune", { extraGates: [{ pattern: "(", reason: "broken" }] }).decision, "allow");
  assert.equal(bash("docker system prune", { extraGates: "not-an-array" }).decision, "allow");
  assert.equal(bash("docker system prune", { extraGates: [null, { reason: "no pattern" }] }).decision, "allow");
});

// --- Non-shell tools are unguarded (CLAUDE.md is the single authored source) ---

test("allow: editing any file, including CLAUDE.md", () => {
  assert.equal(edit("CLAUDE.md").decision, "allow");
  assert.equal(decide("Write", { file_path: "C:\\repo\\CLAUDE.md" }).decision, "allow");
  assert.equal(edit("src/index.ts").decision, "allow");
});

// --- Fail-open shape: malformed / unknown inputs resolve to allow ---

test("allow: missing or unknown inputs", () => {
  assert.equal(decide("Bash", {}).decision, "allow");
  assert.equal(decide("Bash", undefined).decision, "allow");
  assert.equal(decide("PowerShell", {}).decision, "allow");
  assert.equal(decide("Read", { file_path: "CLAUDE.md" }).decision, "allow");
});

// --- Spawn-level: the guard.mjs runner itself ---

const GUARD = join(dirname(fileURLToPath(import.meta.url)), "guard.mjs");

function runGuard(input, env = {}) {
  const r = spawnSync(process.execPath, [GUARD], {
    input: typeof input === "string" ? input : JSON.stringify(input),
    encoding: "utf8",
    env: { ...process.env, EUNOMAI_TRAILER_RULE: "", EUNOMAI_EXTRA_GATES: "", ...env },
  });
  return { status: r.status, stdout: r.stdout };
}

test("guard.mjs (spawned): fail-open, deny output, env config seam", () => {
  // Malformed stdin -> exit 0, empty stdout (fail open).
  const bad = runGuard("this is not json");
  assert.equal(bad.status, 0);
  assert.equal(bad.stdout, "");

  // A deny input -> stdout JSON carries permissionDecision "deny".
  const denyInput = { tool_name: "Bash", tool_input: { command: TRAILER_COMMIT } };
  const deny = runGuard(denyInput);
  assert.equal(deny.status, 0);
  assert.equal(JSON.parse(deny.stdout).hookSpecificOutput.permissionDecision, "deny");

  // EUNOMAI_TRAILER_RULE=off -> the same input passes silently.
  assert.equal(runGuard(denyInput, { EUNOMAI_TRAILER_RULE: "off" }).stdout, "");

  // EUNOMAI_EXTRA_GATES pointing at a real JSON file -> gate applies.
  const dir = mkdtempSync(join(tmpdir(), "eunomai-gates-"));
  const gatesPath = join(dir, "gates.json");
  writeFileSync(gatesPath, JSON.stringify([{ pattern: "docker\\s+system\\s+prune", reason: "org: docker prune" }]));
  const pruneInput = { tool_name: "Bash", tool_input: { command: "docker system prune -a" } };
  const extra = runGuard(pruneInput, { EUNOMAI_EXTRA_GATES: gatesPath });
  assert.equal(JSON.parse(extra.stdout).hookSpecificOutput.permissionDecision, "ask");
  rmSync(dir, { recursive: true, force: true });

  // Unreadable extra-gates path -> silently ignored (fail open).
  assert.equal(runGuard(pruneInput, { EUNOMAI_EXTRA_GATES: join(dir, "missing.json") }).stdout, "");
});
