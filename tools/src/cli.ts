#!/usr/bin/env node
import { DocsError, checkDocs } from "./docs.js";
import { checkSkillsAudit } from "./provenance.js";

const HELP = `eunomai — read-only checks for a Claude Code AI workspace

Usage:
  eunomai docs-check           Read-only: verify README<->docs/ links, index coverage, community-health files.
  eunomai provenance-check     Read-only: verify every skill is covered by the skills-audit registry.
  eunomai --help               Show this help.`;

/** Runs the CLI and returns a process exit code (does not call process.exit). */
function run(argv: string[]): number {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return 0;
  }

  const [cmd] = args;

  if (cmd === "docs-check") {
    const { broken, orphaned, missingHealth, checkedLinks, scannedPages } = checkDocs();
    if (broken.length > 0 || orphaned.length > 0 || missingHealth.length > 0) {
      console.error("docs-check failed:");
      for (const b of broken) console.error(`  broken README link -> ${b}`);
      for (const o of orphaned) console.error(`  orphaned page (not in README index): ${o}`);
      for (const h of missingHealth) console.error(`  missing community-health file: ${h}`);
      return 1;
    }
    console.log(
      `docs-check: ${checkedLinks} link(s) resolve, ${scannedPages} page(s) indexed, community-health files present.`,
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

try {
  process.exit(run(process.argv));
} catch (err: unknown) {
  if (err instanceof DocsError) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  console.error("Unexpected error:", err);
  process.exit(2);
}
