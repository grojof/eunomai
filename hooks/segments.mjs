// eunomai safe-controls — read a shell command as commands, not as text.
//
// parse(command, { dialect }) -> [{ words, redirects, heredocs, vars, dialect }]
//   dialect: "bash" (default) | "powershell" | "cmd"
//
// A best-effort, dependency-free reader of the shell shapes an agent actually writes:
// - segments split on ; && || | & and newlines outside quotes; shell keywords (if, then, do, {, !…) are
//   set aside, so a command inside `if`/`for`/`while`/`{ }` is still a command;
// - quotes removed from words (a single-quoted word is `literal`: never expanded);
// - a heredoc body belongs to the command that opened it, kept apart from its words;
// - redirections are kept apart from arguments;
// - code is read again as commands wherever the shell runs it: `$( … )`, backticks, `sh -c`, `bash -c`,
//   `eval`, `pwsh -Command`, `cmd /c` — each in its own dialect;
// - `NAME=value` assignments made earlier in the same command are remembered (with `${V:-default}`,
//   and a `for` loop's list), so `S=/tmp/x; rm -rf $S` can be judged.
// It executes nothing.

import { tmpdir } from "node:os";

const REDIRECTS = new Set([">", ">>", "<", "&>"]);
const SEPARATORS = new Set([";", "\n", "|", "&", "(", ")"]);
const MAX_DEPTH = 4;

export function readBalanced(src, i, open, close) {
  // src[i] is just past `open`; returns the index past the matching `close`, honouring nested quotes.
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "'") {
      const end = src.indexOf("'", i + 1);
      i = end === -1 ? src.length : end + 1;
      continue;
    }
    if (c === '"') {
      i = readDouble(src, i + 1, "bash").end;
      continue;
    }
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) depth--;
    i++;
  }
  return i;
}

function readDouble(src, i, dialect) {
  // src[i] is just past the opening quote; returns { text, end } with end past the closing quote.
  let text = "";
  const esc = dialect === "powershell" ? "`" : dialect === "cmd" ? null : "\\";
  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      if (dialect === "powershell" && src[i + 1] === '"') {
        text += '"';
        i += 2;
        continue;
      }
      return { text, end: i + 1 };
    }
    if (esc && c === esc && i + 1 < src.length) {
      const n = src[i + 1];
      if (dialect === "powershell") text += n === "n" ? "\n" : n === "t" ? "\t" : n;
      else text += '"\\$`\n'.includes(n) ? (n === "\n" ? "" : n) : c + n;
      i += 2;
      continue;
    }
    if (dialect === "bash" && c === "$" && src[i + 1] === "(") {
      const end = readBalanced(src, i + 2, "(", ")");
      text += src.slice(i, end);
      i = end;
      continue;
    }
    text += c;
    i++;
  }
  return { text, end: i };
}

