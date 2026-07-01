import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  entry: ["src/cli.ts", "src/index.ts"],
  // CJS + noExternal bundles every runtime dependency (yaml, zod) into a single
  // self-contained file, so the CLI ships with the plugin and runs with plain
  // `node` and no node_modules. CJS (not ESM) for maximal runtime compatibility.
  format: ["cjs"],
  noExternal: [/.*/],
  target: "node20",
  clean: true,
  dts: true,
  // Bake the package.json version into the bundle (`--version`); vitest.config.ts mirrors this.
  define: { __CLI_VERSION__: JSON.stringify(version) },
});
