// eunomai safe-controls — the guard's settings, merged from their layers.
//
// loadConfig({ env, projectDir, readFile }) -> { config, sources, errors, ignored }
//
// Layers, in order:
//   1. defaults
//   2. user     — the plugin's userConfig options (CLAUDE_PLUGIN_OPTION_LEVEL / _MODE), set in /config
//   3. legacy   — EUNOMAI_TRAILER_RULE and EUNOMAI_EXTRA_GATES, kept working
//   4. project  — <project>/.claude/eunomai.json, committed: it may only TIGHTEN (a stricter action, a
//                 higher level, more gates or protected paths); a looser value is ignored and reported
//   5. local    — <project>/.claude/eunomai.local.json, gitignored: it may set anything (if git tracks
//                 it, it is the repository's and may only tighten)
// Attribution is the project's policy, not a protection, so the project file sets it outright.
// Every problem is collected, never thrown: the hook stays fail-open and `guard.mjs --check` shows them.

export const LEVELS = ["critical", "standard", "strict"];
export const ACTIONS = ["off", "ask", "deny"];
export const MODES = ["enforce", "report"];

// Gate id -> action per level [critical, standard, strict]. Monotonic: a higher level never loosens.
export const GATES = {
  "ai-coauthor": ["deny", "deny", "deny"],
  "disclosure-detail": ["off", "ask", "ask"],
  "commit-disclosure": ["off", "ask", "ask"],
  "pr-disclosure": ["off", "ask", "ask"],
  "force-push": ["ask", "ask", "ask"],
  "force-push-lease": ["off", "off", "ask"],
  "recursive-delete": ["ask", "ask", "ask"],
  "recursive-delete-any": ["off", "off", "ask"],
  "git-clean": ["off", "ask", "ask"],
  "reset-hard": ["off", "ask", "ask"],
  "secret-read": ["off", "ask", "ask"],
  "secret-mention": ["off", "off", "ask"],
  "version-bump": ["off", "off", "ask"],
  "guard-config-write": ["ask", "ask", "ask"],
  unreadable: ["ask", "ask", "ask"],
};

export const DEFAULTS = Object.freeze({
  level: "standard",
  mode: "enforce",
  gates: {},
  protectedPaths: [],
  extraGates: [],
  attribution: { commit: "none", pr: "assisted-by", tool: "Claude" },
});

const rank = (list, value) => list.indexOf(value);

/** The action a gate takes under this config: its explicit setting, else its level's default. */
export function actionFor(config, id) {
  const explicit = config.gates?.[id];
  if (ACTIONS.includes(explicit)) return explicit;
  const row = GATES[id];
  return row ? row[Math.max(0, rank(LEVELS, config.level))] : "off";
}

function clone(config) {
  return {
    ...config,
    gates: { ...config.gates },
    protectedPaths: [...config.protectedPaths],
    extraGates: [...config.extraGates],
    attribution: { ...config.attribution },
  };
}

function validExtraGate(entry, where, errors) {
  if (!entry || typeof entry.pattern !== "string") {
    errors.push(`${where}: an extra gate needs a "pattern" string`);
    return null;
  }
  // A quantified group that itself contains a quantifier ((a+)+, (\w+\s?)*) can take exponential time on a
  // near-miss. JavaScript cannot interrupt a running regex, so such a pattern is refused here; the hook's
  // timeout is the backstop.
  if (/\((?:[^()\\]|\\.)*[+*}](?:[^()\\]|\\.)*\)[+*{]/.test(entry.pattern)) {
    errors.push(`${where}: extra gate pattern ${JSON.stringify(entry.pattern)} nests quantifiers and could backtrack for ever; rewrite it`);
    return null;
  }
  try {
    new RegExp(entry.pattern, "i");
  } catch (e) {
    errors.push(`${where}: extra gate pattern ${JSON.stringify(entry.pattern)} is not a valid regex (${e.message})`);
    return null;
  }
  const action = entry.action ?? "ask";
  if (!ACTIONS.includes(action)) {
    errors.push(`${where}: extra gate action ${JSON.stringify(action)} is not one of ${ACTIONS.join(", ")}`);
    return null;
  }
  return {
    id: typeof entry.id === "string" ? entry.id : `extra:${entry.pattern}`,
    pattern: entry.pattern,
    reason: typeof entry.reason === "string" ? entry.reason : "a gate this configuration adds",
    action,
  };
}

const KNOWN_KEYS = new Set(["level", "mode", "gates", "protectedPaths", "extraGates", "attribution"]);