function tokenize(src, dialect) {
  const bash = dialect === "bash";
  const segments = [];
  let seg = { words: [], heredocs: [] };
  let word = null;
  let pending = []; // heredocs waiting for the next newline: { delim, strip, owner }
  let expectDelimiter = null; // { strip } after << / <<-
  let i = 0;

  const flushWord = () => {
    if (word === null) return;
    if (expectDelimiter) {
      pending.push({ delim: word.text, strip: expectDelimiter.strip, owner: seg });
      expectDelimiter = null;
    } else {
      seg.words.push(word);
    }
    word = null;
  };
  const flushSegment = () => {
    flushWord();
    if (seg.words.length || seg.heredocs.length) segments.push(seg);
    seg = { words: [], heredocs: [] };
  };
  const append = (text, literal = false) => {
    if (word === null) word = { text: "", literal: true };
    word.text += text;
    word.literal = word.literal && literal;
  };

  while (i < src.length) {
    const c = src[i];
    if (c === "\n") {
      flushWord();
      if (pending.length) {
        // Each body is read line by line from just after this newline, and goes to the command that
        // opened it — not to whatever command follows on the same line.
        let pos = i + 1;
        for (const { delim, strip, owner } of pending) {
          const body = [];
          while (pos <= src.length) {
            const nl = src.indexOf("\n", pos);
            const line = src.slice(pos, nl === -1 ? src.length : nl);
            pos = nl === -1 ? src.length + 1 : nl + 1;
            if ((strip ? line.replace(/^\t+/, "") : line) === delim) break;
            body.push(line);
          }
          owner.heredocs.push(body.join("\n"));
        }
        pending = [];
        i = pos - 1;
      }
      flushSegment();
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\r") {
      flushWord();
      i++;
      continue;
    }
    if (c === "#" && word === null && dialect !== "cmd") {
      const nl = src.indexOf("\n", i);
      i = nl === -1 ? src.length : nl;
      continue;
    }
    if (SEPARATORS.has(c)) {
      if (dialect === "powershell" && c === "&" && src[i + 1] !== "&") {
        flushWord(); // PowerShell's call operator, not a separator
        i++;
        continue;
      }
      if (c === "&" && src[i + 1] === ">") {
        flushWord();
        seg.words.push({ text: "&>", literal: true });
        i += 2;
        continue;
      }
      flushSegment();
      i += src[i + 1] === c && (c === "&" || c === "|") ? 2 : 1;
      continue;
    }
    if (c === "<" && bash) {
      flushWord();
      if (src.startsWith("<<<", i)) {
        seg.words.push({ text: "<<<", literal: true });
        i += 3;
      } else if (src.startsWith("<<", i)) {
        const strip = src[i + 2] === "-";
        i += strip ? 3 : 2;
        expectDelimiter = { strip };
      } else {
        seg.words.push({ text: "<", literal: true });
        i++;
      }
      continue;
    }
    if (c === ">") {
      const op = src[i + 1] === ">" ? ">>" : ">";
      if (word !== null && /^\d$/.test(word.text)) word = null; // 2> and friends
      flushWord();
      seg.words.push({ text: op, literal: true });
      i += op.length;
      const dup = /^&(\d+|-)/.exec(src.slice(i)); // 2>&1, >&- : a file descriptor, not a file
      if (dup) {
        seg.words.push({ text: dup[0], literal: true });
        i += dup[0].length;
      }
      continue;
    }
    if (c === "'" && dialect !== "cmd") {
      if (dialect === "powershell") {
        let text = "";
        let j = i + 1;
        while (j < src.length) {
          if (src[j] === "'" && src[j + 1] === "'") {
            text += "'";
            j += 2;
            continue;
          }
          if (src[j] === "'") break;
          text += src[j++];
        }
        append(text, true);
        i = j + 1;
      } else {
        const end = src.indexOf("'", i + 1);
        append(src.slice(i + 1, end === -1 ? src.length : end), true);
        i = end === -1 ? src.length : end + 1;
      }
      continue;
    }
    if (c === '"') {
      const { text, end } = readDouble(src, i + 1, dialect);
      append(text);
      i = end;
      continue;
    }
    if (bash && c === "\\") {
      if (src[i + 1] === "\n") i += 2;
      else {
        append(src[i + 1] ?? "", true);
        i += 2;
      }
      continue;
    }
    if ((dialect === "powershell" && c === "`") || (dialect === "cmd" && c === "^")) {
      append(src[i + 1] ?? "", true);
      i += 2;
      continue;
    }
    if (c === "$" && src[i + 1] === "(" && dialect !== "cmd") {
      const end = readBalanced(src, i + 2, "(", ")");
      append(src.slice(i, end));
      i = end;
      continue;
    }
    if (bash && c === "`") {
      const end = src.indexOf("`", i + 1);
      append(src.slice(i, end === -1 ? src.length : end + 1));
      i = end === -1 ? src.length : end + 1;
      continue;
    }
    append(c);
    i++;
  }
  flushSegment();
  return segments;
}

// --- variables ----------------------------------------------------------------------------------

const ASSIGNMENT = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/s;
const MKTEMP = /^\$\(\s*mktemp\b[^)]*\)$/;

/**
 * Substitute the variables known in `vars` ($V, ${V}, ${V:-default}, ${V:?}, ${V-default}); an unknown
 * variable with a default takes the default, one without stays as written. A value that is a list (a
 * `for` loop's) substitutes its first item; decide.mjs asks for every item through `expandAll`.
 */
export function expandKnown(text, vars, pick = 0) {
  return text.replace(
    /\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?([-?=+])([^}]*))?\}|\$([A-Za-z_][A-Za-z0-9_]*)/g,
    (m, braced, op, alt, bare) => {
      const name = braced ?? bare;
      if (name in vars) {
        const v = vars[name];
        return Array.isArray(v) ? v[Math.min(pick, v.length - 1)] ?? m : v;
      }
      if (op === "-" || op === "=") return alt;
      return m;
    },
  );
}

