#!/usr/bin/env node
import { DocsError } from "./docs.js";
import { run } from "./run.js";

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
