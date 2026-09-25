// eunomai safe-controls — pure decision logic for the PreToolUse hook.
//
// decide(toolName, toolInput, config, ctx) -> { decision: "allow"|"ask"|"deny", gate?, reason? }
//
// `config` is the merged configuration from config.mjs (DEFAULTS when omitted). `ctx` carries what the
// decision reads from outside the command: { cwd, projectDir, home, env, readFile, platform }; each has
// a default from the running process. No side effects: it reads a commit message file or a PR body
// file through ctx.readFile, and nothing else.
//
// The command is read as commands (segments.mjs): a gate looks at a command's own name and arguments,
// never at text inside another command's quoted data. Posture: ask by default, deny only for an AI
// co-author line; non-exhaustive by design (low maintenance) — close respellings of these shapes only.

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import nodePath from "node:path";
import { DEFAULTS, actionFor } from "./config.mjs";
import { expandAll, parse } from "./segments.mjs";

const SEVERITY = { off: 0, ask: 1, deny: 2 };
const LOCAL_FILE = ".claude/eunomai.local.json";
const EXTRA_GATE_INPUT = 8192; // an extra gate's regex never sees more than this: a bad pattern cannot hang

function context(ctx = {}) {
  const env = ctx.env ?? process.env;
  const cwd = ctx.cwd ?? process.cwd();
  const platform = ctx.platform ?? process.platform;
  return {
    env,
    cwd,
    platform,
    path: platform === "win32" ? nodePath.win32 : nodePath.posix,
    projectDir: ctx.projectDir ?? env.CLAUDE_PROJECT_DIR ?? cwd,
    home: ctx.home ?? env.HOME ?? env.USERPROFILE ?? homedir(),
    readFile:
      ctx.readFile ??
      ((file) => {
        try {
          return readFileSync(file, "utf8");
        } catch {
          return null;
        }
      }),
  };
}

const commandName = (word = "") =>
  word.split(/[\\/]/).pop().toLowerCase().replace(/\.exe$/, "");

// --- paths ------------------------------------------------------------------------------------

/** Every value a word can take, with variables and a leading ~ expanded. */
function values(word, seg, c) {
  if (word.literal) return [word.text];
  const vars = { ...seg.vars };
  for (const [k, v] of Object.entries(c.env)) if (!(k in vars) && typeof v === "string") vars[k] = v;
  vars.HOME = c.home;
  if (seg.dialect === "powershell") {
    vars.USERPROFILE = c.home;
    vars.HOME = c.home;
  }
  const text = word.text.replace(/\$env:([A-Za-z_][A-Za-z0-9_]*)/gi, "$$$1");
  return expandAll(text, vars).map((t) => t.replace(/^~(?=$|[\\/])/, c.home));
}

/** A Windows path seen from WSL: C:\x -> /mnt/c/x. On Windows itself it stays as written. */
function hostPath(p, c) {
  const m = /^([A-Za-z]):(?:[\\/](.*))?$/.exec(p);
  if (!m || c.platform === "win32") return p;
  return `/mnt/${m[1].toLowerCase()}/${(m[2] ?? "").replace(/\\/g, "/")}`;
}