/** Every value a word can take: one per item of a loop variable it uses (capped). */
export function expandAll(text, vars) {
  const lists = [...text.matchAll(/\$\{?([A-Za-z_][A-Za-z0-9_]*)/g)]
    .map((m) => vars[m[1]])
    .filter(Array.isArray);
  const n = Math.min(Math.max(1, ...lists.map((l) => l.length)), 20);
  const out = new Set();
  for (let k = 0; k < n; k++) out.add(expandKnown(text, vars, k));
  return [...out];
}

// --- the command's own words --------------------------------------------------------------------

const DECLARERS = new Set(["export", "declare", "typeset", "local", "readonly"]);
const KEYWORDS = new Set(["if", "then", "else", "elif", "do", "while", "until", "{", "!", "time", "coproc"]);
const CLOSERS = new Set(["fi", "done", "}", "esac", "end"]);
// Wrappers, and how many values each of their options takes.
const WRAPPERS = {
  sudo: /^-[ugCDhprtUT]$/,
  doas: /^-[uC]$/,
  nice: /^-n$/,
  timeout: /^-[sk]$/,
  stdbuf: /^-[ioe]$/,
  env: /^-[uCS]$/,
  command: null,
  builtin: null,
  exec: /^-a$/,
  nohup: null,
  noglob: null,
};

/** The command's own words: assignments, keywords and wrappers (sudo, env, nohup…) set aside. */
export function commandWords(words, vars = {}) {
  let k = 0;
  while (k < words.length) {
    const w = words[k];
    const m = ASSIGNMENT.exec(w.text);
    if (m && !w.literal) {
      vars[m[1]] = MKTEMP.test(m[2].trim()) ? `${tmpdir()}/mktemp.XXXXXX` : expandKnown(m[2], vars);
      k++;
      continue;
    }
    if (DECLARERS.has(w.text)) {
      // export A=b, declare -x A=b: assignments only, no command to judge
      for (const d of words.slice(k + 1)) {
        const a = ASSIGNMENT.exec(d.text);
        if (a && !d.literal) vars[a[1]] = expandKnown(a[2], vars);
      }
      return [];
    }
    if (w.text === "for" || w.text === "select") {
      // for NAME in item…  -> NAME takes each item (the body is the next segment)
      const name = words[k + 1]?.text;
      const inAt = words.findIndex((x, j) => j > k && x.text === "in");
      if (name && inAt > 0) vars[name] = words.slice(inAt + 1).map((x) => expandKnown(x.text, vars));
      return [];
    }
    if (KEYWORDS.has(w.text) || CLOSERS.has(w.text)) {
      k++;
      continue;
    }
    if (w.text in WRAPPERS) {
      const valued = WRAPPERS[w.text];
      k++;
      while (k < words.length && words[k].text.startsWith("-")) {
        k += valued && valued.test(words[k].text) ? 2 : 1;
      }
      if (w.text === "timeout" && k < words.length) k++; // the duration
      continue;
    }
    break;
  }
  return words.slice(k);
}

// --- parse ----------------------------------------------------------------------------------------

function substitutions(text) {
  // The code inside $( … ) and `…` in a word, outermost first.
  const found = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "$" && text[i + 1] === "(") {
      const end = readBalanced(text, i + 2, "(", ")");
      found.push(text.slice(i + 2, end - 1));
      i = end - 1;
    } else if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end === -1) break;
      found.push(text.slice(i + 1, end));
      i = end;
    }
  }
  return found;
}

/**
 * The command as a list of simple commands, each { words, redirects, heredocs, vars, dialect }.
 * Code the shell runs from a string or a substitution is read again, in its own dialect, and its
 * commands are listed before the command that uses them.
 */
export function parse(command, { dialect = "bash", powershell } = {}, depth = 0, vars = {}) {
  if (typeof command !== "string" || !command) return [];
  if (powershell !== undefined) dialect = powershell ? "powershell" : "bash";
  const out = [];
  for (const seg of tokenize(command, dialect)) {
    if (depth < MAX_DEPTH && dialect !== "cmd") {
      for (const w of seg.words) {
        if (w.literal) continue;
        for (const code of substitutions(w.text)) out.push(...parse(code, { dialect }, depth + 1, vars));
      }
    }
    const words = commandWords(seg.words, vars);
    const head = (words[0]?.text ?? "").toLowerCase().replace(/\.exe$/, "");
    if (depth < MAX_DEPTH) {
      const inner = innerCode(head, words);
      if (inner !== null) {
        out.push(...parse(inner.code, { dialect: inner.dialect }, depth + 1, vars));
        continue;
      }
    }
    // Redirections are not arguments: `rm -rf x 2>/dev/null` deletes x, and `> .env` writes .env.
    const args = [];
    const redirects = [];
    for (let k = 0; k < words.length; k++) {
      if (REDIRECTS.has(words[k].text)) {
        if (words[k + 1]) redirects.push({ op: words[k].text, target: words[++k] });
      } else args.push(words[k]);
    }
    out.push({ words: args, redirects, heredocs: seg.heredocs, vars: { ...vars }, dialect });
  }
  return out;
}

const SHELLS = new Set(["sh", "bash", "zsh", "dash", "ksh"]);
const PWSH = new Set(["pwsh", "powershell"]);

function innerCode(head, words) {
  const rest = (from) => words.slice(from).map((w) => w.text).join(" ");
  if (SHELLS.has(head)) {
    const c = words.findIndex((w) => /^-[a-z]*c$/.test(w.text));
    return c > 0 && words[c + 1] ? { code: words[c + 1].text, dialect: "bash" } : null;
  }
  if (head === "eval") return { code: rest(1), dialect: "bash" };
  if (PWSH.has(head)) {
    const c = words.findIndex((w) => /^-(c|command)$/i.test(w.text));
    return c > 0 ? { code: rest(c + 1), dialect: "powershell" } : null;
  }
  if (head === "cmd") {
    const c = words.findIndex((w) => /^\/[ck]$/i.test(w.text));
    return c > 0 ? { code: rest(c + 1), dialect: "cmd" } : null;
  }
  return null;
}
