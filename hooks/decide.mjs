// eunomai safe-controls — pure decision logic for the PreToolUse hook.
//
// decide(toolName, toolInput, config) -> { decision: "allow" | "ask" | "deny", reason?: string }
//
// Kept dependency-free and side-effect-free so it can be unit-tested directly
// (node:test) without spawning a process. The thin stdin/stdout runner lives in
// guard.mjs and builds `config` from the environment:
//   config.trailerRule  "deny" | "ask" | "off" — action of the trailer rule (default "deny").
//   config.extraGates   [{ pattern, reason }] appended to the ask-gates; entries with a
//                       missing/invalid pattern are silently skipped (fail open).
// Posture: ask-by-default, deny only for the unambiguous AI-trailer rule; the
// runner fails open on any error. Gates are deliberately NOT exhaustive
// (low-maintenance) — close respellings of the chosen categories, no new ones.

// Unambiguous AI-attribution trailers — the one hard `deny` (action configurable).
const AI_TRAILERS = [
  /co-authored-by:\s*claude/i,
  /co-authored-by:[^\n]*anthropic/i,
  /generated with \[?claude code/i,
  /🤖 generated with/i,
  /noreply@anthropic\.com/i,
];

// --- Regex building blocks ---
// `git` may carry global options before the subcommand (git -C <path> commit, git -c k=v push).
const GIT = String.raw`\bgit\b(?:\s+-[cC]\s*\S+)*\s+`;
// Stay inside one command segment so a gate does not fire across `;`, `&&`, `|`.
const SEG = String.raw`[^\n;&|]*`;
// A short-flag token carrying <letter>, bundled or split (-f, -rf, -r -f).
const shortFlag = (letter) => String.raw`\s-(?!-)[a-zA-Z]*${letter}[a-zA-Z]*\b`;
const RECURSIVE_FLAG = String.raw`(?:${shortFlag("r")}|\s--recursive\b)`;
const FORCE_FLAG = String.raw`(?:${shortFlag("f")}|\s--force\b)`;

const GIT_COMMIT = new RegExp(GIT + String.raw`commit\b`, "i");

// Small, principled set of irreversible / sensitive command shapes -> `ask`.
// Deliberately NOT an exhaustive denylist (low-maintenance).
const SAFETY_GATES = [
  {
    // --force / --force-with-lease / short -f / +refspec forms.
    test: new RegExp(GIT + String.raw`push\b${SEG}(?:--force(?:-with-lease)?\b|${shortFlag("f")}|\s\+\S+)`, "i"),
    reason: "force-push rewrites remote history",
  },
  {
    // rm with recursive + force in any order, bundled, split, or long flags.
    test: new RegExp(String.raw`\brm\b(?=${SEG}${RECURSIVE_FLAG})(?=${SEG}${FORCE_FLAG})`, "i"),
    reason: "recursive force delete is irreversible",
  },
  {
    test: new RegExp(GIT + String.raw`clean\b(?=${SEG}${FORCE_FLAG})`, "i"),
    reason: "git clean deletes untracked files irreversibly",
  },
  {
    // PowerShell-native delete: Remove-Item/ri/del with -Recurse and -Force in any order.
    test: new RegExp(String.raw`\b(?:remove-item|ri|del)\b(?=${SEG}\s-recurse\b)(?=${SEG}\s-force\b)`, "i"),
    reason: "recursive force delete is irreversible",
  },
  { test: /\b(npm|pnpm|yarn)\s+version\b/i, reason: "version bump" },
  {
    // `.env` files but not process.env; credentials but not git's credential.helper key.
    test: /(?<!process)\.env(\b|\.)|[\\/]secrets?[\\/]|credential(?!\.helper)|\bid_(?:rsa|ed25519)\b|\.pem\b/i,
    reason: "touches secrets / credentials / .env",
  },
];

const TRAILER_RULES = new Set(["deny", "ask", "off"]);

function extraGates(config) {
  if (!Array.isArray(config.extraGates)) return [];
  const gates = [];
  for (const entry of config.extraGates) {
    if (!entry || typeof entry.pattern !== "string") continue;
    try {
      gates.push({
        test: new RegExp(entry.pattern, "i"),
        reason: typeof entry.reason === "string" ? entry.reason : "org-defined gate",
      });
    } catch {
      // Invalid regex -> skip this entry (fail open).
    }
  }
  return gates;
}

function commandDecision(command, config) {
  if (typeof command !== "string" || command.length === 0) return { decision: "allow" };

  const trailerRule = TRAILER_RULES.has(config.trailerRule) ? config.trailerRule : "deny";
  if (trailerRule !== "off" && GIT_COMMIT.test(command)) {
    for (const trailer of AI_TRAILERS) {
      if (trailer.test(command)) {
        return {
          decision: trailerRule,
          reason:
            "eunomai: commit message carries an AI-attribution trailer. Remove it — no " +
            "co-author / 'Generated with Claude Code' lines (see CLAUDE.md conventions).",
        };
      }
    }
  }

  for (const gate of [...SAFETY_GATES, ...extraGates(config)]) {
    if (gate.test.test(command)) {
      return { decision: "ask", reason: `eunomai safety gate: ${gate.reason} — confirm before running.` };
    }
  }

  return { decision: "allow" };
}

export function decide(toolName, toolInput = {}, config = {}) {
  if (toolName !== "Bash" && toolName !== "PowerShell") return { decision: "allow" };
  return commandDecision(toolInput.command, config);
}
