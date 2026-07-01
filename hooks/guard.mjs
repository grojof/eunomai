#!/usr/bin/env node
// eunomai safe-controls — PreToolUse hook runner.
//
// Reads the tool-call JSON from stdin, asks decide() what to do, and emits a
// decision only when it is `deny` or `ask`. On `allow` it writes nothing so the
// user's normal permission flow is untouched. Any error (parse failure, throw)
// falls open: exit 0 with no output, so a hook malfunction never blocks work.
//
// Org override seam (both fail open):
//   EUNOMAI_TRAILER_RULE  "deny" | "ask" | "off" — action of the trailer rule (default "deny").
//   EUNOMAI_EXTRA_GATES   path to a JSON file of [{ "pattern": "...", "reason": "..." }]
//                         appended to the ask-gates; an unreadable file, invalid JSON, or
//                         an invalid regex is silently ignored.

import { readFileSync } from "node:fs";
import { decide } from "./decide.mjs";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(""));
  });
}

function readConfig(env) {
  const config = {};
  const rule = env.EUNOMAI_TRAILER_RULE;
  if (rule === "deny" || rule === "ask" || rule === "off") config.trailerRule = rule;
  if (env.EUNOMAI_EXTRA_GATES) {
    try {
      const parsed = JSON.parse(readFileSync(env.EUNOMAI_EXTRA_GATES, "utf8"));
      if (Array.isArray(parsed)) config.extraGates = parsed;
    } catch {
      // Fail open: a bad extra-gates file must not affect the decision.
    }
  }
  return config;
}

try {
  const input = JSON.parse(await readStdin());
  const { decision, reason } = decide(input.tool_name, input.tool_input ?? {}, readConfig(process.env));

  if (decision === "deny" || decision === "ask") {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: decision,
          permissionDecisionReason: reason ?? "",
        },
      }),
    );
  }
  // `allow` -> emit nothing; let Claude Code's normal permission flow proceed.
  process.exit(0);
} catch {
  // Fail open: never block the user because a guardrail malfunctioned.
  process.exit(0);
}
