import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts", "src/index.ts"],
  // CJS + noExternal bundles every runtime dependency (rulesync, fast-glob, yaml,
  // zod) into a single self-contained file, so the CLI ships with the plugin and
  // runs with plain `node` and no node_modules. CJS (not ESM) because the deps use
  // dynamic require() that an ESM bundle cannot satisfy at runtime.
  format: ["cjs"],
  noExternal: [/.*/],
  target: "node20",
  clean: true,
  dts: true,
});
