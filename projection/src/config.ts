import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { ALL_TOOL_TARGETS, type ToolTarget } from "rulesync";

export const CONFIG_FILENAME = "eunomai.yaml";

/** The rulesync source tool — `AGENTS.md`. It is the input, never a target. */
const SOURCE_TARGET = "agentsmd";

const RawConfigSchema = z.object({
  targets: z.array(z.string()).min(1, "declare at least one target"),
  scopes: z.object({
    project: z.string().min(1, "scopes.project must point at an AGENTS.md path"),
  }),
});

export type EunomaiConfig = {
  /** Validated rulesync `to:` targets (never includes `agentsmd`). */
  targets: ToolTarget[];
  /** Absolute path to the authored `AGENTS.md`. */
  agentsPath: string;
};

/** Raised for any user-facing configuration problem (maps to exit code 1). */
export class ConfigError extends Error {}

const KNOWN_TARGETS = new Set<string>(ALL_TOOL_TARGETS);

/**
 * Load and validate `eunomai.yaml` from `cwd`. Throws {@link ConfigError} with
 * an actionable message on any problem; never writes anything.
 */
export function loadConfig(cwd: string = process.cwd()): EunomaiConfig {
  const configPath = resolve(cwd, CONFIG_FILENAME);
  if (!existsSync(configPath)) {
    throw new ConfigError(`No ${CONFIG_FILENAME} found at ${cwd}.`);
  }

  let raw: unknown;
  try {
    raw = parse(readFileSync(configPath, "utf8"));
  } catch (err) {
    throw new ConfigError(`Could not parse ${CONFIG_FILENAME}: ${(err as Error).message}`);
  }

  const parsed = RawConfigSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ConfigError(`Invalid ${CONFIG_FILENAME}: ${detail}`);
  }
  const { targets, scopes } = parsed.data;

  const unknown = targets.filter((t) => !KNOWN_TARGETS.has(t));
  if (unknown.length > 0) {
    throw new ConfigError(
      `Unknown target(s): ${unknown.join(", ")}. ` +
        `Valid targets are rulesync tool ids, e.g. claudecode, copilot, cursor.`,
    );
  }
  if (targets.includes(SOURCE_TARGET)) {
    throw new ConfigError(
      `'${SOURCE_TARGET}' is the source (AGENTS.md), not a target. Remove it from 'targets'.`,
    );
  }

  const agentsPath = resolve(cwd, scopes.project);
  if (!existsSync(agentsPath)) {
    throw new ConfigError(`AGENTS.md not found at '${scopes.project}' (resolved ${agentsPath}).`);
  }
  if (basename(agentsPath) !== "AGENTS.md" || agentsPath !== resolve(cwd, "AGENTS.md")) {
    throw new ConfigError(
      `v0 only supports an AGENTS.md at the repo root (rulesync reads it from there). ` +
        `Got '${scopes.project}'.`,
    );
  }

  return { targets: targets as ToolTarget[], agentsPath };
}
