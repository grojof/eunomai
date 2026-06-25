// eunomai safe-controls — pure decision logic for the PreToolUse hook.
//
// decide(toolName, toolInput) -> { decision: "allow" | "ask" | "deny", reason?: string }
//
// Kept dependency-free and side-effect-free so it can be unit-tested directly
// (node:test) without spawning a process. The thin stdin/stdout runner lives in
// guard.mjs. Posture: ask-by-default, deny only for the unambiguous AI-trailer
// rule; the runner fails open on any error.

// Unambiguous AI-attribution trailers — the one hard `deny`.
const AI_TRAILERS = [
  /co-authored-by:\s*claude/i,
  /co-authored-by:[^\n]*anthropic/i,
  /generated with \[?claude code/i,
  /🤖 generated with/i,
  /noreply@anthropic\.com/i,
];

// Small, principled set of irreversible / sensitive command shapes -> `ask`.
// Deliberately NOT an exhaustive denylist (low-maintenance).
const SAFETY_GATES = [
  { test: /git\s+push\b[^\n]*--force/i, reason: "force-push rewrites remote history" },
  { test: /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, reason: "recursive force delete is irreversible" },
  { test: /\b(npm|pnpm|yarn)\s+version\b/i, reason: "version bump" },
  {
    test: /\.env(\b|\.)|[\\/]secrets?[\\/]|credential|\bid_rsa\b|\.pem\b/i,
    reason: "touches secrets / credentials / .env",
  },
];

function bashDecision(command) {
  if (typeof command !== "string" || command.length === 0) return { decision: "allow" };

  if (/\bgit\s+commit\b/.test(command)) {
    for (const trailer of AI_TRAILERS) {
      if (trailer.test(command)) {
        return {
          decision: "deny",
          reason:
            "eunomai: commit message carries an AI-attribution trailer. Remove it — no " +
            "co-author / 'Generated with Claude Code' lines (see CLAUDE.md conventions).",
        };
      }
    }
  }

  for (const gate of SAFETY_GATES) {
    if (gate.test.test(command)) {
      return { decision: "ask", reason: `eunomai safety gate: ${gate.reason} — confirm before running.` };
    }
  }

  return { decision: "allow" };
}

export function decide(toolName, toolInput = {}) {
  if (toolName === "Bash") return bashDecision(toolInput.command);
  return { decision: "allow" };
}