/** Apply one layer's object. `tightenOnly` refuses anything looser than what is already in effect. */
function applyLayer(config, sources, layer, data, where, { tightenOnly }, errors, ignored) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    errors.push(`${where}: expected a JSON object`);
    return;
  }
  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.has(key)) errors.push(`${where}: unknown key "${key}"`);
  }
  if ("level" in data) {
    if (!LEVELS.includes(data.level)) errors.push(`${where}: level must be one of ${LEVELS.join(", ")}`);
    else if (tightenOnly && rank(LEVELS, data.level) < rank(LEVELS, config.level))
      ignored.push(`${where}: level "${data.level}" is looser than "${config.level}" (a committed file may only tighten)`);
    else {
      config.level = data.level;
      sources.level = layer;
    }
  }
  if ("mode" in data) {
    if (!MODES.includes(data.mode)) errors.push(`${where}: mode must be one of ${MODES.join(", ")}`);
    else if (tightenOnly && data.mode === "report" && config.mode === "enforce")
      ignored.push(`${where}: mode "report" is looser than "enforce" (a committed file may only tighten)`);
    else {
      config.mode = data.mode;
      sources.mode = layer;
    }
  }
  if ("gates" in data) {
    const gates = data.gates;
    if (gates === null || typeof gates !== "object" || Array.isArray(gates)) {
      errors.push(`${where}: "gates" must be an object of gate id -> ${ACTIONS.join("|")}`);
    } else {
      for (const [id, action] of Object.entries(gates)) {
        if (!(id in GATES)) errors.push(`${where}: unknown gate "${id}" (known: ${Object.keys(GATES).join(", ")})`);
        else if (!ACTIONS.includes(action)) errors.push(`${where}: gate "${id}" must be one of ${ACTIONS.join(", ")}`);
        else if (tightenOnly && rank(ACTIONS, action) < rank(ACTIONS, actionFor(config, id)))
          ignored.push(`${where}: gate "${id}" "${action}" is looser than "${actionFor(config, id)}" (a committed file may only tighten)`);
        else {
          config.gates[id] = action;
          sources[`gates.${id}`] = layer;
        }
      }
    }
  }
  if ("protectedPaths" in data) {
    if (!Array.isArray(data.protectedPaths) || data.protectedPaths.some((p) => typeof p !== "string"))
      errors.push(`${where}: "protectedPaths" must be a list of paths`);
    else config.protectedPaths.push(...data.protectedPaths);
  }
  if ("extraGates" in data) {
    if (!Array.isArray(data.extraGates)) errors.push(`${where}: "extraGates" must be a list`);
    else
      for (const entry of data.extraGates) {
        const gate = validExtraGate(entry, where, errors);
        if (gate) config.extraGates.push(gate);
      }
  }
  if ("attribution" in data) {
    const a = data.attribution;
    if (a === null || typeof a !== "object" || Array.isArray(a)) {
      errors.push(`${where}: "attribution" must be an object {commit, pr, tool}`);
    } else {
      if ("commit" in a) {
        if (a.commit === "none" || a.commit === "assisted-by") config.attribution.commit = a.commit;
        else errors.push(`${where}: attribution.commit must be "none" or "assisted-by"`);
      }
      if ("pr" in a) {
        if (a.pr === "none" || a.pr === "assisted-by") config.attribution.pr = a.pr;
        else errors.push(`${where}: attribution.pr must be "none" or "assisted-by"`);
      }
      if ("tool" in a) {
        if (typeof a.tool === "string" && a.tool.trim()) config.attribution.tool = a.tool.trim();
        else errors.push(`${where}: attribution.tool must be a tool name such as "Claude"`);
      }
      sources.attribution = layer;
    }
  }
}

function readJson(readFile, path, errors) {
  let text;
  try {
    text = readFile(path);
  } catch {
    return undefined; // absent: nothing to apply
  }
  if (text === null || text === undefined) return undefined;
  try {
    return JSON.parse(text);
  } catch (e) {
    errors.push(`${path}: not valid JSON (${e.message})`);
    return undefined;
  }
}

export function loadConfig({ env = {}, projectDir = "", readFile = () => null, sep = "/", isTracked = () => false } = {}) {
  const config = clone(DEFAULTS);
  const sources = { level: "default", mode: "default", attribution: "default" };
  const errors = [];
  const ignored = [];

  // 2. user: the plugin's userConfig options.
  const user = {};
  if (env.CLAUDE_PLUGIN_OPTION_LEVEL) user.level = env.CLAUDE_PLUGIN_OPTION_LEVEL;
  if (env.CLAUDE_PLUGIN_OPTION_MODE) user.mode = env.CLAUDE_PLUGIN_OPTION_MODE;
  if (Object.keys(user).length)
    applyLayer(config, sources, "user", user, "plugin options (/config)", { tightenOnly: false }, errors, ignored);

  // 3. legacy environment variables.
  const legacy = {};
  if (env.EUNOMAI_TRAILER_RULE) {
    if (ACTIONS.includes(env.EUNOMAI_TRAILER_RULE)) legacy.gates = { "ai-coauthor": env.EUNOMAI_TRAILER_RULE };
    else errors.push(`EUNOMAI_TRAILER_RULE: must be one of ${ACTIONS.join(", ")}`);
  }
  if (env.EUNOMAI_EXTRA_GATES) {
    const list = readJson(readFile, env.EUNOMAI_EXTRA_GATES, errors);
    if (list === undefined && !errors.some((e) => e.startsWith(env.EUNOMAI_EXTRA_GATES)))
      errors.push(`EUNOMAI_EXTRA_GATES: cannot read ${env.EUNOMAI_EXTRA_GATES}`);
    else if (list !== undefined) legacy.extraGates = list;
  }
  if (Object.keys(legacy).length)
    applyLayer(config, sources, "env", legacy, "EUNOMAI_* variables", { tightenOnly: false }, errors, ignored);

  // 4. project (committed, tighten-only) and 5. local (gitignored, anything).
  if (projectDir) {
    const projectFile = `${projectDir}${sep}.claude${sep}eunomai.json`;
    const localFile = `${projectDir}${sep}.claude${sep}eunomai.local.json`;
    const project = readJson(readFile, projectFile, errors);
    if (project !== undefined)
      applyLayer(config, sources, "project", project, projectFile, { tightenOnly: true }, errors, ignored);
    const local = readJson(readFile, localFile, errors);
    if (local !== undefined) {
      // Gitignored by convention only: a local file the repository tracks is the repository's, so it may
      // only tighten, like the committed file.
      const tracked = isTracked(localFile);
      if (tracked) errors.push(`${localFile}: tracked by git, so it is read as a committed file (tighten-only); untrack it`);
      applyLayer(config, sources, tracked ? "project" : "local", local, localFile, { tightenOnly: tracked }, errors, ignored);
    }
  }
  return { config, sources, errors, ignored };
}