const GLOB = /[*?[]|\$/;
const CREDENTIAL_DIRS = new Set([".ssh", ".gnupg", ".aws", ".kube", ".docker", ".azure"]);
const HOME_CACHES = new Set([".cache", ".npm", ".pnpm-store", ".yarn"]); // regenerable, even when emptied
const SYSTEM_TOP = /^\/(etc|usr|bin|sbin|lib|lib32|lib64|libx32|boot|opt|srv|root|sys|proc|dev|var|snap)$/;
const WIN_ROOT = /^(?:\/mnt\/[a-z]|[A-Za-z]:)$/i;
const WIN_SYSTEM = /^(?:\/mnt\/[a-z]|[A-Za-z]:)[\\/](windows|program files|program files \(x86\)|programdata)(?:[\\/]|$)/i;
const WIN_USERS = /^(?:\/mnt\/[a-z]|[A-Za-z]:)[\\/]users$/i;
const UNIX_HOMES = /^\/(home|Users)$/;

/**
 * Why deleting this target recursively is risky, or null when it is a routine clean-up. Risky means a
 * scope whose loss cannot be a clean-up: a filesystem or drive root, a top-level or system directory or
 * anything in one, a home directory or anything directly in one, a credentials directory, a
 * repository's `.git`, the whole project, a protected path, or a path that starts with a variable the
 * guard cannot resolve. A glob or variable in the last part of a path stands for that directory's
 * contents; further up it only narrows the path.
 */
function riskyTarget(raw, cwd, c, protectedPaths) {
  const P = c.path;
  if (/^\$\(\s*mktemp\b/.test(raw)) return null; // a fresh temporary directory
  if (/^\$/.test(raw)) return `"${raw}" starts with a variable the guard cannot resolve`;
  const target = hostPath(raw, c);
  const parts = target.split(/[\\/]/);
  const last = parts.length - 1;
  let p;
  // A last part that is only a glob or only a variable (`*`, `.*`, `$d`) stands for the whole directory
  // it is in; a partial one (`odwg-*`, `build_$v`) for some of its children.
  const wholeDir = /^(\.?\*(\.\*)?|\$\{?[A-Za-z_][A-Za-z0-9_]*\}?)$/.test(parts[last]);
  if (wholeDir && parts.slice(0, last).every((s) => !GLOB.test(s))) {
    p = parts.slice(0, last).join("/") || (target.startsWith("/") ? "/" : "."); // the directory emptied
  } else {
    p = parts.map((s) => (GLOB.test(s) ? "_any_" : s)).join("/");
  }
  if (/^[A-Za-z]:$/.test(p)) p += "\\";
  const abs = P.resolve(cwd, p);
  const norm = abs.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
  const parent = norm.slice(0, norm.lastIndexOf("/")) || "/";
  const project = P.resolve(c.projectDir).replace(/\\/g, "/").replace(/\/+$/, "");
  const homes = [c.home, c.env.USERPROFILE].filter(Boolean).map((h) => P.resolve(h).replace(/\\/g, "/").replace(/\/+$/, ""));
  const top = "/" + (norm.split("/")[1] ?? "");
  const within = (child, dir) => child.startsWith(dir + "/");
  const upTo = (dir) => norm === dir || within(dir, norm);

  if (norm === "/" || /^[A-Za-z]:$/.test(norm) || WIN_ROOT.test(norm)) return `"${raw}" is a filesystem or drive root`;
  if (norm === "/mnt") return `"${raw}" holds the mounted drives`;
  if (parent === "/" && !norm.startsWith("/mnt")) return `"${raw}" is a top-level directory`;
  if (SYSTEM_TOP.test(top) && norm !== "/var/tmp" && !within(norm, "/var/tmp"))
    return `"${raw}" is in a system directory (${top})`;
  if (WIN_SYSTEM.test(norm)) return `"${raw}" is in a Windows system directory`;
  for (const home of homes) if (within(norm, home) && HOME_CACHES.has(norm.slice(home.length + 1).split("/")[0])) return null;
  if (WIN_USERS.test(norm) || WIN_USERS.test(parent) || WIN_USERS.test(parent.slice(0, parent.lastIndexOf("/"))))
    return `"${raw}" is a home directory or directly in one`;
  if (UNIX_HOMES.test(parent) || UNIX_HOMES.test(parent.slice(0, parent.lastIndexOf("/")) || "/"))
    return `"${raw}" is a home directory or directly in one`;
  for (const home of homes) {
    if (upTo(home)) return `"${raw}" is your home directory or above it`;
    if (parent === home) return `"${raw}" is directly in your home directory`;
    const first = norm.slice(home.length + 1).split("/")[0];
    if (within(norm, home) && CREDENTIAL_DIRS.has(first)) return `"${raw}" is in ~/${first}, which holds credentials`;
  }
  if (norm.split("/").pop() === ".git") return `"${raw}" is a repository's history`;
  if (upTo(project)) return `"${raw}" is the whole project`;
  for (const pp of protectedPaths) {
    const prot = P.resolve(project, pp.replace(/^~(?=$|[\\/])/, c.home)).replace(/\\/g, "/").replace(/\/+$/, "");
    if (norm === prot || within(norm, prot) || within(prot, norm)) return `"${raw}" is a protected path`;
  }
  return null;
}

// --- secrets ----------------------------------------------------------------------------------

function isSecretPath(p) {
  const parts = p.split(/[\\/]/);
  const base = parts.pop() ?? "";
  if (/^\.env(\..+)?$/i.test(base)) return !/\.(example|sample|template|dist|defaults?)$/i.test(base);
  if (/^id_(rsa|dsa|ecdsa|ed25519)$/.test(base)) return true;
  if ([".netrc", ".pgpass", ".git-credentials"].includes(base)) return true;
  if (base === "credentials" && parts.includes(".aws")) return true;
  return /\.key$/i.test(base);
}

// Commands that read a file's content: every operand is a file…
const READERS = new Set(
  "cat less more head tail bat batcat nl od xxd hexdump base64 strings source . tac view".split(" "),
);
// …except the first operand, which is a pattern or a script (unless -e / -f gave it).
const PATTERN_READERS = new Set(["grep", "egrep", "fgrep", "rg", "ag", "sed", "awk"]);
// …or all operands but the last, which is the destination.
const COPIERS = new Set(["cp", "mv", "scp", "rsync", "install"]);
const PWSH_READERS = new Set(["get-content", "gc", "type", "cat", "select-string", "sls"]);
const PWSH_COPIERS = new Set(["copy-item", "cp", "copy", "cpi", "move-item", "mv", "move", "mi"]);

function readOperands(head, words, dialect) {
  const operands = words.slice(1).filter((w) => !/^-/.test(w.text) || w.text === "-");
  if (dialect === "powershell") {
    if (PWSH_READERS.has(head)) return operands;
    if (PWSH_COPIERS.has(head)) return operands.slice(0, 1);
    return [];
  }
  if (READERS.has(head)) return operands;
  if (PATTERN_READERS.has(head)) {
    const given = words.some((w) => /^-(e|f|-regexp|-file)$/.test(w.text) || /^--(regexp|file)=/.test(w.text));
    return given ? operands : operands.slice(1);
  }
  if (COPIERS.has(head)) return operands.slice(0, -1);
  return [];
}

const SECRET_MENTION = /(?<!process)\.env(\b|\.)|[\\/]secrets?[\\/]|credential(?!\.helper)|\bid_(?:rsa|ed25519)\b|\.pem\b/i;

// --- attribution ------------------------------------------------------------------------------

// Tested one line at a time, so a long line cannot make them slow.
const AI_COAUTHOR =
  /^[ \t]*co-authored-by[ \t]*[:=][^<]*<[^>]*(@anthropic\.com|@openai\.com|copilot@users\.noreply\.github\.com|cursoragent@cursor\.com)>/i;
const AI_GENERATED = /\bgenerated (?:with|by)\s*\[?\s*(?:claude(?: code)?|(?:github )?copilot|chatgpt|codex|cursor|gemini|aider)\b/i;
const ASSISTED_BY = /^[ \t]*assisted-by[ \t]*[:=][ \t]*(.+)$/i;
const MODEL_DETAIL = /\d|\b(opus|sonnet|haiku|fable|gpt|turbo|flash|mini|pro|ultra)\b/i;

function checkAttribution(text, kind, config, fire, { visible = true, disclosure = true } = {}) {
  if (!text || !text.trim()) return;
  const { tool, commit, pr } = config.attribution ?? DEFAULTS.attribution;
  const wanted = kind === "commit" ? commit : pr;
  const where = kind === "commit" ? "commit message" : "pull request description";
  const lines = text.split("\n").map((l) => l.slice(0, 2000));
  const line = lines.find((l) => AI_COAUTHOR.test(l) || AI_GENERATED.test(l))?.trim();
  if (line) {
    const instead =
      wanted === "assisted-by"
        ? `keep only a minimal disclosure line "Assisted-by: ${tool}"`
        : kind === "commit"
          ? "this project wants no AI trailer in commits; disclose in the pull request instead"
          : "disclosure is not required here";
    fire(
      "ai-coauthor",
      `The ${where} carries an AI co-author or generated-by line ("${line}"). Remove that line; ${instead}. ` +
        `Set Claude Code's "attribution" setting (attribution.${kind === "commit" ? "commit" : "pr"}) so it is not added again`,
    );
  }
  const disclosures = lines.map((l) => ASSISTED_BY.exec(l)?.[1]?.trim()).filter(Boolean);
  for (const d of disclosures) {
    if (MODEL_DETAIL.test(d))
      fire(
        "disclosure-detail",
        `The ${where} discloses "Assisted-by: ${d}". Name the tool only, not the model or version`,
        `Assisted-by: ${tool}`,
      );
  }
  // A body the guard cannot see ($(cat file), a variable) is not asked about: it may well disclose.
  if (disclosure && visible && wanted === "assisted-by" && disclosures.length === 0)
    fire(
      kind === "commit" ? "commit-disclosure" : "pr-disclosure",
      `This project asks AI-assisted ${kind === "commit" ? "commits" : "pull requests"} to disclose it, and the ${where} does not`,
      `add the line "Assisted-by: ${tool}"`,
    );
}

function bodyFrom(fileArg, seg, cwd, c) {
  if (fileArg === "-" || fileArg === "/dev/stdin") return { text: seg.heredocs.join("\n"), visible: seg.heredocs.length > 0 };
  const text = c.readFile(c.path.resolve(cwd, fileArg));
  return typeof text === "string" ? { text, visible: true } : { text: "", visible: false };
}

function messageValue(word, seg, c) {
  const text = values(word, seg, c)[0] ?? word.text;
  return { text, visible: !/\$[({A-Za-z_]|`/.test(text) };
}

/** The message a commit-like command writes: -m / --message / --trailer / -F / --file. */
function commitMessage(args, seg, cwd, c) {
  const parts = [];
  for (let k = 0; k < args.length; k++) {
    const a = args[k].text;
    const trailer = (v) => ({ ...v, text: v.text.replace(/^([^:=\n]+)=/, "$1: ") });
    if (a === "--trailer" && args[k + 1]) parts.push(trailer(messageValue(args[++k], seg, c)));
    else if (a.startsWith("--trailer=")) parts.push(trailer({ text: a.slice(10), visible: true }));
    else if (a === "-m" || a === "--message" || /^-[a-zA-Z]*m$/.test(a)) {
      if (args[k + 1]) parts.push(messageValue(args[++k], seg, c));
    } else if (a.startsWith("--message=")) parts.push({ text: a.slice(10), visible: true });
    else if (/^-m./.test(a)) parts.push({ text: a.slice(2), visible: true });
    else if (a === "-F" || a === "--file") {
      if (args[k + 1]) parts.push(bodyFrom(args[++k].text, seg, cwd, c));
    } else if (a.startsWith("--file=")) parts.push(bodyFrom(a.slice(7), seg, cwd, c));
    else if (/^-F./.test(a)) parts.push(bodyFrom(a.slice(2), seg, cwd, c));
  }
  return { text: parts.map((p) => p.text).join("\n"), visible: parts.length > 0 && parts.every((p) => p.visible) };
}

function prBody(args, seg, cwd, c) {
  const parts = [];
  for (let k = 0; k < args.length; k++) {
    const a = args[k].text;
    if (a === "--body" || a === "-b") {
      if (args[k + 1]) parts.push(messageValue(args[++k], seg, c));
    } else if (a.startsWith("--body=")) parts.push({ text: a.slice(7), visible: true });
    else if (a === "--body-file" || a === "-F") {
      if (args[k + 1]) parts.push(bodyFrom(args[++k].text, seg, cwd, c));
    } else if (a.startsWith("--body-file=")) parts.push(bodyFrom(a.slice(12), seg, cwd, c));
  }
  return { text: parts.map((p) => p.text).join("\n"), visible: parts.length > 0 && parts.every((p) => p.visible) };
}

// --- git and gh ---------------------------------------------------------------------------------

const GIT_VALUE_OPTIONS = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path", "--config-env"]);
const shortFlags = (a) => /^-[a-zA-Z]+$/.test(a);

function checkGit(words, seg, cwd, c, config, fire) {
  let k = 1;
  while (k < words.length && words[k].text.startsWith("-")) k += GIT_VALUE_OPTIONS.has(words[k].text) ? 2 : 1;
  const sub = words[k]?.text;
  const args = words.slice(k + 1);
  const texts = args.map((w) => w.text);
  if (sub === "push") {
    const force =
      texts.includes("--force") ||
      texts.includes("--mirror") ||
      texts.some((a) => shortFlags(a) && a.includes("f")) ||
      texts.some((a) => /^\+[^+]/.test(a));
    const lease = texts.some((a) => a.startsWith("--force-with-lease") || a === "--force-if-includes");
    if (force) fire("force-push", "A force-push rewrites the remote's history", "git push --force-with-lease");
    else if (lease) fire("force-push-lease", "A force-push with lease still rewrites the remote's history");
  } else if (sub === "clean") {
    const force = texts.some((a) => /^--f(o(r(ce?)?)?)?$/.test(a) || (shortFlags(a) && a.includes("f")));
    const dry = texts.some((a) => /^--d(r(y(-(r(un?)?)?)?)?)?$/.test(a) || (shortFlags(a) && a.includes("n")));
    if (force && !dry) fire("git-clean", "git clean deletes untracked files for good", "git clean -n to list them first");
  } else if (sub === "reset") {
    if (texts.some((a) => /^--ha(rd?)?$/.test(a)))
      fire("reset-hard", "git reset --hard discards uncommitted work", "git stash, then reset");
  } else if (["commit", "merge", "tag", "commit-tree"].includes(sub)) {
    const msg = commitMessage(args, seg, cwd, c);
    checkAttribution(msg.text, "commit", config, fire, { visible: msg.visible, disclosure: sub === "commit" });
  }
}

function checkGh(words, seg, cwd, c, config, fire) {
  let k = 1;
  while (k < words.length && words[k].text.startsWith("-")) k += /^(-R|--repo)$/.test(words[k].text) ? 2 : 1;
  if (words[k]?.text !== "pr") return;
  const action = words[k + 1]?.text;
  if (!["create", "new", "edit", "merge"].includes(action)) return;
  const body = prBody(words.slice(k + 2), seg, cwd, c);
  // `gh pr merge --body` is the squash commit's message; create/edit write the description.
  checkAttribution(body.text, action === "merge" ? "commit" : "pr", config, fire, {
    visible: body.visible,
    disclosure: action !== "merge",
  });
}

// --- deletes ----------------------------------------------------------------------------------

const PWSH_DELETE = new Set(["remove-item", "ri", "rm", "del", "erase", "rd", "rmdir"]);
const PWSH_VALUE_PARAMS = /^-(erroraction|ea|filter|include|exclude|credential|stream|warningaction|wa|informationaction|infa)$/i;

function deleteTargets(head, words, dialect) {
  const args = words.slice(1);
  if (dialect === "powershell" && PWSH_DELETE.has(head)) {
    let recursive = false;
    const targets = [];
    for (let k = 0; k < args.length; k++) {
      const a = args[k].text;
      if (/^-r(e(c(u(r(se?)?)?)?)?)?$/i.test(a)) recursive = true;
      else if (/^-(path|literalpath|lp|pspath)$/i.test(a)) {
        if (args[k + 1]) targets.push(args[++k]);
      } else if (PWSH_VALUE_PARAMS.test(a)) k++;
      else if (!a.startsWith("-")) targets.push(args[k]);
    }
    return recursive ? targets : null;
  }
  if (head === "rm" && dialect === "bash") {
    let recursive = false;
    let options = true;
    const targets = [];
    for (const w of args) {
      const a = w.text;
      if (options && a === "--") options = false;
      else if (options && a === "--recursive") recursive = true;
      else if (options && shortFlags(a)) recursive ||= /[rR]/.test(a);
      else if (options && a.startsWith("--")) continue;
      else targets.push(w);
    }
    return recursive ? targets : null;
  }
  if (head === "rmdir" || head === "rd") {
    const recursive = args.some((w) => /^\/s$/i.test(w.text));
    return recursive ? args.filter((w) => !/^\/[a-z]$/i.test(w.text)) : null;
  }
  return null;
}

// --- the guard's own configuration ------------------------------------------------------------------

const GUARD_CONFIG = /(^|[\\/])\.claude[\\/]eunomai(\.local)?\.json$/;
const WRITERS = new Set(
  "tee cp mv rm sed perl truncate install ln set-content sc add-content ac out-file copy-item move-item remove-item new-item ni".split(
    " ",
  ),
);

// --- the decision -----------------------------------------------------------------------------

export function decide(toolName, toolInput = {}, config = DEFAULTS, ctx = {}) {
  if (toolName !== "Bash" && toolName !== "PowerShell") return { decision: "allow" };
  const command = toolInput?.command;
  if (typeof command !== "string" || command.length === 0) return { decision: "allow" };
  const c = context(ctx);
  const hits = [];
  const fire = (gate, why, safer) => {
    const action = actionFor(config, gate);
    if (action === "off") return;
    hits.push({ gate, action, reason: reasonFor(gate, action, why, safer) });
  };

  let segments = null;
  try {
    segments = parse(command, { dialect: toolName === "PowerShell" ? "powershell" : "bash" });
  } catch {
    fire("unreadable", "The guard could not read this command, so it cannot tell what it does");
  }
  let cwd = c.cwd;
  for (const seg of segments ?? []) {
    const words = seg.words;
    if (words.length === 0) continue;
    const head = commandName(words[0].text);
    const dialect = seg.dialect;
    if (["cd", "set-location", "sl", "chdir", "pushd"].includes(head)) {
      const to = words[1] ? values(words[1], seg, c)[0] : c.home;
      if (to && to !== "-") cwd = c.path.resolve(cwd, hostPath(to, c));
      continue;
    }
    if (head === "git") checkGit(words, seg, cwd, c, config, fire);
    if (head === "gh") checkGh(words, seg, cwd, c, config, fire);

    const targets = deleteTargets(head, words, dialect);
    if (targets) {
      const risk = targets
        .flatMap((t) => values(t, seg, c))
        .map((t) => riskyTarget(t, cwd, c, config.protectedPaths ?? []))
        .find(Boolean);
      if (risk) fire("recursive-delete", `A recursive delete of ${risk}`, "delete a narrower path");
      else if (targets.length) fire("recursive-delete-any", "A recursive delete");
    }

    const reads = [...readOperands(head, words, dialect), ...(seg.redirects ?? []).filter((r) => r.op === "<").map((r) => r.target)];
    const secret = reads.flatMap((w) => values(w, seg, c)).find(isSecretPath);
    if (secret) fire("secret-read", `This reads a secret file (${secret})`, "use a template such as .env.example");

    const touched = [...(WRITERS.has(head) ? words.slice(1) : []), ...(seg.redirects ?? []).filter((r) => r.op !== "<").map((r) => r.target)];
    if (touched.flatMap((w) => values(w, seg, c)).some((p) => GUARD_CONFIG.test(p)))
      fire("guard-config-write", "This changes eunomai's own guard settings; only a person should");

    if (["npm", "pnpm", "yarn"].includes(head) && words[1]?.text === "version") {
      const rest = words.slice(2).map((w) => w.text);
      const bump =
        rest.some((a) => /^(major|minor|patch|pre(major|minor|patch|release)|from-git|\d)/.test(a)) ||
        rest.some((a) => /^--(major|minor|patch|premajor|preminor|prepatch|prerelease|new-version)/.test(a));
      if (bump) fire("version-bump", "This bumps the package version");
    }
  }

  if (SECRET_MENTION.test(command)) fire("secret-mention", "The command mentions a secret, credential or .env path");

  const bounded = command.slice(0, EXTRA_GATE_INPUT);
  for (const gate of config.extraGates ?? []) {
    if (gate.action === "off") continue;
    let re;
    try {
      re = new RegExp(gate.pattern, "i");
    } catch {
      continue;
    }
    if (re.test(bounded))
      hits.push({ gate: gate.id, action: gate.action, reason: reasonFor(gate.id, gate.action, gate.reason) });
  }

  if (hits.length === 0) return { decision: "allow" };
  const top = hits.reduce((a, b) => (SEVERITY[b.action] > SEVERITY[a.action] ? b : a));
  return { decision: top.action, gate: top.gate, reason: top.reason };
}

function reasonFor(gate, action, why, safer) {
  if (action === "deny") return `eunomai [${gate}]: ${why}.`;
  return (
    `eunomai [${gate}]: ${why}.` +
    (safer ? ` Safer: ${safer}.` : "") +
    ` To stop asking: "gates": {"${gate}": "off"} in ${LOCAL_FILE}.`
  );
}
