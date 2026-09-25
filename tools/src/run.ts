import { checkDocs } from "./docs.js";
import { checkSkillsAudit } from "./provenance.js";

/** Injected at build time from package.json (tsup/vitest `define`); absent when run from plain source. */
declare const __CLI_VERSION__: string | undefined;

/** The CLI version, baked in at build time (see tsup.config.ts). */
export const CLI_VERSION: string =
  typeof __CLI_VERSION__ === "string" ? __CLI_VERSION__ : "0.0.0-dev";

const HELP = `eunomai ${CLI_VERSION} — read-only checks for a Claude Code AI workspace

Usage:
  eunomai docs-check           Read-only: verify README<->docs/ links, that every docs page is reachable from
                               the README, links in AGENTS.md / CLAUDE.md, and frontmatter shape. Missing
                               community-health files are warnings; add --require-health to fail on them.
  eunomai provenance-check     Read-only: verify every skill is covered by the skills-audit registry.
  eunomai --version            Print the CLI version.
  eunomai --help               Show this help.`;

/** Runs the CLI and returns a process exit code (does not call process.exit). */
export function run(argv: string[], cwd: string = process.cwd()): number {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return 0;
  }

  if (args.includes("--version")) {
    console.log(CLI_VERSION);
    return 0;
  }

  const [cmd] = args;

  if (cmd === "docs-check") {
    const requireHealth = args.includes("--require-health");
    const r = checkDocs(cwd);
    const healthFails = requireHealth && r.missingHealth.length > 0;
    if (!requireHealth)
      for (const h of r.missingHealth) console.warn(`  warning: no ${h} (community-health file)`);
    if (
      r.broken.length > 0 ||
      r.brokenInPages.length > 0 ||
      r.brokenInstructions.length > 0 ||
      r.orphaned.length > 0 ||
      r.frontmatterIssues.length > 0 ||
      healthFails
    ) {
      console.error("docs-check failed:");
      for (const b of r.broken) console.error(`  broken README link -> ${b}`);
      for (const b of r.brokenInPages) console.error(`  broken link in ${b}`);
      for (const b of r.brokenInstructions) console.error(`  broken link in ${b}`);
      for (const o of r.orphaned)
        console.error(`  orphaned page (not reachable from the README): ${o}`);
      if (healthFails)
        for (const h of r.missingHealth) console.error(`  missing community-health file: ${h}`);
      for (const f of r.frontmatterIssues) console.error(`  frontmatter: ${f}`);
      return 1;
    }
    const health =
      r.missingHealth.length === 0
        ? "community-health files present"
        : `${r.missingHealth.length} community-health file(s) missing (warning)`;
    console.log(
      `docs-check: ${r.checkedLinks} README link(s) resolve, ${r.scannedPages} page(s) reachable + frontmatter valid, ${health}.`,
    );
    return 0;
  }

  if (cmd === "provenance-check") {
    const { uncovered, invalid, gaps, checked, roots } = checkSkillsAudit(cwd);
    for (const g of gaps) console.warn(`  gap (review): ${g}`);
    if (uncovered.length > 0 || invalid.length > 0) {
      console.error("provenance-check failed:");
      for (const i of invalid) console.error(`  registry: ${i}`);
      for (const u of uncovered) console.error(`  uncovered skill (no audit entry): ${u}`);
      return 1;
    }
    const where = roots.length > 0 ? roots.join(", ") : "(no skills)";
    console.log(`provenance-check: ${checked} skill(s) covered by the audit registry in ${where}.`);
    return 0;
  }

  console.error(`Unknown command: ${cmd}\n\n${HELP}`);
  return 1;
}
