import { checkDocs } from "./docs.js";
import { checkSkillsAudit } from "./provenance.js";

/** Injected at build time from package.json (tsup/vitest `define`); absent when run from plain source. */
declare const __CLI_VERSION__: string | undefined;

/** The CLI version, baked in at build time (see tsup.config.ts). */
export const CLI_VERSION: string =
  typeof __CLI_VERSION__ === "string" ? __CLI_VERSION__ : "0.0.0-dev";

const HELP = `eunomai ${CLI_VERSION} — read-only checks for a Claude Code AI workspace

Usage:
  eunomai docs-check           Read-only: verify README<->docs/ links, index coverage, community-health files.
  eunomai provenance-check     Read-only: verify every skill is covered by the skills-audit registry.
  eunomai --version            Print the CLI version.
  eunomai --help               Show this help.`;

/** Runs the CLI and returns a process exit code (does not call process.exit). */
export function run(argv: string[]): number {
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
    const { broken, orphaned, missingHealth, frontmatterIssues, checkedLinks, scannedPages } =
      checkDocs();
    if (
      broken.length > 0 ||
      orphaned.length > 0 ||
      missingHealth.length > 0 ||
      frontmatterIssues.length > 0
    ) {
      console.error("docs-check failed:");
      for (const b of broken) console.error(`  broken README link -> ${b}`);
      for (const o of orphaned) console.error(`  orphaned page (not in README index): ${o}`);
      for (const h of missingHealth) console.error(`  missing community-health file: ${h}`);
      for (const f of frontmatterIssues) console.error(`  frontmatter: ${f}`);
      return 1;
    }
    console.log(
      `docs-check: ${checkedLinks} link(s) resolve, ${scannedPages} page(s) indexed + frontmatter valid, community-health files present.`,
    );
    return 0;
  }

  if (cmd === "provenance-check") {
    const { uncovered, invalid, gaps, checked, roots } = checkSkillsAudit();
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
