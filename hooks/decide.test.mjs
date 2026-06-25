// eunomai safe-controls — unit tests for the pure decision logic.
// Run: node --test hooks/
import { test } from "node:test";
import assert from "node:assert/strict";
import { decide } from "./decide.mjs";

const bash = (command) => decide("Bash", { command });
const edit = (file_path) => decide("Edit", { file_path });

// --- Commit-trailer guard (deny) ---

test("deny: commit with Co-Authored-By Claude trailer", () => {
  const r = bash('git commit -m "feat: x\n\nCo-Authored-By: Claude <noreply@anthropic.com>"');
  assert.equal(r.decision, "deny");
  assert.match(r.reason, /trailer/i);
});

test("deny: commit with 'Generated with Claude Code' line", () => {
  const r = bash('git commit -m "fix: y\n\n🤖 Generated with Claude Code"');
  assert.equal(r.decision, "deny");
});

test("allow: clean conventional-commit message", () => {
  const r = bash('git commit -m "feat: add safe-controls hooks"');
  assert.equal(r.decision, "allow");
});

// --- Safety-gate escalation (ask) ---

test("ask: force push", () => {
  assert.equal(bash("git push --force origin main").decision, "ask");
  assert.equal(bash("git push --force-with-lease").decision, "ask");
});

test("ask: recursive force delete", () => {
  assert.equal(bash("rm -rf build/").decision, "ask");
  assert.equal(bash("rm -fr ./dist").decision, "ask");
});

test("ask: version bump", () => {
  assert.equal(bash("npm version minor").decision, "ask");
  assert.equal(bash("pnpm version patch").decision, "ask");
});

test("ask: command touching secrets / .env", () => {
  assert.equal(bash("cat .env").decision, "ask");
  assert.equal(bash("vim config/secrets/key").decision, "ask");
});

test("allow: ordinary reversible commands", () => {
  assert.equal(bash("git status").decision, "allow");
  assert.equal(bash("npm test").decision, "allow");
});

// --- Edits are unguarded (CLAUDE.md is the single authored source) ---

test("allow: editing any file, including CLAUDE.md", () => {
  assert.equal(edit("CLAUDE.md").decision, "allow");
  assert.equal(decide("Write", { file_path: "C:\\repo\\CLAUDE.md" }).decision, "allow");
  assert.equal(edit("src/index.ts").decision, "allow");
});

// --- Fail-open shape: malformed / unknown inputs resolve to allow ---

test("allow: missing or unknown inputs", () => {
  assert.equal(decide("Bash", {}).decision, "allow");
  assert.equal(decide("Bash", undefined).decision, "allow");
  assert.equal(decide("Read", { file_path: "CLAUDE.md" }).decision, "allow");
});
