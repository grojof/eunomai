import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { convertFromTool, type ToolTarget } from "rulesync";
import type { EunomaiConfig } from "./config.js";

/** The rulesync source tool — `AGENTS.md`. */
const SOURCE: ToolTarget = "agentsmd" as ToolTarget;

export type CompileResult = {
  targets: ToolTarget[];
};

/**
 * Project the authored `AGENTS.md` to every declared target by delegating to
 * rulesync's `convertFromTool`. eunomai writes no tool files itself.
 */
export async function compile(
  config: EunomaiConfig,
  cwd: string = process.cwd(),
): Promise<CompileResult> {
  await inCwd(cwd, () =>
    convertFromTool({ from: SOURCE, to: config.targets, silent: true }),
  );
  return { targets: config.targets };
}

export type DriftResult = {
  /** Repo-relative paths whose on-disk content differs from a fresh compile. */
  drifted: string[];
  /** Repo-relative paths that were compared. */
  checked: string[];
};

/**
 * Read-only drift check: compile into a temp dir and compare each produced file
 * against the committed one. rulesync's `convertFromTool` has no `check`, so we
 * derive "expected" ourselves. Writes nothing to the repo.
 */
export async function check(
  config: EunomaiConfig,
  cwd: string = process.cwd(),
): Promise<DriftResult> {
  const tmp = mkdtempSync(join(tmpdir(), "eunomai-check-"));
  try {
    cpSync(resolve(cwd, "AGENTS.md"), join(tmp, "AGENTS.md"));
    await inCwd(tmp, () =>
      convertFromTool({ from: SOURCE, to: config.targets, silent: true }),
    );

    const drifted: string[] = [];
    const checked: string[] = [];
    for (const abs of walk(tmp)) {
      const rel = relative(tmp, abs);
      if (rel === "AGENTS.md") continue;
      checked.push(rel);
      const onDisk = resolve(cwd, rel);
      if (!existsSync(onDisk) || readFileSync(onDisk, "utf8") !== readFileSync(abs, "utf8")) {
        drifted.push(rel);
      }
    }
    return { drifted, checked };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Run `fn` with `process.cwd()` temporarily set to `dir`, then restore it. */
async function inCwd<T>(dir: string, fn: () => Promise<T>): Promise<T> {
  const prev = process.cwd();
  process.chdir(dir);
  try {
    return await fn();
  } finally {
    process.chdir(prev);
  }
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
