import { defineConfig } from "tsup";

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
});
