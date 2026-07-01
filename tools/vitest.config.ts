import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  // Mirror the tsup build-time injection so tests exercise the real version string.
  define: { __CLI_VERSION__: JSON.stringify(version) },
});
